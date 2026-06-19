import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { posts, getPost } from "../posts"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  return {
    title: `${post.titulo} | KioskoApp`,
    description: post.descripcion,
    keywords: post.keywords,
    openGraph: {
      title: post.titulo,
      description: post.descripcion,
      url: `https://kioscoapp.com.ar/blog/${post.slug}`,
      siteName: "KioskoApp",
      locale: "es_AR",
      type: "article",
      publishedTime: post.fecha,
    },
    alternates: {
      canonical: `https://kioscoapp.com.ar/blog/${post.slug}`,
    },
  }
}

function renderContent(content: string) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          {line.replace("## ", "")}
        </h2>
      )
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="font-semibold text-gray-900 mt-4 mb-1">
          {line.replace(/\*\*/g, "")}
        </p>
      )
    } else if (line.startsWith("- ")) {
      // Recolectar lista
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace("- ", ""))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-6 space-y-2 my-4 text-gray-700">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseLine(item) }} />
          ))}
        </ul>
      )
      continue
    } else if (line.startsWith("|")) {
      // Tabla
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!lines[i].includes("---")) tableLines.push(lines[i])
        i++
      }
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            {tableLines.map((row, rowIdx) => {
              const cells = row.split("|").filter(c => c.trim())
              const isHeader = rowIdx === 0
              return (
                <tr key={rowIdx} className={isHeader ? "bg-gray-50" : "border-t border-gray-100"}>
                  {cells.map((cell, cellIdx) =>
                    isHeader ? (
                      <th key={cellIdx} className="px-4 py-2 text-left font-semibold text-gray-900">{cell.trim()}</th>
                    ) : (
                      <td key={cellIdx} className="px-4 py-2 text-gray-700">{cell.trim()}</td>
                    )
                  )}
                </tr>
              )
            })}
          </table>
        </div>
      )
      continue
    } else if (line.trim() === "") {
      // skip empty lines
    } else {
      elements.push(
        <p key={i} className="text-gray-700 leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: parseLine(line) }}
        />
      )
    }

    i++
  }

  return elements
}

function parseLine(text: string): string {
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  // Links
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-orange-500 hover:text-orange-600 underline" target="_blank" rel="noopener noreferrer">$1</a>')
  return text
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const otrosPosts = posts.filter(p => p.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo_kioscoapp.png" alt="KioskoApp" width={70} height={70} className="rounded-lg" />
            <span className="font-bold text-gray-900">KioskoApp</span>
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

        {/* Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.titulo,
              "description": post.descripcion,
              "datePublished": post.fecha,
              "author": {
                "@type": "Organization",
                "name": "KioskoApp",
              },
              "publisher": {
                "@type": "Organization",
                "name": "KioskoApp",
                "url": "https://kioscoapp.com.ar",
              },
              "url": `https://kioscoapp.com.ar/blog/${post.slug}`,
            }),
          }}
        />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-gray-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{post.titulo}</span>
        </nav>

        {/* Artículo */}
        <article>
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <time dateTime={post.fecha} className="text-sm text-gray-400">
                {new Date(post.fecha).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-400">{post.tiempoLectura} min de lectura</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
              {post.titulo}
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              {post.descripcion}
            </p>
          </header>

          <div className="prose-custom">
            {renderContent(post.contenido)}
          </div>
        </article>

        {/* CTA inline */}
        <div className="mt-12 bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            ¿Querés aplicar esto en tu kiosco hoy?
          </h2>
          <p className="text-gray-600 mb-6">
            KioskoApp te ayuda a llevar las cuentas, controlar el stock y ver tu ganancia real desde el celular. Sin planillas, sin complicaciones.
          </p>
          <Link
            href="/register"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Probá gratis 30 días →
          </Link>
        </div>

        {/* Otros artículos */}
        {otrosPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Otros artículos</h2>
            <div className="space-y-4">
              {otrosPosts.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                  <div className="border border-gray-100 rounded-xl p-5 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                      {p.titulo}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{p.descripcion}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-400">
          <span>© 2026 KioskoApp</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-gray-600">Inicio</Link>
            <Link href="/blog" className="hover:text-gray-600">Blog</Link>
            <Link href="/register" className="hover:text-gray-600">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}