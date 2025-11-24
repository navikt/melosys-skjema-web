import { test } from "@playwright/test";

import {
  ArbeidssituasjonDto,
  DineOpplysningerDto,
  FamiliemedlemmerDto,
  SkatteforholdOgInntektDto,
  TilleggsopplysningerDto,
  UtenlandsoppdragetArbeidstakersDelDto,
} from "../../../src/types/melosysSkjemaTypes";
import {
  mockFetchArbeidstakerSkjema,
  setupApiMocksForArbeidstaker,
} from "../fixtures/api-mocks";
import {
  formFieldValues,
  testArbeidstakerSkjema,
  testUserInfo,
} from "../fixtures/test-data";
import { ArbeidstakerSkjemaVeiledningPage } from "../pages/skjema/arbeidstaker/arbeidstaker-skjema-veiledning.page";
import { DineOpplysningerStegPage } from "../pages/skjema/arbeidstaker/dine-opplysninger-steg.page";
import { FamiliemedlemmerStegPage } from "../pages/skjema/arbeidstaker/familiemedlemmer-steg.page";
import { OppsummeringStegPage } from "../pages/skjema/arbeidstaker/oppsummering-steg.page";
import { SkatteforholdOgInntektStegPage } from "../pages/skjema/arbeidstaker/skatteforhold-og-inntekt-steg.page";
import { TilleggsopplysningerStegPage } from "../pages/skjema/arbeidstaker/tilleggsopplysninger-steg.page";
import { UtenlandsoppdragetStegPage } from "../pages/skjema/arbeidstaker/utenlandsoppdraget-steg.page";
import { VedleggStegPage } from "../pages/skjema/arbeidstaker/vedlegg-steg.page";

test.describe("Arbeidstaker komplett flyt", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
  });

  // TODO: Update this test to use the new /oversikt flow instead of removed /rollevelger
  // The new flow requires selecting employer through /oversikt before starting application
  test.skip("skal velge rolle som arbeidstaker og starte søknad", async ({
    page,
  }) => {
    const veiledningPage = new ArbeidstakerSkjemaVeiledningPage(page);

    // TODO: Implement navigation through /oversikt for DEG_SELV flow
    // await oversiktPage.goto();
    // await oversiktPage.selectEmployer(testOrganization);
    // await oversiktPage.clickStartApplication();

    // Skal vise veiledningsside
    await veiledningPage.assertStartSoknadButtonVisible();
    await veiledningPage.startSoknad();

    await veiledningPage.assertNavigatedToDineOpplysninger(
      testArbeidstakerSkjema.id,
    );
  });

  // TODO: Denne testen navigerer direkte til skjema uten å gå gjennom ny /oversikt-flyt.
  // I ny flyt skal backend returnere arbeidstaker-data som del av skjema-konteksten,
  // slik at "dine opplysninger" steget vises som readonly/forhåndsutfylt.
  // Skriv ny test som:
  // 1. Går gjennom /oversikt → velg arbeidsgiver/arbeidstaker → opprett søknad
  // 2. Verifiserer at backend-data vises korrekt i skjemaet
  test.skip("skal fylle ut dine opplysninger steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const dineOpplysningerStegPage = new DineOpplysningerStegPage(
      page,
      testArbeidstakerSkjema,
    );

    // Naviger direkte til steget
    await dineOpplysningerStegPage.goto();

    await dineOpplysningerStegPage.assertIsVisible();

    // Verifiser at fødselsnummer-felter er forhåndsutfylt
    await dineOpplysningerStegPage.assertHarNorskFodselsnummerIsJa();
    await dineOpplysningerStegPage.assertFodselsnummerValue(
      testUserInfo.userId,
    );

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedDineOpplysningerPayload: DineOpplysningerDto = {
      harNorskFodselsnummer: true,
      fodselsnummer: testUserInfo.userId,
    };

    await dineOpplysningerStegPage.lagreOgFortsettAndExpectPayload(
      expectedDineOpplysningerPayload,
    );

    // Verifiser navigering til neste steg
    await dineOpplysningerStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut utenlandsoppdraget steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const utenlandsoppdragetStegPage = new UtenlandsoppdragetStegPage(
      page,
      testArbeidstakerSkjema,
    );

    // Naviger direkte til steget
    await utenlandsoppdragetStegPage.goto();

    await utenlandsoppdragetStegPage.assertIsVisible();

    // Svar på spørsmål
    await utenlandsoppdragetStegPage.utsendelsesLandCombobox.selectOption(
      formFieldValues.utsendelseLand,
    );

    await utenlandsoppdragetStegPage.fraDatoInput.fill(
      formFieldValues.periodeFra,
    );
    await utenlandsoppdragetStegPage.tilDatoInput.fill(
      formFieldValues.periodeTil,
    );

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedUtenlandsoppdragetPayload: UtenlandsoppdragetArbeidstakersDelDto =
      {
        utsendelsesLand: formFieldValues.utsendelseLand.value,
        utsendelseFraDato: formFieldValues.periodeFraIso,
        utsendelseTilDato: formFieldValues.periodeTilIso,
      };

    await utenlandsoppdragetStegPage.lagreOgFortsettAndExpectPayload(
      expectedUtenlandsoppdragetPayload,
    );

    // Verifiser navigering til neste steg
    await utenlandsoppdragetStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut skatteforhold og inntekt steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const skatteforholdOgInntektStegPage = new SkatteforholdOgInntektStegPage(
      page,
      testArbeidstakerSkjema,
    );

    // Naviger direkte til steget
    await skatteforholdOgInntektStegPage.goto();

    await skatteforholdOgInntektStegPage.assertIsVisible();

    // Svar på spørsmål
    await skatteforholdOgInntektStegPage.erSkattepliktigTilNorgeRadioGroup.JA.click();
    await skatteforholdOgInntektStegPage.mottarPengestotteFraAnnetEosLandRadioGroup.NEI.click();

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedSkatteforholdOgInntektPayload: SkatteforholdOgInntektDto = {
      erSkattepliktigTilNorgeIHeleutsendingsperioden: true,
      mottarPengestotteFraAnnetEosLandEllerSveits: false,
    };

    await skatteforholdOgInntektStegPage.lagreOgFortsettAndExpectPayload(
      expectedSkatteforholdOgInntektPayload,
    );

    // Verifiser navigering til neste steg
    await skatteforholdOgInntektStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut familiemedlemmer steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const familiemedlemmerStegPage = new FamiliemedlemmerStegPage(
      page,
      testArbeidstakerSkjema,
    );

    // Naviger direkte til steget
    await familiemedlemmerStegPage.goto();

    await familiemedlemmerStegPage.assertIsVisible();

    // Svar på spørsmål
    await familiemedlemmerStegPage.sokerForBarnUnder18RadioGroup.NEI.click();
    await familiemedlemmerStegPage.harEktefelleEllerBarnOver18RadioGroup.NEI.click();

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedFamiliemedlemmerPayload: FamiliemedlemmerDto = {
      sokerForBarnUnder18SomSkalVaereMed: false,
      harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad: false,
    };

    await familiemedlemmerStegPage.lagreOgFortsettAndExpectPayload(
      expectedFamiliemedlemmerPayload,
    );

    // Verifiser navigering til neste steg
    await familiemedlemmerStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut tilleggsopplysninger steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const tilleggsopplysningerStegPage = new TilleggsopplysningerStegPage(
      page,
      testArbeidstakerSkjema,
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

    // Verifiser navigering til neste steg
    await tilleggsopplysningerStegPage.assertNavigatedToNextStep();
  });

  test("skal navigere gjennom vedlegg steg", async ({ page }) => {
    const vedleggStegPage = new VedleggStegPage(page, testArbeidstakerSkjema);

    // Naviger direkte til steget
    await vedleggStegPage.goto();

    await vedleggStegPage.assertIsVisible();

    // Lagre og fortsett (ingen API kall for vedlegg ennå)
    await vedleggStegPage.lagreOgFortsett();

    // Verifiser navigering til neste steg
    await vedleggStegPage.assertNavigatedToNextStep();
  });

  test("Oppsummering viser alle utfylte data fra tidligere steg", async ({
    page,
  }) => {
    const dineOpplysningerData: DineOpplysningerDto = {
      harNorskFodselsnummer: true,
      fodselsnummer: testUserInfo.userId,
      fornavn: formFieldValues.fornavn,
      etternavn: formFieldValues.etternavn,
      fodselsdato: formFieldValues.periodeFraIso,
    };

    const utenlandsoppdragetData: UtenlandsoppdragetArbeidstakersDelDto = {
      utsendelsesLand: formFieldValues.utsendelseLand.value,
      utsendelseFraDato: formFieldValues.periodeFraIso,
      utsendelseTilDato: formFieldValues.periodeTilIso,
    };

    const arbeidssituasjonData: ArbeidssituasjonDto = {
      harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
      skalJobbeForFlereVirksomheter: false,
    };

    const familiemedlemmerData: FamiliemedlemmerDto = {
      sokerForBarnUnder18SomSkalVaereMed: false,
      harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad: false,
    };

    const skatteforholdOgInntektData: SkatteforholdOgInntektDto = {
      erSkattepliktigTilNorgeIHeleutsendingsperioden: true,
      mottarPengestotteFraAnnetEosLandEllerSveits: false,
    };

    const tilleggsopplysningerData: TilleggsopplysningerDto = {
      harFlereOpplysningerTilSoknaden: false,
    };

    // Mock komplett skjema data for oppsummering
    await mockFetchArbeidstakerSkjema(page, {
      ...testArbeidstakerSkjema,
      data: {
        arbeidstakeren: dineOpplysningerData,
        arbeidssituasjon: arbeidssituasjonData,
        utenlandsoppdraget: utenlandsoppdragetData,
        familiemedlemmer: familiemedlemmerData,
        skatteforholdOgInntekt: skatteforholdOgInntektData,
        tilleggsopplysninger: tilleggsopplysningerData,
      },
    });

    const oppsummeringPage = new OppsummeringStegPage(
      page,
      testArbeidstakerSkjema,
    );

    // Naviger direkte til oppsummering
    await oppsummeringPage.goto();

    // Verifiser at oppsummeringssiden vises
    await oppsummeringPage.assertIsVisible();

    // Verifiser data fra dine opplysninger-steget
    await oppsummeringPage.assertDineOpplysningerData(dineOpplysningerData);

    // Verifiser data fra arbeidssituasjon-steget
    await oppsummeringPage.assertArbeidssituasjonData(arbeidssituasjonData);

    // Verifiser data fra utenlandsoppdraget-steget
    await oppsummeringPage.assertUtenlandsoppdragetData(utenlandsoppdragetData);

    // Verifiser data fra skatteforhold og inntekt-steget
    await oppsummeringPage.assertSkatteforholdOgInntektData(
      skatteforholdOgInntektData,
    );

    // Verifiser data fra familiemedlemmer-steget
    await oppsummeringPage.assertFamiliemedlemmerData(familiemedlemmerData);

    // Verifiser data fra tilleggsopplysninger-steget
    await oppsummeringPage.assertTilleggsopplysningerData(
      tilleggsopplysningerData,
    );
  });
});
