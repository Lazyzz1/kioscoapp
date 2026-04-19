import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { planVigente } from '@/types'

const PUBLIC_PATHS = ['/login', '/register', '/pagar', '/api/webhooks']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()
  if (pathname.startsWith('/_next') || pathname.includes('.')) return NextResponse.next()

  let res = NextResponse.next({
    request: { headers: req.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options as any)
          )
        },
      },
    }
  )

  // getSession lee directo de la cookie — más rápido y confiable en edge
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('plan, trial_ends_at, plan_expires_at')
    .eq('id', session.user.id)
    .single()

  if (!perfil || !planVigente(perfil as any)) {
    if (!pathname.startsWith('/pagar')) {
      return NextResponse.redirect(new URL('/pagar', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}