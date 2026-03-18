import { expect, test } from "@playwright/test";

import {
  ArbeidstakerensLonnDto,
  LandKode,
} from "../../../../src/types/melosysSkjemaTypes";
import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import {
  korrektFormatertOrgnr,
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
    const lonnPage = new ArbeidstakerensLonnStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await lonnPage.goto();
    await lonnPage.assertIsVisible();

    await lonnPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.JA.click();

    const expectedPayload: ArbeidstakerensLonnDto = {
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: true,
    };

    await lonnPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await lonnPage.assertNavigatedToNextStep();
  });

  test("variant: ikke alt — legg til norsk virksomhet", async ({ page }) => {
    const lonnPage = new ArbeidstakerensLonnStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await lonnPage.goto();
    await lonnPage.assertIsVisible();

    await lonnPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.NEI.click();

    // Virksomheter section should appear
    await expect(lonnPage.leggTilNorskVirksomhetButton).toBeVisible();
    await expect(lonnPage.leggTilUtenlandskVirksomhetButton).toBeVisible();

    await lonnPage.leggTilNorskVirksomhet(korrektFormatertOrgnr);

    const expectedPayload: ArbeidstakerensLonnDto = {
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: false,
      virksomheterSomUtbetalerLonnOgNaturalytelser: {
        norskeVirksomheter: [{ organisasjonsnummer: korrektFormatertOrgnr }],
        utenlandskeVirksomheter: [],
      },
    };

    await lonnPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await lonnPage.assertNavigatedToNextStep();
  });

  test("variant: ikke alt — legg til utenlandsk virksomhet", async ({
    page,
  }) => {
    const lonnPage = new ArbeidstakerensLonnStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await lonnPage.goto();
    await lonnPage.assertIsVisible();

    await lonnPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.NEI.click();

    await lonnPage.leggTilUtenlandskVirksomhet({
      navn: "Foreign Corp AB",
      vegnavnOgHusnummer: "Kungsgatan 10",
      land: "SE",
      tilhorerSammeKonsern: false,
    });

    const expectedPayload: ArbeidstakerensLonnDto = {
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: false,
      virksomheterSomUtbetalerLonnOgNaturalytelser: {
        norskeVirksomheter: [],
        utenlandskeVirksomheter: [
          {
            navn: "Foreign Corp AB",
            organisasjonsnummer: "",
            vegnavnOgHusnummer: "Kungsgatan 10",
            bygning: "",
            postkode: "",
            byStedsnavn: "",
            region: "",
            land: LandKode.SE,
            tilhorerSammeKonsern: false,
          },
        ],
      },
    };

    await lonnPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await lonnPage.assertNavigatedToNextStep();
  });
});
