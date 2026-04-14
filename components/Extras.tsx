'use client'
import { useState, useMemo } from 'react'
import { Movimiento } from '@/types'

interface Props {
  movimientos: Movimiento[]
  userId: string
}

// ─── Donación ────────────────────────────────────────────
// Reemplazar este link con tu link real de donación de Mercado Pago
// Lo conseguís en: https://www.mercadopago.com.ar/herramientas-para-vender/link-de-pago
const LINK_DONACION = 'https://link.mercadopago.com.ar/turnosbots'

export default function Extras({ movimientos, userId }: Props) {
  const [sugerencia, setSugerencia] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  // ─── Top 5 productos más vendidos ───────────────────────
  const top5 = useMemo(() => {
    const conteo: Record<string, { nombre: string; cantidad: number; monto: number }> = {}

    movimientos
      .filter(m => m.tipo === 'ingreso' && m.descripcion)
      .forEach(m => {
        const key = (m.descripcion ?? '').toLowerCase().trim()
        if (!conteo[key]) {
          conteo[key] = { nombre: m.descripcion ?? '', cantidad: 0, monto: 0 }
        }
        conteo[key].cantidad += m.cantidad
        conteo[key].monto += m.monto
      })

    return Object.values(conteo)
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5)
  }, [movimientos])

  const fmt = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')

  async function enviarSugerencia() {
    if (!sugerencia.trim() || sugerencia.trim().length < 5) return
    setEnviando(true)
    setError('')
    try {
      const res = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: sugerencia }),
      })
      if (res.ok) {
        setEnviado(true)
        setSugerencia('')
        setTimeout(() => setEnviado(false), 4000)
      } else {
        setError('No se pudo enviar. Intentá de nuevo.')
      }
    } catch {
      setError('No se pudo enviar. Intentá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Top 5 productos */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">Top 5 productos</p>
          <p className="text-xs text-gray-400 mt-0.5">Lo que más vendiste (por monto)</p>
        </div>

        {top5.length === 0 ? (
          <div className="px-5 py-6 text-center text-sm text-gray-400">
            Todavía no hay suficientes ventas registradas
          </div>
        ) : (
          <div className="flex flex-col">
            {top5.map((p, i) => {
              const maxMonto = top5[0].monto
              const pct = Math.round((p.monto / maxMonto) * 100)
              const colores = [
                'bg-amber-500',
                'bg-amber-400',
                'bg-amber-300',
                'bg-amber-200',
                'bg-amber-100',
              ]
              return (
                <div key={p.nombre} className="px-5 py-3 flex items-center gap-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-medium text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate capitalize">{p.nombre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${colores[i]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">{fmt(p.monto)}</p>
                    <p className="text-xs text-gray-400">{p.cantidad} ud.</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Donación */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-amber-900">¿Te está siendo útil?</p>
          <p className="text-xs text-amber-700 mt-0.5">Podés ayudarnos a mejorar la app</p>
        </div>
        <a
          href={LINK_DONACION}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition-colors active:scale-[0.98]"
        >
          Donar
        </a>
      </div>

      {/* Sugerencias */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">¿Qué le agregarías a la app?</p>
          <p className="text-xs text-gray-400 mt-0.5">Tu idea puede estar en la próxima versión</p>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <textarea
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 placeholder-gray-400 bg-white text-gray-900 transition-all"
            rows={3}
            placeholder="Ej: quiero poder ver el historial por semana, o que me avise cuando un producto se vende mucho..."
            value={sugerencia}
            onChange={e => setSugerencia(e.target.value)}
            maxLength={500}
          />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          {enviado ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2.5 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              Gracias, tu sugerencia fue enviada.
            </div>
          ) : (
            <button
              onClick={enviarSugerencia}
              disabled={enviando || sugerencia.trim().length < 5}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-30 text-white text-sm font-medium rounded-xl transition-all active:scale-[0.98]"
            >
              {enviando ? 'Enviando...' : 'Enviar sugerencia'}
            </button>
          )}

          <p className="text-xs text-gray-400 text-right">{sugerencia.length}/500</p>
        </div>
      </div>

    </div>
  )
}