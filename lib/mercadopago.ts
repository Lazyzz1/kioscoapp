import MercadoPagoConfig, { PreApproval } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

// ─── Crear link de suscripción para un usuario ───────────
export async function crearLinkSuscripcion(params: {
  userEmail: string
  userId: string
  backUrl: string
}): Promise<string> {
  // Obtener el init_point del plan y agregar external_reference como query param
  const res = await fetch(
    `https://api.mercadopago.com/preapproval_plan/${process.env.MP_PLAN_ID}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    }
  )

  const plan = await res.json()

  if (!res.ok || !plan.init_point) {
    throw new Error(`MP error: ${JSON.stringify(plan)}`)
  }

  // Agregar external_reference a la URL para identificar al usuario en el webhook
  const url = new URL(plan.init_point)
  url.searchParams.set('external_reference', params.userId)

  return url.toString()
}

// ─── Cancelar suscripción ────────────────────────────────
export async function cancelarSuscripcion(subscriptionId: string) {
  const preApproval = new PreApproval(client)
  await preApproval.update({
    id: subscriptionId,
    body: { status: 'cancelled' },
  })
}

// ─── Verificar firma del webhook ─────────────────────────
export function verificarWebhookSignature(
  rawBody: string,
  xSignature: string,
  xRequestId: string
): boolean {
  const crypto = require('crypto')
  const secret = process.env.MP_WEBHOOK_SECRET!

  const parts = Object.fromEntries(
    xSignature.split(',').map(p => p.split('='))
  )
  const ts = parts['ts']
  const hash = parts['v1']

  const manifest = `id:${xRequestId};request-id:${xRequestId};ts:${ts};`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  return expected === hash
}