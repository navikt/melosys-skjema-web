import { test } from "@playwright/test";

import { Representasjonstype } from "~/types/melosysSkjemaTypes";

import {
  mockGetEregOrganisasjonMedJuridiskEnhet,
  mockHentTilganger,
  mockPersonerMedFullmakt,
  setupApiMocksForOversikt,
} from "../fixtures/api-mocks";
import {
  emptyInnsendteSoknader,
  emptyUtkastListe,
  korrektFormatertOrgnr,
  testArbeidsgiverOrganization,
  testEregOrganisasjon,
  testOrganization,
  testPersonMedFullmakt,
  testRadgiverfirmaOrganisasjon,
  testRadgiverfirmaOrgnr,
  testUserInfo,
} from "../fixtures/test-data";
import { OversiktPage } from "../pages/oversikt/oversikt.page";

test.describe("Oversikt - validering", () => {
  test("DEG_SELV: viser feilmelding for manglende arbeidsgiver når man klikker Start søknad uten å søke opp org", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();

    await oversiktPage.clickStartSoknad();

    await oversiktPage.assertValideringManglerArbeidsgiverIsVisible();
    await oversiktPage.assertStillOnPage();
  });

  test("ARBEIDSGIVER: viser feilmeldinger for manglende arbeidsgiver og arbeidstaker samtidig", async ({
    page,
  }) => {
    // Use two organizations to prevent auto-selection of arbeidsgiver
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [testOrganization, testArbeidsgiverOrganization],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockHentTilganger(page, [
      testOrganization,
      testArbeidsgiverOrganization,
    ]);
    await mockPersonerMedFullmakt(page, []);

    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ARBEIDSGIVER,
    );
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();

    await oversiktPage.clickStartSoknad();

    await oversiktPage.assertValideringManglerArbeidsgiverIsVisible();
    await oversiktPage.assertValideringManglerArbeidstakerIsVisible();
    await oversiktPage.assertStillOnPage();
  });

  test("DEG_SELV: viser checkbox-tekst og riktig bekreftelsesfeil når arbeidsgiver er valgt", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockGetEregOrganisasjonMedJuridiskEnhet(page, testEregOrganisasjon);

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertBekreftelseBoksContentForRepresentasjonstype();
    await oversiktPage.assertBekreftelseCheckboxForRepresentasjonstypeIsVisible();

    await oversiktPage.fillArbeidsgiverOrgnr(korrektFormatertOrgnr);
    await oversiktPage.waitForOrgLookup(
      testEregOrganisasjon.juridiskEnhet.navn,
    );

    await oversiktPage.clickStartSoknad();

    await oversiktPage.assertValideringManglerBekreftelseDegSelvIsVisible();
    await oversiktPage.assertStillOnPage();
  });

  test("ARBEIDSGIVER: viser checkbox-tekst og riktig bekreftelsesfeil når øvrige felt er fylt ut", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [testArbeidsgiverOrganization],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockHentTilganger(page, [testArbeidsgiverOrganization]);
    await mockPersonerMedFullmakt(page, [testPersonMedFullmakt]);

    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ARBEIDSGIVER,
    );
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertBekreftelseBoksContentForRepresentasjonstype();
    await oversiktPage.assertBekreftelseCheckboxForRepresentasjonstypeIsVisible();

    await oversiktPage.selectSkalFylleUtJa();
    await oversiktPage.selectArbeidstakerMedFullmakt(
      testPersonMedFullmakt.navn,
    );

    await oversiktPage.clickStartSoknad();

    await oversiktPage.assertValideringManglerBekreftelseIsVisible();
    await oversiktPage.assertStillOnPage();
  });

  test("ANNEN_PERSON: viser korrekt tekstinnhold i bekreftelsesboksen", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockPersonerMedFullmakt(page, [testPersonMedFullmakt]);

    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ANNEN_PERSON,
    );
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();

    await oversiktPage.assertBekreftelseBoksContentForRepresentasjonstype();
    await oversiktPage.assertBekreftelseCheckboxForRepresentasjonstypeIsVisible();
  });

  test("RADGIVER: viser korrekt tekstinnhold i bekreftelsesboksen", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [testArbeidsgiverOrganization],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockHentTilganger(page, [testArbeidsgiverOrganization]);
    await mockGetEregOrganisasjonMedJuridiskEnhet(
      page,
      testRadgiverfirmaOrganisasjon,
    );
    await mockPersonerMedFullmakt(page, [testPersonMedFullmakt]);

    const oversiktPage = new OversiktPage(page, Representasjonstype.RADGIVER);
    await oversiktPage.gotoWithRadgiver(testRadgiverfirmaOrgnr);
    await oversiktPage.assertIsVisible();

    await oversiktPage.assertBekreftelseBoksContentForRepresentasjonstype();
    await oversiktPage.assertBekreftelseCheckboxForRepresentasjonstypeIsVisible();
  });
});
