import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'
import type { Database } from '@/types/database'

// Server-Client für Server Components, Server Actions und Route Handler.
// Pro Request neu erzeugen — nie in einer Modul-Variable cachen.
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Aufruf aus einer Server Component: Cookies sind dort read-only.
            // Unkritisch, weil src/proxy.ts die Session bei jedem Request erneuert.
          }
        },
      },
    }
  )
}
