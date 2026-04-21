import Link from 'next/link'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/login" className="text-amber-500 hover:text-amber-400 text-sm">← Volver</Link>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Términos y Condiciones</h1>
        <p className="text-gray-500 text-sm mb-8">Última actualización: abril 2025</p>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-base mb-2">1. Descripción del servicio</h2>
            <p>KioskoApp es una aplicación web de gestión de ingresos y gastos para pequeños comercios. Permite registrar movimientos, visualizar estadísticas y obtener reportes del negocio.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">2. Registro y cuenta</h2>
            <p>Para usar KioskoApp debés crear una cuenta con un email válido y una contraseña. Sos responsable de mantener la confidencialidad de tus credenciales y de toda la actividad que ocurra en tu cuenta.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">3. Período de prueba</h2>
            <p>Los nuevos usuarios tienen acceso gratuito por 7 días desde el momento del registro. Al finalizar el período de prueba, se requiere una suscripción paga para continuar usando el servicio.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">4. Suscripción y pagos</h2>
            <p>La suscripción tiene un costo de $6.700 ARS por mes. Los pagos se procesan mediante Mercado Pago. La suscripción se renueva automáticamente cada mes hasta que el usuario la cancele. Podés cancelar en cualquier momento desde el dashboard.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">5. Cancelación</h2>
            <p>Podés cancelar tu suscripción en cualquier momento. Al cancelar, mantenés el acceso hasta el final del período ya abonado. No se realizan reembolsos por períodos parciales.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">6. Datos del usuario</h2>
            <p>Los datos que cargás en KioskoApp (movimientos, categorías, etc.) son de tu propiedad. No compartimos ni vendemos tu información a terceros. Ver nuestra <Link href="/privacidad" className="text-amber-500 hover:text-amber-400">Política de Privacidad</Link> para más detalles.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">7. Limitación de responsabilidad</h2>
            <p>KioskoApp es una herramienta de apoyo para la gestión comercial. No nos hacemos responsables por decisiones tomadas en base a los datos registrados en la aplicación. La información financiera debe ser verificada con un contador o profesional habilitado.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">8. Modificaciones</h2>
            <p>Podemos actualizar estos términos en cualquier momento. Te notificaremos por email ante cambios significativos. El uso continuado del servicio después de la notificación implica la aceptación de los nuevos términos.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">9. Contacto</h2>
            <p>Para consultas sobre estos términos podés contactarnos por WhatsApp o escribirnos a través del formulario de sugerencias dentro de la app.</p>
          </section>

        </div>
      </div>
    </div>
  )
}