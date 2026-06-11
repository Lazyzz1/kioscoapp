"use client"

const faqs = [
  {
    q: "¿Necesito instalar algo?",
    a: "No, funciona directamente desde el navegador. Entrás con tu usuario y empezás a usarla, sin descargar nada.",
  },
  {
    q: "¿Puedo usarlo desde el celular?",
    a: "Sí, está optimizado para móvil. Podés registrar ventas y gastos cómodamente desde el teléfono, atrás del mostrador.",
  },
  {
    q: "¿Qué pasa cuando termina el mes gratis?",
    a: "Te avisamos antes de que termine. Si querés seguir, podés suscribirte por Mercado Pago en un par de toques.",
  },
  {
    q: "¿Es seguro?",
    a: "Sí, los datos se guardan en servidores seguros y solo vos (y quien autorices) pueden acceder a la información de tu kiosco.",
  },
]

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function Faq() {
  const [abierto, setAbierto] = useState<number | null>(null)

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Preguntas frecuentes</h2>
      <div className="mt-10 w-full space-y-2">
        {faqs.map((f, i) => (
          <div key={f.q} className="border border-border rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setAbierto(abierto === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-base font-medium hover:bg-accent/10 transition-colors"
            >
              {f.q}
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${abierto === i ? "rotate-180" : ""}`}
              />
            </button>
            {abierto === i && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}