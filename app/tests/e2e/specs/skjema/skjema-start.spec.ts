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
import { translations } from "../../utils/translations";

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
    // Opplysningene ligger i history state og overlever oppfrisking
    await page.reload();
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
    expect(await requestBodyPromise).toMatchObject({
      bekreftetRiktigeOpplysninger: true,
    });
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
    await page
      .getByRole("combobox", {
        name: translations.oversiktAnnenPerson.personVelgerLabel,
      })
      .click();
    await page
      .getByRole("option", { name: new RegExp(testPersonMedFullmakt.navn) })
      .click();
    await oversiktPage.fillArbeidsgiverOrgnr(korrektFormatertOrgnr);
    await oversiktPage.waitForOrgLookup(
      testEregOrganisasjon.juridiskEnhet.navn,
    );
    await oversiktPage.clickStartSoknad();

    const startPage = new SkjemaStartPage(page);
    await startPage.assertIsVisible();
    await startPage.assertInnhold(Representasjonstype.ANNEN_PERSON);
  });

  test("direkte besøk uten søknadsdata sender brukeren til forsiden", async ({
    page,
  }) => {
    await page.goto("/skjema/start");
    await expect(page).toHaveURL("/representasjon");
  });
});
