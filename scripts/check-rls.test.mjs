import { describe, expect, it } from 'vitest'
import { checkMigrations } from './check-rls.mjs'

const file = (sql) => [{ name: '0001_test.sql', sql }]
const policy = `create policy "own" on notes for select to authenticated using ((select auth.uid()) = user_id);`

describe('checkMigrations', () => {
  it('akzeptiert Tabelle mit RLS', () => {
    const sql = `create table public.notes (id uuid primary key);
      alter table public.notes enable row level security; ${policy}`
    expect(checkMigrations(file(sql))).toEqual([])
  })

  it('meldet Tabelle ohne RLS', () => {
    expect(checkMigrations(file('create table if not exists notes (id uuid);'))).toHaveLength(1)
  })

  it('erkennt RLS aus einer späteren Migration', () => {
    const files = [
      { name: '0001.sql', sql: 'create table notes (id uuid);' },
      { name: '0002.sql', sql: 'alter table notes enable row level security;' },
    ]
    expect(checkMigrations(files)).toEqual([])
  })

  it('ignoriert auskommentiertes SQL und gelöschte Tabellen', () => {
    const sql = `-- create table hidden (id int);
      create table tmp (id int); drop table tmp;`
    expect(checkMigrations(file(sql))).toEqual([])
  })

  it('meldet UPDATE-Policy ohne WITH CHECK, user_metadata und auth.role()', () => {
    const sql = `create table notes (id uuid); alter table notes enable row level security;
      create policy "u" on notes for update to authenticated using ((select auth.uid()) = user_id);
      create policy "a" on notes for select using (auth.role() = 'authenticated');
      create policy "m" on notes for select using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');`
    expect(checkMigrations(file(sql))).toHaveLength(3)
  })
})
