# AGENTS.md

Regeln für KI-Coding-Agenten in diesem Repo. Bewusst kurz: Was ESLint, Prettier
oder TypeScript erzwingen, steht nicht hier, sondern in der jeweiligen Config.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 ·
Supabase (`@supabase/ssr`) · Vercel · pnpm

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Befehle

- `pnpm check`: Prettier, ESLint und TypeScript in einem Lauf. Muss vor jedem Commit fehlerfrei sein.
- `pnpm fix`: formatiert und behebt Lint-Fehler automatisch. Zuerst ausführen, wenn `check` scheitert.
- `pnpm build`: vor jedem PR und nach Änderungen an Routing, Config oder Fonts.
- `pnpm dev`: Dev-Server. Läuft bereits einer, den bestehenden weiterverwenden.
- `pnpm db:types`: nach jeder Änderung am Datenbankschema.
- `pnpm audit --prod`: vor jedem Release, läuft auch in CI.

## Struktur

```text
src/app/                  Routen, Layouts, globals.css (alle Farb-Token)
src/components/shared/    Button, Container, Section (einzige Quelle für Basis-UI)
src/components/layout/    Footer (verlinkt Impressum und Datenschutz)
src/components/<feature>/ Feature-Komponenten, max. 8 Dateien pro Ordner
src/actions/              Server Actions (alle Mutationen)
src/lib/supabase/         client.ts (Browser), server.ts (Server), proxy.ts (Session)
src/proxy.ts              Next.js Proxy (früher middleware.ts)
src/constants/            config.ts, navigation.ts
src/types/database.ts     generiert, nie von Hand ändern
```

## Regeln

- Server Components sind der Default. `'use client'` nur in der kleinsten Komponente, die es braucht.
- Basis-UI nie doppelt bauen: `Button`, `Container`, `Section` erweitern statt kopieren.
- Farben nur über Tailwind-Token (`bg-accent`, `text-foreground`). Neue Farbe: erst in `src/app/globals.css` anlegen.
- Mutationen nur in Server Actions: Input mit Zod validieren, dann Auth prüfen, dann schreiben.
- Auth serverseitig mit `supabase.auth.getClaims()`. Nie `getSession()` vertrauen, nie eine User-ID aus dem Input nehmen.
- Jede Supabase-Tabelle hat RLS. Ohne Policy kein Merge.
- Secrets nur in `.env.local`. `NEXT_PUBLIC_` nur für öffentliche Werte, nie für `SUPABASE_SECRET_KEY`.
- Security-Header und CSP in `next.config.ts` nicht entfernen. Neue externe Hosts dort eintragen.
- Keine neue Dependency ohne Grund. Erst prüfen, ob Next.js, React oder der vorhandene Stack es schon kann.

## Git

- Nie direkt auf `main`. Feature-Branch anlegen, am Ende PR auf `main`.
- Conventional Commits auf Deutsch, kurz: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`, `perf:`.
- Nach jeder abgeschlossenen Aufgabe: `pnpm check`, committen, auf den Feature-Branch pushen.
- Danach eine kurze Zusammenfassung als Tabelle: Datei oder Punkt, was und warum.

## Sicherheit und Datenschutz

Beides hat Vorrang vor Tempo und Komfort. Die vollständigen Regeln stehen in
`.claude/rules/security.md` und `.claude/rules/datenschutz.md` und gelten für
jede Aufgabe. Lies beide, bevor du Code schreibst.

Im Zweifel anhalten und den User fragen, vor allem bevor du:

- die CSP oder einen Security-Header lockerst, eine Lint-Regel abschaltest oder eine Prüfung entfernst
- einen externen Dienst, ein Skript, eine Einbettung oder eine Dependency hinzufügst
- Analytics einschaltest oder etwas im Browser speicherst, das nicht technisch nötig ist
- einen zerstörerischen Befehl ausführst (`drop`, `truncate`, `supabase db push`, `supabase db reset`, `git push --force`)
- Rechtstexte, Firmendaten oder echte Personendaten schreiben müsstest

## Detailregeln

Gelten immer, vor jeder Aufgabe lesen:

| Bereich     | Datei                          |
| ----------- | ------------------------------ |
| Sicherheit  | `.claude/rules/security.md`    |
| Datenschutz | `.claude/rules/datenschutz.md` |

Bevor du in einem dieser Bereiche arbeitest, lies zusätzlich die passende Datei:

| Bereich                                      | Datei                                   |
| -------------------------------------------- | --------------------------------------- |
| Supabase, Auth, Server Actions, Migrationen  | `.claude/rules/supabase.md`             |
| Komponenten, Styling, Seiten                 | `.claude/rules/ui.md`                   |
| Neues Projekt aus diesem Template einrichten | `SETUP.md`                              |
| Prüfung vor dem Livegang                     | `.claude/skills/launch-check/SKILL.md`  |
