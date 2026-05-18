import { FamiliemedlemmerDto } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
import { testArbeidstakerSkjema, testUserInfo } from "../../fixtures/test-data";
import { FamiliemedlemmerStegPage } from "../../pages/skjema/familiemedlemmer-steg.page";

test.describe("Familiemedlemmer", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
  });

  test("happy case - ingen familiemedlemmer", async ({ page }) => {
    const familiemedlemmerStegPage = new FamiliemedlemmerStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await familiemedlemmerStegPage.goto();
    await familiemedlemmerStegPage.assertIsVisible();

    await familiemedlemmerStegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.NEI.click();

    const expectedPayload: FamiliemedlemmerDto = {
      skalHaMedFamiliemedlemmer: false,
    };

    await familiemedlemmerStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await familiemedlemmerStegPage.assertNavigatedToNextStep();
  });

  test("happy case - har familiemedlemmer, viser infoboks", async ({
    page,
  }) => {
    const familiemedlemmerStegPage = new FamiliemedlemmerStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await familiemedlemmerStegPage.goto();
    await familiemedlemmerStegPage.assertIsVisible();

    await familiemedlemmerStegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.JA.click();

    // Infoboks med lenke til eget skjema skal vises
    await familiemedlemmerStegPage.assertInfoboksIsVisible();

    const expectedPayload: FamiliemedlemmerDto = {
      skalHaMedFamiliemedlemmer: true,
    };

    await familiemedlemmerStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await familiemedlemmerStegPage.assertNavigatedToNextStep();
  });

  test("viser ikke infoboks når NEI er valgt", async ({ page }) => {
    const familiemedlemmerStegPage = new FamiliemedlemmerStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await familiemedlemmerStegPage.goto();
    await familiemedlemmerStegPage.assertIsVisible();

    await familiemedlemmerStegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.NEI.click();

    await familiemedlemmerStegPage.assertInfoboksIsNotVisible();
  });
});
