import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const DEPRECATED_PACKAGES = [
  { name: 'framer-motion', message: 'Paket heißt jetzt `motion` — Import aus `motion/react`.' },
  { name: '@supabase/auth-helpers-nextjs', message: 'Veraltet — `@supabase/ssr` verwenden.' },
  { name: 'next/router', message: 'Pages Router — im App Router `next/navigation` verwenden.' },
]

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src/types/database.ts']),
  {
    rules: {
      // 300-Zeilen-Regel
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],

      // Kein `any`
      '@typescript-eslint/no-explicit-any': 'error',

      // Kein console.log (nur .error / .warn erlaubt)
      'no-console': ['error', { allow: ['error', 'warn'] }],

      // Named Exports only (Ausnahmen für Next.js-Dateien siehe unten)
      'import/no-default-export': 'error',

      // Kein direkter Zugriff auf process.env — immer über src/lib/env.ts
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message:
            'process.env nur in src/lib/env.ts lesen — sonst `env` aus @/lib/env importieren.',
        },
      ],

      // Veraltete Pakete, die Agenten aus altem Trainingswissen gern einsetzen
      'no-restricted-imports': ['error', { paths: DEPRECATED_PACKAGES }],

      // Konsistente Type-Imports
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  {
    // Ausnahme für Next.js-Dateien die default export brauchen
    files: [
      'src/app/**/page.tsx',
      'src/app/**/layout.tsx',
      'src/app/**/error.tsx',
      'src/app/**/loading.tsx',
      'src/app/**/not-found.tsx',
      'src/app/**/template.tsx',
      'src/app/**/default.tsx',
      'src/app/**/global-error.tsx',
      'src/app/**/forbidden.tsx',
      'src/app/**/unauthorized.tsx',
      'src/app/**/twitter-image.tsx',
      'src/app/**/icon.tsx',
      'src/app/**/apple-icon.tsx',
      'src/app/manifest.ts',
      'src/app/**/opengraph-image.tsx',
      'src/app/sitemap.ts',
      'src/app/robots.ts',
      'next.config.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    // Data Access Layer: UI-Code spricht nie direkt mit der Datenbank.
    // Server-Client nur in src/lib/dal, src/actions und Route Handlern.
    files: ['src/components/**', 'src/hooks/**', 'src/app/**'],
    ignores: ['src/app/**/route.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/lib/supabase/server',
              message: 'Daten über src/lib/dal lesen und über src/actions schreiben.',
            },
            ...DEPRECATED_PACKAGES,
          ],
        },
      ],
    },
  },
  {
    // Skripte sind CLI-Werkzeuge: process.env ist dort erlaubt
    files: ['scripts/**'],
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    files: ['src/lib/env.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
])

export default eslintConfig
