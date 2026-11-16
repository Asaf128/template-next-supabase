# Projektregeln für KI-Agenten

Dieses Projekt wird ausschließlich von KI-Agenten entwickelt. Diese Datei ist die einzige Quelle für alle Regeln. `CLAUDE.md` importiert sie nur. Regeln hier ändern, nirgends sonst.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack

Next.js 16 (App Router, Cache Components, Turbopack) · React 19 · TypeScript 6 strict · Tailwind CSS v4 · Supabase · Zod 4 · Vitest · Vercel · pnpm 12 · Node 24

Dein Trainingswissen ist für diesen Stack wahrscheinlich veraltet. Vor dem Schreiben nachlesen statt raten:

- **Next.js** — `node_modules/next/dist/docs/` (passt exakt zur installierten Version)
- **Supabase** — <https://supabase.com/docs> bzw. der Supabase-MCP-Server (`search_docs`)
- **Alles andere** — installierte Version in `package.json` prüfen, dann die Typen in `node_modules` lesen

Bekannte Abweichungen von älterem Wissen:

| Alt (nicht verwenden)                 | Aktuell in diesem Projekt                                             |
| ------------------------------------- | --------------------------------------------------------------------- |
| `middleware.ts`                       | `src/proxy.ts` mit `export function proxy`                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`       | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_...`)         |
| `SUPABASE_SERVICE_ROLE_KEY`           | `SUPABASE_SECRET_KEY` (`sb_secret_...`)                               |
| `supabase.auth.getSession()` (Server) | `getClaims()` für Prüfung, `getUser()` wenn das User-Objekt nötig ist |
| `@supabase/auth-helpers-nextjs`       | `@supabase/ssr`                                                       |
| `framer-motion`                       | `motion` (Import: `motion/react`)                                     |
| `export const dynamic / revalidate`   | Cache Components: `'use cache'`, `cacheLife`, `<Suspense>`            |
| `params` / `searchParams` synchron    | beides ist ein Promise: `await props.params`                          |
| `tailwind.config.js`                  | Tailwind v4: Tokens in `src/app/globals.css` (`@theme`)               |
| `supabase gen types --project-id`     | `pnpm db:types` (CLI v3: `--remote`)                                  |

## Arbeitsablauf

1. **Vor dem Code:** betroffene Dateien lesen, vorhandene Muster übernehmen.
2. **Nach jeder Änderung:** `pnpm check` ausführen (Prettier, ESLint, TypeScript, Tests). Eine Aufgabe ist erst fertig, wenn `pnpm check` grün ist. Formatfehler behebt `pnpm format`.
3. **Bei Änderungen an Routen, Config oder Env:** zusätzlich `pnpm build`.
4. **UI-Änderungen:** im laufenden Dev-Server prüfen (`pnpm dev`, Next.js-MCP-Server), nicht nur per Typecheck.
5. **Nie** eine Regel, einen Test oder einen Check abschalten, um grün zu werden (`eslint-disable`, `@ts-expect-error`, `.skip`). Wenn eine Regel wirklich falsch ist: dem User melden.
6. **Unklare Anforderung:** nachfragen statt annehmen. Keine Features bauen, die nicht verlangt wurden.

| Befehl          | Zweck                                                        |
| --------------- | ------------------------------------------------------------ |
| `pnpm check`    | Alles prüfen: Format, Lint, Typen, Tests (braucht keine Env) |
| `pnpm build`    | Production Build (braucht Env-Variablen)                     |
| `pnpm dev`      | Dev-Server auf `localhost:3000`                              |
| `pnpm format`   | Prettier auf alle Dateien anwenden                           |
| `pnpm test`     | Vitest einmal ausführen                                      |
| `pnpm db:types` | Supabase-Typen neu generieren (nach jeder Migration)         |

## Projektstruktur

```text
src/
  app/                  Routing, Pages, Layouts (nur dünne Dateien, keine Logik)
  actions/              Server Actions ('use server'), eine Datei pro Feature
  components/
    shared/             Button, Container, Section — einzige Quelle für Basis-UI
    layout/             Header, Footer, Navigation
    [feature]/          Feature-Komponenten, max. 6-8 Dateien pro Ordner
  hooks/                Globale Custom Hooks
  lib/
    env.ts              Einzige Stelle, die process.env liest (Zod-validiert)
    supabase/client.ts  Browser-Client
    supabase/server.ts  Server-Client (server-only)
  constants/            APP_NAME, APP_URL, NAV_LINKS
  types/database.ts     Generiert — nie von Hand bearbeiten
  proxy.ts              Supabase-Session-Refresh (ehemals middleware.ts)
supabase/migrations/    SQL-Migrationen (entsteht mit `supabase init`)
```

## Code-Regeln (per ESLint und TypeScript erzwungen)

- **Max. 300 Zeilen pro Datei** — vorher splitten (UI in Sub-Komponenten, Logik in Custom Hook)
- **Kein `any`** — korrekte Types, Union Types für feste Werte, `unknown` plus Zod für Fremddaten
- **Named Exports only** — `export default` nur in Next.js-Dateien (`page.tsx`, `layout.tsx`, `error.tsx` usw.)
- **Kein `console.log`** — nur `console.error` / `console.warn`
- **Kein `process.env` außerhalb von `src/lib/env.ts`** — `env` aus `@/lib/env` importieren
- **`import type`** für reine Typ-Imports
- **`noUncheckedIndexedAccess`** ist aktiv — Array- und Record-Zugriffe können `undefined` sein

## Tests

- Vitest, Dateien liegen neben dem Code: `foo.ts` und `foo.test.ts`
- Jede neue Funktion in `lib/` und jede Server Action mit Logik bekommt einen Test
- Bugfix: erst einen Test schreiben, der den Fehler zeigt, dann beheben

## Styling

- **Nie Hex-Werte in Komponenten** — nur Tailwind-Klassen aus den Tokens: `bg-accent`, `text-text-secondary`, `border-border`
- Nicht `bg-[var(--accent)]` schreiben, wenn es `bg-accent` gibt
- Neue Farbe: Variable in `src/app/globals.css` unter `:root` anlegen und in `@theme inline` eintragen
- Kein `style={{}}` für wiederkehrende Elemente
- Klassen bedingt zusammensetzen mit `cn()` aus `@/lib/cn`

## Komponenten

- **Server Component ist der Default.** `'use client'` nur, wenn State, Effekte oder Browser-APIs nötig sind, und so tief im Baum wie möglich
- `Button`, `Container`, `Section` aus `src/components/shared/` wiederverwenden. Nie das gleiche UI-Element ein zweites Mal mit anderen Klassen bauen. Fehlt eine Variante: die Shared-Komponente erweitern
- Interne Links mit `next/link` (typisierte Routen sind aktiv), Bilder mit `next/image`
- Cache Components ist aktiv: Zugriffe auf `cookies()`, `headers()`, `searchParams` und Supabase-Abfragen mit User-Bezug gehören in eine Komponente unter `<Suspense>`. Die Build-Fehlermeldung nennt die möglichen Lösungen

## Backend und Daten

- **Mutationen nur über Server Actions** — kein schreibender Supabase-Zugriff aus Client Components
- **Zod in jeder Server Action** — Input validieren, bevor irgendetwas passiert
- **User-ID immer aus der Session**, nie aus Formular, URL oder Request-Body
- **RLS auf jeder Tabelle** — ohne Policy kein Deploy. Der Publishable Key ist öffentlich, RLS ist die einzige Schranke
- **Schema-Änderungen nur als Migration** in `supabase/migrations/` (`supabase migration new <name>`), nie direkt im Dashboard. Danach `pnpm db:types`
- Server-Client pro Request neu erzeugen (`await createClient()`), nie in einer Modul-Variable halten
- Fehler als Rückgabewert an die UI geben, nicht werfen. Interne Fehlertexte nicht an den Client durchreichen

Muster für eine Server Action:

```ts
'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({ title: z.string().trim().min(1).max(120) })

type ActionResult = { ok: true } | { ok: false; error: string }

export async function createNote(input: unknown): Promise<ActionResult> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Ungültige Eingabe' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Nicht angemeldet' }

  const { error } = await supabase.from('notes').insert({ ...parsed.data, user_id: user.id })
  if (error) {
    console.error('createNote', error)
    return { ok: false, error: 'Speichern fehlgeschlagen' }
  }
  return { ok: true }
}
```

## Security

- `.env.local` nie lesen, ausgeben oder committen. Nur `.env.example` ist im Repo
- Neue Env-Variable: in `.env.example`, in `src/lib/env.ts` und in der CI (`.github/workflows/ci.yml`) eintragen
- `NEXT_PUBLIC_` nur für wirklich öffentliche Werte. `SUPABASE_SECRET_KEY` umgeht RLS: nur in Dateien mit `import 'server-only'`, nur wenn es keinen anderen Weg gibt
- Security Headers und CSP in `next.config.ts` nicht entfernen. Neue externe Domain (Skripte, Bilder, APIs): CSP dort erweitern
- Keine neue Dependency ohne Grund. Vorher prüfen, ob eine vorhandene reicht

## Git

- **Conventional Commits** auf Deutsch, kurz: `feat:`, `fix:`, `style:`, `refactor:`, `chore:`, `docs:`, `perf:`, `test:`
- Nie direkt auf `main` pushen — immer Branch und PR
- `pnpm-lock.yaml` wird committet. Dependencies nur mit `pnpm add` / `pnpm update` ändern
- Nach jeder abgeschlossenen Änderung committen und pushen, sobald `pnpm check` grün ist
