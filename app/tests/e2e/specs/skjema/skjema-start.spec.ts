import { Representasjonstype } from "~/types/melosysSkjemaTypes";

import {
  interceptOpprettSoknad,
  mockFetchSkjema,
  mockGetEregOrganisasjonMedJuridiskEnhet,
  mockPersonerMedFullmakt,
  setupApiMocksForOversikt,
} from "../../fixtures/api-mocks";
import { expect, test } from "../../fixtures/test";
import {
  emptyInnsendteSoknader,
  emptyUtkastListe,
  korrektFormatertOrgnr,
  testArbeidstakerSkjema,
  testEregOrganisasjon,
  testOpprettSoknadResponseId,
  testPersonMedFullmakt,
  testUserInfo,
} from "../../fixtures/test-data";
import { OversiktPage } from "../../pages/oversikt/oversikt.page";
import { SkjemaStartPage } from "../../pages/skjema/skjema-start.page";

test.describe("Skjema — introside med bekreftelse", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockGetEregOrganisasjonMedJuridiskEnhet(page, testEregOrganisasjon);
    await mockPersonerMedFullmakt(page, [testPersonMedFullmakt]);
    await mockFetchSkjema(page, {
      ...testArbeidstakerSkjema,
      id: testOpprettSoknadResponseId,
    });
  });

  test("oppretter ikke utkast før brukeren har bekreftet", async ({ page }) => {
    let antallOpprettelser = 0;
    page.on("request", (request) => {
      if (request.url().includes("/opprett-med-kontekst")) antallOpprettelser++;
    });
    const requestBodyPromise = interceptOpprettSoknad(
      page,
      testOpprettSoknadResponseId,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.fillArbeidsgiverOrgnr(korrektFormatertOrgnr);
    await oversiktPage.waitForOrgLookup(
      testEregOrganisasjon.juridiskEnhet.navn,
    );
    await oversiktPage.clickStartSoknad();

    const startPage = new SkjemaStartPage(page);
    await startPage.assertIsVisible();
    await expect(
      page.getByText(`${testEregOrganisasjon.juridiskEnhet.navn} (`),
    ).toBeVisible();
    await startPage.assertInnhold(Representasjonstype.DEG_SELV);
    await startPage.startSoknad();
    await startPage.assertManglerBekreftelseVisible();
    expect(antallOpprettelser).toBe(0);

    await startPage.bekreft();
    await startPage.startSoknad();
    await requestBodyPromise;
    await expect(page).toHaveURL(
      `/skjema/${testOpprettSoknadResponseId}/utsendingsperiode-og-land`,
    );

    // Tilbake fra første steg går til oversikten, ikke til introsiden
    await page.goBack();
    await expect(page).toHaveURL(/\/oversikt/);
    expect(antallOpprettelser).toBe(1);
  });

  test("ANNEN_PERSON: viser info om brev til fullmektig", async ({ page }) => {
    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ANNEN_PERSON,
    );
    await oversiktPage.goto();
    await oversiktPage.selectArbeidstakerMedFullmakt(
      testPersonMedFullmakt.navn,
    );
    await oversiktPage.fillArbeidsgiverOrgnr(korrektFormatertOrgnr);
    await oversiktPage.waitForOrgLookup(
      testEregOrganisasjon.juridiskEnhet.navn,
    );
    await oversiktPage.clickStartSoknad();

    const startPage = new SkjemaStartPage(page);
    await startPage.assertIsVisible();
    await startPage.assertInnhold(Representasjonstype.ANNEN_PERSON);
  });

  test("oppfrisking av introsiden glemmer opplysningene (fnr lagres ikke i nettleseren)", async ({
    page,
  }) => {
    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.fillArbeidsgiverOrgnr(korrektFormatertOrgnr);
    await oversiktPage.waitForOrgLookup(
      testEregOrganisasjon.juridiskEnhet.navn,
    );
    await oversiktPage.clickStartSoknad();
    await new SkjemaStartPage(page).assertIsVisible();

    expect(
      await page.evaluate(() => JSON.stringify(globalThis.history.state)),
    ).not.toContain(testUserInfo.userId);
    await page.reload();
    await expect(page).toHaveURL("/representasjon");
  });

  test("direkte besøk uten søknadsdata sender brukeren til forsiden", async ({
    page,
  }) => {
    await page.goto("/skjema/start");
    await expect(page).toHaveURL("/representasjon");
  });
});
