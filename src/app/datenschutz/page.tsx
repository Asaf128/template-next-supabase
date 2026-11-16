import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  robots: { index: false, follow: true },
}

// Pflichtinhalte nach Art. 13 DSGVO. Die Liste zeigt, was in den Text gehört,
// passend zu dem, was dieses Template technisch tut. Den Text selbst liefert
// der Betreiber, ein Anwalt oder ein geprüfter Generator.
const blocks = [
  {
    heading: 'Verantwortlicher',
    placeholders: [
      'Name und Anschrift des Verantwortlichen',
      'Kontakt für Datenschutzanfragen',
      'Datenschutzbeauftragter, falls benannt',
    ],
  },
  {
    heading: 'Hosting und Server-Logs',
    placeholders: [
      'Hosting bei Vercel: verarbeitete Daten, Zweck, Rechtsgrundlage, Vertrag zur Auftragsverarbeitung',
      'Datenbank und Anmeldung bei Supabase: Region, Zweck, Rechtsgrundlage, Vertrag zur Auftragsverarbeitung',
      'Übermittlung in Drittländer und deren Grundlage',
    ],
  },
  {
    heading: 'Cookies und Speicher im Browser',
    placeholders: [
      'Technisch nötige Cookies (z. B. Anmeldung): Zweck und Speicherdauer',
      'Weitere Cookies oder Dienste: nur falls eingesetzt, mit Einwilligung',
    ],
  },
  {
    heading: 'Kontakt und Formulare',
    placeholders: ['Welche Daten erhoben werden, Zweck, Rechtsgrundlage, Löschfrist'],
  },
  {
    heading: 'Reichweitenmessung',
    placeholders: ['Vercel Analytics und Speed Insights: nur falls eingeschaltet'],
  },
  {
    heading: 'Ihre Rechte',
    placeholders: [
      'Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch',
      'Widerruf einer Einwilligung',
      'Beschwerderecht bei der zuständigen Aufsichtsbehörde',
    ],
  },
] as const

export default function DatenschutzPage() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      intro="Gerüst mit Platzhaltern. Den Text liefert der Betreiber der Website."
      blocks={blocks}
    />
  )
}
