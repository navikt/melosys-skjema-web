import { VedleggFiltype } from "~/types/melosysSkjemaTypes";

import {
  mockHentVedlegg,
  mockLastOppVedlegg,
  setupApiMocksForArbeidsgiver,
  setupApiMocksForArbeidstaker,
} from "../../fixtures/api-mocks";
import { expect, test } from "../../fixtures/test";
import {
  testArbeidsgiverSkjema,
  testArbeidstakerSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { VedleggStegPage } from "../../pages/skjema/vedlegg-steg.page";

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
      const vedleggStegPage = new VedleggStegPage(page, testArbeidstakerSkjema);

      await vedleggStegPage.goto();
      await vedleggStegPage.assertIsVisible();
      await vedleggStegPage.lagreOgFortsett();
      await vedleggStegPage.assertNavigatedToNextStep();
    });

    test("laster opp vedlegg og verifiserer POST-kall", async ({ page }) => {
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

      const vedleggStegPage = new VedleggStegPage(page, testArbeidstakerSkjema);

      await vedleggStegPage.goto();
      await vedleggStegPage.assertIsVisible();

      const uploadRequestPromise = page.waitForRequest(
        (req) =>
          req.url().includes(`/api/skjema/${skjemaId}/vedlegg`) &&
          req.method() === "POST",
      );

      await vedleggStegPage.uploadFile(
        "testfil.pdf",
        "application/pdf",
        Buffer.from("fake-pdf-content"),
      );

      const uploadRequest = await uploadRequestPromise;

      expect(uploadRequest.method()).toBe("POST");
      expect(uploadRequest.url()).toContain(`/api/skjema/${skjemaId}/vedlegg`);

      const contentType = uploadRequest.headers()["content-type"];
      expect(contentType).toContain("multipart/form-data");

      const body = uploadRequest.postData();
      expect(body).toContain("testfil.pdf");

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
      const vedleggStegPage = new VedleggStegPage(page, testArbeidsgiverSkjema);

      await vedleggStegPage.goto();
      await vedleggStegPage.assertIsVisible();
      await vedleggStegPage.lagreOgFortsett();
      await vedleggStegPage.assertNavigatedToNextStep();
    });
  });
});
