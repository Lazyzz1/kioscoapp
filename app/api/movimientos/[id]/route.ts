import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient, createAdminClient } from "@/lib/supabase.server"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createServerComponentClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const { descripcion, precio_unitario, cantidad, monto, es_promo, categoria } = body

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("movimientos")
    .update({ descripcion, precio_unitario, cantidad, monto, es_promo, categoria: categoria || null })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("[PATCH /api/movimientos/[id]]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ movimiento: data })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createServerComponentClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const admin = createAdminClient()
  const { error } = await admin
    .from("movimientos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("[DELETE /api/movimientos/[id]]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}