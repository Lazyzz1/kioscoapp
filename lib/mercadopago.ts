import MercadoPagoConfig, { PreApproval } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

// ─── Crear link de suscripción para un usuario ───────────
export async function crearLinkSuscripcion(userId: string, userEmail: string) {
  const response = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason: "KioskoApp — Suscripción mensual",
      external_reference: userId,          // ← clave: el userId de Supabase
      payer_email: userEmail,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 6700,
        currency_id: "ARS",
      },
      back_url: `${process.env.NEXT_PUBLIC_APP_URL}/suscripcion/gracias`,
      status: "pending",                   // ← sin esto MP pide card_token
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("MP PreApproval error:", error);
    throw new Error("No se pudo crear la suscripción en Mercado Pago");
  }

  const data = await response.json();
  return {
    init_point: data.init_point,           // URL a la que redirigís al usuario
    preapproval_id: data.id,              // guardalo en la sesión si querés
  };
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