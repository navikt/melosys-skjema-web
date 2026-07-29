import { OpprettetVia, Representasjonstype } from "~/types/melosysSkjemaTypes";

import {
  interceptOpprettSoknad,
  mockFeatureToggles,
  mockGetEregOrganisasjonMedJuridiskEnhet,
  mockGetEregOrganisasjonMedJuridiskEnhetPerOrgnr,
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
  korrektFormatertOrgnr2,
  testOpprettSoknadResponseId,
  testUserInfo,
  testVentendeMotpartSoknader,
} from "../fixtures/test-data";
import { OversiktPage } from "../pages/oversikt/oversikt.page";
import { RepresentasjonPage } from "../pages/representasjon/representasjon.page";

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

  test("Viser banner for DEG_SELV og prefiller arbeidsgiver ved klikk", async ({
    page,
  }) => {
    await mockFeatureToggles(page, ALLE_TOGGLES_PAA);
    await mockVentendeMotpartSoknader(page, testVentendeMotpartSoknader);

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertMotpartCtaVisible("Test Bedrift AS");

    await oversiktPage.clickMotpartCtaFyllUtDinDel();
    await oversiktPage.assertArbeidsgiverOrgnrPrefilt(korrektFormatertOrgnr);
  });

  test("Opprettelse via CTA sender opprettetVia i payload", async ({
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
    await oversiktPage.clickMotpartCtaFyllUtDinDel();
    await oversiktPage.assertArbeidsgiverOrgnrPrefilt(korrektFormatertOrgnr);
    await oversiktPage.waitForOrgLookup("Test Organisasjon AS");
    await oversiktPage.checkBekreftelseCheckbox();
    await oversiktPage.clickStartSoknad();

    const requestBody = (await requestBodyPromise) as Record<string, unknown>;
    expect(requestBody.opprettetVia).toBe(OpprettetVia.MOTPART_CTA);
    expect(requestBody.arbeidsgiver).toEqual({
      orgnr: korrektFormatertOrgnr,
      navn: "Test Organisasjon AS",
    });
  });

  test("Bytter brukeren arbeidsgiver etter CTA-klikk, sendes ikke opprettetVia", async ({
    page,
  }) => {
    await mockFeatureToggles(page, ALLE_TOGGLES_PAA);
    await mockVentendeMotpartSoknader(page, testVentendeMotpartSoknader);
    await mockGetEregOrganisasjonMedJuridiskEnhetPerOrgnr(page, {
      [korrektFormatertOrgnr]: "CTA Arbeidsgiver AS",
      [korrektFormatertOrgnr2]: "Annen Arbeidsgiver AS",
    });
    const requestBodyPromise = interceptOpprettSoknad(
      page,
      testOpprettSoknadResponseId,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.clickMotpartCtaFyllUtDinDel();
    await oversiktPage.waitForOrgLookup("CTA Arbeidsgiver AS");

    await oversiktPage.fillArbeidsgiverOrgnr(korrektFormatertOrgnr2);
    await oversiktPage.waitForOrgLookup("Annen Arbeidsgiver AS");
    await oversiktPage.checkBekreftelseCheckbox();
    await oversiktPage.clickStartSoknad();

    const requestBody = (await requestBodyPromise) as Record<string, unknown>;
    expect(requestBody.opprettetVia).toBeUndefined();
    expect(requestBody.arbeidsgiver).toEqual({
      orgnr: korrektFormatertOrgnr2,
      navn: "Annen Arbeidsgiver AS",
    });
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
