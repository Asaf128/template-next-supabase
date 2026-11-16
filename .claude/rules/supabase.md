---
paths:
  - "src/lib/supabase/**"
  - "src/actions/**"
  - "src/app/**/route.ts"
  - "src/proxy.ts"
  - "supabase/**"
---

# Supabase, Auth und Server Actions

## Clients

- Browser: `createClient()` aus `@/lib/supabase/client`. Nur lesen.
- Server Components, Server Actions, Route Handler: `await createClient()` aus `@/lib/supabase/server`. Pro Request neu erzeugen.
- Session-Erneuerung: `src/lib/supabase/proxy.ts`. Geschützte Pfade dort in `PROTECTED_PREFIXES` eintragen.

## Auth

- Prüfen mit `supabase.auth.getClaims()`. Die User-ID ist `claims.sub`.
- `getSession()` serverseitig nie für Autorisierung nutzen: Der Inhalt ist nicht verifiziert.
- `getUser()` nur, wenn frische Profildaten vom Auth-Server nötig sind (kostet einen Netzwerk-Request).
- Der Proxy schützt keine Server Actions. Jede Action prüft die Auth selbst.

## Server Actions

Reihenfolge immer: validieren, Auth prüfen, schreiben, revalidieren.

```ts
'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({ title: z.string().min(1).max(120) })

export async function createItem(input: unknown) {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { error: 'Ungültige Eingabe' }

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) return { error: 'Nicht angemeldet' }

  const { error } = await supabase
    .from('items')
    .insert({ title: parsed.data.title, user_id: data.claims.sub })
  if (error) return { error: 'Speichern fehlgeschlagen' }

  return { error: null }
}
```

- Fehler als Rückgabewert, keine internen Fehlermeldungen an den Client durchreichen.
- Eine Datei pro Feature unter `src/actions/`.

## Datenbank

- Jede Tabelle: `enable row level security` plus mindestens eine Policy. Neue Tabellen über den Skill `add-table`.
- In Policies `(select auth.uid())` statt `auth.uid()` schreiben (wird pro Statement nur einmal ausgewertet).
- Schema-Änderungen nur als Migration unter `supabase/migrations/`, nie nur im Dashboard.
- Nach jeder Schema-Änderung `pnpm db:types`. `src/types/database.ts` nie von Hand ändern.

## Keys und Caching

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` darf im Browser stehen, RLS schützt die Daten.
- `SUPABASE_SECRET_KEY` umgeht RLS. Nur serverseitig, nur wenn es ohne nicht geht, nie in Client-Code importieren.
- Antworten mit Session-Bezug nie cachen: kein `'use cache'` zusammen mit `cookies()`, keine statische Generierung für eingeloggte Ansichten.
