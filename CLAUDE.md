# Claude Code

@AGENTS.md

## Zusätzlich für Claude Code

### Auto-Commit

Nach JEDER abgeschlossenen Änderung automatisch committen und pushen, ohne dass der User es extra sagen muss. Voraussetzung: `pnpm check` ist grün. Commit-Message endet mit:

```text
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Änderungs-Zusammenfassung

Nach jeder abgeschlossenen Aufgabe (nach Commit und Push) eine kompakte Zusammenfassung ausgeben: was geändert wurde und warum. Format: kurze Einleitung, dann Tabelle oder Aufzählung. Nur die wesentlichen Punkte. Beispiel:

> Gepusht. Zusammenfassung:
>
> | Datei / Punkt | Was & Warum                                          |
> | ------------- | ---------------------------------------------------- |
> | `ci.yml`      | `--ignore-scripts` — Build-Script-Fehler in pnpm v10 |

### Werkzeuge

- `.mcp.json` bindet zwei MCP-Server ein: `next-devtools` (Fehler, Routen und Logs des laufenden Dev-Servers) und `supabase` (Doku-Suche, Schema, Logs — nur lesend)
- `.claude/settings.json` gibt die Projekt-Scripts frei und sperrt das Lesen von `.env`-Dateien
