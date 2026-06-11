import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const incluido = [
  "Ganancia del mes en tiempo real",
  "Ventas y gastos ilimitados",
  "Top 5 de productos más vendidos",
  "Modo empleado con PIN",
  "Exportación en PDF y Excel",
  "Historial de los últimos 6 meses",
]

export function Precio() {
  return (
    <section id="precio" className="border-y border-border/60 bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Simple y sin sorpresas</h2>

        <div className="mx-auto mt-12 max-w-md">
          <div className="relative rounded-3xl border border-primary/40 bg-card p-8 shadow-2xl">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Plan KioskoApp</p>
              <p className="mt-3 text-4xl font-extrabold text-primary">1 mes gratis</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Después <span className="font-semibold text-foreground">$6.700 ARS</span>/mes
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {incluido.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

           <Link
              href="/register"
              className="mt-8 w-full inline-flex items-center justify-center text-base font-semibold px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Empezar ahora gratis
           </Link>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Cancelás cuando quieras. Sin permanencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
