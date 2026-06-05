import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmailBienvenida(email: string, nombreNegocio: string) {
  await resend.emails.send({
    from: "KioskoApp <hola@kioscoapp.com.ar>",
    to: email,
    subject: "¡Bienvenido a KioskoApp!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #ffffff; padding: 40px; border-radius: 12px;">
        <h1 style="color: #f97316; font-size: 28px; margin-bottom: 8px;">¡Bienvenido a KioskoApp!</h1>
        <p style="color: #aaaaaa; font-size: 16px;">Hola, <strong style="color: #ffffff;">${nombreNegocio}</strong> 👋</p>
        <p style="color: #cccccc; line-height: 1.6;">Tu cuenta está lista. Tenés <strong style="color: #f97316;">7 días gratis</strong> para probar todas las funciones.</p>
        
        <div style="background: #1a1a1a; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 12px; color: #aaaaaa; font-size: 14px;">Con KioskoApp podés:</p>
          <ul style="color: #cccccc; line-height: 2; margin: 0; padding-left: 20px;">
            <li>Registrar ingresos y gastos en segundos</li>
            <li>Ver tu ganancia del mes en tiempo real</li>
            <li>Usar el modo empleado con PIN</li>
            <li>Exportar tu resumen mensual a PDF</li>
          </ul>
        </div>

        <a href="https://kioscoapp.com.ar/dashboard" 
           style="display: inline-block; background: #f97316; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Ir al Dashboard →
        </a>

        <p style="color: #666666; font-size: 13px; margin-top: 32px;">Si tenés alguna duda, respondé este email y te ayudo.</p>
      </div>
    `,
  });
}

export async function enviarEmailPagoConfirmado(email: string, nombreNegocio: string) {
  const fechaVencimiento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

  await resend.emails.send({
    from: "KioskoApp <hola@kioscoapp.com.ar>",
    to: email,
    subject: "✅ Pago confirmado — KioskoApp",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #ffffff; padding: 40px; border-radius: 12px;">
        <h1 style="color: #22c55e; font-size: 28px; margin-bottom: 8px;">¡Pago confirmado!</h1>
        <p style="color: #aaaaaa; font-size: 16px;">Hola, <strong style="color: #ffffff;">${nombreNegocio}</strong></p>
        <p style="color: #cccccc; line-height: 1.6;">Tu suscripción a KioskoApp está activa. Gracias por confiar en nosotros.</p>

        <div style="background: #1a1a1a; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 8px; color: #aaaaaa; font-size: 14px;">Detalle del pago:</p>
          <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: bold;">$6.700 ARS / mes</p>
          <p style="margin: 8px 0 0; color: #aaaaaa; font-size: 14px;">Próximo cobro: <strong style="color: #cccccc;">${fechaVencimiento}</strong></p>
        </div>

        <a href="https://kioscoapp.com.ar/dashboard" 
           style="display: inline-block; background: #22c55e; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Ir al Dashboard →
        </a>

        <p style="color: #666666; font-size: 13px; margin-top: 32px;">Podés cancelar tu suscripción en cualquier momento desde el dashboard.</p>
      </div>
    `,
  });
}

export async function enviarEmailTrialPorVencer(email: string, nombreNegocio: string, diasRestantes: number) {
  await resend.emails.send({
    from: "KioskoApp <hola@kioscoapp.com.ar>",
    to: email,
    subject: `⏳ Tu prueba gratis vence en ${diasRestantes} días`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #ffffff; padding: 40px; border-radius: 12px;">
        <h1 style="color: #f97316; font-size: 28px; margin-bottom: 8px;">Tu prueba vence en ${diasRestantes} días</h1>
        <p style="color: #aaaaaa; font-size: 16px;">Hola, <strong style="color: #ffffff;">${nombreNegocio}</strong></p>
        <p style="color: #cccccc; line-height: 1.6;">No pierdas acceso a tu historial de movimientos y todas las funciones de KioskoApp.</p>

        <div style="background: #1a1a1a; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0; color: #aaaaaa; font-size: 14px;">Suscripción mensual</p>
          <p style="margin: 8px 0 0; color: #ffffff; font-size: 24px; font-weight: bold;">$6.700 ARS / mes</p>
          <p style="margin: 8px 0 0; color: #aaaaaa; font-size: 13px;">Cancelá cuando quieras, sin permanencia.</p>
        </div>

        <a href="https://kioscoapp.com.ar/pagar" 
           style="display: inline-block; background: #f97316; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Suscribirme ahora →
        </a>

        <p style="color: #666666; font-size: 13px; margin-top: 32px;">Si tenés alguna duda, respondé este email.</p>
      </div>
    `,
  });
}