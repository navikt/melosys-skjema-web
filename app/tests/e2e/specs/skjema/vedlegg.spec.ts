import { test } from "@playwright/test";

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
import { VedleggStegPage as ArbeidsgiverVedleggStegPage } from "../../pages/skjema/arbeidsgiver/vedlegg-steg.page";
import { VedleggStegPage as ArbeidstakerVedleggStegPage } from "../../pages/skjema/arbeidstaker/vedlegg-steg.page";

test.describe("Vedlegg", () => {
  test.describe("Arbeidstaker", () => {
    test.beforeEach(async ({ page }) => {
      await setupApiMocksForArbeidstaker(
        page,
        testArbeidstakerSkjema,
        testUserInfo,
      );
    });

    test("happy case - navigerer gjennom uten vedlegg", async ({ page }) => {
      const vedleggStegPage = new ArbeidstakerVedleggStegPage(
        page,
        testArbeidstakerSkjema,
      );

      await vedleggStegPage.goto();
      await vedleggStegPage.assertIsVisible();
      await vedleggStegPage.lagreOgFortsett();
      await vedleggStegPage.assertNavigatedToNextStep();
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

    test("happy case - navigerer gjennom uten vedlegg", async ({ page }) => {
      const vedleggStegPage = new ArbeidsgiverVedleggStegPage(
        page,
        testArbeidsgiverSkjema,
      );

      await vedleggStegPage.goto();
      await vedleggStegPage.assertIsVisible();
      await vedleggStegPage.lagreOgFortsett();
      await vedleggStegPage.assertNavigatedToNextStep();
    });
  });
});
