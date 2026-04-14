import MercadoPagoConfig, { PreApproval, PreApprovalPlan } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

// ─── Crear link de suscripción para un usuario ───────────
// MP redirige al usuario a este link para que ingrese su tarjeta.
// Al confirmar, MP llama nuestro webhook con el subscription_id.
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
      external_reference: params.userId, // lo usamos en el webhook para identificar al usuario
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
// MP envía x-signature en el header. Lo validamos para evitar fraudes.
export function verificarWebhookSignature(
  rawBody: string,
  xSignature: string,
  xRequestId: string
): boolean {
  const crypto = require('crypto')
  const secret = process.env.MP_WEBHOOK_SECRET!

  // Formato: ts=<timestamp>,v1=<hash>
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