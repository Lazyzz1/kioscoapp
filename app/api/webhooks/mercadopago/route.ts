import { createAdminClient } from "@/lib/supabase.server";
import { enviarEmailPagoConfirmado } from "@/lib/emails";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createAdminClient();

  const topic = body.type || body.topic;
  const resourceId = body.data?.id || body.id;

  if (!resourceId) return NextResponse.json({ ok: true });

  try {
    if (topic === "subscription_preapproval" || topic === "preapproval") {
      const mpRes = await fetch(
        `https://api.mercadopago.com/preapproval/${resourceId}`,
        { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
      );
      const preapproval = await mpRes.json();

      const userId = preapproval.external_reference;
      const status = preapproval.status;
      const mpEmail = preapproval.payer_email;

      if (!userId) {
        console.warn("Webhook sin external_reference:", resourceId);
        return NextResponse.json({ ok: true });
      }

      if (status === "authorized") {
        await supabase
          .from("perfiles")
          .update({
            plan: "pagado",
            plan_activated_at: new Date().toISOString(),
            plan_expires_at: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
            mp_subscription_id: preapproval.id,
            mp_payer_email: mpEmail,
          })
          .eq("id", userId);

        // Buscar datos del perfil para el email
        const { data: perfil } = await supabase
          .from("perfiles")
          .select("nombre_negocio")
          .eq("id", userId)
          .single();

        if (perfil && mpEmail) {
          await enviarEmailPagoConfirmado(mpEmail, perfil.nombre_negocio);
        }

      } else if (status === "cancelled" || status === "paused") {
        await supabase
          .from("perfiles")
          .update({ plan: "cancelled" })
          .eq("id", userId);
      }
    }
  } catch (err) {
    console.error("Webhook error:", err);
  }

  return NextResponse.json({ ok: true });
}