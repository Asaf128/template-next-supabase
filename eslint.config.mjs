import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

// Projektregeln stehen hier statt in AGENTS.md: Was der Linter erzwingt,
// muss kein Agent im Kontext behalten.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src/types/database.ts']),
  {
    rules: {
      // Max. 300 Zeilen pro Datei
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],

      // Kein `any`
      '@typescript-eslint/no-explicit-any': 'error',

      // Kein console.log (nur .error / .warn)
      'no-console': ['error', { allow: ['error', 'warn'] }],

      // Konsistente Type-Imports
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Named Exports only (Ausnahmen für Next.js-Dateien weiter unten)
      'import/no-default-export': 'error',

      // Sicherheit: kein ungeprüftes HTML, kein Code aus Strings
      'react/no-danger': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
  {
    // Keine Hex-Farben in Komponenten: Farben kommen aus globals.css
    files: ['src/components/**/*.tsx', 'src/app/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/#[0-9a-fA-F]{3,8}\\b/]',
          message: 'Keine Hex-Farben. Nutze Tailwind-Token aus src/app/globals.css (bg-accent ...).',
        },
        {
          selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]',
          message: 'Keine Hex-Farben. Nutze Tailwind-Token aus src/app/globals.css (bg-accent ...).',
        },
      ],
    },
  },
  {
    // Next.js verlangt in diesen Dateien einen Default Export
    files: [
      'src/app/**/page.tsx',
      'src/app/**/layout.tsx',
      'src/app/**/error.tsx',
      'src/app/**/global-error.tsx',
      'src/app/**/loading.tsx',
      'src/app/**/not-found.tsx',
      'src/app/**/template.tsx',
      'src/app/**/default.tsx',
      'src/app/**/opengraph-image.tsx',
      'src/app/**/icon.tsx',
      'src/app/manifest.ts',
      'src/app/sitemap.ts',
      'src/app/robots.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },
])

export default eslintConfig
