<!--
Quellen (Stand November 2026), für Menschen. HTML-Kommentare kosten Claude keine Tokens.
- OWASP Top 10:2025: https://owasp.org/Top10/2025/
- Next.js Data Security, CSP, Production Checklist: node_modules/next/dist/docs/01-app/02-guides/
- Supabase Production Security Checklist: https://supabase.com/docs/guides/security/production-checklist
- GitHub Actions Secure Use: https://docs.github.com/en/actions/reference/security/secure-use
Diese Datei hat bewusst kein `paths`: Sie gilt für jede Aufgabe und lädt immer.
-->

# Sicherheit

Gilt für jede Änderung. Gegliedert nach den OWASP Top 10:2025.

Drei Grundsätze:

1. Jede Eingabe ist feindlich, bis sie auf dem Server geprüft wurde. Das gilt für Formulare, URL-Parameter, Header, Cookies, Webhooks und Dateinamen.
2. Der Server entscheidet. Prüfungen im Browser sind Komfort, kein Schutz.
3. Im Zweifel verweigern. Was nicht ausdrücklich erlaubt ist, ist verboten.

## 1. Zugriffskontrolle (A01)

- Jede Server Action und jeder Route Handler prüft selbst, wer anfragt (`supabase.auth.getClaims()`). Eine Prüfung im Proxy, im Layout oder in der Seite schützt die Action nicht: Actions sind per direktem POST erreichbar.
- Nach der Anmeldung auch die Berechtigung prüfen: Gehört der Datensatz dem User? RLS erledigt das in der Datenbank, die Action prüft es zusätzlich, wenn sie Daten per ID lädt.
- Die User-ID kommt immer aus `claims.sub`, nie aus Formular, URL oder Request-Body.
- Rollen und Rechte nur aus `app_metadata` oder einer eigenen Tabelle lesen. `user_metadata` kann der User selbst ändern.
- Jede Tabelle hat RLS und Policies pro Operation. Das gilt auch für Tabellen in Realtime-Publications. RLS filtert keine DELETE-Events von Postgres Changes: Für sensible Daten Broadcast mit Realtime Authorization nutzen.
- `SUPABASE_SECRET_KEY` umgeht RLS. Nie für Anfragen im Namen eines Users verwenden, nur für echte Systemaufgaben (z. B. Webhook-Verarbeitung), und dort alle Prüfungen selbst schreiben.
- Storage: Buckets sind privat, Zugriff über Policies auf `storage.objects` oder zeitlich begrenzte signierte URLs. Öffentliche Buckets nur für wirklich öffentliche Dateien.
- Views mit `security_invoker = true` anlegen. Funktionen mit `security definer` nur, wenn nötig, dann mit festem `set search_path = ''` und nie im Schema `public` für alle aufrufbar.
- Keine Weiterleitung auf eine Adresse aus User-Input. Nur relative Pfade zulassen, die mit einem einzelnen `/` beginnen.
- Der Server ruft keine URL ab, die ein User vorgibt (SSRF). Wenn es sein muss: feste Liste erlaubter Hosts, nur `https`, keine internen Adressen.

## 2. Konfiguration (A02)

- Security-Header und CSP in `next.config.ts` nie lockern. Ein neuer externer Host wird einzeln und nur in der nötigen Direktive eingetragen, nie `*`. Kein `'unsafe-eval'` in Produktion.
- Vor jedem Lockern der CSP, dem Abschalten einer Lint-Regel oder dem Entfernen einer Prüfung beim User nachfragen.
- Umgebungsvariablen: Geheimnisse haben nie das Präfix `NEXT_PUBLIC_`. Alles mit diesem Präfix landet im Browser und ist öffentlich.
- Keine Debug-Routen, Test-Logins, Beispiel-Accounts oder auskommentierten Zugangsdaten im Code.
- CORS nur bei Bedarf und nur für benannte Origins. Nie `Access-Control-Allow-Origin: *` zusammen mit Cookies.
- Fehlerseiten zeigen keine Stacktraces, SQL-Meldungen oder interne Pfade.
- Supabase-Projekt vor dem Livegang (prüft der Skill `launch-check`): SSL Enforcement an, Network Restrictions gesetzt, E-Mail-Bestätigung an, OTP-Gültigkeit höchstens 3600 Sekunden, eigener SMTP-Server, Test-Telefonnummern entfernt, MFA für das Supabase- und GitHub-Konto, Security Advisor ohne Befund.

## 3. Lieferkette (A03)

- Keine neue Dependency ohne Rückfrage. Vorher prüfen: Kann der vorhandene Stack es schon? Wird das Paket gepflegt, ist es verbreitet, wer veröffentlicht es? Paketnamen genau prüfen (Tippfehler-Fallen).
- Keine Skripte, Fonts, Styles oder Bilder von fremden CDNs einbinden. Alles kommt aus dem Repo oder aus npm.
- Echte Projekte committen `pnpm-lock.yaml` und installieren in CI mit `--frozen-lockfile`.
- Install-Skripte bleiben aus (`--ignore-scripts`, Freigabeliste in `pnpm-workspace.yaml`). Die Liste nicht ohne Rückfrage erweitern.
- GitHub Actions sind auf Commit-SHAs gepinnt. Neue Actions genauso einbinden, nie mit Tag oder Branch.
- Kein `curl ... | sh`, keine Installer aus dem Netz ausführen.
- `pnpm audit` vor jedem Release. Kritische und hohe Meldungen in Produktions-Dependencies blockieren den Merge.

## 4. Geheimnisse und Kryptografie (A04)

- Nie eigene Verschlüsselung, eigenes Passwort-Hashing oder eigene Session-Tokens bauen. Passwörter und Sessions gehören Supabase Auth.
- Zufallswerte für Sicherheitszwecke mit `crypto.randomUUID()` oder `crypto.getRandomValues()`, nie mit `Math.random()`.
- Geheimnisse stehen nur in `.env.local` (lokal) und in den Vercel- und GitHub-Einstellungen. Nie im Code, in Commits, in Logs, in Fehlermeldungen, in Tests oder in Kommentaren.
- `.env`-Dateien nicht lesen, nicht ausgeben, nicht committen. Braucht eine Aufgabe einen Wert, den User fragen.
- Taucht ein Geheimnis in einem Commit, Log oder Chat auf: sofort dem User melden. Der Schlüssel muss erneuert werden, Löschen aus der Historie reicht nicht.
- Cookies mit Sitzungsbezug sind `HttpOnly`, `Secure` und `SameSite=Lax` oder strenger. Die Supabase-Cookies setzt `@supabase/ssr`, nicht von Hand überschreiben.

## 5. Injection und XSS (A05)

- Jede Eingabe zuerst mit Zod prüfen: `FormData`, Action-Argumente, `params`, `searchParams`, JSON-Bodies, Webhook-Payloads. Längen, Formate und erlaubte Werte begrenzen.
- Datenbankzugriff nur über den Supabase Query Builder oder `rpc()` mit Parametern. Nie SQL aus Strings zusammensetzen.
- Keinen User-Input in rohe Filter-Strings einsetzen (`.or('...')`, `.filter()` mit selbst gebautem Ausdruck). Stattdessen die typisierten Methoden (`.eq()`, `.in()`, `.ilike()`) nutzen.
- Kein `dangerouslySetInnerHTML`, kein `eval`, kein `new Function` (ESLint verbietet es). Braucht eine Seite fremdes HTML, vorher beim User nachfragen und serverseitig bereinigen.
- Links aus User-Input nur mit `https:`, `http:` oder `mailto:` zulassen. Nie `javascript:`.
- Datei-Uploads: Typ und Größe auf dem Server prüfen, Dateinamen selbst vergeben (UUID), in einen privaten Bucket legen, nie unter dem Original-Namen ausliefern.

## 6. Sicheres Design (A06)

- Alles, was Geld, Rechte oder Mengen betrifft, rechnet der Server. Preise, Rabatte und Rollen kommen nie aus dem Browser.
- Rate Limiting für alles Öffentliche oder Teure: Login, Registrierung, Passwort-Reset, Kontaktformular, E-Mail-Versand, Uploads. Fehlt eine Lösung im Projekt, dem User vorschlagen statt weglassen.
- Server Actions geben nur zurück, was die Oberfläche braucht (`{ error: null }`), nie ganze Datenbankzeilen.
- Listen sind begrenzt (Pagination, `limit`). Texte haben eine Höchstlänge.
- Datenzugriff liegt in serverseitigen Modulen mit `import 'server-only'`. Client Components bekommen fertige, gefilterte Props und keine Objekte mit internen Feldern.

## 7. Anmeldung (A07)

- Anmeldung nur über Supabase Auth. Keine eigenen Login-Tabellen, keine eigenen Tokens.
- Serverseitig `getClaims()`. `getSession()` nie für Entscheidungen nutzen.
- Fehlermeldungen beim Login und Passwort-Reset verraten nicht, ob ein Konto existiert ("E-Mail oder Passwort falsch").
- Redirect-URLs für Auth stehen in der Freigabeliste im Supabase Dashboard, keine Wildcards auf fremde Domains.
- Admin-Bereiche zusätzlich absichern: Rolle serverseitig prüfen, MFA empfehlen.
- Nach Passwort- oder E-Mail-Änderung andere Sitzungen beenden.

## 8. Integrität (A08)

- Webhooks zuerst auf Signatur prüfen, dann verarbeiten. Ohne gültige Signatur mit 401 ablehnen.
- Datenbankänderungen nur als Migration im Repo, geprüft im PR.
- Zerstörerische Befehle nie ohne ausdrückliche Freigabe des Users: `drop`, `truncate`, `delete` ohne `where`, `supabase db reset`, `supabase db push`, `git push --force`, Löschen von Buckets.
- Commit-Hooks und CI-Prüfungen nicht umgehen (`--no-verify`, Jobs abschalten, Tests überspringen).

## 9. Protokollierung (A09)

- Fehler auf dem Server mit `console.error` protokollieren, mit Kontext (welche Action, welcher Schritt), ohne personenbezogene Daten und ohne Geheimnisse.
- Nie protokollieren: Passwörter, Tokens, Cookies, Schlüssel, komplette Request-Bodies, E-Mail-Adressen, IP-Adressen.
- Sicherheitsrelevante Ereignisse nachvollziehbar halten: fehlgeschlagene Berechtigungsprüfungen, Admin-Aktionen, Löschungen.

## 10. Fehlerbehandlung (A10)

- Bei Fehlern geschlossen bleiben: Schlägt eine Prüfung fehl oder wirft sie, wird der Zugriff verweigert, nicht gewährt.
- Das `error`-Feld jedes Supabase-Aufrufs auswerten. Nie mit `data` weiterarbeiten, ohne `error` geprüft zu haben.
- Externe Aufrufe (E-Mail, Zahlungen, APIs) in `try/catch`, mit Zeitlimit und klarer Rückmeldung an die Oberfläche.
- Der Browser bekommt eine allgemeine Meldung ("Speichern fehlgeschlagen"), die Details stehen nur im Server-Log.
- Kein leeres `catch`, das einen Sicherheitsfehler verschluckt. Die eine Ausnahme ist `setAll` in `src/lib/supabase/server.ts`.

## Vor dem Commit

- `pnpm check` ist grün.
- Neue Action oder Route: Eingabe geprüft, Anmeldung geprüft, Berechtigung geprüft, Rückgabe gefiltert.
- Neue Tabelle: RLS an, Policies pro Operation, Index auf Policy-Spalten.
- Kein Geheimnis, kein echter Personendatensatz im Diff.
