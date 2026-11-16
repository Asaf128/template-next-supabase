import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/lib/env'

// Next.js 16: proxy.ts ersetzt middleware.ts. Erneuert die Supabase-Session bei jedem Request.
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Wichtig: zwischen createServerClient und getClaims() keinen Code einfügen.
  // getClaims() prüft die JWT-Signatur und erneuert abgelaufene Tokens.
  await supabase.auth.getClaims()

  // Geschützte Routen: hier anhand der Claims auf /login umleiten.
  // Dabei immer supabaseResponse (bzw. dessen Cookies) zurückgeben, sonst geht die Session verloren.
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
