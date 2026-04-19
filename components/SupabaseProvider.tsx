'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Fuerza que las cookies se sincronicen con el servidor
        fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, session }),
        }).catch(() => {})
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}