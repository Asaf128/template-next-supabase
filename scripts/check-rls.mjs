#!/usr/bin/env node
// Prüft alle SQL-Migrationen: jede Tabelle braucht RLS, und bekannte
// unsichere Muster sind verboten. Läuft in `pnpm check` und in der CI.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const stripComments = (sql) => sql.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
const ident = String.raw`(?:"[^"]+"|[\w$]+)`
const qualified = String.raw`(?:(${ident})\s*\.\s*)?(${ident})`
const clean = (name) => name.replaceAll('"', '').toLowerCase()
// Schemas, die Supabase selbst verwaltet oder die nicht über die Data API erreichbar sind
const SKIPPED_SCHEMAS = new Set(['auth', 'storage', 'realtime', 'vault', 'extensions', 'pg_temp'])

const FORBIDDEN = [
  [
    /\buser_metadata\b|\braw_user_meta_data\b/i,
    'user_metadata ist vom User änderbar — für Berechtigungen app_metadata nutzen',
  ],
  [
    /\bauth\.role\s*\(/i,
    'auth.role() ist veraltet — Rolle über `TO authenticated` an der Policy setzen',
  ],
  [/\bdisable\s+row\s+level\s+security\b/i, 'RLS darf nicht abgeschaltet werden'],
]

/** @param {{ name: string, sql: string }[]} files */
export function checkMigrations(files) {
  const errors = []
  const tables = new Map()
  const withRls = new Set()

  for (const { name, sql: raw } of files) {
    const sql = stripComments(raw)
    const create = new RegExp(
      String.raw`create\s+table\s+(?:if\s+not\s+exists\s+)?${qualified}`,
      'gi'
    )
    for (const m of sql.matchAll(create)) {
      const schema = clean(m[1] ?? 'public')
      if (!SKIPPED_SCHEMAS.has(schema)) tables.set(`${schema}.${clean(m[2])}`, name)
    }
    const enable = new RegExp(
      String.raw`alter\s+table\s+(?:if\s+exists\s+)?(?:only\s+)?${qualified}\s+enable\s+row\s+level\s+security`,
      'gi'
    )
    for (const m of sql.matchAll(enable)) withRls.add(`${clean(m[1] ?? 'public')}.${clean(m[2])}`)
    const drop = new RegExp(String.raw`drop\s+table\s+(?:if\s+exists\s+)?${qualified}`, 'gi')
    for (const m of sql.matchAll(drop)) tables.delete(`${clean(m[1] ?? 'public')}.${clean(m[2])}`)

    for (const [pattern, message] of FORBIDDEN) {
      if (pattern.test(sql)) errors.push(`${name}: ${message}`)
    }
    const update = /create\s+policy[^;]*?\bfor\s+update\b[^;]*;/gi
    for (const m of sql.matchAll(update)) {
      if (!/with\s+check/i.test(m[0])) {
        errors.push(
          `${name}: UPDATE-Policy ohne WITH CHECK — User könnte Zeilen einem anderen User zuweisen`
        )
      }
    }
  }

  for (const [table, file] of tables) {
    if (!withRls.has(table)) {
      errors.push(`${file}: Tabelle ${table} ohne "enable row level security"`)
    }
  }
  return errors
}

function main() {
  const dir = join(process.cwd(), 'supabase', 'migrations')
  const files = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.sql'))
        .sort()
        .map((name) => ({ name, sql: readFileSync(join(dir, name), 'utf8') }))
    : []
  const errors = checkMigrations(files)
  if (errors.length > 0) {
    console.error(`RLS-Check fehlgeschlagen:\n${errors.map((e) => `  - ${e}`).join('\n')}`)
    process.exit(1)
  }
  console.warn(`RLS-Check ok (${files.length} Migrationen)`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
