import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createAdminClient } from '@/lib/supabase.server'
import { cancelarSuscripcion } from '@/lib/mercadopago'

export async function POST() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('mp_subscription_id')
    .eq('id', user.id)
    .single()

  if (!perfil?.mp_subscription_id) {
    return NextResponse.json({ error: 'No hay suscripción activa' }, { status: 400 })
  }

  try {
    await cancelarSuscripcion(perfil.mp_subscription_id)

    // El webhook de MP va a llegar y actualizar el plan a 'cancelled'
    // pero también lo actualizamos de forma inmediata por si acaso
    const admin = createAdminClient()
    await admin
      .from('perfiles')
      .update({ plan: 'cancelled', plan_expires_at: new Date().toISOString() })
      .eq('id', user.id)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Error cancelando suscripción:', e)
    return NextResponse.json({ error: 'No se pudo cancelar' }, { status: 500 })
  }
}