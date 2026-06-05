import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createAdminClient } from '@/lib/supabase.server'

export async function GET(req: NextRequest) {
  const supabase = await createServerComponentClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Verificar que es admin
  const admin = createAdminClient()
  const { data: perfil } = await admin
    .from('perfiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!perfil?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const userId = req.nextUrl.searchParams.get('id')
  if (!userId) {
    return NextResponse.json({ error: 'Falta id' }, { status: 400 })
  }

  const { data: movimientos, error } = await admin
    .from('movimientos')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ movimientos })
}