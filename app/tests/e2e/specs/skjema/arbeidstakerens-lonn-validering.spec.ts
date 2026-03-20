import { test } from "@playwright/test";

import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { ArbeidstakerensLonnStegPage } from "../../pages/skjema/arbeidstakerens-lonn-steg.page";

test.describe("Arbeidstakerens lønn - validering", () => {
  let stegPage: ArbeidstakerensLonnStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
    stegPage = new ArbeidstakerensLonnStegPage(page, testArbeidsgiverSkjema);
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmelding når det ikke er svart på om arbeidsgiver betaler all lønn", async () => {
    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaSvarePaOmDuBetalerAllLonnIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding når arbeidsgiver ikke betaler all lønn og ingen virksomheter er lagt til", async () => {
    await stegPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.NEI.click();

    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaLeggeTilMinstEnVirksomhetIsVisible();
    await stegPage.assertStillOnStep();
  });
});
