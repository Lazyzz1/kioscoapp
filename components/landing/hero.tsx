import Link from "next/link"
import Image from "next/image"
import { ShieldCheck, TrendingUp, ArrowUpRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(600px circle at 20% 10%, rgba(34,197,94,0.10), transparent 60%), radial-gradient(500px circle at 90% 20%, rgba(245,158,11,0.08), transparent 55%)",
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Sin tarjeta de crédito
          </span>
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Controlá las ganancias de tu kiosco desde el celular
          </h1>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Sin cuadernos, sin calculadoras, sin excusas.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-1 text-base font-semibold px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Empezá gratis — 1 mes sin pagar
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/10 blur-2xl" />
          <div className="rounded-[2rem] border border-border bg-card p-3 shadow-2xl">
            <div className="rounded-3xl border border-border/70 bg-background p-5">
              <div className="mb-4 flex items-center gap-2">
                <Image src="/icon.png" alt="" width={28} height={28} className="rounded-md" />
                <span className="text-sm font-semibold">KioskoApp</span>
                <span className="ml-auto text-xs text-muted-foreground">Marzo 2025</span>
              </div>
              <div className="rounded-2xl bg-primary/10 p-4">
                <p className="text-xs text-muted-foreground">Ganancia del mes</p>
                <p className="mt-1 flex items-center gap-2 text-3xl font-extrabold text-primary">
                  $487.300
                  <TrendingUp className="h-5 w-5" />
                </p>
                <p className="mt-1 text-xs text-primary/80">+18% vs. mes anterior</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Ventas</p>
                  <p className="text-lg font-bold">$612.000</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Gastos</p>
                  <p className="text-lg font-bold text-accent">$124.700</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { n: "Coca-Cola 500ml", v: "142 u." },
                  { n: "Marlboro Box", v: "98 u." },
                  { n: "Alfajor Jorgito", v: "87 u." },
                ].map((p, i) => (
                  <div key={p.n} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {i + 1}
                      </span>
                      {p.n}
                    </span>
                    <span className="text-muted-foreground">{p.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
