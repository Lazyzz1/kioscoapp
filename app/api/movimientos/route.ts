import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase.server'

// GET /api/movimientos?mes=2026-04
export async function GET(req: NextRequest) {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const mes = req.nextUrl.searchParams.get('mes') // formato: "2026-04"
  let query = supabase
    .from('movimientos')
    .select('*')
    .eq('user_id', user.id)
    .order('fecha', { ascending: false })

  if (mes) {
    const [year, month] = mes.split('-').map(Number)
    const desde = new Date(year, month - 1, 1).toISOString()
    const hasta = new Date(year, month, 0, 23, 59, 59).toISOString()
    query = query.gte('fecha', desde).lte('fecha', hasta)
  }

  const { data, error } = await query.limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ movimientos: data })
}

// POST /api/movimientos
export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { tipo, descripcion, precio_unitario, cantidad, monto, es_promo } = body

  // Validaciones básicas
  if (!['ingreso', 'gasto'].includes(tipo)) {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  }
  if (!monto || monto <= 0) {
    return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('movimientos')
    .insert({
      user_id: user.id,
      tipo,
      descripcion: descripcion || null,
      precio_unitario: precio_unitario || 0,
      cantidad: cantidad || 1,
      monto,
      es_promo: es_promo || false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ movimiento: data }, { status: 201 })
}