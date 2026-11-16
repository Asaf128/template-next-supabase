import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { APP_NAME, APP_URL } from '@/constants/config'
import './globals.css'

// Fonts liegen als npm-Pakete lokal vor (@fontsource-variable/*). Der Build
// braucht dadurch keinen Netzwerkzugriff auf Google Fonts und läuft auch in
// abgeschotteten CI- und Agent-Umgebungen. Font tauschen: Paket installieren,
// Pfad hier anpassen.
const displayFont = localFont({
  src: '../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2',
  variable: '--font-display',
  weight: '400 900',
  display: 'swap',
})

const bodyFont = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-body',
  weight: '100 900',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: `${APP_NAME} — Projektbeschreibung`, template: `%s | ${APP_NAME}` },
  description: '150-160 Zeichen Beschreibung mit Hauptkeyword.',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: APP_NAME,
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-background text-text-primary antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
