import { test } from "@playwright/test";

import {
  DineOpplysningerDto,
  ArbeidssituasjonDto,
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
import { DineOpplysningerStegPage } from "../pages/skjema/arbeidstaker/dine-opplysninger-steg.page";
import { FamiliemedlemmerStegPage } from "../pages/skjema/arbeidstaker/familiemedlemmer-steg.page";
import { OppsummeringStegPage } from "../pages/skjema/arbeidstaker/oppsummering-steg.page";
import { SkatteforholdOgInntektStegPage } from "../pages/skjema/arbeidstaker/skatteforhold-og-inntekt-steg.page";
import { TilleggsopplysningerStegPage } from "../pages/skjema/arbeidstaker/tilleggsopplysninger-steg.page";
import { VedleggStegPage } from "../pages/skjema/arbeidstaker/vedlegg-steg.page";

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

    await veiledningPage.assertNavigatedToDineOpplysninger(
      testArbeidstakerSkjema.id,
    );
  });

  test("skal fylle ut dine opplysninger steg og gjøre forventet POST request", async ({
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
    await dineOpplysningerStegPage.assertFodselsnummerValue(testUserInfo.userId);

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
