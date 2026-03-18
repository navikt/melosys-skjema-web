# Playwright Testplan - melosys-skjema-web

## Oversikt over applikasjonen

Appen har **4 representasjonstyper** som gir **3 ulike skjemadeler**:

| Representasjon              | Skjemadel                            | Antall steg |
| --------------------------- | ------------------------------------ | ----------- |
| DEG_SELV                    | ARBEIDSTAKERS_DEL                    | 7 steg      |
| ANNEN_PERSON                | ARBEIDSTAKERS_DEL                    | 7 steg      |
| ARBEIDSGIVER (uten fullmakt)| ARBEIDSGIVERS_DEL                    | 8 steg      |
| RÅDGIVER (uten fullmakt)    | ARBEIDSGIVERS_DEL                    | 8 steg      |
| ARBEIDSGIVER_MED_FULLMAKT   | ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL    | 11 steg     |
| RÅDGIVER_MED_FULLMAKT       | ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL    | 11 steg     |

## Filstruktur

```
app/tests/e2e/
├── fixtures/
│   ├── api-mocks.ts              (utvide med nye mocks)
│   └── test-data.ts              (utvide med nye testdata)
├── pages/
│   ├── representasjon/
│   │   ├── representasjon.page.ts         (NY)
│   │   └── velg-radgiverfirma.page.ts     (NY)
│   ├── oversikt/
│   │   └── oversikt.page.ts               (NY)
│   └── skjema/
│       ├── arbeidsgiver/          (eksisterende page objects)
│       ├── arbeidstaker/          (eksisterende page objects)
│       ├── kvittering/            (eksisterende)
│       └── innsendt/
│           └── innsendt.page.ts            (NY)
├── specs/
│   ├── representasjon.spec.ts              (NY)
│   ├── oversikt.spec.ts                    (NY)
│   └── skjema/
│       ├── utsendingsperiode-og-land.spec.ts          (NY)
│       ├── arbeidsgiverens-virksomhet-i-norge.spec.ts (NY)
│       ├── utenlandsoppdraget.spec.ts                 (NY)
│       ├── arbeidssted-i-utlandet.spec.ts             (NY)
│       ├── arbeidstakerens-lonn.spec.ts               (NY)
│       ├── arbeidssituasjon.spec.ts                   (NY)
│       ├── skatteforhold-og-inntekt.spec.ts           (NY)
│       ├── familiemedlemmer.spec.ts                   (NY)
│       ├── tilleggsopplysninger.spec.ts               (NY)
│       ├── vedlegg.spec.ts                            (NY)
│       ├── oppsummering.spec.ts                       (NY)
│       ├── kvittering.spec.ts                (FLYTT fra kvittering/)
│       └── innsendt-skjema.spec.ts                    (NY)
├── utils/
│   └── datepicker-helpers.ts      (eksisterende)
└── types/
    └── playwright-types.ts        (eksisterende)
```

## Endringer på eksisterende filer

- `arbeidstaker-flow.spec.ts` — **slettes**, testene splittes ut til respektive steg-filer
- `arbeidsgiver-flow.spec.ts` — **slettes**, testene splittes ut til respektive steg-filer
- `arbeidssted-i-utlandet.spec.ts` (datatransform-test) — **innlemmes** i den nye steg-filen
- `kvittering.spec.ts` — **flyttes** fra `specs/skjema/kvittering/` til `specs/skjema/`
- `api-mocks.ts` og `test-data.ts` — **utvides** med mocks/data for nye flows

## Mønster per steg-spec

Hver spec-fil følger dette mønsteret:

```typescript
test.describe('StegNavn', () => {
  test('happy case - arbeidsgiver', async ({ page }) => { ... });
  test('happy case - arbeidstaker', async ({ page }) => { ... }); // hvis steget finnes i begge flows
  test('variant: <valg A>', async ({ page }) => { ... });
  test('variant: <valg B>', async ({ page }) => { ... });
});
```

## Faser og prioritering

| Fase | Hva                                                       | Prioritet   |
| ---- | --------------------------------------------------------- | ----------- |
| 1    | Splitt eksisterende flow-tester inn i steg-filer          | Høy         |
| 2    | Nye page objects: representasjon, oversikt, innsendt      | Høy         |
| 3    | `representasjon.spec.ts` — alle 4 representasjonstyper    | Høy         |
| 4    | `oversikt.spec.ts` — dashboard-funksjonalitet             | Høy         |
| 5    | Varianter/kombinasjoner per steg (conditional branches)   | Høy         |
| 6    | `innsendt-skjema.spec.ts` — readonly visning              | Medium      |
| 7    | Skjemavalidering per steg                                 | Nice-to-have|
| —    | Tilgjengelighet (axe-core) på alle sider                  | Reminder    |

## Detaljert testliste per steg-fil

### `representasjon.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Velg DEG_SELV — navigerer til oversikt                        |
| Velg ARBEIDSGIVER — navigerer til oversikt                    |
| Velg RÅDGIVER — navigerer til velg-rådgiverfirma, velg firma, navigerer til oversikt |
| Velg ANNEN_PERSON (Privatperson) — navigerer til oversikt     |

### `oversikt.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Viser utkastliste                                             |
| Start ny søknad                                               |
| Viser innsendte søknader                                      |

### `utsendingsperiode-og-land.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Happy case — velg land, sett periode, lagre og fortsett       |

### `arbeidsgiverens-virksomhet-i-norge.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Offentlig virksomhet (Ja) — ingen oppfølgingsspørsmål         |
| Privat virksomhet + bemanningsbyrå                            |
| Privat virksomhet + ikke bemanningsbyrå                       |

### `utenlandsoppdraget.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Alle Ja — viser alle conditional-felter                       |
| Alle Nei — minimalt med felter                                |
| Blandet — representative kombinasjoner                        |

### `arbeidssted-i-utlandet.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| PA_LAND — fast arbeidssted                                    |
| PA_LAND — vekslende arbeidssted                               |
| OFFSHORE — standard                                           |
| PA_SKIP — internasjonalt farvann                              |
| PA_SKIP — territorialfarvann                                  |
| OM_BORD_PA_FLY — vanlig hjemmebase                            |
| OM_BORD_PA_FLY — ikke vanlig hjemmebase                       |
| Datatransform — PA_LAND fast (fra eksisterende test)          |
| Datatransform — PA_LAND vekslende (fra eksisterende test)     |
| Datatransform — PA_SKIP internasjonalt (fra eksisterende test)|
| Datatransform — PA_SKIP territorialt (fra eksisterende test)  |
| Datatransform — OM_BORD_PA_FLY med vanlig hjemmebase (fra eksisterende test) |
| Datatransform — OM_BORD_PA_FLY uten vanlig hjemmebase (fra eksisterende test)|

### `arbeidstakerens-lonn.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Arbeidsgiver betaler alt (Ja)                                 |
| Ikke alt — legg til norsk virksomhet                          |
| Ikke alt — legg til utenlandsk virksomhet                     |

### `arbeidssituasjon.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Har vært i arbeid + ikke flere virksomheter (happy case)      |
| Ikke vært i arbeid — viser aktivitetsbeskrivelse              |
| Flere virksomheter — norsk virksomhet                         |
| Flere virksomheter — utenlandsk virksomhet                    |

### `skatteforhold-og-inntekt.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Uten pengestøtte fra annet land                               |
| Med pengestøtte — fyller ut beløp, land, beskrivelse          |

### `familiemedlemmer.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Ingen familiemedlemmer (Nei)                                  |
| Legg til familiemedlem med norsk fødselsnummer                |
| Legg til familiemedlem med fødselsdato (uten fnr)             |

### `tilleggsopplysninger.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Ingen tilleggsopplysninger (Nei)                              |
| Med tilleggsopplysninger — fyller ut fritekst                 |

### `vedlegg.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Ingen vedlegg — gå videre uten opplasting                     |
| Last opp vedlegg                                              |

### `oppsummering.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Oppsummering — arbeidstakers del                              |
| Oppsummering — arbeidsgivers del                              |
| Oppsummering — kombinert (arbeidsgiver og arbeidstakers del)  |

### `kvittering.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Viser kvittering med referansenummer                          |
| Navigerer tilbake til oversikt                                |

### `innsendt-skjema.spec.ts`

| Test                                                          |
| ------------------------------------------------------------- |
| Viser innsendt — arbeidstakers del                            |
| Viser innsendt — arbeidsgivers del                            |
| Viser innsendt — kombinert                                    |

## Oppsummering

| Kategori                              | Antall tester (ca.) |
| ------------------------------------- | ------------------- |
| Representasjon & navigasjon           | 4                   |
| Oversikt                              | 3-4                 |
| Steg happy cases + varianter          | ~35                 |
| Innsendt skjema                       | 3                   |
| **Sum uten nice-to-have**             | **~45-50**          |
| Skjemavalidering (nice-to-have)       | 8-12                |
| Tilgjengelighet / axe-core (reminder) | 10-15               |
| **Totalt med alt**                    | **~65-75**          |

## Tekniske beslutninger

- **Mocking:** Fortsetter med `page.route()` (konsistent med eksisterende oppsett)
- **Auth:** Mocket via `mockUserInfo()` (ingen reell innlogging)
- **Locators:** Role-baserte og label-baserte (jf. Playwright best practice)
- **Page objects:** Eksisterende mønster videreføres (constructor med `Page` + `skjema` DTO)
