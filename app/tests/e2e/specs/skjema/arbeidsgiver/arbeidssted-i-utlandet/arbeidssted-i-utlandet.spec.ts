import { test } from "@playwright/test";

import { ArbeidsstedIUtlandetDto } from "../../../../../../src/types/melosysSkjemaTypes";
import { setupApiMocksForArbeidsgiver } from "../../../../fixtures/api-mocks";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../../../fixtures/test-data";
import { ArbeidsstedIUtlandetStegPage } from "../../../../pages/skjema/arbeidsgiver/arbeidssted-i-utlandet-steg.page";

const arbeidsstedIUtlandetMedVerdiIAlleFelter: ArbeidsstedIUtlandetDto = {
  arbeidsstedType: "PA_LAND",
  paLand: {
    fastEllerVekslendeArbeidssted: "FAST",
    fastArbeidssted: {
      vegadresse: "Test Street",
      nummer: "123",
      postkode: "0123",
      bySted: "Test City",
    },
    beskrivelseVekslende: "Dette feltet skal fjernes ved transform",
    erHjemmekontor: false,
  },
  offshore: {
    navnPaInnretning: "Test Platform",
    typeInnretning: "PLATTFORM_ELLER_ANNEN_FAST_INNRETNING",
    sokkelLand: "NO",
  },
  paSkip: {
    navnPaSkip: "Test Ship",
    yrketTilArbeidstaker: "Test Occupation",
    seilerI: "INTERNASJONALT_FARVANN",
    flaggland: "NO",
    territorialfarvannLand: "SE",
  },
  omBordPaFly: {
    hjemmebaseLand: "NO",
    hjemmebaseNavn: "Oslo Airport",
    erVanligHjemmebase: false,
    vanligHjemmebaseLand: "SE",
    vanligHjemmebaseNavn: "Stockholm Airport",
  },
};

test.describe("ArbeidsstedIUtlandet", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
  });

  test.describe("Data transform", () => {
    test("skal fjerne irrelevante felt ved submit for PA_LAND FAST", async ({
      page,
    }) => {
      const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
        page,
        testArbeidsgiverSkjema,
      );

      await arbeidsstedPage.mockArbeidsstedIUtlandetData(
        arbeidsstedIUtlandetMedVerdiIAlleFelter,
      );
      await arbeidsstedPage.goto();
      await arbeidsstedPage.assertIsVisible();

      await arbeidsstedPage.arbeidsstedTypeSelect.selectOption("PA_LAND");

      await arbeidsstedPage.fastEllerVekslendeRadioGroup.FAST.click();

      await arbeidsstedPage.vegadresseInput.fill("Test Street");
      await arbeidsstedPage.nummerInput.fill("123");
      await arbeidsstedPage.postkodeInput.fill("0123");
      await arbeidsstedPage.byStedInput.fill("Test City");

      await arbeidsstedPage.erHjemmekontorRadioGroup.NEI.click();

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: "PA_LAND",
        paLand: {
          fastEllerVekslendeArbeidssted: "FAST",
          fastArbeidssted: {
            vegadresse: "Test Street",
            nummer: "123",
            postkode: "0123",
            bySted: "Test City",
          },
          erHjemmekontor: false,
        },
      };

      await arbeidsstedPage.lagreOgFortsettAndExpectPayload(
        expectedTransformedData,
      );
    });

    test("skal fjerne irrelevante felt ved submit for PA_LAND VEKSLENDE", async ({
      page,
    }) => {
      const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
        page,
        testArbeidsgiverSkjema,
      );

      await arbeidsstedPage.mockArbeidsstedIUtlandetData(
        arbeidsstedIUtlandetMedVerdiIAlleFelter,
      );
      await arbeidsstedPage.goto();
      await arbeidsstedPage.assertIsVisible();

      await arbeidsstedPage.arbeidsstedTypeSelect.selectOption("PA_LAND");

      await arbeidsstedPage.fastEllerVekslendeRadioGroup.VEKSLENDE.click();

      await arbeidsstedPage.beskrivelseVekslendeTextarea.fill(
        "Arbeidstaker veksler mellom flere lokasjoner",
      );

      await arbeidsstedPage.erHjemmekontorRadioGroup.JA.click();

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: "PA_LAND",
        paLand: {
          fastEllerVekslendeArbeidssted: "VEKSLENDE",
          beskrivelseVekslende: "Arbeidstaker veksler mellom flere lokasjoner",
          erHjemmekontor: true,
        },
      };

      await arbeidsstedPage.lagreOgFortsettAndExpectPayload(
        expectedTransformedData,
      );
    });

    test("skal fjerne irrelevante felt ved submit for PA_SKIP INTERNASJONALT_FARVANN", async ({
      page,
    }) => {
      const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
        page,
        testArbeidsgiverSkjema,
      );

      await arbeidsstedPage.mockArbeidsstedIUtlandetData(
        arbeidsstedIUtlandetMedVerdiIAlleFelter,
      );
      await arbeidsstedPage.goto();
      await arbeidsstedPage.assertIsVisible();

      await arbeidsstedPage.arbeidsstedTypeSelect.selectOption("PA_SKIP");

      await arbeidsstedPage.navnPaSkipInput.fill("MS Test Ship");
      await arbeidsstedPage.yrketTilArbeidstakerInput.fill("Kaptein");

      await arbeidsstedPage.seilerIRadioGroup.INTERNASJONALT.click();

      await arbeidsstedPage.flagglandSelect.selectOption("SE");

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: "PA_SKIP",
        paSkip: {
          navnPaSkip: "MS Test Ship",
          yrketTilArbeidstaker: "Kaptein",
          seilerI: "INTERNASJONALT_FARVANN",
          flaggland: "SE",
        },
      };

      await arbeidsstedPage.lagreOgFortsettAndExpectPayload(
        expectedTransformedData,
      );
    });

    test("skal fjerne irrelevante felt ved submit for PA_SKIP TERRITORIALFARVANN", async ({
      page,
    }) => {
      const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
        page,
        testArbeidsgiverSkjema,
      );

      await arbeidsstedPage.mockArbeidsstedIUtlandetData(
        arbeidsstedIUtlandetMedVerdiIAlleFelter,
      );
      await arbeidsstedPage.goto();
      await arbeidsstedPage.assertIsVisible();

      await arbeidsstedPage.arbeidsstedTypeSelect.selectOption("PA_SKIP");

      await arbeidsstedPage.navnPaSkipInput.fill("MS Test Ship");
      await arbeidsstedPage.yrketTilArbeidstakerInput.fill("Kaptein");

      await arbeidsstedPage.seilerIRadioGroup.TERRITORIALFARVANN.click();

      await arbeidsstedPage.territorialfarvannLandSelect.selectOption("SE");

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: "PA_SKIP",
        paSkip: {
          navnPaSkip: "MS Test Ship",
          yrketTilArbeidstaker: "Kaptein",
          seilerI: "TERRITORIALFARVANN",
          territorialfarvannLand: "SE",
        },
      };

      await arbeidsstedPage.lagreOgFortsettAndExpectPayload(
        expectedTransformedData,
      );
    });

    test("skal fjerne irrelevante felt ved submit for OM_BORD_PA_FLY med vanlig hjemmebase", async ({
      page,
    }) => {
      const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
        page,
        testArbeidsgiverSkjema,
      );

      await arbeidsstedPage.mockArbeidsstedIUtlandetData(
        arbeidsstedIUtlandetMedVerdiIAlleFelter,
      );
      await arbeidsstedPage.goto();
      await arbeidsstedPage.assertIsVisible();

      await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
        "OM_BORD_PA_FLY",
      );

      await arbeidsstedPage.hjemmebaseLandSelect.selectOption("DK");

      await arbeidsstedPage.hjemmebaseNavnInput.fill("Aarhus Airport");

      await arbeidsstedPage.erVanligHjemmebaseRadioGroup.JA.click();

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: "OM_BORD_PA_FLY",
        omBordPaFly: {
          hjemmebaseLand: "DK",
          hjemmebaseNavn: "Aarhus Airport",
          erVanligHjemmebase: true,
        },
      };

      await arbeidsstedPage.lagreOgFortsettAndExpectPayload(
        expectedTransformedData,
      );
    });

    test("skal fjerne irrelevante felt ved submit for OM_BORD_PA_FLY med annen hjemmebase", async ({
      page,
    }) => {
      const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
        page,
        testArbeidsgiverSkjema,
      );

      await arbeidsstedPage.mockArbeidsstedIUtlandetData(
        arbeidsstedIUtlandetMedVerdiIAlleFelter,
      );
      await arbeidsstedPage.goto();
      await arbeidsstedPage.assertIsVisible();

      await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
        "OM_BORD_PA_FLY",
      );

      await arbeidsstedPage.hjemmebaseLandSelect.selectOption("DK");

      await arbeidsstedPage.hjemmebaseNavnInput.fill("Skagen Airport");

      await arbeidsstedPage.erVanligHjemmebaseRadioGroup.NEI.click();

      await arbeidsstedPage.vanligHjemmebaseLandSelect.selectOption("SE");

      await arbeidsstedPage.vanligHjemmebaseNavnInput.fill("Stockholm Airport");

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: "OM_BORD_PA_FLY",
        omBordPaFly: {
          hjemmebaseLand: "DK",
          hjemmebaseNavn: "Skagen Airport",
          erVanligHjemmebase: false,
          vanligHjemmebaseLand: "SE",
          vanligHjemmebaseNavn: "Stockholm Airport",
        },
      };

      await arbeidsstedPage.lagreOgFortsettAndExpectPayload(
        expectedTransformedData,
      );
    });
  });
});
