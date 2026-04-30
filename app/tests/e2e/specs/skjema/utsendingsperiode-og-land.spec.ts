import { UtsendingsperiodeOgLandDto } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
import {
  formFieldValues,
  testArbeidstakerSkjema,
  testUserInfo,
} from "../../fixtures/test-data";
import { UtsendingsperiodeOgLandStegPage } from "../../pages/skjema/utsendingsperiode-og-land-steg.page";

test.describe("Utsendingsperiode og land", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
  });

  test("happy case - fyller ut land og periode og gjør forventet POST request", async ({
    page,
  }) => {
    const utsendingsperiodeOgLandStegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await utsendingsperiodeOgLandStegPage.goto();
    await utsendingsperiodeOgLandStegPage.assertIsVisible();

    await utsendingsperiodeOgLandStegPage.velgLand(
      formFieldValues.utsendelseLand,
    );

    await utsendingsperiodeOgLandStegPage.fillFraDato(
      formFieldValues.periodeFra,
    );
    await utsendingsperiodeOgLandStegPage.fillTilDato(
      formFieldValues.periodeTil,
    );

    const expectedPayload: UtsendingsperiodeOgLandDto = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      utsendelsePeriode: formFieldValues.periode,
    };

    await utsendingsperiodeOgLandStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );

    await utsendingsperiodeOgLandStegPage.assertNavigatedToNextStep();
  });
});
