export interface Perfil {
  id: string
  nombre_negocio: string
  plan: 'trial' | 'active' | 'expired' | 'cancelled' | 'pagado'
  trial_ends_at: string | null
  plan_activated_at: string | null
  plan_expires_at: string | null
  mp_subscription_id: string | null
  mp_payer_email: string | null
  pin_empleado: string | null   
  created_at: string
}

export interface Movimiento {
  id: string
  user_id: string
  tipo: "ingreso" | "gasto"
  descripcion: string | null
  precio_unitario: number | null
  cantidad: number
  monto: number
  es_promo: boolean | null
  categoria: string | null   
  fecha: string
  created_at: string
}

export function planVigente(perfil: Perfil): boolean {
  if (perfil.plan === "active") return true
  if (perfil.plan === "trial") {
    if (!perfil.trial_ends_at) return false
    return new Date(perfil.trial_ends_at) > new Date()
  }
  return false
}

export function diasRestantesTrial(perfil: Perfil): number {
  if (!perfil.trial_ends_at) return 0
  const diff = new Date(perfil.trial_ends_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}