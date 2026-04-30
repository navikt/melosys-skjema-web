import {
  mockGetEregOrganisasjon,
  mockGetEregOrganisasjonMedJuridiskEnhet,
  mockUserInfo,
} from "../fixtures/api-mocks";
import { test } from "../fixtures/test";
import { korrektFormatertOrgnr, testUserInfo } from "../fixtures/test-data";
import { RepresentasjonPage } from "../pages/representasjon/representasjon.page";
import { VelgRadgiverfirmaPage } from "../pages/representasjon/velg-radgiverfirma.page";

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
