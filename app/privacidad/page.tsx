import Link from 'next/link'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/login" className="text-amber-500 hover:text-amber-400 text-sm">← Volver</Link>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Política de Privacidad</h1>
        <p className="text-gray-500 text-sm mb-8">Última actualización: abril 2025</p>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-base mb-2">1. Información que recopilamos</h2>
            <p>Recopilamos la siguiente información cuando usás KioskoApp:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-400">
              <li>Email y contraseña (encriptada) para el acceso a tu cuenta</li>
              <li>Nombre del negocio</li>
              <li>Movimientos que registrás (ingresos y gastos)</li>
              <li>Información de pago procesada por Mercado Pago (no almacenamos datos de tarjetas)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">2. Cómo usamos tu información</h2>
            <p>Usamos tu información exclusivamente para:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-400">
              <li>Brindarte el servicio de KioskoApp</li>
              <li>Procesar pagos y gestionar tu suscripción</li>
              <li>Enviarte notificaciones relacionadas con tu cuenta</li>
              <li>Mejorar la aplicación en base a sugerencias anónimas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">3. Almacenamiento de datos</h2>
            <p>Tus datos se almacenan de forma segura en Supabase, una plataforma de base de datos con cifrado en tránsito y en reposo. Los servidores están ubicados en la región de Brasil (São Paulo).</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">4. Compartir información con terceros</h2>
            <p>No vendemos ni compartimos tu información personal con terceros, excepto:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-400">
              <li><strong className="text-gray-300">Mercado Pago:</strong> para procesar pagos de suscripción</li>
              <li><strong className="text-gray-300">Supabase:</strong> para almacenamiento de datos</li>
              <li><strong className="text-gray-300">Vercel:</strong> para hosting de la aplicación</li>
            </ul>
            <p className="mt-2">Todos estos proveedores tienen sus propias políticas de privacidad y cumplen con estándares de seguridad internacionales.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">5. Tus derechos</h2>
            <p>Tenés derecho a:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-400">
              <li>Acceder a tus datos personales</li>
              <li>Solicitar la corrección de datos incorrectos</li>
              <li>Solicitar la eliminación de tu cuenta y todos tus datos</li>
              <li>Exportar tus datos (próximamente)</li>
            </ul>
            <p className="mt-2">Para ejercer estos derechos contactanos por WhatsApp o desde el formulario de sugerencias en la app.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">6. Cookies</h2>
            <p>Usamos cookies de sesión para mantenerte autenticado. No usamos cookies de tracking ni publicidad.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">7. Contacto</h2>
            <p>Para consultas sobre privacidad contactanos por WhatsApp o desde la sección de sugerencias dentro de la app.</p>
          </section>

        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <Link href="/terminos" className="text-amber-500 hover:text-amber-400 text-sm">
            Ver Términos y Condiciones →
          </Link>
        </div>
      </div>
    </div>
  )
}