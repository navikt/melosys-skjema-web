import { test } from "../../fixtures/test";

import { SkatteforholdOgInntektDto } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { testArbeidstakerSkjema, testUserInfo } from "../../fixtures/test-data";
import { SkatteforholdOgInntektStegPage } from "../../pages/skjema/skatteforhold-og-inntekt-steg.page";

test.describe("Skatteforhold og inntekt", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
  });

  test("happy case - skattepliktig til Norge, ingen pengestøtte", async ({
    page,
  }) => {
    const skatteforholdOgInntektStegPage = new SkatteforholdOgInntektStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await skatteforholdOgInntektStegPage.goto();
    await skatteforholdOgInntektStegPage.assertIsVisible();

    await skatteforholdOgInntektStegPage.erSkattepliktigTilNorgeRadioGroup.JA.click();
    await skatteforholdOgInntektStegPage.mottarPengestotteFraAnnetEosLandRadioGroup.NEI.click();

    const expectedPayload: SkatteforholdOgInntektDto = {
      erSkattepliktigTilNorgeIHeleutsendingsperioden: true,
      mottarPengestotteFraAnnetEosLandEllerSveits: false,
    };

    await skatteforholdOgInntektStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await skatteforholdOgInntektStegPage.assertNavigatedToNextStep();
  });

  test("variant: med pengestøtte fra annet EØS-land", async ({ page }) => {
    const skatteforholdOgInntektStegPage = new SkatteforholdOgInntektStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await skatteforholdOgInntektStegPage.goto();
    await skatteforholdOgInntektStegPage.assertIsVisible();

    await skatteforholdOgInntektStegPage.erSkattepliktigTilNorgeRadioGroup.NEI.click();
    await skatteforholdOgInntektStegPage.mottarPengestotteFraAnnetEosLandRadioGroup.JA.click();

    // Conditional fields should now be visible
    await skatteforholdOgInntektStegPage.landSomUtbetalerPengestotteCombobox.selectOption(
      "SE",
    );
    await skatteforholdOgInntektStegPage.pengestotteBelopInput.fill("15000");
    await skatteforholdOgInntektStegPage.pengestotteBeskrivelseInput.fill(
      "Barnebidrag fra Sverige",
    );

    const expectedPayload: SkatteforholdOgInntektDto = {
      erSkattepliktigTilNorgeIHeleutsendingsperioden: false,
      mottarPengestotteFraAnnetEosLandEllerSveits: true,
      landSomUtbetalerPengestotte: "SE",
      pengestotteSomMottasFraAndreLandBelop: "15000",
      pengestotteSomMottasFraAndreLandBeskrivelse: "Barnebidrag fra Sverige",
    };

    await skatteforholdOgInntektStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await skatteforholdOgInntektStegPage.assertNavigatedToNextStep();
  });
});
