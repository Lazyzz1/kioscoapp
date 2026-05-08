import { NextResponse } from "next/server";
import { enviarEmailBienvenida, enviarEmailPagoConfirmado, enviarEmailTrialPorVencer } from "@/lib/emails";

export async function GET() {
  try {
    await enviarEmailBienvenida("lucasromeroepja765@gmail.com", "Kiosco de Prueba");
    await enviarEmailPagoConfirmado("lucasromeroepja765@gmail.com", "Kiosco de Prueba");
    await enviarEmailTrialPorVencer("lucasromeroepja765@gmail.com", "Kiosco de Prueba", 3);
    return NextResponse.json({ ok: true, mensaje: "3 emails enviados" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}