import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type {
  SkatteforholdOgInntektDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import type { RadioButtonGroupJaNeiLocator } from "../../../types/playwright-types";

// Hent felter fra statiske definisjoner
const skatteforholdOgInntekt =
  SKJEMA_DEFINISJON_A1.seksjoner.skatteforholdOgInntekt;
const felter = skatteforholdOgInntekt.felter;
const t = nb.translation;

// Feilmeldinger
const feilmeldinger = {
  duMaSvarePaOmDuErSkattepliktig:
    t.skatteforholdOgInntektSteg
      .duMaSvarePaOmDuErSkattepliktigTilNorgeIHeleUtsendingsperioden,
  duMaSvarePaOmDuMottarPengestotte:
    t.skatteforholdOgInntektSteg
      .duMaSvarePaOmDuMottarPengestotteFraEtAnnetEosLandEllerSveits,
  duMaBeskriveHvaSlagsPengestotte:
    t.skatteforholdOgInntektSteg.duMaBeskriveHvaSlagsPengestotteDuMottar,
  duMaVelgeHvilketLandSomUtbetalerPengestotten:
    t.skatteforholdOgInntektSteg.duMaVelgeHvilketLandSomUtbetalerPengestotten,
  duMaOppgiEtGyldigBelop:
    t.skatteforholdOgInntektSteg.duMaOppgiEtGyldigBelopSomErStorreEnn0,
};

export class SkatteforholdOgInntektStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly erSkattepliktigTilNorgeRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly mottarPengestotteFraAnnetEosLandRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly landSomUtbetalerPengestotteCombobox: Locator;
  readonly pengestotteBelopInput: Locator;
  readonly pengestotteBeskrivelseInput: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: skatteforholdOgInntekt.tittel,
    });

    const erSkattepliktigTilNorgeGroup = page.getByRole("radiogroup", {
      name: felter.erSkattepliktigTilNorgeIHeleutsendingsperioden.label,
    });
    this.erSkattepliktigTilNorgeRadioGroup = {
      JA: erSkattepliktigTilNorgeGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: erSkattepliktigTilNorgeGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    const mottarPengestotteFraAnnetEosLandGroup = page.getByRole("radiogroup", {
      name: felter.mottarPengestotteFraAnnetEosLandEllerSveits.label,
    });
    this.mottarPengestotteFraAnnetEosLandRadioGroup = {
      JA: mottarPengestotteFraAnnetEosLandGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: mottarPengestotteFraAnnetEosLandGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.landSomUtbetalerPengestotteCombobox = page.getByRole("combobox", {
      name: felter.landSomUtbetalerPengestotte.label,
    });
    this.pengestotteBelopInput = page.getByLabel(
      felter.pengestotteSomMottasFraAndreLandBelop.label,
    );
    this.pengestotteBeskrivelseInput = page.getByLabel(
      felter.pengestotteSomMottasFraAndreLandBeskrivelse.label,
    );

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjema.id}/skatteforhold-og-inntekt`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/skatteforhold-og-inntekt`,
    );
    await this.lagreOgFortsettButton.click();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(
    expectedPayload: SkatteforholdOgInntektDto,
  ) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/familiemedlemmer`,
    );
  }

  async assertStillOnStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/skatteforhold-og-inntekt`,
    );
  }

  // --- Validation assertions ---

  private erSkattepliktigFieldset() {
    return this.page.getByRole("radiogroup", {
      name: felter.erSkattepliktigTilNorgeIHeleutsendingsperioden.label,
    });
  }

  private mottarPengestotteFieldset() {
    return this.page.getByRole("radiogroup", {
      name: felter.mottarPengestotteFraAnnetEosLandEllerSveits.label,
    });
  }

  async assertDuMaSvarePaOmDuErSkattepliktigIsVisible() {
    await expect(
      this.erSkattepliktigFieldset().getByText(
        feilmeldinger.duMaSvarePaOmDuErSkattepliktig,
      ),
    ).toBeVisible();
  }

  async assertDuMaSvarePaOmDuMottarPengestotteIsVisible() {
    await expect(
      this.mottarPengestotteFieldset().getByText(
        feilmeldinger.duMaSvarePaOmDuMottarPengestotte,
      ),
    ).toBeVisible();
  }

  async assertDuMaBeskriveHvaSlagsPengestotteIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.duMaBeskriveHvaSlagsPengestotte),
    ).toBeVisible();
  }

  async assertDuMaVelgeHvilketLandSomUtbetalerPengestottenIsVisible() {
    await expect(
      this.page.getByText(
        feilmeldinger.duMaVelgeHvilketLandSomUtbetalerPengestotten,
      ),
    ).toBeVisible();
  }

  async assertDuMaOppgiEtGyldigBelopIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.duMaOppgiEtGyldigBelop),
    ).toBeVisible();
  }
}
