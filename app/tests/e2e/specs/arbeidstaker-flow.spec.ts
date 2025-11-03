import { test } from "@playwright/test";

import {
  ArbeidstakerenDto,
  FamiliemedlemmerDto,
  SkatteforholdOgInntektDto,
  TilleggsopplysningerDto,
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
import { RollevelgerPage } from "../pages/rollevelger/rollevelger.page";
import { ArbeidstakerSkjemaVeiledningPage } from "../pages/skjema/arbeidstaker/arbeidstaker-skjema-veiledning.page";
import { ArbeidstakerenStegPage } from "../pages/skjema/arbeidstaker/arbeidstakeren-steg.page";
import { FamiliemedlemmerStegPage } from "../pages/skjema/arbeidstaker/familiemedlemmer-steg.page";
import { OppsummeringStegPage } from "../pages/skjema/arbeidstaker/oppsummering-steg.page";
import { SkatteforholdOgInntektStegPage } from "../pages/skjema/arbeidstaker/skatteforhold-og-inntekt-steg.page";
import { TilleggsopplysningerStegPage } from "../pages/skjema/arbeidstaker/tilleggsopplysninger-steg.page";

test.describe("Arbeidstaker komplett flyt", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
  });

  test("skal velge rolle som arbeidstaker og starte søknad", async ({
    page,
  }) => {
    const rollevelgerPage = new RollevelgerPage(page);
    const veiledningPage = new ArbeidstakerSkjemaVeiledningPage(page);

    // Start fra rollevelger og velg arbeidstaker
    await rollevelgerPage.goto();

    // Velg arbeidstaker (navigerer direkte)
    await rollevelgerPage.selectArbeidstaker(testUserInfo.name);

    // Skal vise veiledningsside
    await veiledningPage.assertStartSoknadButtonVisible();
    await veiledningPage.startSoknad();

    await veiledningPage.assertNavigatedToArbeidstakeren(
      testArbeidstakerSkjema.id,
    );
  });

  test("skal fylle ut arbeidstakeren steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const arbeidstakerenStegPage = new ArbeidstakerenStegPage(
      page,
      testArbeidstakerSkjema,
    );

    // Naviger direkte til steget
    await arbeidstakerenStegPage.goto();

    await arbeidstakerenStegPage.assertIsVisible();

    // Verifiser at fødselsnummer-felter er forhåndsutfylt
    await arbeidstakerenStegPage.assertHarNorskFodselsnummerIsJa();
    await arbeidstakerenStegPage.assertFodselsnummerValue(testUserInfo.userId);

    // Svar på spørsmål
    await arbeidstakerenStegPage.harVaertEllerSkalVaereILonnetArbeidRadioGroup.JA.click();
    await arbeidstakerenStegPage.skalJobbeForFlereVirksomheterRadioGroup.NEI.click();

    // Lagre og fortsett og verifiser forventet payload i POST request
    const expectedArbeidstakerenPayload: ArbeidstakerenDto = {
      harNorskFodselsnummer: true,
      fodselsnummer: testUserInfo.userId,
      harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
      skalJobbeForFlereVirksomheter: false,
    };

    await arbeidstakerenStegPage.lagreOgFortsettAndExpectPayload(
      expectedArbeidstakerenPayload,
    );

    // Verifiser navigering til neste steg
    await arbeidstakerenStegPage.assertNavigatedToNextStep();
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
    await tilleggsopplysningerStegPage.assertNavigatedToOppsummering();
  });

  test("Oppsummering viser alle utfylte data fra tidligere steg", async ({
    page,
  }) => {
    const arbeidstakerenData: ArbeidstakerenDto = {
      harNorskFodselsnummer: true,
      fodselsnummer: testUserInfo.userId,
      fornavn: formFieldValues.fornavn,
      etternavn: formFieldValues.etternavn,
      fodselsdato: formFieldValues.periodeFraIso,
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
        arbeidstakeren: arbeidstakerenData,
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

    // Verifiser data fra arbeidstakeren-steget
    await oppsummeringPage.assertArbeidstakerenData(arbeidstakerenData);

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
