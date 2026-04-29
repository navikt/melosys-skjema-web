import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type {
  ArbeidsstedIUtlandetDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import type { RadioButtonGroupJaNeiLocator } from "../../../types/playwright-types";
import { mockFetchSkjema } from "../../fixtures/api-mocks";

// Hent felter fra statiske definisjoner
const arbeidsstedIUtlandet =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedIUtlandet;
const paLandFelter = SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedPaLand.felter;
const offshoreFelter =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedOffshore.felter;
const paSkipFelter = SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedPaSkip.felter;
const omBordPaFlyFelter =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedOmBordPaFly.felter;

// Feilmeldinger
const feilmeldinger = {
  // Arbeidssted type (discriminated union)
  duMaVelgeArbeidsstedType:
    nb.translation.arbeidsstedIUtlandetSteg.duMaVelgeArbeidsstedType,
  // Felles
  navnPaVirksomhetErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.navnPaVirksomhetErPakrevd,
  // På land
  duMaVelgeFastEllerVekslende:
    nb.translation.arbeidsstedIUtlandetSteg.duMaVelgeFastEllerVekslende,
  duMaSvarePaOmDetErHjemmekontor:
    nb.translation.arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErHjemmekontor,
  vegadresseErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.vegadresseErPakrevd,
  nummerErPakrevd: nb.translation.arbeidsstedIUtlandetSteg.nummerErPakrevd,
  postkodeErPakrevd: nb.translation.arbeidsstedIUtlandetSteg.postkodeErPakrevd,
  byStedErPakrevd: nb.translation.arbeidsstedIUtlandetSteg.byStedErPakrevd,
  // Offshore
  navnPaInnretningErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.navnPaInnretningErPakrevd,
  duMaVelgeTypeInnretning:
    nb.translation.arbeidsstedIUtlandetSteg.duMaVelgeTypeInnretning,
  sokkelLandErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.sokkelLandErPakrevd,
  // På skip
  navnPaSkipErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.navnPaSkipErPakrevd,
  yrketTilArbeidstakerErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.yrketTilArbeidstakerErPakrevd,
  duMaVelgeHvorSkipetSeiler:
    nb.translation.arbeidsstedIUtlandetSteg.duMaVelgeHvorSkipetSeiler,
  flagglandErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.flagglandErPakrevd,
  territorialfarvannLandErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.territorialfarvannLandErPakrevd,
  // Om bord på fly
  hjemmebaseLandErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.hjemmebaseLandErPakrevd,
  hjemmebaseNavnErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.hjemmebaseNavnErPakrevd,
  duMaSvarePaOmDetErVanligHjemmebase:
    nb.translation.arbeidsstedIUtlandetSteg.duMaSvarePaOmDetErVanligHjemmebase,
  vanligHjemmebaseLandErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.vanligHjemmebaseLandErPakrevd,
  vanligHjemmebaseNavnErPakrevd:
    nb.translation.arbeidsstedIUtlandetSteg.vanligHjemmebaseNavnErPakrevd,
};

export class ArbeidsstedIUtlandetStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly arbeidsstedTypeSelect: Locator;
  readonly lagreOgFortsettButton: Locator;

  // Felles felt
  readonly navnPaVirksomhetInput: Locator;

  // På land felter
  readonly fastEllerVekslendeRadioGroup: {
    FAST: Locator;
    VEKSLENDE: Locator;
  };
  readonly vegadresseInput: Locator;
  readonly nummerInput: Locator;
  readonly postkodeInput: Locator;
  readonly byStedInput: Locator;
  readonly erHjemmekontorRadioGroup: RadioButtonGroupJaNeiLocator;

  // Offshore felter
  readonly navnPaInnretningInput: Locator;
  readonly typeInnretningRadioGroup: {
    PLATTFORM: Locator;
    BORESKIP: Locator;
  };
  readonly sokkelLandSelect: Locator;

  // På skip felter
  readonly navnPaSkipInput: Locator;
  readonly yrketTilArbeidstakerInput: Locator;
  readonly seilerIRadioGroup: {
    INTERNASJONALT: Locator;
    TERRITORIALFARVANN: Locator;
  };
  readonly flagglandSelect: Locator;
  readonly territorialfarvannLandSelect: Locator;

  // Om bord på fly felter
  readonly hjemmebaseLandSelect: Locator;
  readonly hjemmebaseNavnInput: Locator;
  readonly erVanligHjemmebaseRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly vanligHjemmebaseLandSelect: Locator;
  readonly vanligHjemmebaseNavnInput: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: arbeidsstedIUtlandet.tittel,
    });
    this.arbeidsstedTypeSelect = page.getByRole("combobox", {
      name: arbeidsstedIUtlandet.felter.arbeidsstedType.label,
    });

    // Felles - alle seksjoner har navnPaVirksomhet med samme label
    this.navnPaVirksomhetInput = page.getByLabel(
      paLandFelter.navnPaVirksomhet.label,
    );

    // På land
    const fastEllerVekslendeGroup = page.getByRole("group", {
      name: paLandFelter.fastEllerVekslendeArbeidssted.label,
    });
    this.fastEllerVekslendeRadioGroup = {
      FAST: fastEllerVekslendeGroup.getByRole("radio", {
        name: paLandFelter.fastEllerVekslendeArbeidssted.alternativer[0].label,
      }),
      VEKSLENDE: fastEllerVekslendeGroup.getByRole("radio", {
        name: paLandFelter.fastEllerVekslendeArbeidssted.alternativer[1].label,
      }),
    };

    this.vegadresseInput = page.getByLabel(paLandFelter.vegadresse.label);
    this.nummerInput = page.getByLabel(paLandFelter.nummer.label);
    this.postkodeInput = page.getByLabel(paLandFelter.postkode.label);
    this.byStedInput = page.getByLabel(paLandFelter.bySted.label);

    const erHjemmekontorGroup = page.getByRole("group", {
      name: paLandFelter.erHjemmekontor.label,
    });
    this.erHjemmekontorRadioGroup = {
      JA: erHjemmekontorGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: erHjemmekontorGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    // Offshore
    this.navnPaInnretningInput = page.getByLabel(
      offshoreFelter.navnPaInnretning.label,
    );

    const typeInnretningGroup = page.getByRole("group", {
      name: offshoreFelter.typeInnretning.label,
    });
    this.typeInnretningRadioGroup = {
      PLATTFORM: typeInnretningGroup.getByRole("radio", {
        name: offshoreFelter.typeInnretning.alternativer[0].label,
      }),
      BORESKIP: typeInnretningGroup.getByRole("radio", {
        name: offshoreFelter.typeInnretning.alternativer[1].label,
      }),
    };

    this.sokkelLandSelect = page.getByRole("combobox", {
      name: offshoreFelter.sokkelLand.label,
    });

    // På skip
    this.navnPaSkipInput = page.getByLabel(paSkipFelter.navnPaSkip.label);
    this.yrketTilArbeidstakerInput = page.getByLabel(
      paSkipFelter.yrketTilArbeidstaker.label,
    );

    const seilerIGroup = page.getByRole("group", {
      name: paSkipFelter.seilerI.label,
    });
    this.seilerIRadioGroup = {
      INTERNASJONALT: seilerIGroup.getByRole("radio", {
        name: paSkipFelter.seilerI.alternativer[0].label,
      }),
      TERRITORIALFARVANN: seilerIGroup.getByRole("radio", {
        name: paSkipFelter.seilerI.alternativer[1].label,
      }),
    };

    this.flagglandSelect = page.getByRole("combobox", {
      name: paSkipFelter.flaggland.label,
    });
    this.territorialfarvannLandSelect = page.getByRole("combobox", {
      name: paSkipFelter.territorialfarvannLand.label,
    });

    // Om bord på fly
    this.hjemmebaseLandSelect = page.getByRole("combobox", {
      name: omBordPaFlyFelter.hjemmebaseLand.label,
    });
    this.hjemmebaseNavnInput = page.getByLabel(
      omBordPaFlyFelter.hjemmebaseNavn.label,
    );

    const erVanligHjemmebaseGroup = page.getByRole("group", {
      name: omBordPaFlyFelter.erVanligHjemmebase.label,
    });
    this.erVanligHjemmebaseRadioGroup = {
      JA: erVanligHjemmebaseGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: erVanligHjemmebaseGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.vanligHjemmebaseLandSelect = page.getByRole("combobox", {
      name: omBordPaFlyFelter.vanligHjemmebaseLand.label,
    });
    this.vanligHjemmebaseNavnInput = page.getByLabel(
      omBordPaFlyFelter.vanligHjemmebaseNavn.label,
    );

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjema.id}/arbeidssted-i-utlandet`);
  }

  async mockArbeidsstedIUtlandetData(
    arbeidsstedIUtlandetData: ArbeidsstedIUtlandetDto,
  ) {
    await mockFetchSkjema(this.page, {
      ...this.skjema,
      data: {
        ...this.skjema.data,
        arbeidsstedIUtlandet: arbeidsstedIUtlandetData,
      } as UtsendtArbeidstakerSkjemaDto["data"],
    });
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/arbeidssted-i-utlandet`,
    );
    await this.lagreOgFortsett();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(
    expectedPayload: ArbeidsstedIUtlandetDto,
  ) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/arbeidstakerens-lonn`,
    );
  }

  async assertStillOnStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/arbeidssted-i-utlandet`,
    );
  }

  // --- Validation assertions: Arbeidssted type ---

  async assertDuMaVelgeArbeidsstedTypeIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.duMaVelgeArbeidsstedType),
    ).toBeVisible();
  }

  // --- Validation assertions: PA_LAND ---

  async assertNavnPaVirksomhetErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.navnPaVirksomhetErPakrevd),
    ).toBeVisible();
  }

  private fastEllerVekslendeFieldset() {
    return this.page.getByRole("group", {
      name: paLandFelter.fastEllerVekslendeArbeidssted.label,
    });
  }

  async assertDuMaVelgeFastEllerVekslendeIsVisible() {
    await expect(
      this.fastEllerVekslendeFieldset().getByText(
        feilmeldinger.duMaVelgeFastEllerVekslende,
      ),
    ).toBeVisible();
  }

  private erHjemmekontorFieldset() {
    return this.page.getByRole("group", {
      name: paLandFelter.erHjemmekontor.label,
    });
  }

  async assertDuMaSvarePaOmDetErHjemmekontorIsVisible() {
    await expect(
      this.erHjemmekontorFieldset().getByText(
        feilmeldinger.duMaSvarePaOmDetErHjemmekontor,
      ),
    ).toBeVisible();
  }

  async assertVegadresseErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.vegadresseErPakrevd),
    ).toBeVisible();
  }

  async assertNummerErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.nummerErPakrevd),
    ).toBeVisible();
  }

  async assertPostkodeErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.postkodeErPakrevd),
    ).toBeVisible();
  }

  async assertByStedErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.byStedErPakrevd),
    ).toBeVisible();
  }

  // --- Validation assertions: OFFSHORE ---

  async assertNavnPaInnretningErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.navnPaInnretningErPakrevd),
    ).toBeVisible();
  }

  private typeInnretningFieldset() {
    return this.page.getByRole("group", {
      name: offshoreFelter.typeInnretning.label,
    });
  }

  async assertDuMaVelgeTypeInnretningIsVisible() {
    await expect(
      this.typeInnretningFieldset().getByText(
        feilmeldinger.duMaVelgeTypeInnretning,
      ),
    ).toBeVisible();
  }

  async assertSokkelLandErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.sokkelLandErPakrevd),
    ).toBeVisible();
  }

  // --- Validation assertions: PA_SKIP ---

  async assertNavnPaSkipErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.navnPaSkipErPakrevd),
    ).toBeVisible();
  }

  async assertYrketTilArbeidstakerErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.yrketTilArbeidstakerErPakrevd),
    ).toBeVisible();
  }

  private seilerIFieldset() {
    return this.page.getByRole("group", {
      name: paSkipFelter.seilerI.label,
    });
  }

  async assertDuMaVelgeHvorSkipetSeilerIsVisible() {
    await expect(
      this.seilerIFieldset().getByText(feilmeldinger.duMaVelgeHvorSkipetSeiler),
    ).toBeVisible();
  }

  async assertFlagglandErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.flagglandErPakrevd),
    ).toBeVisible();
  }

  async assertTerritorialfarvannLandErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.territorialfarvannLandErPakrevd),
    ).toBeVisible();
  }

  // --- Validation assertions: OM_BORD_PA_FLY ---

  async assertHjemmebaseLandErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.hjemmebaseLandErPakrevd),
    ).toBeVisible();
  }

  async assertHjemmebaseNavnErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.hjemmebaseNavnErPakrevd),
    ).toBeVisible();
  }

  private erVanligHjemmebaseFieldset() {
    return this.page.getByRole("group", {
      name: omBordPaFlyFelter.erVanligHjemmebase.label,
    });
  }

  async assertDuMaSvarePaOmDetErVanligHjemmebaseIsVisible() {
    await expect(
      this.erVanligHjemmebaseFieldset().getByText(
        feilmeldinger.duMaSvarePaOmDetErVanligHjemmebase,
      ),
    ).toBeVisible();
  }

  async assertVanligHjemmebaseLandErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.vanligHjemmebaseLandErPakrevd),
    ).toBeVisible();
  }

  async assertVanligHjemmebaseNavnErPakrevdIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.vanligHjemmebaseNavnErPakrevd),
    ).toBeVisible();
  }
}
