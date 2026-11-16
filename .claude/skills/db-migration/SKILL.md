---
name: db-migration
description: Schema der Supabase-Datenbank ändern. Nutzen bei neuer Tabelle, neuer Spalte, Policy, Index, View oder Funktion, und immer wenn eine SQL-Datei in supabase/migrations angelegt oder geändert wird.
---

# Datenbank-Migration

Schema-Änderungen laufen nur über Migrationsdateien. Nie im Dashboard, nie per MCP auf Produktion.

## Ablauf

1. Datei anlegen: `pnpm exec supabase migration new <name>`. Den Dateinamen nie selbst erfinden.
2. SQL schreiben nach der Vorlage unten.
3. `pnpm check:rls` ausführen. Der Check muss grün sein.
4. Lokal anwenden, falls die lokale Supabase-Instanz läuft: `pnpm exec supabase migration up`. Dann `pnpm exec supabase db advisors` und Befunde beheben.
5. Typen neu erzeugen: `pnpm db:types`.
6. Den Subagenten `security-reviewer` auf die Migration ansetzen.
7. `supabase db push` auf das echte Projekt führt nur der User aus oder gibt es ausdrücklich frei.

Eine bereits gepushte Migration nie ändern. Korrekturen kommen in eine neue Migration.

## Vorlage für eine Tabelle mit User-Bezug

```sql
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  created_at timestamptz not null default now()
);

-- Spalten, die in Policies vorkommen, immer indizieren
create index notes_user_id_idx on public.notes (user_id);

alter table public.notes enable row level security;

create policy "notes_select_own" on public.notes
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "notes_insert_own" on public.notes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "notes_update_own" on public.notes
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "notes_delete_own" on public.notes
  for delete to authenticated
  using ((select auth.uid()) = user_id);
```

## Regeln

- RLS und Policies stehen in derselben Migration wie `create table`.
- Eine Policy pro Operation (select, insert, update, delete). Kein `for all`.
- Immer `to authenticated` oder `to anon` angeben, dazu eine Eigentums-Bedingung. `to authenticated` allein lässt jeden angemeldeten User an alle Zeilen.
- `(select auth.uid())` statt `auth.uid()`: wird einmal pro Abfrage ausgewertet statt pro Zeile.
- UPDATE braucht `using` und `with check`, und zusätzlich eine SELECT-Policy. Ohne SELECT-Policy ändert ein Update still 0 Zeilen.
- Rollen und Rechte nie aus `user_metadata` lesen (vom User änderbar), sondern aus `app_metadata` oder einer eigenen Tabelle.
- Views: `create view ... with (security_invoker = true)`. Sonst umgehen sie RLS.
- `security definer` nie verwenden, um einen Rechte-Fehler zu beheben. Falls wirklich nötig: Funktion in ein nicht öffentliches Schema, `set search_path = ''`, `auth.uid()` im Funktionskörper prüfen.
- Storage: Upsert braucht INSERT-, SELECT- und UPDATE-Policy.
- Constraints (`not null`, `check`, Foreign Keys) in die Datenbank, nicht nur in Zod.

## Wenn etwas unklar ist

Supabase ändert sich häufig. Aktuelle Doku über den MCP-Server (`search_docs`) nachschlagen oder die Seite mit angehängtem `.md` abrufen. Befehle der CLI immer mit `pnpm exec supabase <befehl> --help` prüfen, nie raten.
