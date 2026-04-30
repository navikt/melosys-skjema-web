import { test } from "../../fixtures/test";

import { TilleggsopplysningerDto } from "~/types/melosysSkjemaTypes";

import {
  setupApiMocksForArbeidsgiver,
  setupApiMocksForArbeidstaker,
} from "../../fixtures/api-mocks";
import {
  testArbeidsgiverSkjema,
  testArbeidstakerSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { TilleggsopplysningerStegPage } from "../../pages/skjema/tilleggsopplysninger-steg.page";

test.describe("Tilleggsopplysninger", () => {
  test.describe("Arbeidstaker", () => {
    test.beforeEach(async ({ page }) => {
      await setupApiMocksForArbeidstaker(
        page,
        testArbeidstakerSkjema,
        testUserInfo,
      );
    });

    test("happy case - ingen tilleggsopplysninger", async ({ page }) => {
      const tilleggsopplysningerStegPage = new TilleggsopplysningerStegPage(
        page,
        testArbeidstakerSkjema,
      );

      await tilleggsopplysningerStegPage.goto();
      await tilleggsopplysningerStegPage.assertIsVisible();

      await tilleggsopplysningerStegPage.harFlereOpplysningerRadioGroup.NEI.click();

      const expectedPayload: TilleggsopplysningerDto = {
        harFlereOpplysningerTilSoknaden: false,
      };

      await tilleggsopplysningerStegPage.lagreOgFortsettAndExpectPayload(
        expectedPayload,
      );
      await tilleggsopplysningerStegPage.assertNavigatedToNextStep();
    });

    test("variant: med tilleggsopplysninger", async ({ page }) => {
      const tilleggsopplysningerStegPage = new TilleggsopplysningerStegPage(
        page,
        testArbeidstakerSkjema,
      );

      await tilleggsopplysningerStegPage.goto();
      await tilleggsopplysningerStegPage.assertIsVisible();

      await tilleggsopplysningerStegPage.harFlereOpplysningerRadioGroup.JA.click();
      await tilleggsopplysningerStegPage.tilleggsopplysningerTextarea.fill(
        "Arbeidstakeren har tidligere vært utsendt til samme land i 2024.",
      );

      const expectedPayload: TilleggsopplysningerDto = {
        harFlereOpplysningerTilSoknaden: true,
        tilleggsopplysningerTilSoknad:
          "Arbeidstakeren har tidligere vært utsendt til samme land i 2024.",
      };

      await tilleggsopplysningerStegPage.lagreOgFortsettAndExpectPayload(
        expectedPayload,
      );
      await tilleggsopplysningerStegPage.assertNavigatedToNextStep();
    });
  });

  test.describe("Arbeidsgiver", () => {
    test.beforeEach(async ({ page }) => {
      await setupApiMocksForArbeidsgiver(
        page,
        testArbeidsgiverSkjema,
        [testOrganization],
        testUserInfo,
      );
    });

    test("happy case - ingen tilleggsopplysninger", async ({ page }) => {
      const tilleggsopplysningerStegPage = new TilleggsopplysningerStegPage(
        page,
        testArbeidsgiverSkjema,
      );

      await tilleggsopplysningerStegPage.goto();
      await tilleggsopplysningerStegPage.assertIsVisible();

      await tilleggsopplysningerStegPage.harFlereOpplysningerRadioGroup.NEI.click();

      const expectedPayload: TilleggsopplysningerDto = {
        harFlereOpplysningerTilSoknaden: false,
      };

      await tilleggsopplysningerStegPage.lagreOgFortsettAndExpectPayload(
        expectedPayload,
      );
      await tilleggsopplysningerStegPage.assertNavigatedToNextStep();
    });

    test("variant: med tilleggsopplysninger", async ({ page }) => {
      const tilleggsopplysningerStegPage = new TilleggsopplysningerStegPage(
        page,
        testArbeidsgiverSkjema,
      );

      await tilleggsopplysningerStegPage.goto();
      await tilleggsopplysningerStegPage.assertIsVisible();

      await tilleggsopplysningerStegPage.harFlereOpplysningerRadioGroup.JA.click();
      await tilleggsopplysningerStegPage.tilleggsopplysningerTextarea.fill(
        "Vi ønsker å informere om at oppdraget kan forlenges med ytterligere 6 måneder.",
      );

      const expectedPayload: TilleggsopplysningerDto = {
        harFlereOpplysningerTilSoknaden: true,
        tilleggsopplysningerTilSoknad:
          "Vi ønsker å informere om at oppdraget kan forlenges med ytterligere 6 måneder.",
      };

      await tilleggsopplysningerStegPage.lagreOgFortsettAndExpectPayload(
        expectedPayload,
      );
      await tilleggsopplysningerStegPage.assertNavigatedToNextStep();
    });
  });
});
