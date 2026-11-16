#!/usr/bin/env node
// PostToolUse (Edit|Write): formatiert die geänderte Datei sofort mit Prettier.
import { spawnSync } from 'node:child_process'

const input = JSON.parse(await new Response(process.stdin).text())
const file = input.tool_input?.file_path
if (file) {
  spawnSync(
    'pnpm',
    ['exec', 'prettier', '--write', '--ignore-unknown', '--log-level', 'warn', file],
    {
      stdio: ['ignore', 'ignore', 'inherit'],
    }
  )
}
