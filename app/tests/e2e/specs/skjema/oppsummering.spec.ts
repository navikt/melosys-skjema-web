import { test } from "../../fixtures/test";

import {
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidssituasjonDto,
  ArbeidsstedIUtlandetDto,
  ArbeidsstedType,
  ArbeidstakerensLonnDto,
  FamiliemedlemmerDto,
  FastEllerVekslendeArbeidssted,
  SkatteforholdOgInntektDto,
  TilleggsopplysningerDto,
  UtenlandsoppdragetDto,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import {
  mockFetchSkjema,
  setupApiMocksForArbeidsgiver,
  setupApiMocksForArbeidstaker,
  setupApiMocksForKombinert,
} from "../../fixtures/api-mocks";
import {
  formFieldValues,
  testArbeidsgiverSkjema,
  testArbeidstakerSkjema,
  testKombinertSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { OppsummeringStegPage } from "../../pages/skjema/oppsummering-steg.page";

test.describe("Oppsummering", () => {
  test.describe("Arbeidstaker", () => {
    const utsendingsperiodeOgLandData = {
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

    test.beforeEach(async ({ page }) => {
      await setupApiMocksForArbeidstaker(
        page,
        testArbeidstakerSkjema,
        testUserInfo,
      );
    });

    test("viser alle utfylte data fra tidligere steg og sender inn", async ({
      page,
    }) => {
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

      await oppsummeringPage.goto();
      await oppsummeringPage.assertIsVisible();

      await oppsummeringPage.assertArbeidssituasjonData(arbeidssituasjonData);
      await oppsummeringPage.assertUtsendingsperiodeOgLandData(
        utsendingsperiodeOgLandData,
      );
      await oppsummeringPage.assertSkatteforholdOgInntektData(
        skatteforholdOgInntektData,
      );
      await oppsummeringPage.assertFamiliemedlemmerData(familiemedlemmerData);
      await oppsummeringPage.assertTilleggsopplysningerData(
        tilleggsopplysningerData,
      );

      await oppsummeringPage.sendInnAndExpectPost();
      await oppsummeringPage.assertNavigatedToKvittering();
    });
  });

  test.describe("Arbeidsgiver", () => {
    const arbeidsgiverensVirksomhetINorgeData: ArbeidsgiverensVirksomhetINorgeDto =
      {
        erArbeidsgiverenOffentligVirksomhet: false,
        erArbeidsgiverenBemanningsEllerVikarbyraa: false,
        opprettholderArbeidsgiverenVanligDrift: true,
      };

    const utenlandsoppdragetData: UtenlandsoppdragetDto = {
      arbeidsgiverHarOppdragILandet: true,
      arbeidstakerBleAnsattForUtenlandsoppdraget: false,
      arbeidstakerForblirAnsattIHelePerioden: true,
      arbeidstakerErstatterAnnenPerson: false,
    };

    const arbeidsstedIUtlandetData: ArbeidsstedIUtlandetDto = {
      arbeidsstedType: ArbeidsstedType.PA_LAND,
      paLand: {
        navnPaVirksomhet: "Test Virksomhet AS",
        fastEllerVekslendeArbeidssted: FastEllerVekslendeArbeidssted.FAST,
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

    test.beforeEach(async ({ page }) => {
      await setupApiMocksForArbeidsgiver(
        page,
        testArbeidsgiverSkjema,
        [testOrganization],
        testUserInfo,
      );
    });

    test("viser alle utfylte data fra tidligere steg og sender inn", async ({
      page,
    }) => {
      await mockFetchSkjema(page, {
        ...testArbeidsgiverSkjema,
        data: {
          type: "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVERS_DEL",
          arbeidsgiverensVirksomhetINorge: arbeidsgiverensVirksomhetINorgeData,
          utenlandsoppdraget: utenlandsoppdragetData,
          arbeidsstedIUtlandet: arbeidsstedIUtlandetData,
          arbeidstakerensLonn: arbeidstakerensLonnData,
          tilleggsopplysninger: tilleggsopplysningerData,
        } as UtsendtArbeidstakerSkjemaDto["data"],
      });

      const oppsummeringStegPage = new OppsummeringStegPage(
        page,
        testArbeidsgiverSkjema,
      );

      await oppsummeringStegPage.goto();
      await oppsummeringStegPage.assertIsVisible();

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

      await oppsummeringStegPage.sendInnAndExpectPost();
      await oppsummeringStegPage.assertNavigatedToKvittering();
    });
  });

  test.describe("Kombinert (arbeidsgiver og arbeidstakers del)", () => {
    const arbeidsgiversData = {
      arbeidsgiverensVirksomhetINorge: {
        erArbeidsgiverenOffentligVirksomhet: false,
        erArbeidsgiverenBemanningsEllerVikarbyraa: false,
        opprettholderArbeidsgiverenVanligDrift: true,
      } as ArbeidsgiverensVirksomhetINorgeDto,
      utenlandsoppdraget: {
        arbeidsgiverHarOppdragILandet: true,
        arbeidstakerBleAnsattForUtenlandsoppdraget: false,
        arbeidstakerForblirAnsattIHelePerioden: true,
        arbeidstakerErstatterAnnenPerson: false,
      } as UtenlandsoppdragetDto,
      arbeidsstedIUtlandet: {
        arbeidsstedType: ArbeidsstedType.PA_LAND,
        paLand: {
          navnPaVirksomhet: "Test Virksomhet AS",
          fastEllerVekslendeArbeidssted: FastEllerVekslendeArbeidssted.FAST,
          fastArbeidssted: {
            vegadresse: "Storgata",
            nummer: "1",
            postkode: "0123",
            bySted: "Stockholm",
          },
          erHjemmekontor: false,
        },
      } as ArbeidsstedIUtlandetDto,
      arbeidstakerensLonn: {
        arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: true,
      } as ArbeidstakerensLonnDto,
    };

    const arbeidstakersData = {
      arbeidssituasjon: {
        harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
        skalJobbeForFlereVirksomheter: false,
      } as ArbeidssituasjonDto,
      skatteforholdOgInntekt: {
        erSkattepliktigTilNorgeIHeleutsendingsperioden: true,
        mottarPengestotteFraAnnetEosLandEllerSveits: false,
      } as SkatteforholdOgInntektDto,
      familiemedlemmer: {
        skalHaMedFamiliemedlemmer: false,
        familiemedlemmer: [],
      } as FamiliemedlemmerDto,
    };

    const utsendingsperiodeOgLandData = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      utsendelsePeriode: formFieldValues.periode,
    };

    const tilleggsopplysningerData: TilleggsopplysningerDto = {
      harFlereOpplysningerTilSoknaden: false,
    };

    test.beforeEach(async ({ page }) => {
      await setupApiMocksForKombinert(
        page,
        testKombinertSkjema,
        [testOrganization],
        testUserInfo,
      );
    });

    test("viser alle utfylte data fra begge deler og sender inn", async ({
      page,
    }) => {
      await mockFetchSkjema(page, {
        ...testKombinertSkjema,
        data: {
          type: "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL",
          arbeidsgiversData,
          arbeidstakersData,
          utsendingsperiodeOgLand: utsendingsperiodeOgLandData,
          tilleggsopplysninger: tilleggsopplysningerData,
        } as UtsendtArbeidstakerSkjemaDto["data"],
      });

      const oppsummeringStegPage = new OppsummeringStegPage(
        page,
        testKombinertSkjema,
      );

      await oppsummeringStegPage.goto();
      await oppsummeringStegPage.assertIsVisible();

      // Verify arbeidsgiver data is shown
      await oppsummeringStegPage.assertArbeidsgiverensVirksomhetINorgeData(
        arbeidsgiversData.arbeidsgiverensVirksomhetINorge,
      );
      await oppsummeringStegPage.assertUtenlandsoppdragetData(
        arbeidsgiversData.utenlandsoppdraget,
      );
      await oppsummeringStegPage.assertArbeidstakerensLonnData(
        arbeidsgiversData.arbeidstakerensLonn,
      );

      // Verify tilleggsopplysninger
      await oppsummeringStegPage.assertTilleggsopplysningerData(
        tilleggsopplysningerData,
      );

      await oppsummeringStegPage.sendInnAndExpectPost();
      await oppsummeringStegPage.assertNavigatedToKvittering();
    });
  });
});
