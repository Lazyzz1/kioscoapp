import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient, createAdminClient } from "@/lib/supabase.server"
import { cookies } from "next/headers"

// ─── PATCH: editar un movimiento ─────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerComponentClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const { descripcion, precio_unitario, cantidad, monto, es_promo } = body

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("movimientos")
    .update({ descripcion, precio_unitario, cantidad, monto, es_promo })
    .eq("id", params.id)
    .eq("user_id", user.id)   // seguridad: solo el dueño puede editar
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ movimiento: data })
}

// ─── DELETE: eliminar un movimiento ──────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerComponentClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const admin = createAdminClient()
  const { error } = await admin
    .from("movimientos")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id)   // seguridad: solo el dueño puede eliminar

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}