import { NextRequest, NextResponse } from "next/server";
import { enviarEmailBienvenida } from "@/lib/emails";

export async function POST(req: NextRequest) {
  const { email, nombreNegocio } = await req.json();
  
  if (!email || !nombreNegocio) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  try {
    await enviarEmailBienvenida(email, nombreNegocio);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error email bienvenida:", err);
    return NextResponse.json({ error: "Error al enviar email" }, { status: 500 });
  }
}