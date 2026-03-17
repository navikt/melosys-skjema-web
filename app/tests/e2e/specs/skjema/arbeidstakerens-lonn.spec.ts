import { test } from "@playwright/test";

import { ArbeidstakerensLonnDto } from "../../../../src/types/melosysSkjemaTypes";
import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { ArbeidstakerensLonnStegPage } from "../../pages/skjema/arbeidsgiver/arbeidstakerens-lonn-steg.page";

test.describe("Arbeidstakerens lønn", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
  });

  test("happy case - arbeidsgiver betaler all lønn", async ({ page }) => {
    const arbeidstakerensLonnStegPage = new ArbeidstakerensLonnStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await arbeidstakerensLonnStegPage.goto();
    await arbeidstakerensLonnStegPage.assertIsVisible();

    await arbeidstakerensLonnStegPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.JA.click();

    const expectedPayload: ArbeidstakerensLonnDto = {
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: true,
    };

    await arbeidstakerensLonnStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await arbeidstakerensLonnStegPage.assertNavigatedToNextStep();
  });
});
