import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@/lib/supabase.server'
import { Perfil, Movimiento } from '@/types'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = createServerComponentClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Primer día del mes anterior — así tenemos datos para la comparación
  const hoy = new Date()
  const primerDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
    .toISOString()
    .split('T')[0]

  const [{ data: perfil }, { data: movimientos }] = await Promise.all([
    supabase.from('perfiles').select('*').eq('id', user.id).single(),
    supabase
      .from('movimientos')
      .select('*')
      .eq('user_id', user.id)
      .gte('fecha', primerDiaMesAnterior)   // desde el 1° del mes anterior
      .order('fecha', { ascending: false }),
  ])

  if (!perfil) redirect('/login')

  return (
    <DashboardClient
      perfil={perfil as Perfil}
      movimientosIniciales={(movimientos ?? []) as Movimiento[]}
    />
  )
}