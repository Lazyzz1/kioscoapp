import { BarChart3, PlusCircle, Trophy, Lock, FileSpreadsheet, CalendarRange } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Ganancia en tiempo real",
    desc: "Ves cuánto ganás al instante, sin calcular nada.",
  },
  {
    icon: PlusCircle,
    title: "Registrá en segundos",
    desc: "Ingreso o gasto en 3 toques desde el celular.",
  },
  {
    icon: Trophy,
    title: "Top 5 productos",
    desc: "Sabé qué productos te dejan más plata cada mes.",
  },
  {
    icon: Lock,
    title: "Modo empleado con PIN",
    desc: "Tu empleado registra ventas sin ver tus números.",
  },
  {
    icon: FileSpreadsheet,
    title: "Exportá en PDF y Excel",
    desc: "Resumen mensual prolijo para guardar o compartir.",
  },
  {
    icon: CalendarRange,
    title: "Historial de 6 meses",
    desc: "Comparás mes a mes cómo va tu negocio.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <h2 className="mx-auto max-w-2xl text-balance text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Todo lo que necesitás en un solo lugar
      </h2>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
