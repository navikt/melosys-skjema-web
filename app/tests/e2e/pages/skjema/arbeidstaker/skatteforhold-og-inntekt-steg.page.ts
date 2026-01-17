import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "../../../../../src/constants/skjemaDefinisjonA1";
import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidstakersSkjemaDto,
  SkatteforholdOgInntektDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";

// Hent felter fra statiske definisjoner
const skatteforholdOgInntekt =
  SKJEMA_DEFINISJON_A1.seksjoner.skatteforholdOgInntekt;
const felter = skatteforholdOgInntekt.felter;

export class SkatteforholdOgInntektStegPage {
  readonly page: Page;
  readonly skjema: ArbeidstakersSkjemaDto;
  readonly heading: Locator;
  readonly erSkattepliktigTilNorgeRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly mottarPengestotteFraAnnetEosLandRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly landSomUtbetalerPengestotteCombobox: Locator;
  readonly pengestotteBelopInput: Locator;
  readonly pengestotteBeskrivelseInput: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidstakersSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: skatteforholdOgInntekt.tittel,
    });

    const erSkattepliktigTilNorgeGroup = page.getByRole("group", {
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

    const mottarPengestotteFraAnnetEosLandGroup = page.getByRole("group", {
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
    await this.page.goto(
      `/skjema/arbeidstaker/${this.skjema.id}/skatteforhold-og-inntekt`,
    );
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${this.skjema.id}/skatteforhold-og-inntekt`,
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
      `/skjema/arbeidstaker/${this.skjema.id}/familiemedlemmer`,
    );
  }
}
