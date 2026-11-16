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
- „Require status checks to pass" → `Prettier`, `ESLint`, `TypeScript`, `RLS`, `Tests`, `Build`, `Audit`, `gitleaks`
- „Do not allow bypassing"

**Security** — Settings → Security: Dependabot Alerts sowie Secret Scanning mit Push Protection aktivieren.

## 7. KI-Werkzeuge

Bereits im Repo und ohne weiteres Zutun aktiv:

| Datei                                 | Zweck                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| `AGENTS.md`                           | Einzige Regel-Datei. Claude Code, Codex, Cursor und Copilot lesen sie                |
| `docs/PROJECT.md`                     | Was gebaut wird. **Jetzt ausfüllen** (Ziel, Rollen, Datenmodell, Nicht-Ziele)        |
| `.claude/settings.json`               | Rechte und Hooks: Auto-Format, Dateischutz, `pnpm check` als Pflicht vor dem Stoppen |
| `.claude/skills/`                     | Abläufe `feature` und `db-migration`                                                 |
| `.claude/agents/security-reviewer.md` | Nur lesender Review-Agent für Auth, RLS und Server Actions                           |
| `.mcp.json`                           | MCP-Server `next-devtools` und `supabase` (nur lesend)                               |

Einmalig von Hand:

**Offizielle Skills installieren** (bewusst nicht im Template enthalten, damit du die aktuelle Version bekommst und selbst prüfst, was ins Repo kommt):

```bash
npx skills add supabase/agent-skills                    # Supabase + Postgres Best Practices
npx skills add vercel/next.js --skill next-dev-loop     # Laufzeit-Prüfung im Browser
```

Die Skills landen unter `.agents/skills/`, die Versionen in `skills-lock.json`. Beides committen. Skills sind Anweisungen an den Agenten: nur aus offiziellen Quellen installieren und den Diff lesen.

**Supabase-MCP auf das Projekt begrenzen:** in `.mcp.json` an die URL `&project_ref=<ref>` anhängen. Sonst sieht der Agent alle Projekte des Accounts. Den MCP-Server nur mit einem Entwicklungs-Projekt verbinden, nie mit Produktionsdaten: Inhalte aus der Datenbank können Anweisungen enthalten, die ein Agent befolgt.

**Sandbox einschalten:** in Claude Code `/sandbox` ausführen. Damit laufen Shell-Befehle mit Dateisystem- und Netzwerk-Grenzen. Die Deny-Regeln in `.claude/settings.json` allein halten ein Skript nicht davon ab, `.env.local` zu lesen.

**CODEOWNERS prüfen:** in `.github/CODEOWNERS` den GitHub-Namen anpassen und in der Branch Protection „Require review from Code Owners" aktivieren. Damit kann kein Agent seine eigenen Regeln, Hooks oder CI-Prüfungen ohne dein Review ändern.

**Für CI und Agenten ohne Browser:** in Supabase ein Personal Access Token mit eingeschränktem Umfang anlegen (nur dieses Projekt), nicht das Token aus `supabase login` verwenden.

## Danach

`pnpm check` und `pnpm build` müssen grün sein. Diese Datei kann anschließend gelöscht werden.
