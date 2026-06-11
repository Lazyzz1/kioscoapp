import Link from "next/link"

export function CtaFinal() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-5xl rounded-3xl bg-primary/10 px-6 py-14 text-center ring-1 ring-primary/30 md:py-20"
        style={{ backgroundColor: "#0a2a16" }}
      >
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Empezá hoy. El primer mes es gratis.
        </h2>
        <Link
          href="/register"
          className="mt-8 inline-flex items-center justify-center text-base font-semibold px-6 py-3 rounded-md bg-white text-[#0a2a16] hover:bg-white/90 transition-colors"
        >
          Crear mi cuenta gratis
        </Link>
      </div>
    </section>
  )
}
