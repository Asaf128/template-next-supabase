import { z } from 'zod'

// Öffentliche Env-Variablen — einzige Stelle, an der process.env gelesen wird.
// NEXT_PUBLIC_-Werte müssen statisch referenziert werden, damit Next.js sie
// in den Client-Bundle einsetzen kann (kein process.env[key]).
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
})

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
})

if (!parsed.success) {
  throw new Error(
    `Ungültige Umgebungsvariablen — .env.local mit .env.example abgleichen:\n${z.prettifyError(parsed.error)}`
  )
}

export const env = parsed.data
