#!/usr/bin/env node
// PreToolUse (Edit|Write): schützt Dateien, die ein Agent nie von Hand ändern soll.
// Exit 2 = blockiert, stderr geht als Begründung an den Agenten.
import { relative } from 'node:path'

const input = JSON.parse(await new Response(process.stdin).text())
const file = input.tool_input?.file_path
if (!file) process.exit(0)
const path = relative(input.cwd ?? process.cwd(), file).replaceAll('\\', '/')

const BLOCKED = [
  [/^\.env(\.(?!example$).*)?$/, 'Env-Dateien enthalten Secrets. Nur .env.example bearbeiten.'],
  [/^pnpm-lock\.yaml$/, 'Lockfile nur über `pnpm add` / `pnpm update` ändern.'],
  [/^src\/types\/database\.ts$/, 'Generierte Datei. Mit `pnpm db:types` neu erzeugen.'],
  [/^\.git\//, 'Git-Interna nicht direkt bearbeiten.'],
]
for (const [pattern, reason] of BLOCKED) {
  if (pattern.test(path)) {
    console.error(`Blockiert: ${path} — ${reason}`)
    process.exit(2)
  }
}

// Dateien, die Prüfungen und Rechte steuern: nur mit Zustimmung des Users.
const ASK =
  /^(\.github\/|\.claude\/(settings\.json|hooks\/)|\.mcp\.json$|pnpm-workspace\.yaml$|eslint\.config\.mjs$|scripts\/check-rls\.mjs$)/
if (ASK.test(path)) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: `${path} steuert Prüfungen oder Rechte. Änderung braucht Zustimmung.`,
      },
    })
  )
}
