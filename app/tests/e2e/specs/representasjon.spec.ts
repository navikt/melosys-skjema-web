import { VELG_SITUASJON } from "~/featuretoggle/toggleNavn";
import { VALG_DIGITAL_ELLER_PAPIR_URL } from "~/pages/velgSituasjon/VelgSituasjonPage";

import {
  mockFeatureToggles,
  mockGetEregOrganisasjon,
  mockGetEregOrganisasjonMedJuridiskEnhet,
  mockUserInfo,
} from "../fixtures/api-mocks";
import { test } from "../fixtures/test";
import { korrektFormatertOrgnr, testUserInfo } from "../fixtures/test-data";
import { RepresentasjonPage } from "../pages/representasjon/representasjon.page";
import { VelgRadgiverfirmaPage } from "../pages/representasjon/velg-radgiverfirma.page";
import { VelgSituasjonPage } from "../pages/velg-situasjon/velg-situasjon.page";

test.describe("Representasjon", () => {
  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    // Mock ereg for rådgiver-flow
    await mockGetEregOrganisasjon(page);
  });

  test("Velg DEG_SELV — navigerer til oversikt", async ({ page }) => {
    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.goto();
    await representasjonPage.assertIsVisible();
    await representasjonPage.velgDegSelv();
    await representasjonPage.assertNavigatedToOversikt();
  });

  test("Velg ARBEIDSGIVER — navigerer til oversikt", async ({ page }) => {
    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.goto();
    await representasjonPage.assertIsVisible();
    await representasjonPage.velgArbeidsgiver();
    await representasjonPage.assertNavigatedToOversikt();
  });

  test("Velg RÅDGIVER — navigerer til velg-rådgiverfirma", async ({ page }) => {
    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.goto();
    await representasjonPage.assertIsVisible();
    await representasjonPage.velgRadgiver();
    await representasjonPage.assertNavigatedToVelgRadgiverfirma();
  });

  test("Velg ANNEN_PERSON (Privatperson) — navigerer til oversikt", async ({
    page,
  }) => {
    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.goto();
    await representasjonPage.assertIsVisible();
    await representasjonPage.velgAnnenPerson();
    await representasjonPage.assertNavigatedToOversikt();
  });
});

test.describe("Velg rådgiverfirma", () => {
  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    await mockGetEregOrganisasjonMedJuridiskEnhet(page, {
      erOffentligArbeidsgiver: false,
      antallAnsatte: 50,
      organisasjon: {
        orgnr: korrektFormatertOrgnr,
        navn: "Rådgiverfirma AS",
      },
      juridiskEnhet: {
        orgnr: korrektFormatertOrgnr,
        navn: "Rådgiverfirma AS",
      },
    });
  });

  test("Søk og velg rådgiverfirma — navigerer til oversikt med query params", async ({
    page,
  }) => {
    const velgRadgiverfirmaPage = new VelgRadgiverfirmaPage(page);
    await velgRadgiverfirmaPage.goto();
    await velgRadgiverfirmaPage.assertIsVisible();
    await velgRadgiverfirmaPage.sokOgVelgFirma(
      korrektFormatertOrgnr,
      "Rådgiverfirma AS",
    );
    await velgRadgiverfirmaPage.klikKOk();
    await velgRadgiverfirmaPage.assertNavigatedToOversikt();
  });
});

test.describe("Representasjon — Gå tilbake", () => {
  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
  });

  test("går til velg situasjon når togglen er på", async ({ page }) => {
    await mockFeatureToggles(page, { [VELG_SITUASJON]: true });
    const representasjonPage = new RepresentasjonPage(page);
    const velgSituasjonPage = new VelgSituasjonPage(page);
    await representasjonPage.gotoDirekte();
    await representasjonPage.assertIsVisible();
    await representasjonPage.gaTilbake();
    await velgSituasjonPage.assertIsVisible();
  });

  test("lenker til nav.no sin mellomside når togglen er av", async ({
    page,
  }) => {
    await mockFeatureToggles(page, { [VELG_SITUASJON]: false });
    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.gotoDirekte();
    await representasjonPage.assertIsVisible();
    await representasjonPage.assertGaTilbakePekerPa(
      VALG_DIGITAL_ELLER_PAPIR_URL,
    );
  });
});

test.describe("Velg rådgiverfirma — Avbryt", () => {
  test("går til «Hvem skal du opptre som?» også når velg situasjon er på", async ({
    page,
  }) => {
    await mockUserInfo(page, testUserInfo);
    await mockFeatureToggles(page, { [VELG_SITUASJON]: true });
    const velgRadgiverfirmaPage = new VelgRadgiverfirmaPage(page);
    const representasjonPage = new RepresentasjonPage(page);
    await velgRadgiverfirmaPage.goto();
    await velgRadgiverfirmaPage.assertIsVisible();
    await velgRadgiverfirmaPage.klikKAvbryt();
    await velgRadgiverfirmaPage.assertNavigatedToRepresentasjon();
    await representasjonPage.assertIsVisible();
  });
});
