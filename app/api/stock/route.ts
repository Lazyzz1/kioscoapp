import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient, createAdminClient } from "@/lib/supabase.server"

// GET — listar todos los productos de stock del usuario
export async function GET() {
  const supabase = await createServerComponentClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("stock")
    .select("*")
    .eq("user_id", user.id)
    .order("nombre", { ascending: true })

  if (error) {
    console.error("[GET /api/stock]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ stock: data })
}

// POST — agregar un producto al stock
export async function POST(req: NextRequest) {
  const supabase = await createServerComponentClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 })
  }

  const { nombre, cantidad, minimo } = body as {
    nombre: string
    cantidad: number
    minimo: number
  }

  if (!nombre?.trim()) {
    return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
  }

  const admin = createAdminClient()

  // Verificar que no exista ya un producto con el mismo nombre (case-insensitive)
  const { data: existente } = await admin
    .from("stock")
    .select("id")
    .eq("user_id", user.id)
    .ilike("nombre", nombre.trim())
    .maybeSingle()

  if (existente) {
    return NextResponse.json({ error: "Ya existe un producto con ese nombre" }, { status: 409 })
  }

  const { data, error } = await admin
    .from("stock")
    .insert({
      user_id: user.id,
      nombre: nombre.trim(),
      cantidad: cantidad ?? 0,
      minimo: minimo ?? 5,
    })
    .select()
    .single()

  if (error) {
    console.error("[POST /api/stock]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ producto: data })
}