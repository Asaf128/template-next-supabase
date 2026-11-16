<!--
Quellen (Stand November 2026), für Menschen. HTML-Kommentare kosten Claude keine Tokens.
- DSGVO, v. a. Art. 5, 6, 13, 15 bis 21, 25, 28, 30, 32, 33: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- TDDDG § 25 (früher TTDSG): https://www.gesetze-im-internet.de/ttdsg/__25.html
- DDG § 5 (Impressum, früher TMG): https://www.gesetze-im-internet.de/ddg/__5.html
- DSK, Orientierungshilfe Digitale Dienste: https://www.datenschutzkonferenz-online.de/media/oh/OH_Digitale_Dienste.pdf
- LG München I, 20.01.2022, 3 O 17493/20 (Google Fonts vom Google-Server)
- EU-US Data Privacy Framework: gilt formal, Rechtsmittel C-703/25 P beim EuGH anhängig
- Vercel Web Analytics, Privacy and Compliance: https://vercel.com/docs/analytics/privacy-policy
Diese Datei ist keine Rechtsberatung. Sie legt technische Voreinstellungen fest.
Rechtstexte und Einzelfallfragen prüft ein Mensch (Betreiber, Anwalt, Datenschutzbeauftragter).
Bewusst ohne `paths`: gilt für jede Aufgabe und lädt immer.
-->

# Datenschutz

Gilt für jede Änderung an Websites für Betreiber in Deutschland und der EU.
Die Regeln setzen DSGVO, TDDDG und DDG technisch um. Sie ersetzen keine
rechtliche Prüfung: Wo eine Rechtsfrage offen ist, nicht selbst entscheiden,
sondern dem User die Frage stellen.

## Grundsätze

- **So wenig Daten wie möglich.** Nur erheben, was der Zweck braucht. Jedes Formularfeld, jede Spalte und jedes Tracking-Ereignis braucht einen Grund.
- **Datenschutz als Voreinstellung.** Alles, was nicht nötig ist, ist ab Werk aus: Analytics, Einbettungen, optionale Felder, Newsletter-Haken.
- **Zweckbindung.** Daten nur für den Zweck nutzen, für den sie erhoben wurden. Eine Kontaktanfrage ist keine Newsletter-Anmeldung.
- **Begrenzte Speicherdauer.** Für jede Art personenbezogener Daten steht fest, wann sie gelöscht wird.
- **Personenbezogen ist mehr als der Name:** E-Mail, Telefonnummer, IP-Adresse, Geräte- und Nutzerkennungen, Standort, Fotos, Freitext aus Formularen.

## Dienstleister und Standort

- Daten bleiben in der EU. Supabase-Projekt in einer EU-Region anlegen (Frankfurt). Vercel-Funktionen laufen über `vercel.json` in `fra1`. Diese Einstellung nicht entfernen.
- Jeder Dienst, der personenbezogene Daten verarbeitet, braucht einen Vertrag zur Auftragsverarbeitung (AVV, englisch DPA) und steht in der Datenschutzerklärung. Das gilt für Vercel, Supabase und jeden E-Mail-Dienst.
- Keinen neuen externen Dienst einbauen, ohne den User zu fragen: Analytics, Fehler-Tracking, Chat-Widgets, Captchas, Karten, Videos, Schriften, Zahlungsanbieter, KI-APIs. Bei der Frage nennen: Welche Daten gehen an wen, in welches Land.
- Anbieter aus der EU bevorzugen. Übermittlungen in die USA stützen sich derzeit auf das EU-US Data Privacy Framework. Es gilt, wird aber vor dem EuGH angegriffen. Darauf nicht ohne Not bauen.
- Keine personenbezogenen Daten an KI-Dienste senden, außer der User hat es für genau diesen Zweck freigegeben.

## Cookies und Speicher im Browser (§ 25 TDDDG)

- Ohne Einwilligung erlaubt ist nur, was technisch unbedingt nötig ist, um die vom Nutzer gewünschte Funktion zu liefern: Login-Cookies von Supabase, Warenkorb, Spracheinstellung, die gespeicherte Einwilligung selbst.
- Alles andere braucht eine vorherige Einwilligung: Cookies, `localStorage`, `sessionStorage`, IndexedDB, Zählpixel und Geräte-Fingerprinting für Statistik, Marketing oder Personalisierung. "Berechtigtes Interesse" reicht dafür nicht.
- Vor der Einwilligung wird nichts davon geladen oder gesetzt. Skripte erst nach dem Klick einbinden, nicht nur verstecken.
- Ein Einwilligungs-Banner, falls nötig: "Ablehnen" ist gleich gut sichtbar wie "Akzeptieren", nichts ist vorausgewählt, die Auswahl lässt sich später ändern, Impressum und Datenschutzerklärung bleiben erreichbar.
- Braucht das Projekt nur technisch nötige Cookies, kommt kein Banner auf die Seite. Kein Banner aus Gewohnheit einbauen.

## Analytics

- Vercel Analytics und Speed Insights sind im Template ausgeschaltet. Sie laufen nur mit `NEXT_PUBLIC_ENABLE_ANALYTICS=true`.
- Nicht selbst einschalten. Der Betreiber entscheidet und trägt das Werkzeug in die Datenschutzerklärung ein. Ob zusätzlich eine Einwilligung nötig ist, ist unter Aufsichtsbehörden umstritten: Das ist eine Frage für den User, nicht für den Agenten.
- Keine anderen Tracker einbauen (Google Analytics, Tag Manager, Meta Pixel, Hotjar und ähnliche), außer der User verlangt es ausdrücklich. Dann nur hinter einer Einwilligung.
- Analytics-Ereignisse enthalten nie personenbezogene Daten: keine E-Mail, keine User-ID, keine Suchbegriffe mit Namen, keine vollständigen URLs mit Tokens.

## Externe Inhalte

- Keine Schriften, Skripte oder Styles von fremden Servern. Google Fonts vom Google-Server zu laden wurde als Datenschutzverstoß gewertet. Fonts liegen lokal vor und bleiben es.
- YouTube, Vimeo, Google Maps, Instagram, Spotify und ähnliche Einbettungen nie direkt laden. Erst ein Platzhalter mit Hinweis, das fremde Element lädt nach einem Klick des Nutzers (Zwei-Klick-Lösung).
- Bilder liegen im Repo oder im eigenen Storage, nicht auf fremden Bild-Servern.
- Die CSP in `next.config.ts` ist die technische Sperre dafür. Wer einen fremden Host freischalten will, fragt vorher den User.

## Formulare

- Nur Felder, die für die Anfrage nötig sind. Pflichtfelder auf das Minimum, optionale Felder als optional kennzeichnen.
- Am Formular steht ein kurzer Hinweis mit Link zur Datenschutzerklärung.
- Keine vorab angehakten Kästchen. Einwilligungen (z. B. Newsletter) sind freiwillig, getrennt vom Absenden und werden mit Zeitpunkt gespeichert.
- Newsletter nur mit Bestätigungs-Mail (Double Opt-in) und Abmelde-Link in jeder Mail.
- Spam-Schutz ohne Dienste, die Besucher verfolgen: verstecktes Feld (Honeypot), Zeitprüfung, Rate Limiting. Ein externes Captcha nur nach Rückfrage.
- Formulare senden per POST an eine Server Action. Personenbezogene Daten stehen nie in der URL.
- Benachrichtigungs-Mails an den Betreiber enthalten nur, was nötig ist.

## Nutzerkonten und Rechte der Betroffenen

- Wer ein Konto anlegen kann, kann es auch löschen. Löschen entfernt die verknüpften Daten (`on delete cascade`) und die Dateien im Storage.
- Nutzer können ihre Daten einsehen und korrigieren. Bei größeren Datenmengen einen Export vorsehen.
- Für Daten ohne Konto (Kontaktanfragen, Logs) gibt es eine Löschfrist und einen Weg, sie umzusetzen.
- Der Betreiber muss Auskunfts- und Löschanfragen in der Regel binnen eines Monats beantworten können. Die Datenstruktur so bauen, dass alle Daten einer Person auffindbar sind (durchgehend `user_id`).

## Daten in Datenbank, Logs und Code

- Nur Spalten anlegen, die gebraucht werden. Keine Felder "auf Vorrat" (Geburtsdatum, Geschlecht, Adresse).
- Besonders sensible Daten (Gesundheit, Religion, Herkunft, politische Meinung, Sexualleben, Biometrie) nur nach ausdrücklicher Bestätigung des Users speichern. Vorher nachfragen.
- Keine personenbezogenen Daten in Logs, Fehlermeldungen, Analytics, URLs oder Commit-Nachrichten.
- Test- und Beispieldaten sind erfunden (`max@example.com`). Nie echte Kunden- oder Nutzerdaten ins Repo, in Seeds, in Screenshots oder in den Chat kopieren.
- Produktionsdaten nicht in lokale Umgebungen oder Vorschau-Deployments ziehen.

## Pflichtseiten

- Jede Website hat `/impressum` und `/datenschutz`. Beide sind von jeder Seite aus mit einem Klick erreichbar (Footer) und werden von keinem Banner verdeckt.
- Die Seiten im Template sind Gerüste mit Platzhaltern. Die Inhalte kommen vom Betreiber, einem Anwalt oder einem geprüften Generator.
- Nie Rechtstexte, Firmendaten, Registernummern oder Namen erfinden. Fehlt eine Angabe, bleibt der Platzhalter `[PLATZHALTER: ...]` stehen und der User bekommt eine Liste, was fehlt.
- Die Datenschutzerklärung nennt jeden Dienst, den der Code tatsächlich nutzt. Kommt ein Dienst dazu oder fällt weg, den User darauf hinweisen, dass der Text angepasst werden muss.

## Wenn etwas schiefgeht

- Verdacht auf eine Datenpanne (offene Tabelle, öffentlicher Bucket mit Personendaten, Schlüssel im Repo, Daten im falschen Log): Arbeit anhalten und dem User sofort melden, was betroffen ist und seit wann.
- Nichts stillschweigend reparieren. Der Betreiber muss eine Panne unter Umständen binnen 72 Stunden der Aufsichtsbehörde melden und braucht dafür die Fakten.
