export const APP_NAME = 'Starter'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// Datenschutz als Voreinstellung: Vercel Analytics und Speed Insights laufen
// nur, wenn der Betreiber sie bewusst einschaltet (siehe .claude/rules/datenschutz.md).
export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
