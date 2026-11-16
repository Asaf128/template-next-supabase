export const NAV_LINKS = [{ label: 'Home', href: '/' }] as const

// Pflichtseiten: müssen von jeder Seite aus erreichbar sein (Footer).
export const LEGAL_LINKS = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
] as const
