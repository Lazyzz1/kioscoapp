import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createAdminClient } from '@/lib/supabase.server'

export async function POST(req: NextRequest) {
  const supabase = await createServerComponentClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('[POST /api/sugerencias] auth error:', authError)
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { mensaje } = await req.json()
  if (!mensaje || mensaje.trim().length < 5) {
    return NextResponse.json({ error: 'Mensaje muy corto' }, { status: 400 })
  }

  // Admin client para evitar problemas de RLS en Route Handlers
  const admin = createAdminClient()
  const { error } = await admin
    .from('sugerencias')
    .insert({ user_id: user.id, mensaje: mensaje.trim() })

  if (error) {
    console.error('[POST /api/sugerencias] insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}