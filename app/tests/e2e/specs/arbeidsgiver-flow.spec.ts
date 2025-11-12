import { test } from "@playwright/test";

import {
  ArbeidsgiverenDto,
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidsstedIUtlandetDto,
  ArbeidstakerenArbeidsgiversDelDto,
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
import { RollevelgerPage } from "../pages/rollevelger/rollevelger.page";
import { ArbeidsgiverSkjemaVeiledningPage } from "../pages/skjema/arbeidsgiver/arbeidsgiver-skjema-veiledning.page";
import { ArbeidsgiverenStegPage } from "../pages/skjema/arbeidsgiver/arbeidsgiveren-steg.page";
import { ArbeidsgiverensVirksomhetINorgeStegPage } from "../pages/skjema/arbeidsgiver/arbeidsgiverens-virksomhet-i-norge-steg.page";
import { ArbeidsstedIUtlandetStegPage } from "../pages/skjema/arbeidsgiver/arbeidssted-i-utlandet-steg.page";
import { ArbeidstakerenStegPage } from "../pages/skjema/arbeidsgiver/arbeidstakeren-steg.page";
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

  test("skal velge rolle som arbeidsgiver og starte søknad", async ({
    page,
  }) => {
    const rollevelgerPage = new RollevelgerPage(page);
    const veiledningPage = new ArbeidsgiverSkjemaVeiledningPage(page);

    // Start fra rollevelger og velg organisasjons
    await rollevelgerPage.goto();

    // Velg test organisasjonen (navigerer direkte)
    await rollevelgerPage.selectOrganization(testOrganization.navn);

    // Skal vise veiledningsside
    await veiledningPage.assertStartSoknadButtonVisible();
    await veiledningPage.startSoknad();

    await veiledningPage.assertNavigatedToArbeidsgiveren(
      testArbeidsgiverSkjema.id,
    );
  });

  test("skal fylle ut arbeidsgiveren steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const arbeidsgiverStegPage = new ArbeidsgiverenStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Sett valgt rolle i session storage
    await arbeidsgiverStegPage.setValgtRolle(testOrganization);

    // Naviger direkte til steget
    await arbeidsgiverStegPage.goto();

    await arbeidsgiverStegPage.assertIsVisible();

    // Verifiser at organisasjonsnummer er forhåndsutfylt
    await arbeidsgiverStegPage.assertOrganisasjonsnummerValue(
      testOrganization.orgnr,
    );

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedArbeidsgiverPayload: ArbeidsgiverenDto = {
      organisasjonsnummer: testOrganization.orgnr,
      organisasjonNavn: testOrganization.navn,
    };

    await arbeidsgiverStegPage.lagreOgFortsettAndExpectPayload(
      expectedArbeidsgiverPayload,
    );

    // Verifiser navigerering til neste steg
    await arbeidsgiverStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut arbeidstakeren steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const arbeidstakerenStegPage = new ArbeidstakerenStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Naviger direkte til steget
    await arbeidstakerenStegPage.goto();

    await arbeidstakerenStegPage.assertIsVisible();

    // Fyll ut fødselsnummer
    await arbeidstakerenStegPage.fillFodselsnummer("12345678901");

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedArbeidstakerPayload: ArbeidstakerenArbeidsgiversDelDto = {
      fodselsnummer: "12345678901",
    };

    await arbeidstakerenStegPage.lagreOgFortsettAndExpectPayload(
      expectedArbeidstakerPayload,
    );

    // Verifiser navigerering til neste steg
    await arbeidstakerenStegPage.assertNavigatedToNextStep();
  });

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
    await utenlandsoppdragetStegPage.fraDatoInput.fill(
      formFieldValues.periodeFra,
    );
    await utenlandsoppdragetStegPage.tilDatoInput.fill(
      formFieldValues.periodeTil,
    );

    await utenlandsoppdragetStegPage.arbeidsgiverHarOppdragILandetRadioGroup.JA.click();
    await utenlandsoppdragetStegPage.arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup.NEI.click();
    await utenlandsoppdragetStegPage.arbeidstakerForblirAnsattIHelePeriodenRadioGroup.JA.click();
    await utenlandsoppdragetStegPage.arbeidstakerErstatterAnnenPersonRadioGroup.NEI.click();

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedUtenlandsoppdragetPayload: UtenlandsoppdragetDto = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      arbeidstakerUtsendelseFraDato: formFieldValues.periodeFraIso,
      arbeidstakerUtsendelseTilDato: formFieldValues.periodeTilIso,
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

    const arbeidsgiverenData: ArbeidsgiverenDto = {
      organisasjonsnummer: testOrganization.orgnr,
      organisasjonNavn: testOrganization.navn,
    };

    const arbeidsgiverensVirksomhetINorgeData: ArbeidsgiverensVirksomhetINorgeDto =
      {
        erArbeidsgiverenOffentligVirksomhet: false,
        erArbeidsgiverenBemanningsEllerVikarbyraa: false,
        opprettholderArbeidsgiverenVanligDrift: true,
      };

    const utenlandsoppdragetData: UtenlandsoppdragetDto = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      arbeidstakerUtsendelseFraDato: formFieldValues.periodeFraIso,
      arbeidstakerUtsendelseTilDato: formFieldValues.periodeTilIso,
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
        arbeidsgiveren: arbeidsgiverenData,
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
    await oppsummeringStegPage.assertArbeidsgiverenData(arbeidsgiverenData);
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
