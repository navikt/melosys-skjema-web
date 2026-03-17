import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "../../../../../src/constants/skjemaDefinisjonA1";
import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidssituasjonDto,
  UtsendtArbeidstakerSkjemaDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";

const arbeidssituasjon = SKJEMA_DEFINISJON_A1.seksjoner.arbeidssituasjon;
const felter = arbeidssituasjon.felter;

export class ArbeidssituasjonStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly harVaertILonnetArbeidRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly aktivitetTextarea: Locator;
  readonly skalJobbeForFlereVirksomheterRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: arbeidssituasjon.tittel,
    });

    const harVaertGroup = page.getByRole("group", {
      name: felter.harVaertEllerSkalVaereILonnetArbeidFoerUtsending.label,
    });
    this.harVaertILonnetArbeidRadioGroup = {
      JA: harVaertGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: harVaertGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.aktivitetTextarea = page.getByLabel(
      felter.aktivitetIMaanedenFoerUtsendingen.label,
    );

    const skalJobbeGroup = page.getByRole("group", {
      name: felter.skalJobbeForFlereVirksomheter.label,
    });
    this.skalJobbeForFlereVirksomheterRadioGroup = {
      JA: skalJobbeGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: skalJobbeGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjema.id}/arbeidssituasjon`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/arbeidssituasjon`,
    );
    await this.lagreOgFortsett();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(expectedPayload: ArbeidssituasjonDto) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/skatteforhold-og-inntekt`,
    );
  }
}
