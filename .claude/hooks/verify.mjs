#!/usr/bin/env node
// Stop: der Agent darf erst aufhören, wenn `pnpm check` grün ist.
// Läuft nur, wenn es ungespeicherte Änderungen gibt (reine Fragen kosten nichts).
import { spawnSync } from 'node:child_process'

const run = (cmd, args) => spawnSync(cmd, args, { encoding: 'utf8' })
if (run('git', ['status', '--porcelain']).stdout.trim() === '') process.exit(0)

const check = run('pnpm', ['check'])
if (check.status !== 0) {
  const output = `${check.stdout}\n${check.stderr}`.trim().split('\n').slice(-40).join('\n')
  console.error(`pnpm check ist rot. Beheben, dann erneut prüfen:\n${output}`)
  process.exit(2)
}
