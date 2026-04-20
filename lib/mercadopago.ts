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
  const preApproval = new PreApproval(client)

  const response = await preApproval.create({
    body: {
      preapproval_plan_id: process.env.MP_PLAN_ID!,
      payer_email: params.userEmail,
      back_url: params.backUrl,
      external_reference: params.userId,
      status: 'pending', // ✅ MP genera el link — el usuario ingresa su tarjeta ahí
    },
  })

  if (!response.init_point) {
    throw new Error('MP no devolvió init_point')
  }

  return response.init_point
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