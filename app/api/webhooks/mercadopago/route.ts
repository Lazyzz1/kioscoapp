import { createAdminClient } from "@/lib/supabase.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createAdminClient();

  // MP manda distintos tipos de eventos
  const topic = body.type || body.topic;
  const resourceId = body.data?.id || body.id;

  if (!resourceId) return NextResponse.json({ ok: true });

  try {
    if (topic === "subscription_preapproval" || topic === "preapproval") {
      // Fetch del preapproval para obtener sus datos completos
      const mpRes = await fetch(
        `https://api.mercadopago.com/preapproval/${resourceId}`,
        {
          headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
        }
      );
      const preapproval = await mpRes.json();

      const userId = preapproval.external_reference; // ← el UUID de Supabase
      const status = preapproval.status;             // "authorized" | "paused" | "cancelled"
      const mpEmail = preapproval.payer_email;

      if (!userId) {
        console.warn("Webhook sin external_reference:", resourceId);
        return NextResponse.json({ ok: true });
      }

      if (status === "authorized") {
        // Pago exitoso → activar plan
        await supabase
          .from("perfiles")
          .update({
            plan: "pagado",
            plan_activated_at: new Date().toISOString(),
            plan_expires_at: new Date(
              Date.now() + 31 * 24 * 60 * 60 * 1000
            ).toISOString(),
            mp_subscription_id: preapproval.id,
            mp_payer_email: mpEmail,
          })
          .eq("id", userId);

      } else if (status === "cancelled" || status === "paused") {
        // Cancelación/pausa → revertir a trial/cancelled
        await supabase
          .from("perfiles")
          .update({ plan: "cancelled" })
          .eq("id", userId);
      }
    }
  } catch (err) {
    console.error("Webhook error:", err);
  }

  // Siempre respondé 200 a MP o va a reintentar
  return NextResponse.json({ ok: true });
}