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

- **Hooks** (`.claude/settings.json`): formatieren jede geänderte Datei, blockieren Edits an `.env`, Lockfile und generierten Typen, und lassen dich erst stoppen, wenn `pnpm check` grün ist. Wenn ein Hook blockiert: Ursache beheben, nicht umgehen
- **Skills** (`.claude/skills/`): `feature` für jede Aufgabe über mehrere Dateien, `db-migration` für jede Schema-Änderung
- **Subagent** `security-reviewer`: nach Änderungen an Datenbank, Auth oder Server Actions aufrufen
- **MCP** (`.mcp.json`): `next-devtools` für Fehler, Routen und Logs des Dev-Servers, `supabase` nur lesend für Doku, Schema und Advisors
