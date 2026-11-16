---
paths:
  - "src/components/**"
  - "src/app/**/*.tsx"
  - "src/app/globals.css"
---

# Komponenten, Styling und Seiten

## Komponenten

- Basis-UI liegt in `src/components/shared/` (`Button`, `Container`, `Section`). Neue Variante: bestehende Komponente erweitern.
- Feature-Komponenten unter `src/components/<feature>/`, maximal 8 Dateien pro Ordner. Wird es mehr, Unterordner bilden.
- Props als `interface`, native Props über `ComponentProps<'button'>` erben statt einzeln nachbauen.
- `'use client'` nur in der kleinsten Komponente mit State, Effekt oder Event-Handler. Daten in der Server Component laden und als Props übergeben.
- Dateien über 300 Zeilen teilen: UI in Sub-Komponenten, Logik in einen Hook unter `src/hooks/`.

## Styling

- Nur Tailwind-Klassen mit den Token aus `src/app/globals.css`: `bg-background`, `bg-surface`, `bg-accent`, `text-foreground`, `text-text-secondary`, `text-text-on-dark`, `border-border`.
- Keine Hex-Werte und kein `bg-[var(--x)]` in Komponenten. Fehlt ein Token, in `globals.css` unter `:root` und `@theme inline` ergänzen.
- Kein `style={{}}` für wiederkehrende Werte.
- Klassen bedingt zusammensetzen mit `cn()` aus `@/lib/cn`.
- Überschriften nutzen `--font-display`, Fließtext `--font-body` (in `globals.css` gesetzt, nicht pro Komponente).

## Seiten

- Jede `page.tsx` exportiert `metadata` oder `generateMetadata` (Titel, Beschreibung).
- Bilder immer mit `next/image`, externe Hosts in `next.config.ts` (`images.remotePatterns` und CSP) eintragen.
- Fonts liegen lokal vor (`@fontsource-variable/*`, eingebunden in `src/app/layout.tsx`). Nicht auf `next/font/google` umstellen: Der Build bräuchte dann Netzwerkzugriff.
- Neue Route auch in `src/app/sitemap.ts` und bei Bedarf in `src/constants/navigation.ts` eintragen.
- Interaktive Elemente brauchen einen zugänglichen Namen (Text, `aria-label`) und sichtbaren Fokus.
