import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@/lib/supabase.server'
import { Perfil, Movimiento, diasRestantesTrial, planVigente } from '@/types'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = createServerComponentClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: perfil }, { data: movimientos }] = await Promise.all([
    supabase.from('perfiles').select('*').eq('id', user.id).single(),
    supabase
      .from('movimientos')
      .select('*')
      .eq('user_id', user.id)
      .order('fecha', { ascending: false })
      .limit(50),
  ])

  if (!perfil) redirect('/login')

  return (
    <DashboardClient
      perfil={perfil as Perfil}
      movimientosIniciales={(movimientos ?? []) as Movimiento[]}
    />
  )
}