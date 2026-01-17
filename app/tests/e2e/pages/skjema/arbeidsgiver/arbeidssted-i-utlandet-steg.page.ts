import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "../../../../../src/constants/skjemaDefinisjonA1";
import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidsgiversSkjemaDto,
  ArbeidsstedIUtlandetDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";
import { mockFetchArbeidsgiverSkjema } from "../../../fixtures/api-mocks";

// Hent felter fra statiske definisjoner
const arbeidsstedIUtlandet =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedIUtlandet;
const paLandFelter = SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedPaLand.felter;
const offshoreFelter = SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedOffshore.felter;
const paSkipFelter = SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedPaSkip.felter;
const omBordPaFlyFelter =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedOmBordPaFly.felter;

export class ArbeidsstedIUtlandetStegPage {
  readonly page: Page;
  readonly skjema: ArbeidsgiversSkjemaDto;
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
  readonly beskrivelseVekslendeTextarea: Locator;
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

  constructor(page: Page, skjema: ArbeidsgiversSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: arbeidsstedIUtlandet.tittel,
    });
    this.arbeidsstedTypeSelect = page.getByRole("combobox", {
      name: arbeidsstedIUtlandet.felter.arbeidsstedType.label,
    });

    // Felles - alle seksjoner har navnPaVirksomhet med samme label
    this.navnPaVirksomhetInput = page.getByLabel(paLandFelter.navnPaVirksomhet.label);

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
    this.beskrivelseVekslendeTextarea = page.getByLabel(
      paLandFelter.beskrivelseVekslende.label,
    );

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
    await this.page.goto(
      `/skjema/arbeidsgiver/${this.skjema.id}/arbeidssted-i-utlandet`,
    );
  }

  async mockArbeidsstedIUtlandetData(
    arbeidsstedIUtlandetData: ArbeidsstedIUtlandetDto,
  ) {
    await mockFetchArbeidsgiverSkjema(this.page, {
      ...this.skjema,
      data: {
        ...this.skjema.data,
        arbeidsstedIUtlandet: arbeidsstedIUtlandetData,
      },
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
      `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${this.skjema.id}/arbeidssted-i-utlandet`,
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
      `/skjema/arbeidsgiver/${this.skjema.id}/arbeidstakerens-lonn`,
    );
  }
}
