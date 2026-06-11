import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Problema } from "@/components/landing/problema"
import { Features } from "@/components/landing/features"
import { Precio } from "@/components/landing/precio"
import { Faq } from "@/components/landing/faq"
import { CtaFinal } from "@/components/landing/cta-final"
import { Footer } from "@/components/landing/footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Problema />
        <Features />
        <Precio />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  )
}
