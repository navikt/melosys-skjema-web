import {
  ArbeidsstedIUtlandetDto,
  ArbeidsstedType,
  Farvann,
  FastEllerVekslendeArbeidssted,
  LandKode,
  TypeInnretning,
} from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import { expect, test } from "../../fixtures/test";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { ArbeidsstedIUtlandetStegPage } from "../../pages/skjema/arbeidssted-i-utlandet-steg.page";

const arbeidsstedIUtlandetMedVerdiIAlleFelter: ArbeidsstedIUtlandetDto = {
  arbeidsstedType: ArbeidsstedType.PA_LAND,
  paLand: {
    navnPaVirksomhet: "Test Virksomhet AS",
    fastEllerVekslendeArbeidssted: FastEllerVekslendeArbeidssted.FAST,
    fastArbeidssted: {
      vegadresse: "Test Street",
      nummer: "123",
      postkode: "0123",
      bySted: "Test City",
    },
    erHjemmekontor: false,
  },
  offshore: {
    navnPaVirksomhet: "Test Virksomhet AS",
    navnPaInnretning: "Test Platform",
    typeInnretning: TypeInnretning.PLATTFORM_ELLER_ANNEN_FAST_INNRETNING,
    sokkelLand: LandKode.SE,
  },
  paSkip: {
    navnPaVirksomhet: "Test Virksomhet AS",
    navnPaSkip: "Test Ship",
    yrketTilArbeidstaker: "Test Occupation",
    seilerI: Farvann.INTERNASJONALT_FARVANN,
    flaggland: LandKode.SE,
    territorialfarvannLand: LandKode.SE,
  },
  omBordPaFly: {
    navnPaVirksomhet: "Test Virksomhet AS",
    hjemmebaseLand: LandKode.SE,
    hjemmebaseNavn: "Oslo Airport",
    erVanligHjemmebase: false,
    vanligHjemmebaseLand: LandKode.SE,
    vanligHjemmebaseNavn: "Stockholm Airport",
  },
};

test.describe("Arbeidssted i utlandet", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
  });

  test("happy case - PA_LAND med fast arbeidssted", async ({ page }) => {
    const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await arbeidsstedPage.goto();
    await arbeidsstedPage.assertIsVisible();

    await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
      ArbeidsstedType.PA_LAND,
    );
    await arbeidsstedPage.navnPaVirksomhetInput.fill("Test Virksomhet AS");
    await arbeidsstedPage.fastEllerVekslendeRadioGroup.FAST.click();
    await arbeidsstedPage.vegadresseInput.fill("Storgata");
    await arbeidsstedPage.nummerInput.fill("1");
    await arbeidsstedPage.postkodeInput.fill("0123");
    await arbeidsstedPage.byStedInput.fill("Stockholm");
    await arbeidsstedPage.erHjemmekontorRadioGroup.NEI.click();

    const expectedPayload: ArbeidsstedIUtlandetDto = {
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

    await arbeidsstedPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidsstedPage.assertNavigatedToNextStep();
  });

  test("variant: OFFSHORE — plattform på norsk sokkel", async ({ page }) => {
    const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await arbeidsstedPage.goto();
    await arbeidsstedPage.assertIsVisible();

    await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
      ArbeidsstedType.OFFSHORE,
    );

    // Verify offshore-specific fields are visible
    await expect(arbeidsstedPage.navnPaVirksomhetInput).toBeVisible();
    await expect(arbeidsstedPage.navnPaInnretningInput).toBeVisible();

    await arbeidsstedPage.navnPaVirksomhetInput.fill("Offshore Corp AS");
    await arbeidsstedPage.navnPaInnretningInput.fill("Troll A");
    await arbeidsstedPage.typeInnretningRadioGroup.PLATTFORM.click();
    await arbeidsstedPage.sokkelLandSelect.selectOption("SE");

    // Verify PA_LAND-specific fields are NOT visible
    await expect(arbeidsstedPage.vegadresseInput).not.toBeVisible();

    const expectedPayload: ArbeidsstedIUtlandetDto = {
      arbeidsstedType: ArbeidsstedType.OFFSHORE,
      offshore: {
        navnPaVirksomhet: "Offshore Corp AS",
        navnPaInnretning: "Troll A",
        typeInnretning: TypeInnretning.PLATTFORM_ELLER_ANNEN_FAST_INNRETNING,
        sokkelLand: LandKode.SE,
      },
    };

    await arbeidsstedPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidsstedPage.assertNavigatedToNextStep();
  });

  test("variant: PA_SKIP — internasjonalt farvann", async ({ page }) => {
    const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await arbeidsstedPage.goto();
    await arbeidsstedPage.assertIsVisible();

    await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
      ArbeidsstedType.PA_SKIP,
    );

    // Verify ship-specific fields are visible
    await expect(arbeidsstedPage.navnPaSkipInput).toBeVisible();
    await expect(arbeidsstedPage.yrketTilArbeidstakerInput).toBeVisible();

    await arbeidsstedPage.navnPaVirksomhetInput.fill("Shipping AS");
    await arbeidsstedPage.navnPaSkipInput.fill("MS Norden");
    await arbeidsstedPage.yrketTilArbeidstakerInput.fill("Styrmann");
    await arbeidsstedPage.seilerIRadioGroup.INTERNASJONALT.click();
    await arbeidsstedPage.flagglandSelect.selectOption("SE");

    // Verify territorialfarvannLand is NOT visible when internasjonalt
    await expect(
      arbeidsstedPage.territorialfarvannLandSelect,
    ).not.toBeVisible();

    const expectedPayload: ArbeidsstedIUtlandetDto = {
      arbeidsstedType: ArbeidsstedType.PA_SKIP,
      paSkip: {
        navnPaVirksomhet: "Shipping AS",
        navnPaSkip: "MS Norden",
        yrketTilArbeidstaker: "Styrmann",
        seilerI: Farvann.INTERNASJONALT_FARVANN,
        flaggland: LandKode.SE,
      },
    };

    await arbeidsstedPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidsstedPage.assertNavigatedToNextStep();
  });

  test("variant: PA_LAND — vekslende arbeidssted", async ({ page }) => {
    const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await arbeidsstedPage.goto();
    await arbeidsstedPage.assertIsVisible();

    await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
      ArbeidsstedType.PA_LAND,
    );
    await arbeidsstedPage.navnPaVirksomhetInput.fill("Vekslende Corp AS");
    await arbeidsstedPage.fastEllerVekslendeRadioGroup.VEKSLENDE.click();

    // Verify fast-fields disappear when workplace varies
    await expect(arbeidsstedPage.vegadresseInput).not.toBeVisible();

    await arbeidsstedPage.erHjemmekontorRadioGroup.JA.click();

    const expectedPayload: ArbeidsstedIUtlandetDto = {
      arbeidsstedType: ArbeidsstedType.PA_LAND,
      paLand: {
        navnPaVirksomhet: "Vekslende Corp AS",
        fastEllerVekslendeArbeidssted: FastEllerVekslendeArbeidssted.VEKSLENDE,
        erHjemmekontor: true,
      },
    };

    await arbeidsstedPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidsstedPage.assertNavigatedToNextStep();
  });

  test("variant: PA_SKIP — territorialfarvann", async ({ page }) => {
    const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await arbeidsstedPage.goto();
    await arbeidsstedPage.assertIsVisible();

    await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
      ArbeidsstedType.PA_SKIP,
    );

    await arbeidsstedPage.navnPaVirksomhetInput.fill("Rederi AS");
    await arbeidsstedPage.navnPaSkipInput.fill("MS Fjordline");
    await arbeidsstedPage.yrketTilArbeidstakerInput.fill("Matros");
    await arbeidsstedPage.seilerIRadioGroup.TERRITORIALFARVANN.click();

    // Verify territorialfarvannLand appears
    await expect(arbeidsstedPage.territorialfarvannLandSelect).toBeVisible();
    // Verify flaggland is NOT visible for territorialfarvann
    await expect(arbeidsstedPage.flagglandSelect).not.toBeVisible();

    await arbeidsstedPage.territorialfarvannLandSelect.selectOption("DK");

    const expectedPayload: ArbeidsstedIUtlandetDto = {
      arbeidsstedType: ArbeidsstedType.PA_SKIP,
      paSkip: {
        navnPaVirksomhet: "Rederi AS",
        navnPaSkip: "MS Fjordline",
        yrketTilArbeidstaker: "Matros",
        seilerI: Farvann.TERRITORIALFARVANN,
        territorialfarvannLand: LandKode.DK,
      },
    };

    await arbeidsstedPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidsstedPage.assertNavigatedToNextStep();
  });

  test("variant: OM_BORD_PA_FLY — vanlig hjemmebase", async ({ page }) => {
    const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await arbeidsstedPage.goto();
    await arbeidsstedPage.assertIsVisible();

    await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
      ArbeidsstedType.OM_BORD_PA_FLY,
    );

    await arbeidsstedPage.navnPaVirksomhetInput.fill("Nordic Airlines AS");
    await arbeidsstedPage.hjemmebaseLandSelect.selectOption("SE");
    await arbeidsstedPage.hjemmebaseNavnInput.fill("Arlanda");
    await arbeidsstedPage.erVanligHjemmebaseRadioGroup.JA.click();

    // Verify extra fields do NOT appear when vanlig hjemmebase
    await expect(arbeidsstedPage.vanligHjemmebaseLandSelect).not.toBeVisible();
    await expect(arbeidsstedPage.vanligHjemmebaseNavnInput).not.toBeVisible();

    const expectedPayload: ArbeidsstedIUtlandetDto = {
      arbeidsstedType: ArbeidsstedType.OM_BORD_PA_FLY,
      omBordPaFly: {
        navnPaVirksomhet: "Nordic Airlines AS",
        hjemmebaseLand: LandKode.SE,
        hjemmebaseNavn: "Arlanda",
        erVanligHjemmebase: true,
      },
    };

    await arbeidsstedPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidsstedPage.assertNavigatedToNextStep();
  });

  test("variant: OM_BORD_PA_FLY — ikke vanlig hjemmebase", async ({ page }) => {
    const arbeidsstedPage = new ArbeidsstedIUtlandetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await arbeidsstedPage.goto();
    await arbeidsstedPage.assertIsVisible();

    await arbeidsstedPage.arbeidsstedTypeSelect.selectOption(
      ArbeidsstedType.OM_BORD_PA_FLY,
    );

    // Verify fly-specific fields are visible
    await expect(arbeidsstedPage.hjemmebaseLandSelect).toBeVisible();

    await arbeidsstedPage.navnPaVirksomhetInput.fill("Fly AS");
    await arbeidsstedPage.hjemmebaseLandSelect.selectOption("SE");
    await arbeidsstedPage.hjemmebaseNavnInput.fill("Arlanda");
    await arbeidsstedPage.erVanligHjemmebaseRadioGroup.NEI.click();

    // Verify extra fields appear when NOT vanlig hjemmebase
    await expect(arbeidsstedPage.vanligHjemmebaseLandSelect).toBeVisible();
    await arbeidsstedPage.vanligHjemmebaseLandSelect.selectOption("DK");
    await arbeidsstedPage.vanligHjemmebaseNavnInput.fill("Gardermoen");

    const expectedPayload: ArbeidsstedIUtlandetDto = {
      arbeidsstedType: ArbeidsstedType.OM_BORD_PA_FLY,
      omBordPaFly: {
        navnPaVirksomhet: "Fly AS",
        hjemmebaseLand: LandKode.SE,
        hjemmebaseNavn: "Arlanda",
        erVanligHjemmebase: false,
        vanligHjemmebaseLand: LandKode.DK,
        vanligHjemmebaseNavn: "Gardermoen",
      },
    };

    await arbeidsstedPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidsstedPage.assertNavigatedToNextStep();
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
      await arbeidsstedPage.navnPaVirksomhetInput.fill("Test Virksomhet AS");
      await arbeidsstedPage.fastEllerVekslendeRadioGroup.FAST.click();
      await arbeidsstedPage.vegadresseInput.fill("Test Street");
      await arbeidsstedPage.nummerInput.fill("123");
      await arbeidsstedPage.postkodeInput.fill("0123");
      await arbeidsstedPage.byStedInput.fill("Test City");
      await arbeidsstedPage.erHjemmekontorRadioGroup.NEI.click();

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.PA_LAND,
        paLand: {
          navnPaVirksomhet: "Test Virksomhet AS",
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
      await arbeidsstedPage.navnPaVirksomhetInput.fill("Test Virksomhet AS");
      await arbeidsstedPage.fastEllerVekslendeRadioGroup.VEKSLENDE.click();
      await arbeidsstedPage.erHjemmekontorRadioGroup.JA.click();

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.PA_LAND,
        paLand: {
          navnPaVirksomhet: "Test Virksomhet AS",
          fastEllerVekslendeArbeidssted:
            FastEllerVekslendeArbeidssted.VEKSLENDE,
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
      await arbeidsstedPage.navnPaVirksomhetInput.fill("Test Virksomhet AS");
      await arbeidsstedPage.navnPaSkipInput.fill("MS Test Ship");
      await arbeidsstedPage.yrketTilArbeidstakerInput.fill("Kaptein");
      await arbeidsstedPage.seilerIRadioGroup.INTERNASJONALT.click();
      await arbeidsstedPage.flagglandSelect.selectOption("SE");

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.PA_SKIP,
        paSkip: {
          navnPaVirksomhet: "Test Virksomhet AS",
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
      await arbeidsstedPage.navnPaVirksomhetInput.fill("Test Virksomhet AS");
      await arbeidsstedPage.navnPaSkipInput.fill("MS Test Ship");
      await arbeidsstedPage.yrketTilArbeidstakerInput.fill("Kaptein");
      await arbeidsstedPage.seilerIRadioGroup.TERRITORIALFARVANN.click();
      await arbeidsstedPage.territorialfarvannLandSelect.selectOption("SE");

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.PA_SKIP,
        paSkip: {
          navnPaVirksomhet: "Test Virksomhet AS",
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
      await arbeidsstedPage.navnPaVirksomhetInput.fill("Test Virksomhet AS");
      await arbeidsstedPage.hjemmebaseLandSelect.selectOption("DK");
      await arbeidsstedPage.hjemmebaseNavnInput.fill("Aarhus Airport");
      await arbeidsstedPage.erVanligHjemmebaseRadioGroup.JA.click();

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.OM_BORD_PA_FLY,
        omBordPaFly: {
          navnPaVirksomhet: "Test Virksomhet AS",
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
      await arbeidsstedPage.navnPaVirksomhetInput.fill("Test Virksomhet AS");
      await arbeidsstedPage.hjemmebaseLandSelect.selectOption("DK");
      await arbeidsstedPage.hjemmebaseNavnInput.fill("Skagen Airport");
      await arbeidsstedPage.erVanligHjemmebaseRadioGroup.NEI.click();
      await arbeidsstedPage.vanligHjemmebaseLandSelect.selectOption("SE");
      await arbeidsstedPage.vanligHjemmebaseNavnInput.fill("Stockholm Airport");

      const expectedTransformedData: ArbeidsstedIUtlandetDto = {
        arbeidsstedType: ArbeidsstedType.OM_BORD_PA_FLY,
        omBordPaFly: {
          navnPaVirksomhet: "Test Virksomhet AS",
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
