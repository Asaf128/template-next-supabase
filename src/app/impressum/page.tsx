import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Impressum',
  robots: { index: false, follow: true },
}

// Pflichtangaben nach § 5 DDG. Welche Punkte gelten, hängt von Rechtsform und
// Branche ab. Vor dem Livegang alle Platzhalter ersetzen oder streichen.
const blocks = [
  {
    heading: 'Angaben gemäß § 5 DDG',
    placeholders: [
      'Name und Rechtsform des Unternehmens',
      'Vertretungsberechtigte Person',
      'Straße, Hausnummer, PLZ, Ort',
    ],
  },
  {
    heading: 'Kontakt',
    placeholders: ['E-Mail-Adresse', 'Telefonnummer oder anderer schneller Kontaktweg'],
  },
  {
    heading: 'Register und Steuern',
    placeholders: [
      'Registergericht und Registernummer, falls eingetragen',
      'Umsatzsteuer-Identifikationsnummer, falls vorhanden',
    ],
  },
  {
    heading: 'Berufsrechtliche Angaben',
    placeholders: ['Aufsichtsbehörde, Kammer, Berufsbezeichnung, falls zulassungspflichtig'],
  },
] as const

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      intro="Gerüst mit Platzhaltern. Die Angaben liefert der Betreiber der Website."
      blocks={blocks}
    />
  )
}
