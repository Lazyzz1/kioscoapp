export type Plan = 'trial' | 'active' | 'expired' | 'cancelled'
export type TipoMovimiento = 'ingreso' | 'gasto'

export interface Perfil {
  id: string
  nombre_negocio: string
  plan: Plan
  trial_ends_at: string
  plan_activated_at: string | null
  plan_expires_at: string | null
  mp_subscription_id: string | null
  mp_payer_email: string | null
  created_at: string
}

export interface Movimiento {
  id: string
  user_id: string
  tipo: TipoMovimiento
  descripcion: string | null
  precio_unitario: number | null 
  cantidad: number
  monto: number
  es_promo: boolean | null
  fecha: string
  created_at: string
}

export interface ResumenMes {
  total_ingresos: number
  total_gastos: number
  neto: number
  cantidad_movimientos: number
}

// Helpers
export function planVigente(perfil: Perfil): boolean {
  if (perfil.plan === 'active') return true
  if (perfil.plan === 'trial') {
    return new Date(perfil.trial_ends_at) > new Date()
  }
  return false
}

export function diasRestantesTrial(perfil: Perfil): number {
  const diff = new Date(perfil.trial_ends_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}