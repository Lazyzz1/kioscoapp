import { createAdminClient, createServerComponentClient } from "@/lib/supabase.server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUser = await createServerComponentClient();
  const { data: { user } } = await supabaseUser.auth.getUser();

  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const supabase = createAdminClient();

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!perfil?.is_admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { data: perfiles } = await supabase
    .from("perfiles")
    .select("id, nombre_negocio, plan, trial_ends_at, plan_activated_at, plan_expires_at, mp_payer_email, created_at")
    .order("created_at", { ascending: false });

  const total = perfiles?.length ?? 0;
  const pagados = perfiles?.filter((p: { plan: string }) => p.plan === "pagado").length ?? 0;
  const trials = perfiles?.filter((p: { plan: string }) => p.plan === "trial").length ?? 0;
  const cancelados = perfiles?.filter((p: { plan: string }) => p.plan === "cancelled").length ?? 0;
  const mrr = pagados * 6700;

  return NextResponse.json({ perfiles, stats: { total, pagados, trials, cancelados, mrr } });
}