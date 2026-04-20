'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Perfil, diasRestantesTrial } from '@/types'

export default function PagarPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setPerfil(data)
    }
    load()
  }, [])

  async function handleSuscribirse() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/suscripcion/crear', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('No se pudo iniciar el pago. Intentá de nuevo.')
      }
    } catch {
      setError('Hubo un problema. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const diasRestantes = perfil ? diasRestantesTrial(perfil) : null
  const trialActivo = perfil?.plan === 'trial' && (diasRestantes ?? 0) > 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* Estado del trial */}
        {trialActivo ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center">
            <p className="text-amber-400 font-medium">
              Te quedan {diasRestantes} {diasRestantes === 1 ? 'día' : 'días'} de prueba gratis
            </p>
            <p className="text-amber-500/70 text-sm mt-1">
              Suscribite ahora para no perder el acceso
            </p>
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center">
            <p className="text-red-400 font-medium">Tu período de prueba terminó</p>
            <p className="text-red-500/70 text-sm mt-1">Suscribite para volver a usar KioskoApp</p>
          </div>
        )}

        {/* Card de suscripción */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-5">
          <div className="text-center">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-amber-600 items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white">KioskoApp</h1>
            <div className="mt-3">
              <span className="text-3xl font-semibold text-white">$6.700 ARS</span>
              <span className="text-gray-400 text-sm"> / mes</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Cancelá cuando quieras</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              'Registrá ingresos y gastos sin límite',
              'Dashboard con tu ganancia del mes',
              'Alertas automáticas',
              'Acceso desde cualquier celular',
              'Soporte por WhatsApp',
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-green-400" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg text-center">{error}</p>
          )}

          <button
            onClick={handleSuscribirse}
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all active:scale-[0.98]"
          >
            {loading ? 'Redirigiendo a Mercado Pago...' : 'Suscribirme con Mercado Pago'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Pago seguro procesado por Mercado Pago. Podés cancelar desde tu perfil en cualquier momento.
          </p>
        </div>

        <button
          onClick={async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = '/login'
          }}
          className="text-sm text-gray-500 text-center hover:text-gray-400 transition-colors"
        >
          Cerrar sesión
        </button>

      </div>
    </div>
  )
}