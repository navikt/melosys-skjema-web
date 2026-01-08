import { test } from "@playwright/test";

import {
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidsstedIUtlandetDto,
  ArbeidstakerensLonnDto,
  TilleggsopplysningerDto,
  UtenlandsoppdragetDto,
} from "../../../src/types/melosysSkjemaTypes";
import {
  mockFetchArbeidsgiverSkjema,
  setupApiMocksForArbeidsgiver,
} from "../fixtures/api-mocks";
import {
  formFieldValues,
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../fixtures/test-data";
import { ArbeidsgiverensVirksomhetINorgeStegPage } from "../pages/skjema/arbeidsgiver/arbeidsgiverens-virksomhet-i-norge-steg.page";
import { ArbeidsstedIUtlandetStegPage } from "../pages/skjema/arbeidsgiver/arbeidssted-i-utlandet-steg.page";
import { ArbeidstakerensLonnStegPage } from "../pages/skjema/arbeidsgiver/arbeidstakerens-lonn-steg.page";
import { OppsummeringStegPage } from "../pages/skjema/arbeidsgiver/oppsummering-steg.page";
import { TilleggsopplysningerStegPage } from "../pages/skjema/arbeidsgiver/tilleggsopplysninger-steg.page";
import { UtenlandsoppdragetStegPage } from "../pages/skjema/arbeidsgiver/utenlandsoppdraget-steg.page";
import { VedleggStegPage } from "../pages/skjema/arbeidsgiver/vedlegg-steg.page";

test.describe("Arbeidsgiver komplett flyt", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
  });

  // TODO: Update this test to use the new /oversikt flow instead of removed /rollevelger

  test("skal fylle ut arbeidsgiverens virksomhet i Norge steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const virksomhetStegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Sett opp mock slik at steget ikke automatisk navigerer tilbake til arbeidsgiveren-steg, innholdet i arbeidsgiveren data her har ikke noe å si atm.
    await virksomhetStegPage.mockArbeidsgiverenStegData({
      organisasjonsnummer: testOrganization.orgnr,
      organisasjonNavn: testOrganization.navn,
    });

    // Naviger direkte til steget
    await virksomhetStegPage.goto();

    await virksomhetStegPage.assertIsVisible();

    // Svar på spørsmål
    await virksomhetStegPage.offentligVirksomhetRadioGroup.NEI.click();
    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.NEI.click();
    await virksomhetStegPage.vanligDriftRadioGroup.JA.click();

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedVirksomhetPayload: ArbeidsgiverensVirksomhetINorgeDto = {
      erArbeidsgiverenOffentligVirksomhet: false,
      erArbeidsgiverenBemanningsEllerVikarbyraa: false,
      opprettholderArbeidsgiverenVanligDrift: true,
    };

    await virksomhetStegPage.lagreOgFortsettAndExpectPayload(
      expectedVirksomhetPayload,
    );

    // Verifiser navigerering til neste steg
    await virksomhetStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut utenlandsoppdraget steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const utenlandsoppdragetStegPage = new UtenlandsoppdragetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Naviger direkte til steget
    await utenlandsoppdragetStegPage.goto();

    await utenlandsoppdragetStegPage.assertIsVisible();

    // Svar på spørsmål
    await utenlandsoppdragetStegPage.utsendelseLandCombobox.selectOption(
      formFieldValues.utsendelseLand,
    );
    await utenlandsoppdragetStegPage.fillFraDato(formFieldValues.periodeFra);
    await utenlandsoppdragetStegPage.fillTilDato(formFieldValues.periodeTil);

    await utenlandsoppdragetStegPage.arbeidsgiverHarOppdragILandetRadioGroup.JA.click();
    await utenlandsoppdragetStegPage.arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup.NEI.click();
    await utenlandsoppdragetStegPage.arbeidstakerForblirAnsattIHelePeriodenRadioGroup.JA.click();
    await utenlandsoppdragetStegPage.arbeidstakerErstatterAnnenPersonRadioGroup.NEI.click();

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedUtenlandsoppdragetPayload: UtenlandsoppdragetDto = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      arbeidstakerUtsendelsePeriode: formFieldValues.periode,
      arbeidsgiverHarOppdragILandet: true,
      arbeidstakerBleAnsattForUtenlandsoppdraget: false,
      arbeidstakerForblirAnsattIHelePerioden: true,
      arbeidstakerErstatterAnnenPerson: false,
    };

    await utenlandsoppdragetStegPage.lagreOgFortsettAndExpectPayload(
      expectedUtenlandsoppdragetPayload,
    );

    // Verifiser navigerering til neste steg
    await utenlandsoppdragetStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut arbeidssted i utlandet steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const arbeidsstedIUtlandetStegPage = new ArbeidsstedIUtlandetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Naviger direkte til steget
    await arbeidsstedIUtlandetStegPage.goto();

    await arbeidsstedIUtlandetStegPage.assertIsVisible();

    // Velg "På land" som arbeidssted type
    await arbeidsstedIUtlandetStegPage.arbeidsstedTypeSelect.selectOption(
      "PA_LAND",
    );

    // Velg fast arbeidssted
    await arbeidsstedIUtlandetStegPage.fastEllerVekslendeRadioGroup.FAST.click();

    // Fyll ut adresse
    await arbeidsstedIUtlandetStegPage.vegadresseInput.fill("Storgata");
    await arbeidsstedIUtlandetStegPage.nummerInput.fill("1");
    await arbeidsstedIUtlandetStegPage.postkodeInput.fill("0123");
    await arbeidsstedIUtlandetStegPage.byStedInput.fill("Stockholm");

    // Svar nei på hjemmekontor
    await arbeidsstedIUtlandetStegPage.erHjemmekontorRadioGroup.NEI.click();

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedArbeidsstedIUtlandetPayload: ArbeidsstedIUtlandetDto = {
      arbeidsstedType: "PA_LAND",
      paLand: {
        fastEllerVekslendeArbeidssted: "FAST",
        fastArbeidssted: {
          vegadresse: "Storgata",
          nummer: "1",
          postkode: "0123",
          bySted: "Stockholm",
        },
        erHjemmekontor: false,
      },
    };

    await arbeidsstedIUtlandetStegPage.lagreOgFortsettAndExpectPayload(
      expectedArbeidsstedIUtlandetPayload,
    );

    // Verifiser navigerering til neste steg
    await arbeidsstedIUtlandetStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut arbeidstakerens lønn steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const arbeidstakerensLonnStegPage = new ArbeidstakerensLonnStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Naviger direkte til steget
    await arbeidstakerensLonnStegPage.goto();

    await arbeidstakerensLonnStegPage.assertIsVisible();

    // Svar på spørsmål
    await arbeidstakerensLonnStegPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.JA.click();

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedArbeidstakerensLonnPayload: ArbeidstakerensLonnDto = {
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: true,
    };

    await arbeidstakerensLonnStegPage.lagreOgFortsettAndExpectPayload(
      expectedArbeidstakerensLonnPayload,
    );

    // Verifiser navigerering til neste steg
    await arbeidstakerensLonnStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut tilleggsopplysninger steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const tilleggsopplysningerStegPage = new TilleggsopplysningerStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Naviger direkte til steget
    await tilleggsopplysningerStegPage.goto();

    await tilleggsopplysningerStegPage.assertIsVisible();

    // Svar på spørsmål
    await tilleggsopplysningerStegPage.harFlereOpplysningerRadioGroup.NEI.click();

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedTilleggsopplysningerPayload: TilleggsopplysningerDto = {
      harFlereOpplysningerTilSoknaden: false,
    };

    await tilleggsopplysningerStegPage.lagreOgFortsettAndExpectPayload(
      expectedTilleggsopplysningerPayload,
    );

    // Verifiser navigerering til neste steg
    await tilleggsopplysningerStegPage.assertNavigatedToNextStep();
  });

  test("skal navigere gjennom vedlegg steg", async ({ page }) => {
    const vedleggStegPage = new VedleggStegPage(page, testArbeidsgiverSkjema);

    // Naviger direkte til steget
    await vedleggStegPage.goto();

    await vedleggStegPage.assertIsVisible();

    // Lagre og fortsett (ingen API kall for vedlegg ennå)
    await vedleggStegPage.lagreOgFortsett();

    // Verifiser navigerering til neste steg
    await vedleggStegPage.assertNavigatedToNextStep();
  });

  test("Oppsummering viser alle utfylte data fra tidligere steg", async ({
    page,
  }) => {
    const oppsummeringStegPage = new OppsummeringStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    const arbeidsgiverensVirksomhetINorgeData: ArbeidsgiverensVirksomhetINorgeDto =
      {
        erArbeidsgiverenOffentligVirksomhet: false,
        erArbeidsgiverenBemanningsEllerVikarbyraa: false,
        opprettholderArbeidsgiverenVanligDrift: true,
      };

    const utenlandsoppdragetData: UtenlandsoppdragetDto = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      arbeidstakerUtsendelsePeriode: formFieldValues.periode,
      arbeidsgiverHarOppdragILandet: true,
      arbeidstakerBleAnsattForUtenlandsoppdraget: false,
      arbeidstakerForblirAnsattIHelePerioden: true,
      arbeidstakerErstatterAnnenPerson: false,
    };

    const arbeidsstedIUtlandetData: ArbeidsstedIUtlandetDto = {
      arbeidsstedType: "PA_LAND",
      paLand: {
        fastEllerVekslendeArbeidssted: "FAST",
        fastArbeidssted: {
          vegadresse: "Storgata",
          nummer: "1",
          postkode: "0123",
          bySted: "Stockholm",
        },
        erHjemmekontor: false,
      },
    };

    const arbeidstakerensLonnData: ArbeidstakerensLonnDto = {
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: true,
    };

    const tilleggsopplysningerData: TilleggsopplysningerDto = {
      harFlereOpplysningerTilSoknaden: false,
    };

    // Mock komplett skjema data for oppsummering
    await mockFetchArbeidsgiverSkjema(page, {
      ...testArbeidsgiverSkjema,
      data: {
        arbeidsgiverensVirksomhetINorge: arbeidsgiverensVirksomhetINorgeData,
        utenlandsoppdraget: utenlandsoppdragetData,
        arbeidsstedIUtlandet: arbeidsstedIUtlandetData,
        arbeidstakerensLonn: arbeidstakerensLonnData,
        tilleggsopplysninger: tilleggsopplysningerData,
      },
    });

    // Naviger direkte til oppsummering
    await oppsummeringStegPage.goto();

    await oppsummeringStegPage.assertIsVisible();

    // Verifiser at oppsummeringen viser utfylte data
    await oppsummeringStegPage.assertArbeidsgiverensVirksomhetINorgeData(
      arbeidsgiverensVirksomhetINorgeData,
    );
    await oppsummeringStegPage.assertUtenlandsoppdragetData(
      utenlandsoppdragetData,
    );
    await oppsummeringStegPage.assertArbeidsstedIUtlandetData(
      arbeidsstedIUtlandetData,
    );
    await oppsummeringStegPage.assertArbeidstakerensLonnData(
      arbeidstakerensLonnData,
    );
    await oppsummeringStegPage.assertTilleggsopplysningerData(
      tilleggsopplysningerData,
    );
  });
});
