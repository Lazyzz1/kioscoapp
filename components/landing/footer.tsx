import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/icon.png" alt="" width={28} height={28} className="rounded-md" />
          <span className="text-sm font-semibold">
            Kiosko<span className="text-primary">App</span>
          </span>
          <span className="ml-2 text-sm text-muted-foreground">© 2026 KioskoApp</span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="/terminos" className="transition-colors hover:text-foreground">
            Términos y condiciones
          </Link>
          <Link href="/privacidad" className="transition-colors hover:text-foreground">
            Política de privacidad
          </Link>
        </nav>
      </div>
    </footer>
  )
}
