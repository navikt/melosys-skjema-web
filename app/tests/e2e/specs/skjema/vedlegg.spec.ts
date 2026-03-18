import { test } from "@playwright/test";

import { VedleggFiltype } from "../../../../src/types/melosysSkjemaTypes";
import {
  mockHentVedlegg,
  mockLastOppVedlegg,
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

    test("laster opp vedlegg og viser filen", async ({ page }) => {
      const skjemaId = testArbeidstakerSkjema.id;
      const vedleggResponse = {
        id: "vedlegg-123",
        filnavn: "testfil.pdf",
        filtype: VedleggFiltype.PDF,
        filstorrelse: 12_345,
        opprettetDato: "2026-01-15T10:00:00Z",
      };

      await mockHentVedlegg(page, skjemaId);
      await mockLastOppVedlegg(page, skjemaId, vedleggResponse);

      const vedleggStegPage = new ArbeidstakerVedleggStegPage(
        page,
        testArbeidstakerSkjema,
      );

      await vedleggStegPage.goto();
      await vedleggStegPage.assertIsVisible();

      await vedleggStegPage.uploadFile(
        "testfil.pdf",
        "application/pdf",
        Buffer.from("fake-pdf-content"),
      );

      await vedleggStegPage.assertFileItemVisible("testfil.pdf");

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
