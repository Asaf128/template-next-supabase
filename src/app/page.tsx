export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-text-secondary mb-4">
          Template
        </p>
        <h1 className="text-6xl sm:text-7xl lg:text-8xl text-foreground">
          Starter
        </h1>
        <div className="w-16 h-px bg-accent mx-auto mt-6" />
        <p className="mt-6 text-text-secondary">
          Bereit loszulegen. Ersetze diese Seite mit deinem Content.
        </p>
      </div>
    </main>
  )
}
