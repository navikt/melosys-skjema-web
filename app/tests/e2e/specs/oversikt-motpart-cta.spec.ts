import { OpprettetVia, Representasjonstype } from "~/types/melosysSkjemaTypes";

import {
  interceptOpprettSoknad,
  mockFeatureToggles,
  mockGetEregOrganisasjonMedJuridiskEnhet,
  mockPersonerMedFullmakt,
  mockUserInfo,
  mockVentendeMotpartSoknader,
  setupApiMocksForOversikt,
} from "../fixtures/api-mocks";
import { expect, test } from "../fixtures/test";
import {
  emptyInnsendteSoknader,
  emptyUtkastListe,
  emptyVentendeMotpartSoknader,
  korrektFormatertOrgnr,
  testOpprettSoknadResponseId,
  testUserInfo,
  testVentendeMotpartSoknader,
} from "../fixtures/test-data";
import { OversiktPage } from "../pages/oversikt/oversikt.page";
import { RepresentasjonPage } from "../pages/representasjon/representasjon.page";
import { SkjemaStartPage } from "../pages/skjema/skjema-start.page";

const ALLE_TOGGLES_PAA = {
  "melosys.skjema.motpart-cta": true,
  "melosys.skjema.innsendt-sammendrag": true,
};

const MOTPART_CTA_AV = {
  "melosys.skjema.motpart-cta": false,
  "melosys.skjema.innsendt-sammendrag": true,
};

test.describe("Oversikt — motpart-CTA", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockGetEregOrganisasjonMedJuridiskEnhet(page);
    await mockPersonerMedFullmakt(page, []);
  });

  test("«Fyll ut din del» går rett til introsiden med arbeidsgiver og arbeidstaker utfylt", async ({
    page,
  }) => {
    await mockFeatureToggles(page, ALLE_TOGGLES_PAA);
    await mockVentendeMotpartSoknader(page, testVentendeMotpartSoknader);
    const requestBodyPromise = interceptOpprettSoknad(
      page,
      testOpprettSoknadResponseId,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertMotpartCtaVisible("Test Bedrift AS");
    await oversiktPage.assertMotpartCtaBeskrivelseVisible(
      "Sverige",
      "01.02.2026",
      "31.08.2026",
    );

    await oversiktPage.clickMotpartCtaFyllUtDinDel();
    await new SkjemaStartPage(page).bekreftOgStart(
      Representasjonstype.DEG_SELV,
    );

    expect(await requestBodyPromise).toEqual({
      representasjonstype: Representasjonstype.DEG_SELV,
      arbeidsgiver: {
        orgnr: korrektFormatertOrgnr,
        navn: "Test Organisasjon AS",
      },
      arbeidstaker: { fnr: testUserInfo.userId, etternavn: testUserInfo.name },
      opprettetVia: OpprettetVia.MOTPART_CTA,
      prefyllFraSkjemaId: "7f9b2c4d-1e3a-4b5c-8d6e-9f0a1b2c3d4e",
    });
    await expect(page).toHaveURL(
      new RegExp(`/skjema/${testOpprettSoknadResponseId}`),
    );
  });

  test("Viser ikke banner når toggle er av", async ({ page }) => {
    await mockFeatureToggles(page, MOTPART_CTA_AV);
    await mockVentendeMotpartSoknader(page, testVentendeMotpartSoknader);

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    const togglesLastet = oversiktPage.ventPaaFeatureToggles();
    await oversiktPage.goto();
    await togglesLastet;
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertMotpartCtaNotVisible("Test Bedrift AS");
  });

  test("Viser ikke banner uten ventende motpart-søknader", async ({ page }) => {
    await mockFeatureToggles(page, ALLE_TOGGLES_PAA);
    await mockVentendeMotpartSoknader(page, emptyVentendeMotpartSoknader);

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    const ventendeLastet = oversiktPage.ventPaaVentendeMotpartSoknader();
    await oversiktPage.goto();
    await ventendeLastet;
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertMotpartCtaNotVisible("Test Bedrift AS");
  });

  test("Viser ikke banner for ARBEIDSGIVER-kontekst", async ({ page }) => {
    await mockFeatureToggles(page, ALLE_TOGGLES_PAA);
    await mockVentendeMotpartSoknader(page, testVentendeMotpartSoknader);

    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ARBEIDSGIVER,
    );
    const togglesLastet = oversiktPage.ventPaaFeatureToggles();
    await oversiktPage.goto();
    await togglesLastet;
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertMotpartCtaNotVisible("Test Bedrift AS");
  });
});

test.describe("Landingsside — motpart-hint", () => {
  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
  });

  test("Viser «Søknad venter på deg» på DEG_SELV-kortet ved treff", async ({
    page,
  }) => {
    await mockFeatureToggles(page, ALLE_TOGGLES_PAA);
    await mockVentendeMotpartSoknader(page, testVentendeMotpartSoknader);

    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.goto();
    await representasjonPage.assertIsVisible();
    await representasjonPage.assertSoknadVenterBadgeVisible();
  });

  test("Viser ikke hint når toggle er av", async ({ page }) => {
    await mockFeatureToggles(page, MOTPART_CTA_AV);
    await mockVentendeMotpartSoknader(page, testVentendeMotpartSoknader);

    const representasjonPage = new RepresentasjonPage(page);
    const togglesLastet = representasjonPage.ventPaaFeatureToggles();
    await representasjonPage.goto();
    await togglesLastet;
    await representasjonPage.assertIsVisible();
    await representasjonPage.assertSoknadVenterBadgeNotVisible();
  });

  test("Viser ikke hint uten ventende motpart-søknader", async ({ page }) => {
    await mockFeatureToggles(page, ALLE_TOGGLES_PAA);
    await mockVentendeMotpartSoknader(page, emptyVentendeMotpartSoknader);

    const representasjonPage = new RepresentasjonPage(page);
    const ventendeLastet = representasjonPage.ventPaaVentendeMotpartSoknader();
    await representasjonPage.goto();
    await ventendeLastet;
    await representasjonPage.assertIsVisible();
    await representasjonPage.assertSoknadVenterBadgeNotVisible();
  });
});
