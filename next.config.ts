import type { NextConfig } from 'next'

// Content Security Policy: legt fest, von wo die Seite Inhalte laden darf.
// Sie ist zugleich die technische Sperre für fremde Skripte, Fonts und
// Einbettungen (siehe .claude/rules/security.md und datenschutz.md).
// Neue Hosts einzeln und nur in der nötigen Zeile eintragen, nie '*'.
//
// 'unsafe-inline' bei script-src braucht Next.js für sein Inline-Bootstrapping.
// Die strengere Variante mit Nonce würde jede Seite dynamisch rendern.
// 'unsafe-eval' braucht nur der Dev-Modus, deshalb gilt die CSP nur in Production.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  // Seite darf nicht in fremde Frames eingebettet werden (Clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Browser darf Dateitypen nicht raten
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Fremde Seiten sehen nur die Herkunft, nie die volle URL
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Kamera, Mikrofon, Standort und Werbe-Schnittstellen sind aus
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  // Nur HTTPS, zwei Jahre lang. Bewusst ohne includeSubDomains: Das würde
  // auch Subdomains des Kunden erzwingen, die diese Seite nicht kontrolliert.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  // Fremde Fenster bekommen keinen Zugriff auf diese Seite
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Content-Security-Policy', value: contentSecurityPolicy }]
    : []),
]

const nextConfig: NextConfig = {
  // Verrät nicht per Header, welches Framework läuft
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
