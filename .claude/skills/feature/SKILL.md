---
name: feature
description: Ein neues Feature von der Anforderung bis zum Commit umsetzen. Nutzen, wenn eine Aufgabe mehr als eine Datei betrifft, eine neue Route, Tabelle oder Server Action braucht, oder wenn unklar ist, wo man anfängt.
---

# Feature umsetzen

## 1. Verstehen

- `docs/PROJECT.md` lesen: Ziel, Datenmodell, Nicht-Ziele.
- Ähnlichen vorhandenen Code suchen und dessen Muster übernehmen.
- Für jede Next.js-API, die du nutzt, die passende Seite in `node_modules/next/dist/docs/` lesen.
- Offene Fragen, die das Ergebnis ändern, dem User stellen. Alles andere selbst entscheiden und im Abschlussbericht nennen.

## 2. Planen

Vor dem ersten Edit kurz festhalten: welche Dateien entstehen oder sich ändern, welche Daten fließen wohin, woran man erkennt, dass es fertig ist (ein Test oder ein prüfbares Verhalten). Bei mehr als etwa fünf Dateien den Plan dem User zeigen.

## 3. Bauen, in dieser Reihenfolge

1. **Datenbank** — Skill `db-migration`.
2. **Lesen** — Funktion in `src/lib/dal/<bereich>.ts` mit `import 'server-only'`. Prüft den User mit `getCurrentUser()`, gibt ein kleines DTO zurück, nie ganze Zeilen.
3. **Schreiben** — Server Action in `src/actions/<bereich>.ts` nach dem Muster in `AGENTS.md`: Zod, `getCurrentUser()`, Eigentum prüfen, Ergebnis als `{ ok }`-Objekt.
4. **Tests** — für Zod-Schemas, reine Funktionen und die Logik der Action.
5. **UI** — Server Components zuerst. Daten mit User-Bezug in eine eigene Komponente unter `<Suspense>`. `'use client'` nur am Blatt.

## 4. Prüfen

- `pnpm check` muss grün sein. `pnpm build`, wenn Routen, Config oder Env betroffen sind.
- UI im laufenden Dev-Server ansehen (`pnpm dev`, MCP-Server `next-devtools`: `get_errors`).
- Bei Datenbank-, Auth- oder Action-Änderungen den Subagenten `security-reviewer` aufrufen und kritische und hohe Befunde beheben.

## 5. Abschließen

- Ein Commit pro abgeschlossener Einheit, Conventional Commit auf Deutsch.
- `docs/PROJECT.md` anpassen, wenn sich Datenmodell oder Umfang geändert haben.
- Bericht an den User: was gebaut wurde, was geprüft wurde (mit Ausgabe), was offen ist.
