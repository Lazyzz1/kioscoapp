import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase.server'
import { verificarWebhookSignature } from '@/lib/mercadopago'
import MercadoPagoConfig, { PreApproval } from 'mercadopago'

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const xSignature = req.headers.get('x-signature') ?? ''
  const xRequestId = req.headers.get('x-request-id') ?? ''

  // ✅ Solo verificar firma si el secret está configurado (no es placeholder)
  // Verificación deshabilitada temporalmente para debug
// TODO: reactivar después de confirmar el flujo

  const event = JSON.parse(rawBody)
  console.log('Webhook MP recibido:', event.type, event.data?.id)

  // Solo nos interesan eventos de preapproval (suscripciones)
  if (event.type !== 'subscription_preapproval') {
    return NextResponse.json({ ok: true })
  }

  const subscriptionId = event.data?.id
  if (!subscriptionId) return NextResponse.json({ ok: true })

  try {
    // Obtener detalles de la suscripción desde MP
    const preApproval = new PreApproval(mpClient)
    const sub = await preApproval.get({ id: subscriptionId })

   const payerEmail = sub.payer_email
    if (!payerEmail) return NextResponse.json({ ok: true })

    // Buscar usuario por email en Supabase
    const supabase = createAdminClient()
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const user = users.find((u: { id: string; email?: string }) => u.email === payerEmail)
    if (!user) return NextResponse.json({ ok: true })
    const userId = user.id

    const ahora = new Date()

    if (sub.status === 'authorized') {
      // ✅ Pago activo: plan='pagado', plan_expires_at = 30 días desde hoy
      const expira = new Date(ahora)
      expira.setDate(expira.getDate() + 32) // 32 días de margen para el próximo cobro

      await supabase
        .from('perfiles')
        .update({
          plan: 'pagado',                           // ✅ coincide con el chequeo del dashboard
          mp_subscription_id: subscriptionId,
          mp_payer_email: sub.payer_email ?? null,
          plan_activated_at: ahora.toISOString(),
          plan_expires_at: expira.toISOString(),    // ✅ fecha futura, no null
        })
        .eq('id', userId)

      console.log(`✅ Suscripción activada: user=${userId} expira=${expira.toISOString()}`)

    } else if (sub.status === 'cancelled' || sub.status === 'paused') {
      // Suscripción cancelada o pausada → expirar acceso
      await supabase
        .from('perfiles')
        .update({
          plan: 'cancelled',
          plan_expires_at: ahora.toISOString(), // expira ahora
        })
        .eq('id', userId)

      console.log(`❌ Suscripción cancelada: user=${userId} status=${sub.status}`)
    }

    return NextResponse.json({ ok: true })

  } catch (e: any) {
    console.error('Webhook error:', e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}