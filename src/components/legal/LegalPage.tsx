import { Container } from '@/components/shared/Container'
import { Section } from '@/components/shared/Section'

interface LegalBlock {
  heading: string
  placeholders: readonly string[]
}

interface LegalPageProps {
  title: string
  intro: string
  blocks: readonly LegalBlock[]
}

// Gerüst für Impressum und Datenschutzerklärung. Zeigt, welche Angaben nötig
// sind. Die Texte liefert der Betreiber, ein Anwalt oder ein geprüfter
// Generator. Kein Agent erfindet hier Inhalte.
export function LegalPage({ title, intro, blocks }: LegalPageProps) {
  return (
    <main>
      <Section>
        <Container className="max-w-3xl">
          <h1 className="text-foreground text-4xl">{title}</h1>
          <p className="text-text-secondary mt-6">{intro}</p>
          {blocks.map((block) => (
            <section key={block.heading} className="mt-12">
              <h2 className="text-foreground text-xl">{block.heading}</h2>
              <ul className="text-text-primary mt-4 space-y-2">
                {block.placeholders.map((item) => (
                  <li key={item}>[PLATZHALTER: {item}]</li>
                ))}
              </ul>
            </section>
          ))}
        </Container>
      </Section>
    </main>
  )
}
