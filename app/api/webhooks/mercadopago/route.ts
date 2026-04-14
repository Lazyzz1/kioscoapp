import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createAdminClient } from '@/lib/supabase.server'
import { verificarWebhookSignature } from '@/lib/mercadopago'
import MercadoPagoConfig, { PreApproval } from 'mercadopago'

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const xSignature = req.headers.get('x-signature') ?? ''
  const xRequestId = req.headers.get('x-request-id') ?? ''

  // Verificar firma de MP para evitar llamadas falsas
  if (!verificarWebhookSignature(rawBody, xSignature, xRequestId)) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)

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

    const userId = sub.external_reference // lo guardamos al crear el link
    if (!userId) return NextResponse.json({ ok: true })

    const supabase = createAdminClient()

    // Mapear estado de MP a nuestro plan
    const nuevoPlan = (() => {
      switch (sub.status) {
        case 'authorized': return 'active'
        case 'cancelled':  return 'cancelled'
        case 'paused':     return 'expired'
        default:           return 'expired'
      }
    })()

    await supabase
      .from('perfiles')
      .update({
        plan: nuevoPlan,
        mp_subscription_id: subscriptionId,
        mp_payer_email: sub.payer_email ?? null,
        plan_activated_at: nuevoPlan === 'active' ? new Date().toISOString() : undefined,
        plan_expires_at: nuevoPlan !== 'active'
          ? new Date().toISOString()
          : null,
      })
      .eq('id', userId)

    console.log(`Suscripción ${subscriptionId}: ${sub.status} → plan=${nuevoPlan} user=${userId}`)
    return NextResponse.json({ ok: true })

  } catch (e: any) {
    console.error('Webhook error:', e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}