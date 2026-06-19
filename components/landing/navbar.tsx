import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="Logo de KioskoApp"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight">
            Kiosko<span className="text-primary">App</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/blog"
            className="text-sm px-4 py-2 rounded-md hover:bg-accent transition-colors hidden sm:block"
          >
            Blog
          </Link>
          <Link href="/login" className="text-sm px-4 py-2 rounded-md hover:bg-accent transition-colors">
            Iniciar sesión
          </Link>
          <Link href="/register" className="text-sm font-semibold px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Probá gratis
          </Link>
        </div>
      </nav>
    </header>
  )
}