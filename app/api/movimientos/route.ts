import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient, createAdminClient } from "@/lib/supabase.server"

export async function GET() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { data, error } = await supabase
    .from("movimientos")
    .select("*")
    .eq("user_id", user.id)
    .order("fecha", { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ movimientos: data })
}

export async function POST(req: NextRequest) {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const { tipo, descripcion, precio_unitario, cantidad, monto, es_promo, categoria } = body

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("movimientos")
    .insert({
      user_id: user.id,
      tipo,
      descripcion,
      precio_unitario,
      cantidad,
      monto,
      es_promo,
      categoria: categoria || null,
      fecha: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ movimiento: data })
}