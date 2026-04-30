import { Representasjonstype } from "~/types/melosysSkjemaTypes";

import {
  interceptOpprettSoknad,
  mockGetEregOrganisasjonMedJuridiskEnhet,
  mockHentTilganger,
  mockPersonerMedFullmakt,
  mockVerifiserPerson,
  setupApiMocksForOversikt,
} from "../fixtures/api-mocks";
import { expect, test } from "../fixtures/test";
import {
  emptyInnsendteSoknader,
  emptyUtkastListe,
  korrektFormatertOrgnr,
  testArbeidsgiverOrganization,
  testArbeidstakerUtenFullmakt,
  testEregOrganisasjon,
  testInnsendteSoknader,
  testOpprettSoknadResponseId,
  testOrganization,
  testPersonMedFullmakt,
  testRadgiverfirmaOrganisasjon,
  testRadgiverfirmaOrgnr,
  testUserInfo,
  testUtkastListe,
  testVerifiserPersonResponse,
} from "../fixtures/test-data";
import { OversiktPage } from "../pages/oversikt/oversikt.page";

test.describe("Oversikt", () => {
  test("Viser oversiktssiden for DEG_SELV med start-søknad-knapp", async ({
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
    await oversiktPage.assertStartSoknadVisible();
  });

  test("Viser utkastliste når det finnes påbegynte søknader", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      testUtkastListe,
      emptyInnsendteSoknader,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertUtkastListVisible();
  });

  test("Viser innsendte søknader-tabell når det finnes innsendte søknader", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [testOrganization],
      emptyUtkastListe,
      testInnsendteSoknader,
    );

    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ARBEIDSGIVER,
    );
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertHistorikkVisible();
  });

  test("Viser start-søknad-skjema med arbeidsgivervalg for ARBEIDSGIVER", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [testOrganization],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockHentTilganger(page, [testOrganization]);

    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ARBEIDSGIVER,
    );
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertStartSoknadVisible();
  });
});

test.describe("Oversikt — Start søknad POST-payload", () => {
  test("DEG_SELV: sender korrekt payload med arbeidstaker fra innlogget bruker", async ({
    page,
  }) => {
    // Setup mocks
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockGetEregOrganisasjonMedJuridiskEnhet(page, testEregOrganisasjon);
    await mockPersonerMedFullmakt(page, []);
    const requestBodyPromise = interceptOpprettSoknad(
      page,
      testOpprettSoknadResponseId,
    );

    // Navigate and fill form
    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();

    // Type valid org number — OrganisasjonSoker auto-fires lookup on 9 digits
    await oversiktPage.fillArbeidsgiverOrgnr(korrektFormatertOrgnr);
    await oversiktPage.waitForOrgLookup(
      testEregOrganisasjon.juridiskEnhet.navn,
    );
    await oversiktPage.checkBekreftelseCheckbox();

    // Submit
    await oversiktPage.clickStartSoknad();
    const requestBody = await requestBodyPromise;

    // Assert POST payload
    expect(requestBody).toEqual({
      representasjonstype: Representasjonstype.DEG_SELV,
      arbeidsgiver: {
        orgnr: testEregOrganisasjon.juridiskEnhet.orgnr,
        navn: testEregOrganisasjon.juridiskEnhet.navn,
      },
      arbeidstaker: {
        fnr: testUserInfo.userId,
        etternavn: testUserInfo.name,
      },
    });
  });

  test("ARBEIDSGIVER uten fullmakt: sender korrekt payload med manuelt oppgitt arbeidstaker", async ({
    page,
  }) => {
    // Setup mocks
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [testArbeidsgiverOrganization],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockHentTilganger(page, [testArbeidsgiverOrganization]);
    await mockPersonerMedFullmakt(page, []);
    await mockVerifiserPerson(page, testVerifiserPersonResponse);
    const requestBodyPromise = interceptOpprettSoknad(
      page,
      testOpprettSoknadResponseId,
    );

    // Navigate
    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ARBEIDSGIVER,
    );
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();

    // Single arbeidsgiver is pre-selected (only one in Altinn list)
    // Select "Nei" for fullmakt radio
    await oversiktPage.selectSkalFylleUtNei();

    // Fill arbeidstaker fnr + etternavn and click Søk
    await oversiktPage.fillArbeidstakerUtenFullmakt(
      testArbeidstakerUtenFullmakt.fnr,
      testArbeidstakerUtenFullmakt.etternavn,
    );
    await oversiktPage.waitForPersonVerified(testVerifiserPersonResponse.navn);
    await oversiktPage.checkBekreftelseCheckbox();

    // Submit
    await oversiktPage.clickStartSoknad();
    const requestBody = await requestBodyPromise;

    // Assert POST payload — skalFylleUtForArbeidstaker=false means no fullmakt transform
    expect(requestBody).toEqual({
      representasjonstype: Representasjonstype.ARBEIDSGIVER,
      arbeidsgiver: {
        orgnr: testArbeidsgiverOrganization.orgnr,
        navn: testArbeidsgiverOrganization.navn,
      },
      arbeidstaker: {
        fnr: testArbeidstakerUtenFullmakt.fnr,
        etternavn: testArbeidstakerUtenFullmakt.etternavn,
      },
    });
  });

  test("ARBEIDSGIVER med fullmakt: sender korrekt payload med fullmaktsarbeidstaker", async ({
    page,
  }) => {
    // Setup mocks
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [testArbeidsgiverOrganization],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockHentTilganger(page, [testArbeidsgiverOrganization]);
    await mockPersonerMedFullmakt(page, [testPersonMedFullmakt]);
    const requestBodyPromise = interceptOpprettSoknad(
      page,
      testOpprettSoknadResponseId,
    );

    // Navigate
    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ARBEIDSGIVER,
    );
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();

    // Select "Ja" for fullmakt radio
    await oversiktPage.selectSkalFylleUtJa();

    // Select person from fullmakt combobox
    await oversiktPage.selectArbeidstakerMedFullmakt(
      testPersonMedFullmakt.navn,
    );
    await oversiktPage.checkBekreftelseCheckbox();

    // Submit
    await oversiktPage.clickStartSoknad();
    const requestBody = await requestBodyPromise;

    // Assert POST payload — skalFylleUtForArbeidstaker=true triggers ARBEIDSGIVER_MED_FULLMAKT
    expect(requestBody).toEqual({
      representasjonstype: Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT,
      arbeidsgiver: {
        orgnr: testArbeidsgiverOrganization.orgnr,
        navn: testArbeidsgiverOrganization.navn,
      },
      arbeidstaker: {
        fnr: testPersonMedFullmakt.fnr,
        etternavn: testPersonMedFullmakt.navn,
      },
    });
  });

  test("RÅDGIVER uten fullmakt: sender korrekt payload med rådgiverfirma", async ({
    page,
  }) => {
    // Setup mocks
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
    await mockPersonerMedFullmakt(page, []);
    await mockVerifiserPerson(page, testVerifiserPersonResponse);
    const requestBodyPromise = interceptOpprettSoknad(
      page,
      testOpprettSoknadResponseId,
    );

    // Navigate with rådgiver context
    const oversiktPage = new OversiktPage(page, Representasjonstype.RADGIVER);
    await oversiktPage.gotoWithRadgiver(testRadgiverfirmaOrgnr);
    await oversiktPage.assertIsVisible();

    // Select arbeidsgiver from combobox
    await oversiktPage.selectArbeidsgiver(testArbeidsgiverOrganization.navn);

    // Select "Nei" for fullmakt radio (RÅDGIVER defaults to Ja, so we switch to Nei)
    await oversiktPage.selectSkalFylleUtNei();

    // Fill arbeidstaker manually
    await oversiktPage.fillArbeidstakerUtenFullmakt(
      testArbeidstakerUtenFullmakt.fnr,
      testArbeidstakerUtenFullmakt.etternavn,
    );
    await oversiktPage.waitForPersonVerified(testVerifiserPersonResponse.navn);
    await oversiktPage.checkBekreftelseCheckbox();

    // Submit
    await oversiktPage.clickStartSoknad();
    const requestBody = await requestBodyPromise;

    // Assert POST payload — includes radgiverfirma, no fullmakt transform
    expect(requestBody).toEqual({
      representasjonstype: Representasjonstype.RADGIVER,
      radgiverfirma: {
        orgnr: testRadgiverfirmaOrganisasjon.juridiskEnhet.orgnr,
        navn: testRadgiverfirmaOrganisasjon.juridiskEnhet.navn,
      },
      arbeidsgiver: {
        orgnr: testArbeidsgiverOrganization.orgnr,
        navn: testArbeidsgiverOrganization.navn,
      },
      arbeidstaker: {
        fnr: testArbeidstakerUtenFullmakt.fnr,
        etternavn: testArbeidstakerUtenFullmakt.etternavn,
      },
    });
  });

  test("RÅDGIVER med fullmakt: sender korrekt payload med fullmaktsarbeidstaker og rådgiverfirma", async ({
    page,
  }) => {
    // Setup mocks
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
    const requestBodyPromise = interceptOpprettSoknad(
      page,
      testOpprettSoknadResponseId,
    );

    // Navigate with rådgiver context
    const oversiktPage = new OversiktPage(page, Representasjonstype.RADGIVER);
    await oversiktPage.gotoWithRadgiver(testRadgiverfirmaOrgnr);
    await oversiktPage.assertIsVisible();

    // Select arbeidsgiver from combobox
    await oversiktPage.selectArbeidsgiver(testArbeidsgiverOrganization.navn);

    // RÅDGIVER defaults to skalFylleUtForArbeidstaker=true, so "Ja" is pre-selected
    // Select person from fullmakt combobox
    await oversiktPage.selectArbeidstakerMedFullmakt(
      testPersonMedFullmakt.navn,
    );
    await oversiktPage.checkBekreftelseCheckbox();

    // Submit
    await oversiktPage.clickStartSoknad();
    const requestBody = await requestBodyPromise;

    // Assert POST payload — includes radgiverfirma, fullmakt transform applies
    expect(requestBody).toEqual({
      representasjonstype: Representasjonstype.RADGIVER_MED_FULLMAKT,
      radgiverfirma: {
        orgnr: testRadgiverfirmaOrganisasjon.juridiskEnhet.orgnr,
        navn: testRadgiverfirmaOrganisasjon.juridiskEnhet.navn,
      },
      arbeidsgiver: {
        orgnr: testArbeidsgiverOrganization.orgnr,
        navn: testArbeidsgiverOrganization.navn,
      },
      arbeidstaker: {
        fnr: testPersonMedFullmakt.fnr,
        etternavn: testPersonMedFullmakt.navn,
      },
    });
  });
});
