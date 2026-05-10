import { createAdminClient } from "@/lib/supabase.server";
import { enviarEmailTrialPorVencer } from "@/lib/emails";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Verificar que viene de Vercel Cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Buscar usuarios con trial que vence en 3 días
  const en3dias = new Date();
  en3dias.setDate(en3dias.getDate() + 3);
  const desde = new Date(en3dias);
  desde.setHours(0, 0, 0, 0);
  const hasta = new Date(en3dias);
  hasta.setHours(23, 59, 59, 999);

  const { data: perfiles } = await supabase
    .from("perfiles")
    .select("id, nombre_negocio, trial_ends_at")
    .eq("plan", "trial")
    .gte("trial_ends_at", desde.toISOString())
    .lte("trial_ends_at", hasta.toISOString());

  if (!perfiles || perfiles.length === 0) {
    return NextResponse.json({ ok: true, enviados: 0 });
  }

  // Buscar emails en auth.users para cada perfil
  let enviados = 0;
  for (const perfil of perfiles) {
    const { data: userData } = await supabase.auth.admin.getUserById(perfil.id);
    const email = userData?.user?.email;
    if (email) {
      await enviarEmailTrialPorVencer(email, perfil.nombre_negocio, 3);
      enviados++;
    }
  }

  return NextResponse.json({ ok: true, enviados });
}