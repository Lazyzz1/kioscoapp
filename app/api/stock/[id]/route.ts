import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient, createAdminClient } from "@/lib/supabase.server"

// PATCH — editar nombre, cantidad o mínimo de un producto
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerComponentClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 })
  }

  const admin = createAdminClient()

  // Verificar que el producto pertenece al usuario
  const { data: existente } = await admin
    .from("stock")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!existente) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  }

  const updates: Record<string, unknown> = {}
  if (body.nombre !== undefined) updates.nombre = (body.nombre as string).trim()
  if (body.cantidad !== undefined) updates.cantidad = body.cantidad
  if (body.minimo !== undefined) updates.minimo = body.minimo

  const { data, error } = await admin
    .from("stock")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[PATCH /api/stock/:id]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ producto: data })
}

// DELETE — eliminar un producto del stock
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerComponentClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  const admin = createAdminClient()

  // Verificar que el producto pertenece al usuario
  const { data: existente } = await admin
    .from("stock")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!existente) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  }

  const { error } = await admin
    .from("stock")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("[DELETE /api/stock/:id]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}