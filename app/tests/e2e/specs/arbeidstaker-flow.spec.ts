import { test } from "@playwright/test";

import {
  ArbeidssituasjonDto,
  FamiliemedlemmerDto,
  SkatteforholdOgInntektDto,
  TilleggsopplysningerDto,
  UtsendingsperiodeOgLandDto,
  type UtsendtArbeidstakerSkjemaDto,
} from "../../../src/types/melosysSkjemaTypes";
import {
  mockFetchSkjema,
  setupApiMocksForArbeidstaker,
} from "../fixtures/api-mocks";
import {
  formFieldValues,
  testArbeidstakerSkjema,
  testUserInfo,
} from "../fixtures/test-data";
import { ArbeidstakerSkjemaVeiledningPage } from "../pages/skjema/arbeidstaker/arbeidstaker-skjema-veiledning.page";
import { FamiliemedlemmerStegPage } from "../pages/skjema/arbeidstaker/familiemedlemmer-steg.page";
import { OppsummeringStegPage } from "../pages/skjema/arbeidstaker/oppsummering-steg.page";
import { SkatteforholdOgInntektStegPage } from "../pages/skjema/arbeidstaker/skatteforhold-og-inntekt-steg.page";
import { TilleggsopplysningerStegPage } from "../pages/skjema/arbeidstaker/tilleggsopplysninger-steg.page";
import { UtsendingsperiodeOgLandStegPage } from "../pages/skjema/arbeidstaker/utsendingsperiode-og-land-steg.page";
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

    await veiledningPage.assertNavigatedToUtsendingsperiodeOgLand(
      testArbeidstakerSkjema.id,
    );
  });

  test("skal fylle ut utsendingsperiode og land steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const utsendingsperiodeOgLandStegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testArbeidstakerSkjema,
    );

    // Naviger direkte til steget
    await utsendingsperiodeOgLandStegPage.goto();

    await utsendingsperiodeOgLandStegPage.assertIsVisible();

    // Svar på spørsmål
    await utsendingsperiodeOgLandStegPage.utsendelseLandCombobox.selectOption(
      formFieldValues.utsendelseLand,
    );

    await utsendingsperiodeOgLandStegPage.fillFraDato(
      formFieldValues.periodeFra,
    );
    await utsendingsperiodeOgLandStegPage.fillTilDato(
      formFieldValues.periodeTil,
    );

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedUtsendingsperiodeOgLandPayload: UtsendingsperiodeOgLandDto = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      utsendelsePeriode: formFieldValues.periode,
    };

    await utsendingsperiodeOgLandStegPage.lagreOgFortsettAndExpectPayload(
      expectedUtsendingsperiodeOgLandPayload,
    );

    // Verifiser navigering til neste steg
    await utsendingsperiodeOgLandStegPage.assertNavigatedToNextStep();
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
    await familiemedlemmerStegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.NEI.click();

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedFamiliemedlemmerPayload: FamiliemedlemmerDto = {
      skalHaMedFamiliemedlemmer: false,
      familiemedlemmer: [],
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
    const utsendingsperiodeOgLandData: UtsendingsperiodeOgLandDto = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      utsendelsePeriode: formFieldValues.periode,
    };

    const arbeidssituasjonData: ArbeidssituasjonDto = {
      harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
      skalJobbeForFlereVirksomheter: false,
    };

    const familiemedlemmerData: FamiliemedlemmerDto = {
      skalHaMedFamiliemedlemmer: false,
      familiemedlemmer: [],
    };

    const skatteforholdOgInntektData: SkatteforholdOgInntektDto = {
      erSkattepliktigTilNorgeIHeleutsendingsperioden: true,
      mottarPengestotteFraAnnetEosLandEllerSveits: false,
    };

    const tilleggsopplysningerData: TilleggsopplysningerDto = {
      harFlereOpplysningerTilSoknaden: false,
    };

    // Mock komplett skjema data for oppsummering
    await mockFetchSkjema(page, {
      ...testArbeidstakerSkjema,
      data: {
        type: "UTSENDT_ARBEIDSTAKER_ARBEIDSTAKERS_DEL",
        arbeidssituasjon: arbeidssituasjonData,
        utsendingsperiodeOgLand: utsendingsperiodeOgLandData,
        familiemedlemmer: familiemedlemmerData,
        skatteforholdOgInntekt: skatteforholdOgInntektData,
        tilleggsopplysninger: tilleggsopplysningerData,
      } as UtsendtArbeidstakerSkjemaDto["data"],
    });

    const oppsummeringPage = new OppsummeringStegPage(
      page,
      testArbeidstakerSkjema,
    );

    // Naviger direkte til oppsummering
    await oppsummeringPage.goto();

    // Verifiser at oppsummeringssiden vises
    await oppsummeringPage.assertIsVisible();

    // Verifiser data fra arbeidssituasjon-steget
    await oppsummeringPage.assertArbeidssituasjonData(arbeidssituasjonData);

    // Verifiser data fra utsendingsperiode og land-steget
    await oppsummeringPage.assertUtsendingsperiodeOgLandData(
      utsendingsperiodeOgLandData,
    );

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

    await oppsummeringPage.sendInnAndExpectPost();

    await oppsummeringPage.assertNavigatedToKvittering();
  });
});
