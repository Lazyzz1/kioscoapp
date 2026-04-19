import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ─── Cliente para Server Components / Route Handlers ────
export async function createServerComponentClient() {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({ name, value, ...options } as any)
        } catch {}
      },
      remove(name: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({ name, value: '', ...options } as any)
        } catch {}
      },
    },
  })
}

// ─── Cliente para Middleware ─────────────────────────────
export function createMiddlewareClient(req: NextRequest, res: NextResponse) {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get(name: string) { return req.cookies.get(name)?.value },
      set(name: string, value: string, options: Record<string, unknown>) {
        res.cookies.set({ name, value, ...options } as any)
      },
      remove(name: string, options: Record<string, unknown>) {
        res.cookies.set({ name, value: '', ...options } as any)
      },
    },
  })
}

// ─── Cliente admin (solo server, usa service role) ───────
export function createAdminClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}