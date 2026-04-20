import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rutas que NO requieren autenticación
const PUBLIC_ROUTES = ['/', '/login', '/register', '/pagar', '/api/webhooks/mercadopago', '/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Dejar pasar rutas públicas y assets
  if (
    PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ✅ getSession() lee la cookie localmente — no hace llamadas de red
  // getUser() hace una llamada a Supabase que puede fallar en Edge Runtime
  const { data: { session } } = await supabase.auth.getSession()

  // No autenticado → /login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Autenticado → chequear suscripción/trial
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('plan, trial_ends_at, plan_expires_at')
    .eq('id', session.user.id)
    .single()

  if (perfil) {
    const ahora = new Date()
    const trialVigente = perfil.trial_ends_at && new Date(perfil.trial_ends_at) > ahora
    const planVigente = perfil.plan_expires_at && new Date(perfil.plan_expires_at) > ahora
    const esPago = perfil.plan === 'pagado' && planVigente
    const tieneAcceso = trialVigente || esPago

    // Sin acceso → /pagar (NO a /login)
    if (!tieneAcceso && !pathname.startsWith('/pagar')) {
      return NextResponse.redirect(new URL('/pagar', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}