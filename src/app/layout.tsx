import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { APP_NAME, APP_URL } from '@/constants/config'
import './globals.css'

const displayFont = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const bodyFont = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
