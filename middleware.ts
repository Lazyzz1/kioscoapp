import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createMiddlewareClient } from '@/lib/supabase.server'
import { planVigente } from '@/types'

// Rutas públicas que no requieren auth ni suscripción
const PUBLIC_PATHS = ['/login', '/register', '/pagar', '/api/webhooks']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { pathname } = req.nextUrl

  // Dejar pasar rutas públicas y archivos estáticos
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return res
  if (pathname.startsWith('/_next') || pathname.includes('.')) return res

  const supabase = createMiddlewareClient(req, res)

  // 1. Verificar que haya sesión activa
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 2. Verificar suscripción vigente (trial o activa)
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('plan, trial_ends_at, plan_expires_at')
    .eq('id', session.user.id)
    .single()

  if (!perfil || !planVigente(perfil as any)) {
    // No tiene plan vigente → redirigir a pagar
    // Pero si ya está en /pagar, no crear loop
    if (!pathname.startsWith('/pagar')) {
      return NextResponse.redirect(new URL('/pagar', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}