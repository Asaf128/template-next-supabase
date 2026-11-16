---
name: add-table
description: Legt eine Supabase-Tabelle, Spalte oder Policy als Migration mit RLS an und aktualisiert die Typen. Nutzen bei jeder Änderung am Datenbankschema.
argument-hint: "<tabellenname>"
---

# Supabase-Schema ändern

1. **Migration anlegen**: `pnpm exec supabase migration new <name>` erzeugt eine Datei unter `supabase/migrations/`. Fehlt der Ordner `supabase/`, zuerst `pnpm exec supabase init`.
2. **SQL schreiben** nach diesem Muster:

   ```sql
   create table public.items (
     id uuid primary key default gen_random_uuid(),
     user_id uuid not null references auth.users (id) on delete cascade,
     title text not null check (char_length(title) between 1 and 120),
     created_at timestamptz not null default now()
   );

   create index items_user_id_idx on public.items (user_id);

   alter table public.items enable row level security;

   create policy "items_select_own" on public.items
     for select to authenticated
     using ((select auth.uid()) = user_id);

   create policy "items_insert_own" on public.items
     for insert to authenticated
     with check ((select auth.uid()) = user_id);

   create policy "items_update_own" on public.items
     for update to authenticated
     using ((select auth.uid()) = user_id)
     with check ((select auth.uid()) = user_id);

   create policy "items_delete_own" on public.items
     for delete to authenticated
     using ((select auth.uid()) = user_id);
   ```

   - Eine Policy pro Operation, immer mit `to authenticated` oder `to anon`.
   - Index auf jede Spalte, die in einer Policy oder einem Filter steht.
   - Öffentlich lesbare Daten: eigene `select`-Policy `to anon, authenticated using (true)`. Nie RLS abschalten.
3. **Anwenden**: Frage den User, bevor du `pnpm exec supabase db push` ausführst. Das ändert die verknüpfte Datenbank.
4. **Typen erneuern**: `pnpm db:types`.
5. **Zugriff bauen**: Lesen in Server Components, Schreiben als Server Action nach `.claude/rules/supabase.md`.
6. `pnpm check`, dann committen. Migration und `src/types/database.ts` gehören in denselben Commit.
