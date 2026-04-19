import type { Metadata } from 'next'
import './globals.css'
import SupabaseProvider from '@/components/SupabaseProvider'

export const metadata: Metadata = {
  title: 'KioskoApp — Tu plata, clara y simple',
  description: 'Control de ingresos y gastos para kioscos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-background min-h-screen">
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}