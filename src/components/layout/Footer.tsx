import Link from 'next/link'
import { Container } from '@/components/shared/Container'
import { APP_NAME } from '@/constants/config'
import { LEGAL_LINKS } from '@/constants/navigation'

// Steht im Root-Layout, damit Impressum und Datenschutzerklärung von jeder
// Seite aus mit einem Klick erreichbar sind.
export function Footer() {
  return (
    <footer className="border-border border-t py-8">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-text-secondary text-sm">{APP_NAME}</p>
        <nav aria-label="Rechtliches">
          <ul className="flex gap-6">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-text-secondary hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  )
}
