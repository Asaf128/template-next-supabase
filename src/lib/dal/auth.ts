import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

// Data Access Layer: einzige Stelle, die den aktuellen User ermittelt.
// Gibt bewusst nur ein kleines DTO zurück, nie das ganze Supabase-User-Objekt.
export interface CurrentUser {
  id: string
  email: string | null
}

// cache(): pro Request nur eine Prüfung, egal wie oft aufgerufen.
// getClaims() verifiziert die JWT-Signatur — getSession() tut das nicht.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data) return null
  return { id: data.claims.sub, email: data.claims.email ?? null }
})
