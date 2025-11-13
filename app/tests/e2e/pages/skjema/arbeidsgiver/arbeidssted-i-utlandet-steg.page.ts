import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidsgiversSkjemaDto,
  ArbeidsstedIUtlandetDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";
import { mockFetchArbeidsgiverSkjema } from "../../../fixtures/api-mocks";

export class ArbeidsstedIUtlandetStegPage {
  readonly page: Page;
  readonly skjema: ArbeidsgiversSkjemaDto;
  readonly heading: Locator;
  readonly arbeidsstedTypeSelect: Locator;
  readonly lagreOgFortsettButton: Locator;

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
      name: nb.translation.arbeidsstedIUtlandetSteg.tittel,
    });
    this.arbeidsstedTypeSelect = page.getByRole("combobox", {
      name: nb.translation.arbeidsstedIUtlandetSteg.hvorSkalArbeidetUtfores,
    });

    // På land
    const fastEllerVekslendeGroup = page.getByRole("group", {
      name: nb.translation.arbeidsstedIUtlandetSteg
        .harFastArbeidsstedEllerVeksler,
    });
    this.fastEllerVekslendeRadioGroup = {
      FAST: fastEllerVekslendeGroup.getByRole("radio", {
        name: nb.translation.arbeidsstedIUtlandetSteg.fastArbeidssted,
      }),
      VEKSLENDE: fastEllerVekslendeGroup.getByRole("radio", {
        name: nb.translation.arbeidsstedIUtlandetSteg.vekslerOfte,
      }),
    };

    this.vegadresseInput = page.getByLabel(
      nb.translation.arbeidsstedIUtlandetSteg.vegadresse,
    );
    this.nummerInput = page.getByLabel(
      nb.translation.arbeidsstedIUtlandetSteg.nummer,
    );
    this.postkodeInput = page.getByLabel(
      nb.translation.arbeidsstedIUtlandetSteg.postkode,
    );
    this.byStedInput = page.getByLabel(
      nb.translation.arbeidsstedIUtlandetSteg.bySted,
    );
    this.beskrivelseVekslendeTextarea = page.getByLabel(
      nb.translation.arbeidsstedIUtlandetSteg.beskriv,
    );

    const erHjemmekontorGroup = page.getByRole("group", {
      name: nb.translation.arbeidsstedIUtlandetSteg.erHjemmekontor,
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
      nb.translation.arbeidsstedIUtlandetSteg.navnPaInnretning,
    );

    const typeInnretningGroup = page.getByRole("group", {
      name: nb.translation.arbeidsstedIUtlandetSteg.hvilkenTypeInnretning,
    });
    this.typeInnretningRadioGroup = {
      PLATTFORM: typeInnretningGroup.getByRole("radio", {
        name: nb.translation.arbeidsstedIUtlandetSteg.plattformEllerFast,
      }),
      BORESKIP: typeInnretningGroup.getByRole("radio", {
        name: nb.translation.arbeidsstedIUtlandetSteg.boreskipEllerFlyttbar,
      }),
    };

    this.sokkelLandSelect = page.getByRole("combobox", {
      name: nb.translation.arbeidsstedIUtlandetSteg.hvilketLandsSokkel,
    });

    // På skip
    this.navnPaSkipInput = page.getByLabel(
      nb.translation.arbeidsstedIUtlandetSteg.navnPaSkip,
    );
    this.yrketTilArbeidstakerInput = page.getByLabel(
      nb.translation.arbeidsstedIUtlandetSteg.yrketTilArbeidstaker,
    );

    const seilerIGroup = page.getByRole("group", {
      name: nb.translation.arbeidsstedIUtlandetSteg.hvorSkalSkipetSeile,
    });
    this.seilerIRadioGroup = {
      INTERNASJONALT: seilerIGroup.getByRole("radio", {
        name: nb.translation.arbeidsstedIUtlandetSteg.internasjonaltFarvann,
      }),
      TERRITORIALFARVANN: seilerIGroup.getByRole("radio", {
        name: nb.translation.arbeidsstedIUtlandetSteg.territorialfarvann,
      }),
    };

    this.flagglandSelect = page.getByRole("combobox", {
      name: nb.translation.arbeidsstedIUtlandetSteg.flaggland,
    });
    this.territorialfarvannLandSelect = page.getByRole("combobox", {
      name: nb.translation.arbeidsstedIUtlandetSteg
        .hvilketLandsTerritorialfarvann,
    });

    // Om bord på fly
    this.hjemmebaseLandSelect = page.getByRole("combobox", {
      name: nb.translation.arbeidsstedIUtlandetSteg.hjemmebaseLand,
    });
    this.hjemmebaseNavnInput = page.getByLabel(
      nb.translation.arbeidsstedIUtlandetSteg.hjemmebaseNavn,
    );

    const erVanligHjemmebaseGroup = page.getByRole("group", {
      name: nb.translation.arbeidsstedIUtlandetSteg.erVanligHjemmebase,
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
      name: nb.translation.arbeidsstedIUtlandetSteg.vanligHjemmebaseLand,
    });
    this.vanligHjemmebaseNavnInput = page.getByLabel(
      nb.translation.arbeidsstedIUtlandetSteg.vanligHjemmebaseNavn,
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
