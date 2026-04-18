import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient, createAdminClient } from "@/lib/supabase.server"

export async function GET() {
  const supabase = createServerComponentClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("movimientos")
    .select("*")
    .eq("user_id", user.id)
    .order("fecha", { ascending: false })
    .limit(50)

  if (error) {
    console.error("[GET /api/movimientos]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ movimientos: data })
}

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.error("[POST /api/movimientos] auth error:", authError)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 })
  }

  const { tipo, descripcion, precio_unitario, cantidad, monto, es_promo, categoria } = body as {
    tipo: string
    descripcion?: string
    precio_unitario?: number
    cantidad: number
    monto: number
    es_promo?: boolean
    categoria?: string
  }

  const admin = createAdminClient()

  const insertData: Record<string, unknown> = {
    user_id: user.id,
    tipo,
    descripcion: descripcion ?? null,
    precio_unitario: precio_unitario ?? 0,
    cantidad,
    monto,
    es_promo: es_promo ?? false,
    fecha: new Date().toISOString(),
  }

  // Solo incluimos categoria si ya existe la columna (migración corrida)
  if (categoria !== undefined) {
    insertData.categoria = categoria || null
  }

  const { data, error } = await admin
    .from("movimientos")
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error("[POST /api/movimientos] insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ movimiento: data })
}