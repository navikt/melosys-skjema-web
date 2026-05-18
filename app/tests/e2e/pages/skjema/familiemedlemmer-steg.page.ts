import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type {
  FamiliemedlemmerDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import type { RadioButtonGroupJaNeiLocator } from "../../../types/playwright-types";

const familiemedlemmerSeksjon = SKJEMA_DEFINISJON_A1.seksjoner.familiemedlemmer;
const felter = familiemedlemmerSeksjon.felter;
const t = nb.translation;

export class FamiliemedlemmerStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly harDuFamiliemedlemmerSomSkalVaereMedRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly lagreOgFortsettButton: Locator;
  readonly infoboks: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: familiemedlemmerSeksjon.tittel,
    });

    const harDuFamiliemedlemmerSomSkalVaereMedGroup = page.getByRole(
      "radiogroup",
      {
        name: felter.skalHaMedFamiliemedlemmer.label,
      },
    );
    this.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup = {
      JA: harDuFamiliemedlemmerSomSkalVaereMedGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: harDuFamiliemedlemmerSomSkalVaereMedGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.infoboks = page.getByRole("region").filter({
      hasText: t.familiemedlemmerSteg.informasjonOmEgenSoknad,
    });

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjema.id}/familiemedlemmer`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/familiemedlemmer`,
    );
    await this.lagreOgFortsettButton.click();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(expectedPayload: FamiliemedlemmerDto) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/tilleggsopplysninger`,
    );
  }

  async assertStillOnStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/familiemedlemmer`,
    );
  }

  // --- Infoboks assertions ---

  async assertInfoboksIsVisible() {
    await expect(this.infoboks).toBeVisible();
  }

  async assertInfoboksIsNotVisible() {
    await expect(this.infoboks).toBeHidden();
  }

  // --- Validation assertions ---

  private skalHaMedFamiliemedlemmerFieldset() {
    return this.page.getByRole("radiogroup", {
      name: felter.skalHaMedFamiliemedlemmer.label,
    });
  }

  async assertDuMaSvarePaOmDuHarFamiliemedlemmerIsVisible() {
    await expect(
      this.skalHaMedFamiliemedlemmerFieldset().getByText(
        t.familiemedlemmerSteg
          .duMaSvarePaOmDuHarFamiliemedlemmerSomSkalVaereMed,
      ),
    ).toBeVisible();
  }
}
