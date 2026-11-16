# Setup — Neues Projekt einrichten

Diese Schritte sind einmalig nötig, bevor die Entwicklung startet. Voraussetzungen: Node 24 (`.nvmrc`) und pnpm 12 (`corepack enable` übernimmt die Version aus `package.json`).

## 1. Repo anlegen und installieren

GitHub → „Use this template" → neues Repo. Dann:

```bash
pnpm install
```

## 2. Supabase-Projekt und Umgebungsvariablen

```bash
cp .env.example .env.local
```

Werte aus dem [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API Keys eintragen:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → der Key mit `sb_publishable_...` (ersetzt den alten anon-Key)
- `NEXT_PUBLIC_APP_URL` → `http://localhost:3000` für lokale Entwicklung

Fehlt ein Wert oder ist er ungültig, brechen `pnpm dev` und `pnpm build` mit einer klaren Meldung ab (`src/lib/env.ts`).

## 3. Supabase CLI verbinden

```bash
pnpm exec supabase login
pnpm exec supabase init                       # legt supabase/config.toml und supabase/migrations/ an
pnpm exec supabase link --project-ref <ref>   # <ref> = Project ID aus dem Dashboard
pnpm db:types                                 # nach jeder Migration wiederholen
```

Schema-Änderungen laufen ab jetzt nur noch als Migration: `pnpm exec supabase migration new <name>`, dann `pnpm exec supabase db push`.

## 4. App-Infos anpassen

- `package.json` → `name`
- `src/constants/config.ts` → `APP_NAME`
- `src/app/layout.tsx` → `metadata` (Beschreibung, OG-Bild unter `public/images/og-default.jpg`)
- `src/app/globals.css` → Farben unter `:root`, Schriften in `layout.tsx`

## 5. Vercel verbinden

1. Repo in [Vercel](https://vercel.com) importieren
2. Environment Variables setzen (gleiche Namen wie in `.env.example`, `NEXT_PUBLIC_APP_URL` = Produktions-Domain)

## 6. GitHub einrichten

**Secrets für CI** (optional, ohne sie baut die CI mit Platzhaltern) — Settings → Secrets → Actions:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

**Branch Protection auf `main`** — Settings → Branches:

- „Require a pull request before merging"
- „Require status checks to pass" → `Prettier`, `ESLint`, `TypeScript`, `Tests`, `Build`, `gitleaks`
- „Do not allow bypassing"

**Security** — Settings → Security: Dependabot Alerts sowie Secret Scanning mit Push Protection aktivieren.

## 7. KI-Werkzeuge

- **`AGENTS.md`** ist die einzige Regel-Datei. Claude Code, Codex, Cursor und Copilot lesen sie. Projektspezifisches (Domäne, Datenmodell, Begriffe) dort ergänzen, sobald es feststeht.
- **`.mcp.json`** bindet zwei MCP-Server ein:
  - `next-devtools` — Fehler, Routen und Logs des laufenden Dev-Servers
  - `supabase` — nur lesend. Beim ersten Start meldet man sich per Browser an. Auf ein Projekt begrenzen: in der URL `&project_ref=<ref>` ergänzen. Sonst sieht der Agent alle Projekte des Accounts.
- **`.claude/settings.json`** gibt die Projekt-Scripts frei und sperrt das Lesen von `.env`-Dateien.

## Danach

`pnpm check` und `pnpm build` müssen grün sein. Diese Datei kann anschließend gelöscht werden.
