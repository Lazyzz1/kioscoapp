import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase.server'
import { crearLinkSuscripcion } from '@/lib/mercadopago'

export async function POST() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const url = await crearLinkSuscripcion({
      userEmail: user.email!,
      userId: user.id,
      backUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })
    return NextResponse.json({ url })
  } catch (e: any) {
    console.error('MP error:', e)
    return NextResponse.json({ error: 'Error al crear link de pago' }, { status: 500 })
  }
}