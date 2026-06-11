import { Clock, HelpCircle, UserX } from "lucide-react"

const problemas = [
  {
    icon: Clock,
    title: "Perdés tiempo sumando a mano",
    desc: "Cada cierre de caja te lleva un montón de minutos y siempre queda la duda de si está bien.",
  },
  {
    icon: HelpCircle,
    title: "No sabés cuánto ganaste este mes",
    desc: "Entre ventas y gastos, nunca tenés claro el número real que te quedó en el bolsillo.",
  },
  {
    icon: UserX,
    title: "Tu empleado anota lo que quiere",
    desc: "Sin control, las ventas y la plata de la caja quedan libradas a la memoria de cada uno.",
  },
]

export function Problema() {
  return (
    <section className="border-y border-border/60 bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="mx-auto max-w-2xl text-balance text-center text-3xl font-bold tracking-tight sm:text-4xl">
          ¿Seguís usando Excel o un cuaderno para llevar las cuentas?
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {problemas.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
