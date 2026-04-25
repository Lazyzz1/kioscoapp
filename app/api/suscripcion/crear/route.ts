import { createServerComponentClient } from "@/lib/supabase.server";
import { crearLinkSuscripcion } from "@/lib/mercadopago";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createServerComponentClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const { init_point } = await crearLinkSuscripcion(
      user.id,           // ← external_reference
      user.email ?? ""
    );
    return NextResponse.json({ init_point });
  } catch (err) {
    return NextResponse.json({ error: "Error al crear suscripción" }, { status: 500 });
  }
}