import type { Metadata } from 'next'
import './globals.css'
import PostHogProvider from '@/components/PostHogProvider'

export const metadata: Metadata = {
  title: 'KioskoApp — Controlá las ganancias de tu kiosco desde el celular',
  description: 'App web para dueños de kioscos: registrá ventas y gastos, mirá tu ganancia del mes en tiempo real, top 5 productos, modo empleado con PIN y exportá en PDF y Excel. 1 mes gratis.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-background min-h-screen">
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}