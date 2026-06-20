import Link from "next/link"
import { Metadata } from "next"
import { posts } from "./posts"

export const metadata: Metadata = {
  title: "Blog — Consejos para kioscos | KioskoApp",
  description: "Guías y consejos prácticos para dueños de kiosco: cómo llevar las cuentas, controlar el stock, calcular la ganancia real y administrar mejor tu negocio.",
  keywords: ["blog kiosco", "consejos kiosco", "administrar kiosco", "gestión kiosco argentina"],
  openGraph: {
    title: "Blog — Consejos para kioscos | KioskoApp",
    description: "Guías y consejos prácticos para dueños de kiosco.",
    url: "https://kioscoapp.com.ar/blog",
    siteName: "KioskoApp",
    locale: "es_AR",
    type: "website",
  },
  alternates: {
    canonical: "https://kioscoapp.com.ar/blog",
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo_kioscoapp.png" alt="KioskoApp" width={70} height={70} className="rounded-lg" />
            <span className="font-bold text-gray-900 dark:text-white">KioskoApp</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors"
          >
            Probá gratis →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-12">
          <p className="text-sm font-medium text-orange-500 mb-2">Blog</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Consejos para dueños de kiosco
          </h1>
          <p className="text-lg text-gray-600 dark:text-neutral-400">
            Guías prácticas para llevar mejor las cuentas, controlar el stock y hacer crecer tu kiosco.
          </p>
        </div>

        {/* Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Blog KioskoApp",
              "description": "Consejos para dueños de kiosco",
              "url": "https://kioscoapp.com.ar/blog",
              "publisher": {
                "@type": "Organization",
                "name": "KioskoApp",
                "url": "https://kioscoapp.com.ar",
              },
            }),
          }}
        />

        {/* Lista de posts */}
        <div className="space-y-6">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="border border-gray-100 dark:border-neutral-800 rounded-2xl p-6 hover:border-orange-200 dark:hover:border-orange-900 hover:bg-orange-50/30 dark:hover:bg-orange-500/5 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <time
                    dateTime={post.fecha}
                    className="text-xs text-gray-400 dark:text-neutral-500"
                  >
                    {new Date(post.fecha).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <span className="text-gray-300 dark:text-neutral-700">·</span>
                  <span className="text-xs text-gray-400 dark:text-neutral-500">{post.tiempoLectura} min de lectura</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {post.titulo}
                </h2>
                <p className="text-gray-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {post.descripcion}
                </p>
                <p className="text-sm font-medium text-orange-500 mt-4 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  Leer artículo →
                </p>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-900/50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            ¿Querés llevar mejor las cuentas de tu kiosco?
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 mb-6">
            KioskoApp te permite registrar ventas, controlar el stock y ver tu ganancia real desde el celular. Probalo gratis por 30 días.
          </p>
          <Link
            href="/register"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Empezar gratis →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-neutral-800 mt-16">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-400 dark:text-neutral-500">
          <span>© 2026 KioskoApp</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-gray-600 dark:hover:text-neutral-300">Inicio</Link>
            <Link href="/blog" className="hover:text-gray-600 dark:hover:text-neutral-300">Blog</Link>
            <Link href="/register" className="hover:text-gray-600 dark:hover:text-neutral-300">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}