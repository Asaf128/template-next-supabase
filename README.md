# template-next-supabase

Template für neue Projekte, die von KI-Agenten entwickelt werden. Einmal als Template verwenden, loslegen. Alle Regeln sind von Tag 0 an maschinell erzwungen.

- **Neues Projekt einrichten:** [SETUP.md](SETUP.md)
- **Regeln für Agenten:** [AGENTS.md](AGENTS.md) (einzige Quelle, `CLAUDE.md` importiert sie)

## Stack

| Kategorie   | Technologie                                             |
| ----------- | ------------------------------------------------------- |
| Framework   | Next.js 16 (App Router, Cache Components, Turbopack)    |
| UI          | React 19                                                |
| Sprache     | TypeScript 6 (strict, `noUncheckedIndexedAccess`)       |
| Styling     | Tailwind CSS v4                                         |
| Backend/DB  | Supabase (Postgres, Auth, Storage) über `@supabase/ssr` |
| Validierung | Zod 4                                                   |
| Tests       | Vitest                                                  |
| Animationen | Motion + Lenis                                          |
| Icons       | Lucide React                                            |
| Hosting     | Vercel                                                  |
| Tooling     | pnpm 12, Node 24, ESLint 10, Prettier                   |

## Scripts

```bash
pnpm dev           # Dev-Server (localhost:3000)
pnpm check         # Prettier + ESLint + TypeScript + Tests (wie in CI)
pnpm build         # Production Build
pnpm format        # Prettier anwenden
pnpm lint:fix      # ESLint mit Auto-Fix
pnpm test          # Vitest
pnpm db:types      # Supabase-Types generieren (vorher: supabase link)
```

## Was maschinell erzwungen wird

| Regel                                          | Wodurch                                |
| ---------------------------------------------- | -------------------------------------- |
| Max. 300 Zeilen pro Datei                      | ESLint `max-lines`                     |
| Kein `any`                                     | ESLint                                 |
| Named Exports only (außer Next.js-Dateien)     | ESLint `import/no-default-export`      |
| Kein `console.log`                             | ESLint `no-console`                    |
| `process.env` nur in `src/lib/env.ts`          | ESLint `no-restricted-syntax`          |
| Env-Variablen vollständig und gültig           | Zod in `src/lib/env.ts` (Start/Build)  |
| Typsichere Links und Route-Props               | Next.js `typedRoutes`                  |
| Formatierung inkl. Tailwind-Klassenreihenfolge | Prettier                               |
| Conventional Commits                           | commitlint als Git-Hook                |
| Format, Lint, Typen, Tests, Build bei jedem PR | GitHub Actions                         |
| Keine Secrets im Repo                          | gitleaks bei jedem PR                  |
| Reproduzierbare Installs                       | `pnpm-lock.yaml` + `--frozen-lockfile` |

Nicht maschinell erzwungen, aber in `AGENTS.md` vorgeschrieben: RLS auf jeder Tabelle, Zod in jeder Server Action, User-ID aus der Session, keine Hex-Werte in Komponenten.

## Farbschema anpassen

Alle Farben stehen als CSS-Variablen in `src/app/globals.css` unter `:root`. Farbschema ändern heißt: nur diese eine Stelle anpassen.

```css
--accent: #c5a028;
--accent-light: #e8d5a3;
--accent-dark: #8a6e1a;
```
