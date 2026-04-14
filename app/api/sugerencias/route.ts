import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase.server'

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { mensaje } = await req.json()
  if (!mensaje || mensaje.trim().length < 5) {
    return NextResponse.json({ error: 'Mensaje muy corto' }, { status: 400 })
  }

  const { error } = await supabase
    .from('sugerencias')
    .insert({ user_id: user.id, mensaje: mensaje.trim() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 201 })
}