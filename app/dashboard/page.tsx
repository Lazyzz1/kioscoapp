import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@/lib/supabase.server'
import { Perfil, Movimiento } from '@/types'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createServerComponentClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Cargar 6 meses atrás para poder navegar el historial
  const hoy = new Date()
  const desde = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1)
    .toISOString()
    .split('T')[0]

  const [{ data: perfil }, { data: movimientos }] = await Promise.all([
    supabase.from('perfiles').select('*').eq('id', user.id).single(),
    supabase
      .from('movimientos')
      .select('*')
      .eq('user_id', user.id)
      .gte('fecha', desde)
      .order('fecha', { ascending: false }),
  ])

  if (!perfil) redirect('/login')

  const ahora = new Date()
  const trialVigente = perfil.trial_ends_at && new Date(perfil.trial_ends_at) > ahora
  const planVigente = perfil.plan_expires_at && new Date(perfil.plan_expires_at) > ahora
  const esPago = perfil.plan === 'pagado' && planVigente
  const tieneAcceso = trialVigente || esPago

  if (!tieneAcceso) redirect('/pagar')

  return (
    <DashboardClient
      perfil={perfil as Perfil}
      movimientosIniciales={(movimientos ?? []) as Movimiento[]}
    />
  )
}