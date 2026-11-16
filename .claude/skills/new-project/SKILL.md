---
name: new-project
description: Richtet ein frisch aus diesem Template erzeugtes Repo als neues Projekt ein (Name, Metadaten, Env, Supabase-Typen).
argument-hint: "<projektname>"
disable-model-invocation: true
---

# Neues Projekt einrichten

Projektname: `$ARGUMENTS`. Fehlt er, zuerst danach fragen.

`SETUP.md` ist die Quelle für alle Schritte. Lies sie und arbeite sie so ab:

1. **Selbst erledigen**
   - `package.json`: `name` auf den Projektnamen (kebab-case) setzen.
   - `src/constants/config.ts`: `APP_NAME` setzen.
   - `src/app/layout.tsx`: `description` anpassen (150 bis 160 Zeichen, vom User erfragen oder als Entwurf vorschlagen).
   - `README.md`: Titel und Einleitung auf das Projekt umschreiben, Template-Hinweise entfernen.
   - `.gitignore`: den Block `pnpm-lock.yaml` entfernen. Ein echtes Projekt committet sein Lockfile.
   - `pnpm install`, danach `pnpm-lock.yaml` mit committen.
   - `.github/workflows/ci.yml`: in allen Jobs `pnpm install --ignore-scripts` durch `pnpm install --frozen-lockfile --ignore-scripts` ersetzen.
2. **Vom User erfragen, nie erfinden**
   - Supabase Project ID für `db:types` in `package.json`.
   - Werte für `.env.local`. Die Datei legt der User selbst an (`cp .env.example .env.local`). Lies oder schreibe keine echten Keys.
   - Akzentfarbe, falls sie vom Template abweichen soll (`src/app/globals.css`).
3. **Prüfen**: `pnpm check` und `pnpm build` müssen fehlerfrei laufen.
4. **Committen** auf einem Branch `chore/projekt-setup`, PR auf `main`.
5. **Dem User als Liste nennen**, was nur er tun kann: Vercel verbinden, GitHub-Secrets setzen, Branch Protection und Dependabot aktivieren (Details in `SETUP.md`).
