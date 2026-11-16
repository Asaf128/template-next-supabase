# template-next-supabase

Template für neue Projekte, gebaut für die Arbeit mit KI-Coding-Agenten. Einmal
als Template verwenden, loslegen: Die Regeln sind von Tag 0 maschinell erzwungen,
und der Agent findet alles, was er wissen muss, ohne dass du es erklärst.

## Stack

| Kategorie   | Technologie                                           |
| ----------- | ----------------------------------------------------- |
| Framework   | Next.js 16 (App Router)                               |
| Sprache     | TypeScript (strict)                                   |
| Styling     | Tailwind CSS v4                                       |
| Backend/DB  | Supabase (Postgres + Auth + Storage)                  |
| Hosting     | Vercel                                                |
| Animationen | Framer Motion + Lenis                                 |
| Icons       | Lucide React                                          |
| Validierung | Zod                                                   |
| Fonts       | lokal über `@fontsource-variable/*` (kein Google-CDN) |

## Projekt starten

Voraussetzung: Node 22 oder neuer, pnpm (Version steht in `package.json` unter `packageManager`).

```bash
pnpm install
cp .env.example .env.local   # Werte aus dem Supabase Dashboard eintragen
pnpm dev
```

Für ein neues Projekt aus diesem Template: [SETUP.md](SETUP.md). Mit Claude Code
erledigt `/new-project <name>` die automatisierbaren Schritte.

## Scripts

```bash
pnpm dev           # Dev-Server (localhost:3000)
pnpm check         # Prettier + ESLint + TypeScript in einem Lauf (wie in CI)
pnpm fix           # formatiert und behebt Lint-Fehler automatisch
pnpm build         # Production Build
pnpm db:types      # Supabase-Typen generieren (Project ID in package.json setzen)
```

Einzeln verfügbar: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm format:check`, `pnpm typecheck`.

## Setup für KI-Agenten

Der Aufbau folgt den offiziellen Vorgaben von Anthropic (Claude Code), Vercel
(Next.js), Supabase und GitHub. Leitlinie: so wenig Kontext wie möglich dauerhaft
laden, den Rest nur bei Bedarf.

| Datei                         | Zweck                                                                              | Wann geladen                     |
| ----------------------------- | ---------------------------------------------------------------------------------- | -------------------------------- |
| `AGENTS.md`                   | Zentrale Regeln. Offener Standard, den Claude Code, Copilot, Codex und Cursor lesen | jede Session                     |
| `CLAUDE.md`                   | Importiert `AGENTS.md`, ergänzt Claude-spezifisches                                 | jede Session (Claude Code)       |
| `.claude/rules/*.md`          | Detailregeln pro Bereich (Supabase, UI)                                            | nur beim Lesen passender Dateien |
| `.claude/skills/*/SKILL.md`   | Mehrstufige Abläufe (`new-project`, `add-table`)                                   | nur bei Aufruf                   |
| `.claude/settings.json`       | Freigaben für Prüfbefehle, Lesesperre für `.env`-Dateien                           | jede Session (Claude Code)       |
| `node_modules/next/dist/docs` | Next.js-Doku passend zur installierten Version                                     | bei Bedarf                       |

Grundsätze dahinter:

- **Erzwingen statt beschreiben.** Dateilänge, `any`, `console.log`, Default Exports und Hex-Farben prüft ESLint. Diese Regeln stehen deshalb nicht in `AGENTS.md`.
- **Ein Prüfbefehl.** `pnpm check` gibt dem Agenten eine schnelle, eindeutige Rückmeldung.
- **Build ohne Netzwerk.** Fonts liegen lokal, damit `pnpm build` auch in abgeschotteten Agent-Umgebungen läuft.
- **Regeln an einer Stelle.** Inhalte in `AGENTS.md` pflegen, nicht in `CLAUDE.md` duplizieren.

Optional, bewusst nicht vorinstalliert (kostet Kontext und Pflege):

```bash
# Offizielle Next.js-Skills, z. B. Prüfschleife gegen den laufenden Dev-Server
npx skills add vercel/next.js --skill next-dev-loop
```

## Projektstruktur

```text
src/
  app/                    Routing, Pages, Layouts, globals.css
  components/
    shared/               Button, Container, Section
    [feature]/            Feature-Komponenten (bei Bedarf anlegen)
  actions/                Server Actions (bei Bedarf anlegen)
  hooks/                  Globale Custom Hooks (bei Bedarf anlegen)
  lib/
    supabase/
      client.ts           Browser-Client
      server.ts           Server-Client
      proxy.ts            Session-Erneuerung, geschützte Pfade
    cn.ts                 clsx + tailwind-merge
    formatPrice.ts        Preis-Formatierung (Cent → EUR)
  types/
    database.ts           Auto-generiert von Supabase
  constants/
    config.ts             App-Name, App-URL
    navigation.ts         Nav-Links
  proxy.ts                Next.js Proxy (früher middleware.ts)
```

## Regeln (maschinell erzwungen)

- **Max. 300 Zeilen pro Datei**: ESLint `max-lines`
- **Kein `any`**: ESLint `@typescript-eslint/no-explicit-any`
- **Kein `console.log`**: ESLint `no-console` (nur `.error` und `.warn`)
- **Named Exports only**: ESLint `import/no-default-export` (Ausnahme: Next.js-Dateien)
- **Keine Hex-Farben in Komponenten**: ESLint `no-restricted-syntax`
- **Formatierung**: Prettier + `prettier-plugin-tailwindcss`
- **Conventional Commits**: commitlint als Git-Hook
- **CI**: Prettier, ESLint, TypeScript und Build bei jedem PR, Actions auf Commit-SHAs gepinnt
- **Secret-Scan**: gitleaks bei jedem PR
- **TypeScript strict + noUncheckedIndexedAccess**

## Farbschema anpassen

Alle Farben stehen als CSS-Variablen in `src/app/globals.css` unter `:root`.
Gesamtes Farbschema ändern heißt: nur diese eine Stelle anpassen.

```css
/* Akzentfarbe tauschen, alles andere passt sich an */
--accent: #c5a028;
--accent-light: #e8d5a3;
--accent-dark: #8a6e1a;
```
