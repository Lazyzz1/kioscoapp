'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GraciasPage() {
  const router = useRouter()
  const [segundos, setSegundos] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setSegundos(s => {
        if (s <= 1) {
          clearInterval(interval)
          router.push('/dashboard')
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
      <div className="w-full max-w-sm text-center flex flex-col items-center gap-6">

        {/* Ícono animado */}
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">¡Gracias por suscribirte!</h1>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            Tu pago fue recibido. Tu cuenta se está activando, esto tarda solo unos segundos.
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000"
            style={{ width: `${((5 - segundos) / 5) * 100}%` }}
          />
        </div>

        <p className="text-gray-500 text-sm">
          Redirigiendo al dashboard en <span className="text-amber-400 font-medium">{segundos}</span> segundos...
        </p>

        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-amber-500 hover:text-amber-400 transition-colors underline underline-offset-2"
        >
          Ir ahora
        </button>

      </div>
    </div>
  )
}