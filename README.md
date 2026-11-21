# Ekte vare?

En norsk produktquiz om hvor overbevisende KI-genererte produktbilder kan være. Åtte runder, 32 bilder, kildebelagte avsløringer og en personlig oppsummering. Ingen konto, datainnsamling eller eksterne bilde-/fontkall.

## Kjør lokalt

Du trenger Node.js 20 eller nyere. Ingen installasjon av pakker er nødvendig.

```sh
npm run dev
```

Åpne http://localhost:5173. Denne adressen er bare en lokal forhåndsvisning, ikke en lenke familie kan åpne på andre enheter.

```sh
npm test
npm run build
```

`dist/` er en statisk nettside som kan ligge på vanlig statisk hosting. Ingen publisering er utført. Endre port med miljøvariabelen `PORT` ved behov.

## Innhold og fasit

- `content/rounds.json`: innholdet appen bruker. Inneholder fasiten; dette er en familieaktivitet, ikke en sikker eksamensplattform.
- `content/real-products.json`: åtte dokumenterte produkter med bildekilder, norsk forhandler, supplerende dokumentasjon og verifikasjonsbegrensninger.
- `content/generated-prompts.json`: tekstbeskrivelser brukt med det innebygde image_gen-verktøyet.
- `content/presentation-revisions.json`: arkiv over 16 stiltilpassede genereringer, med nøyaktige prompter og kildebildet brukt som fotografisk referanse. Bare de tre fra første runde brukes nå.
- `assets/prepared/` og `content/presentation.json`: bilder med lik innramming, beskjæringskoordinater og kilde-/resultathasher. Bare de fire fra første runde brukes nå; resten er arkivert.
- `assets/generated/`: 24 leveringsoptimaliserte konseptbilder. Originaler i `content/originals/`.
- `assets/real/`: originale forhandler-/produsentbilder, uten KI-endring av produktet.
- `assets/fonts/`: lokalt lagret Manrope og fontlisens.

Etter endringer i produktgrunnlaget: `node scripts/assemble-content.mjs`, deretter test og bygg. Kontroller endrede bilder visuelt.

## Rettferdig bildepresentasjon

Den første nattlampen er erstattet med LIEWOODs eget, høyoppløselige bilde av Winston Rabbit uten fjernkontroll eller grå bilderamme. Produktet har norsk produktoppføring og produsentkilde. Første runde beholder også sine tre nye konseptbilder og den tilpassede innrammingen.

Runde 2–8 bruker igjen de opprinnelige bildene og deres opprinnelige innramming etter brukerens ønske. Dette inkluderer Flextail Tiny Pump 2X i turrunden, med tilhørende kilder og forklaring. Innholdsskriptet begrenser reviderte bilder og innramming til kategorien `baby`, slik at en ny bygging beholder dette valget.

Arkivet inneholder en tidligere revisjon av 16 konseptbilder og mekanisk innramming av alle 32 bilder. Behandlingen var rektangulær beskjæring av ytre hvitmarg, proporsjonal skalering, hvit utfylling til 1000 × 1000 og WebP-komprimering, uten segmentering, overmaling eller fjerning av logoer. Ingen ekte produkter er malt om med KI. Originalfilene beholdes. `scripts/prepare-images.browser.js` dokumenterer arkivprosessen; det er `scripts/assemble-content.mjs` som bestemmer hvilke varianter appen bruker.

Dette reduserer utilsiktede presentasjonshint, men garanterer ikke at bildene er like vanskelige. Gjenkjennelige produkter og merker kan fortsatt gi legitim forhåndskunnskap. En familiepilot er fortsatt nyttig.

## Hva resultatene betyr

Et dokumentert produkt har en produktoppføring og supplerende kilde. Ingen fysisk inspeksjon, sikkerhetsvurdering, effektvurdering eller bekreftelse på fotografisk opphav er utført. Wolfcraft-produktet har en historisk norsk oppføring; tilgjengelighet er ikke bekreftet. Konseptbildene er laget til denne quizen. Lignende design og produktkategorier finnes; quizen hevder ikke universell ikke-eksistens.

Rundene har henholdsvis 1, 2, 1, 0, 1, 2, 1 og 0 dokumenterte produkter. Det er en kuratert opplevelse, ikke et mål på markedsforekomst eller en psykologisk test. Produktplasseringene blandes for hver ny gjennomspilling og beholdes ved gjenopptakelse. Prisene og annonsetekstene i de siste to rundene er tydelig forklart som illustrasjoner i avsløringen. Annonserundene blander dokumenterte og oppdiktede design, slik at annonseformatet alene ikke gir fasiten.

«Vet ikke» teller som usikkerhet, ikke som avvisning av ekte produkter. Et valgt svar kan sendes direkte uten en egen sikkerhetsvurdering. Resultatet oppsummerer produktvalgene.

## Før offentlig deling

Bildene fra forhandlere og produsent er samlet for lokal gjennomgang. Tillatelse til offentlig reproduksjon er ikke bekreftet. Avklar bruksgrunnlaget eller bytt til egne/tillatte fotografier før offentlig publisering. Fonten leveres med OFL-lisens. Noen ekte bilder har merkevaretekst; dette kan bli et utilsiktet hint og bør vurderes i en pilot med noen utenfor sluttpublikummet. Ingen brukertest er ennå gjennomført.

### Gjennomgang før GitHub

Gjennomgått 2026-11-21: Ingen åpenbare API-nøkler, tilgangstokener eller private nøkler ble funnet i filskanningen. Dette er en avgrenset kontroll, ikke en garanti. En personlig maskinsti er fjernet fra bildeverktøyet, og målgruppebeskrivelsen er generalisert. Verktøybuffer, skjermbilder, logger, lokale innstillinger, miljøfiler og store bildegenereringsoriginaler er utelatt via `.gitignore`. Originalene beholdes lokalt; en ny klone kan kjøre quizen og bygge nettsiden, men arkivets bildeforberedelse trenger originalfilene separat.

Et offentlig repo deler også kildebildene som ikke er i bruk. Både disse og de aktive forhandler-/produsentbildene må vurderes før opplasting. Kildehenvisninger dokumenterer opphavet, men er ikke dokumentasjon på tillatelse til videredistribusjon. Ikke legg en generell bildelisens over tredjepartsbildene. Behold fontens `assets/fonts/OFL.txt`.

Fasit, KI-prompter, bildekilder og genereringsmetadata er ment å kunne leses offentlig. Quizen lagrer svar i nettleseren, ikke i prosjektmappen. `private: true` i `package.json` gjelder npm-publisering og gjør ikke et GitHub-repo privat.

For GitHub Pages: bygg med `npm run build`, og publiser bare `dist/` som et Pages-artefakt gjennom GitHub Actions. Velg GitHub Actions som publiseringskilde. Dette begrenser nettsidens filer; det skjuler ikke filer i et offentlig repo. Se [GitHubs veiledning for publiseringskilder](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Ingen publiseringsflyt er aktivert her.

Kontroller filene før første commit med `git add --dry-run .`, og se gjennom staged diff før push. `.gitignore` beskytter ikke filer som allerede er sporet eller lagret i historikken. Se [GitHubs veiledning om sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository). Gjennomgangen fant ingen lokal `.git`-mappe; eksisterende ekstern historikk er ikke undersøkt.

## Personvern og tilgjengelighet

Svar og fremdrift lagres i `localStorage` under `ekte-vare-session-v1`. Lagringsfeil skal ikke hindre gjennomføring. Korrupt eller utdatert lagring ignoreres. Svar sendes ikke til en server. Andre på samme nettleserprofil kan lese dem. «Begynn på nytt» erstatter tidligere svar.

Native avkrysningsbokser og dialoger, tastaturfokus, store trykkflater og ingen tidsbegrensning. Bildeforstørrelse åpnes separat fra produktvalg. Alle bilder og fonter lastes fra samme opphav. Kun kildelenkene åpner andre nettsteder.
