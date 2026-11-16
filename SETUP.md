# Setup: Neues Projekt einrichten

Du hast dieses Template als Basis für ein neues Repo verwendet. Diese Schritte
sind nötig, bevor du startest. Mit Claude Code erledigt `/new-project <name>`
die Schritte 1, 3 und 4 und fragt dich nach den fehlenden Werten.

## 1. Dependencies installieren

```bash
pnpm install
```

Das Template committet kein Lockfile. Im echten Projekt gehört es ins Repo:
den Block `pnpm-lock.yaml` aus `.gitignore` entfernen, `pnpm-lock.yaml`
committen und in `.github/workflows/ci.yml` auf
`pnpm install --frozen-lockfile --ignore-scripts` umstellen.

## 2. Umgebungsvariablen

```bash
cp .env.example .env.local
```

Werte aus dem [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API Keys eintragen:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (beginnt mit `sb_publishable_`)
- `NEXT_PUBLIC_APP_URL`: `http://localhost:3000` für lokale Entwicklung

Die alten `anon`- und `service_role`-Keys laufen aus. Dieses Template nutzt nur
noch die neuen Publishable und Secret Keys.

`NEXT_PUBLIC_ENABLE_ANALYTICS` bleibt auf `false`, bis der Betreiber Vercel
Analytics bewusst einschaltet und in die Datenschutzerklärung aufnimmt.

Das Supabase-Projekt in einer EU-Region anlegen (Frankfurt). Die Region lässt
sich später nicht ändern.

## 3. Supabase Types generieren

In `package.json` im Script `db:types` den Platzhalter `YOUR_PROJECT_ID` durch
deine Supabase Project ID ersetzen, dann:

```bash
pnpm db:types
```

## 4. App-Infos anpassen

- `package.json`: `name`
- `src/constants/config.ts`: `APP_NAME`
- `src/app/layout.tsx`: `description` in `metadata`
- `src/app/globals.css`: Akzentfarbe unter `:root`, falls nötig
- `src/lib/supabase/proxy.ts`: geschützte Pfade in `PROTECTED_PREFIXES`, sobald es einen Login gibt

## 5. Vercel verbinden

1. Repo in [Vercel](https://vercel.com) importieren
2. Environment Variables im Vercel Dashboard setzen (gleiche Werte wie `.env.local`)
3. `vercel.json` legt die Region auf Frankfurt (`fra1`) fest. Nicht entfernen.

## 6. GitHub einrichten

**Secrets für CI**: Repo → Settings → Secrets → Actions. Optional, der Build
läuft auch mit Platzhaltern:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`

**Branch Protection auf `main`**: Repo → Settings → Branches:

- „Require a pull request before merging"
- „Require status checks to pass": `Prettier`, `ESLint`, `TypeScript`, `Build` auswählen
- „Do not allow bypassing"

**Security**: Repo → Settings → Security:

- Dependabot alerts aktivieren
- Secret Scanning + Push Protection aktivieren

**Actions**: Repo → Settings → Actions → General:

- „Require actions to be pinned to a full-length commit SHA" aktivieren
- Workflow permissions auf „Read repository contents" stellen

## 7. Datenschutz und Recht (nur der Betreiber kann das)

- `/impressum` und `/datenschutz` sind Gerüste. Alle `[PLATZHALTER: ...]` durch echte, geprüfte Angaben ersetzen. Kein KI-Agent darf diese Texte erfinden.
- Verträge zur Auftragsverarbeitung abschließen: Vercel, Supabase, E-Mail-Dienst.
- Im Supabase Dashboard die [Production Security Checklist](https://supabase.com/docs/guides/security/production-checklist) abarbeiten.
- Vor dem Livegang in Claude Code `/launch-check` ausführen. Der Skill prüft Sicherheit und Datenschutz und ändert nichts.

---

Du kannst diese Datei danach löschen oder behalten. Sie hat keinen Einfluss auf die App.
