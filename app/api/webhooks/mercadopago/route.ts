import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase.server'
import MercadoPagoConfig, { PreApproval } from 'mercadopago'

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  let event: any
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  console.log('Webhook MP recibido:', event.type, event.data?.id)

  // Aceptar eventos de suscripción
  const tiposValidos = ['subscription_preapproval', 'subscription_authorized_payment']
  if (!tiposValidos.includes(event.type)) {
    return NextResponse.json({ ok: true })
  }

  const subscriptionId = event.data?.id
  if (!subscriptionId) return NextResponse.json({ ok: true })

  // Ignorar IDs de prueba de simulación de MP
  if (subscriptionId === '123456' || subscriptionId === 'TEST') {
    console.log('Webhook: ID de simulación ignorado')
    return NextResponse.json({ ok: true })
  }

  try {
    // Obtener detalles de la suscripción desde MP
    let sub: any
    try {
      const preApproval = new PreApproval(mpClient)
      sub = await preApproval.get({ id: subscriptionId })
    } catch (e: any) {
      console.error('No se pudo obtener suscripción de MP:', subscriptionId, e?.message)
      return NextResponse.json({ ok: true })
    }

    if (!sub) return NextResponse.json({ ok: true })

    console.log('Suscripción MP:', sub.status, 'payer:', sub.payer_email, 'external_ref:', sub.external_reference)

    const supabase = createAdminClient()
    const ahora = new Date()

    // Intentar obtener userId por external_reference primero (más confiable)
    // Si no, buscar por email
    let userId: string | null = sub.external_reference ?? null

    if (!userId && sub.payer_email) {
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const user = users.find((u: { id: string; email?: string }) => u.email === sub.payer_email)
      userId = user?.id ?? null
    }

    if (!userId) {
      console.error('No se encontró usuario para la suscripción:', subscriptionId)
      return NextResponse.json({ ok: true })
    }

    if (sub.status === 'authorized') {
      const expira = new Date(ahora)
      expira.setDate(expira.getDate() + 32)

      await supabase
        .from('perfiles')
        .update({
          plan: 'pagado',
          mp_subscription_id: subscriptionId,
          mp_payer_email: sub.payer_email ?? null,
          plan_activated_at: ahora.toISOString(),
          plan_expires_at: expira.toISOString(),
        })
        .eq('id', userId)

      console.log(`✅ Suscripción activada: user=${userId} expira=${expira.toISOString()}`)

    } else if (sub.status === 'cancelled' || sub.status === 'paused') {
      await supabase
        .from('perfiles')
        .update({
          plan: 'cancelled',
          plan_expires_at: ahora.toISOString(),
        })
        .eq('id', userId)

      console.log('❌ Suscripción cancelada: user=' + userId + ' status=' + sub.status)
    }

    return NextResponse.json({ ok: true })

  } catch (e: any) {
    console.error('Webhook error:', e?.message ?? e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}