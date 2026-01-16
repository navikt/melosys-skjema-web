import { test } from "@playwright/test";

import {
  ArbeidsstedIUtlandetDto,
  ArbeidsstedType,
  Farvann,
  FastEllerVekslendeArbeidssted,
  LandKode,
  TypeInnretning,
} from "../../../../../../src/types/melosysSkjemaTypes";
import { setupApiMocksForArbeidsgiver } from "../../../../fixtures/api-mocks";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../../../fixtures/test-data";
import { ArbeidsstedIUtlandetStegPage } from "../../../../pages/skjema/arbeidsgiver/arbeidssted-i-utlandet-steg.page";

const arbeidsstedIUtlandetMedVerdiIAlleFelter: ArbeidsstedIUtlandetDto = {
  arbeidsstedType: ArbeidsstedType.PA_LAND,
  paLand: {
    fastEllerVekslendeArbeidssted: FastEllerVekslendeArbeidssted.FAST,
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
    typeInnretning: TypeInnretning.PLATTFORM_ELLER_ANNEN_FAST_INNRETNING,
    sokkelLand: LandKode.NO,
  },
  paSkip: {
    navnPaSkip: "Test Ship",
    yrketTilArbeidstaker: "Test Occupation",
    seilerI: Farvann.INTERNASJONALT_FARVANN,
    flaggland: LandKode.NO,
    territorialfarvannLand: LandKode.SE,
  },
  omBordPaFly: {
    hjemmebaseLand: LandKode.NO,
    hjemmebaseNavn: "Oslo Airport",
    erVanligHjemmebase: false,
    vanligHjemmebaseLand: LandKode.SE,
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

      await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.PA_LAND,
      );

      await arbeidsstedPage.fastEllerVekslendeRadioGroup.FAST.click();

      await arbeidsstedPage.vegadresseInput.fill("Test Street");
      await arbeidsstedPage.nummerInput.fill("123");
      await arbeidsstedPage.postkodeInput.fill("0123");
      await arbeidsstedPage.byStedInput.fill("Test City");

      await arbeidsstedPage.erHjemmekontorRadioGroup.NEI.click();

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.PA_LAND,
        paLand: {
          fastEllerVekslendeArbeidssted: FastEllerVekslendeArbeidssted.FAST,
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

      await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.PA_LAND,
      );

      await arbeidsstedPage.fastEllerVekslendeRadioGroup.VEKSLENDE.click();

      await arbeidsstedPage.beskrivelseVekslendeTextarea.fill(
        "Arbeidstaker veksler mellom flere lokasjoner",
      );

      await arbeidsstedPage.erHjemmekontorRadioGroup.JA.click();

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.PA_LAND,
        paLand: {
          fastEllerVekslendeArbeidssted:
            FastEllerVekslendeArbeidssted.VEKSLENDE,
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

      await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.PA_SKIP,
      );

      await arbeidsstedPage.navnPaSkipInput.fill("MS Test Ship");
      await arbeidsstedPage.yrketTilArbeidstakerInput.fill("Kaptein");

      await arbeidsstedPage.seilerIRadioGroup.INTERNASJONALT.click();

      await arbeidsstedPage.flagglandSelect.selectOption("SE");

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.PA_SKIP,
        paSkip: {
          navnPaSkip: "MS Test Ship",
          yrketTilArbeidstaker: "Kaptein",
          seilerI: Farvann.INTERNASJONALT_FARVANN,
          flaggland: LandKode.SE,
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

      await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.PA_SKIP,
      );

      await arbeidsstedPage.navnPaSkipInput.fill("MS Test Ship");
      await arbeidsstedPage.yrketTilArbeidstakerInput.fill("Kaptein");

      await arbeidsstedPage.seilerIRadioGroup.TERRITORIALFARVANN.click();

      await arbeidsstedPage.territorialfarvannLandSelect.selectOption("SE");

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.PA_SKIP,
        paSkip: {
          navnPaSkip: "MS Test Ship",
          yrketTilArbeidstaker: "Kaptein",
          seilerI: Farvann.TERRITORIALFARVANN,
          territorialfarvannLand: LandKode.SE,
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
        ArbeidsstedType.OM_BORD_PA_FLY,
      );

      await arbeidsstedPage.hjemmebaseLandSelect.selectOption("DK");

      await arbeidsstedPage.hjemmebaseNavnInput.fill("Aarhus Airport");

      await arbeidsstedPage.erVanligHjemmebaseRadioGroup.JA.click();

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.OM_BORD_PA_FLY,
        omBordPaFly: {
          hjemmebaseLand: LandKode.DK,
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
        ArbeidsstedType.OM_BORD_PA_FLY,
      );

      await arbeidsstedPage.hjemmebaseLandSelect.selectOption("DK");

      await arbeidsstedPage.hjemmebaseNavnInput.fill("Skagen Airport");

      await arbeidsstedPage.erVanligHjemmebaseRadioGroup.NEI.click();

      await arbeidsstedPage.vanligHjemmebaseLandSelect.selectOption("SE");

      await arbeidsstedPage.vanligHjemmebaseNavnInput.fill("Stockholm Airport");

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.OM_BORD_PA_FLY,
        omBordPaFly: {
          hjemmebaseLand: LandKode.DK,
          hjemmebaseNavn: "Skagen Airport",
          erVanligHjemmebase: false,
          vanligHjemmebaseLand: LandKode.SE,
          vanligHjemmebaseNavn: "Stockholm Airport",
        },
      };

      await arbeidsstedPage.lagreOgFortsettAndExpectPayload(
        expectedTransformedData,
      );
    });
  });
});
