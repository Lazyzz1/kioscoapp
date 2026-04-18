import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createAdminClient } from '@/lib/supabase.server'

// ─── POST: guardar o verificar PIN ───────────────────────
export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { accion, pin } = body // accion: 'guardar' | 'verificar'

  if (!pin || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'El PIN debe ser de 4 dígitos' }, { status: 400 })
  }

  const admin = createAdminClient()

  if (accion === 'guardar') {
    // Guarda el PIN hasheado con btoa (simple, no es criptografía fuerte
    // pero evita que se vea en texto plano en la base de datos)
    const pinHash = Buffer.from(pin).toString('base64')
    const { error } = await admin
      .from('perfiles')
      .update({ pin_empleado: pinHash })
      .eq('id', user.id)

    if (error) {
      console.error('[POST /api/pin] save error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  if (accion === 'verificar') {
    const { data: perfil, error } = await admin
      .from('perfiles')
      .select('pin_empleado')
      .eq('id', user.id)
      .single()

    if (error || !perfil) {
      return NextResponse.json({ error: 'Error al verificar' }, { status: 500 })
    }

    if (!perfil.pin_empleado) {
      return NextResponse.json({ error: 'PIN no configurado' }, { status: 404 })
    }

    const pinHash = Buffer.from(pin).toString('base64')
    const valido = pinHash === perfil.pin_empleado
    return NextResponse.json({ valido })
  }

  return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
}