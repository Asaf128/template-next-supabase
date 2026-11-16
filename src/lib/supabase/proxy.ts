import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

// Pfad-Präfixe, die einen eingeloggten User verlangen, z. B. ['/dashboard'].
// Leer = keine Route ist geschützt, die Session wird nur erneuert.
const PROTECTED_PREFIXES: readonly string[] = []
const LOGIN_PATH = '/login'

// Erneuert die Supabase-Session bei jedem Request. Folgt dem offiziellen
// Supabase-Beispiel (examples/auth/nextjs/lib/supabase/proxy.ts).
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          // Cache-Header von Supabase übernehmen, damit kein CDN eine Antwort
          // mit Set-Cookie an andere Nutzer ausliefert.
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // Zwischen createServerClient und getClaims() keinen Code einfügen.
  // getClaims() prüft die Signatur des Tokens, getSession() tut das nicht.
  const { data } = await supabase.auth.getClaims()
  const isLoggedIn = Boolean(data?.claims)

  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (!isLoggedIn && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = LOGIN_PATH
    return NextResponse.redirect(url)
  }

  // supabaseResponse unverändert zurückgeben, sonst gehen die Cookies verloren.
  return supabaseResponse
}
