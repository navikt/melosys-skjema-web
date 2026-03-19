# Playwright E2E Test Conventions

This document describes the conventions for writing Playwright e2e tests in this project.

## File Structure

```
app/tests/e2e/
├── fixtures/
│   ├── api-mocks.ts          # API route mocking (page.route)
│   └── test-data.ts          # Shared test data constants and DTOs
├── pages/                    # Page Object Model (POM) classes
│   ├── representasjon/
│   ├── oversikt/
│   └── skjema/
│       ├── arbeidsgiver/     # Page objects for arbeidsgiver flow steps
│       ├── arbeidstaker/     # Page objects for arbeidstaker flow steps
│       ├── kvittering/
│       └── innsendt/
├── specs/                    # Test spec files
│   ├── representasjon.spec.ts
│   ├── oversikt.spec.ts
│   └── skjema/
│       ├── <step-name>.spec.ts              # Happy case tests
│       └── <step-name>-validering.spec.ts   # Validation tests (separate file)
├── utils/
│   └── datepicker-helpers.ts # Helper for NAV Design System DatePicker
└── AGENT.md                  # This file
```

### File naming conventions

- Page objects: `<step-name>-steg.page.ts` (e.g., `utsendingsperiode-og-land-steg.page.ts`)
- Spec files: `<step-name>.spec.ts` for happy cases
- Validation specs: `<step-name>-validering.spec.ts` in a separate file alongside the happy case spec
- Custom types: `app/tests/types/playwright-types.ts`

## Page Object Model (POM) — Mandatory

**Spec files must NEVER use `page.` directly for locators, interactions, or assertions.** All DOM interactions go through page object methods.

### Page object structure

```typescript
import { expect, type Locator, type Page } from "@playwright/test";
import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type { UtsendtArbeidstakerSkjemaDto } from "~/types/melosysSkjemaTypes";

// Get field labels from static definitions
const seksjon = SKJEMA_DEFINISJON_A1.seksjoner.seksjonNavn;
const felter = seksjon.felter;

// Step title from i18n
const stegTittel = nb.translation.stegNavn.tittel;

// Error messages from i18n
const feilmeldinger = {
  fieldName: nb.translation.stegNavn.feilmelding,
  datoErPakrevd: nb.translation.periode.datoErPakrevd,
};

export class StegNavnStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", { name: stegTittel });
    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() { ... }
  async assertIsVisible() { ... }
  async lagreOgFortsett() { ... }
  async lagreOgFortsettAndWaitForApiRequest() { ... }
  async lagreOgFortsettAndExpectPayload(expected) { ... }
  async assertNavigatedToNextStep() { ... }
}
```

### Key conventions

1. **Constructor** takes `Page` and `UtsendtArbeidstakerSkjemaDto`
2. **Locators** are `readonly` properties, initialized in the constructor
3. **Labels** come from `SKJEMA_DEFINISJON_A1` (field labels) and `nb` (i18n translations)
4. **Error messages** come from `~/i18n/nb.ts` — never hardcode Norwegian strings
5. **Validation assertions** are explicit per field (e.g., `assertFraDatoErPakrevdIsVisible()`) — not generic count-based assertions
6. Every page object has `goto()`, `assertIsVisible()`, `lagreOgFortsett()`, and `assertNavigatedToNextStep()`

## Locator Patterns

Prefer role-based and label-based locators (Playwright best practice):

```typescript
// Headings
page.getByRole("heading", { name: stegTittel });

// Buttons
page.getByRole("button", { name: nb.translation.felles.lagreOgFortsett });

// Radio button groups (use RadioButtonGroupJaNeiLocator type)
const group = page.getByRole("group", { name: felter.fieldName.label });
const radioGroup: RadioButtonGroupJaNeiLocator = {
  JA: group.getByRole("radio", { name: nb.translation.felles.ja }),
  NEI: group.getByRole("radio", { name: nb.translation.felles.nei }),
};

// Combobox (select)
page.getByRole("combobox", { name: felter.fieldName.label });

// Date inputs
page.getByLabel(nb.translation.periode.fraDato);
page.getByLabel(nb.translation.periode.tilDato);

// Error messages in date fields (NAV Design System DOM structure)
// DatePicker.Input: textbox -> input-wrapper -> field-wrapper (contains error paragraph)
this.fraDatoInput.locator("..").locator("..").getByText(feilmeldinger.datoErPakrevd);

// Generic text assertions
page.getByText(feilmeldinger.someError);
```

### RadioButtonGroupJaNeiLocator

Defined in `app/tests/types/playwright-types.ts`:

```typescript
type RadioButtonGroupLocator<T extends string> = { [K in T]: Locator };
export type RadioButtonGroupJaNeiLocator = RadioButtonGroupLocator<"JA" | "NEI">;
```

Use this type for all Ja/Nei radio groups. Access with `radioGroup.JA.click()` or `radioGroup.NEI.click()`.

## Spec Structure

```typescript
import { test } from "@playwright/test";
import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { testArbeidstakerSkjema, testUserInfo, formFieldValues } from "../../fixtures/test-data";
import { StegNavnStegPage } from "../../pages/skjema/arbeidstaker/steg-navn-steg.page";

test.describe("Steg Navn", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(page, testArbeidstakerSkjema, testUserInfo);
  });

  test("happy case - description", async ({ page }) => {
    const stegPage = new StegNavnStegPage(page, testArbeidstakerSkjema);
    await stegPage.goto();
    await stegPage.assertIsVisible();
    // ... fill fields, click lagre, assert navigation
  });
});
```

### Validation spec files

Validation tests go in a **separate file** named `<step-name>-validering.spec.ts`:

```typescript
test.describe("Steg Navn - validering", () => {
  let stegPage: StegNavnStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(page, testArbeidstakerSkjema, testUserInfo);
    stegPage = new StegNavnStegPage(page, testArbeidstakerSkjema);
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmelding når ingen felter er fylt ut", async () => {
    await stegPage.lagreOgFortsett();
    await stegPage.assertFieldXFeilmeldingIsVisible();
    await stegPage.assertFieldYFeilmeldingIsVisible();
    await stegPage.assertStillOnStep();
  });
});
```

## API Mocking

Uses **`page.route()`** (not MSW). Mocks are in `fixtures/api-mocks.ts`.

### Composite setup functions

Use these to set up all required API mocks for a flow:

- `setupApiMocksForArbeidstaker(page, skjema, userInfo)` — arbeidstaker flow
- `setupApiMocksForArbeidsgiver(page, skjema, tilganger, userInfo)` — arbeidsgiver flow
- `setupApiMocksForKombinert(page, skjema, tilganger, userInfo)` — combined flow
- `setupApiMocksForOversikt(page, userInfo, orgs, utkast, innsendte)` — oversikt page

### Individual mock functions

Each step has a `mockPost<StepName>(page, skjemaId)` function. Use when you need finer control.

### Intercepting POST payloads

Use `page.waitForRequest()` to capture and assert on POST payloads:

```typescript
async lagreOgFortsettAndWaitForApiRequest() {
  const requestPromise = this.page.waitForRequest(
    `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/step-name`
  );
  await this.lagreOgFortsett();
  return await requestPromise;
}

async lagreOgFortsettAndExpectPayload(expectedPayload: StepDto) {
  const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
  expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
}
```

## Test Data

All test data lives in `fixtures/test-data.ts`. Key exports:

- `testUserInfo` — mocked user identity
- `testArbeidstakerSkjema` / `testArbeidsgiverSkjema` / `testKombinertSkjema` — skjema DTOs
- `formFieldValues` — reusable form values (dates, land, etc.)
- `testOrganization` / `testArbeidsgiverOrganization` — organization data

**Never hardcode test values in spec files** — import from `test-data.ts`.

## DatePicker Helper

For filling dates via the NAV Design System calendar widget, use `selectDateFromCalendar()` from `utils/datepicker-helpers.ts`:

```typescript
import { selectDateFromCalendar } from "../../../utils/datepicker-helpers";

async fillFraDato(date: string) {
  await selectDateFromCalendar(this.page, this.fraDatoInput, date);
}
```

Date format is `DD.MM.YYYY` (Norwegian format, e.g., `"01.01.2026"`).

## i18n and Labels

- **Field labels**: `SKJEMA_DEFINISJON_A1.seksjoner.<seksjon>.felter.<felt>.label`
- **Step titles**: `nb.translation.<stegNavn>.tittel`
- **Common strings**: `nb.translation.felles.*` (e.g., `lagreOgFortsett`, `ja`, `nei`)
- **Error messages**: `nb.translation.periode.*` and `nb.translation.<stegNavn>.*`

Never hardcode Norwegian strings — always reference `nb` or `SKJEMA_DEFINISJON_A1`.

## Running Tests

```bash
# Run all e2e tests (starts dev server automatically)
npx playwright test

# Run a specific spec file
npx playwright test tests/e2e/specs/skjema/utsendingsperiode-og-land.spec.ts

# Run with UI mode
npx playwright test --ui

# Run only chromium
npx playwright test --project=chromium
```

All commands should be run from the `app/` directory.

## Playwright Config

- `testDir`: `./tests/e2e`
- `baseURL`: `http://localhost:5173`
- Dev server started automatically via `npm run dev`
- Local: runs chromium, firefox, webkit. CI: chromium only with 2 retries.
- Traces on first retry, screenshots on failure.
