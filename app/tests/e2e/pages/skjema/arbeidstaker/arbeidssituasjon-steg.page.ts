import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidssituasjonDto,
  ArbeidstakersSkjemaDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";

export class ArbeidssituasjonStegPage {
  readonly page: Page;
  readonly skjema: ArbeidstakersSkjemaDto;
  readonly heading: Locator;
  readonly harVaertEllerSkalVaereILonnetArbeidRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly aktivitetIMaanedenFoerUtsendingenTextarea: Locator;
  readonly skalJobbeForFlereVirksomheterRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidstakersSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.arbeidssituasjonSteg.tittel,
    });

    const harVaertEllerSkalVaereILonnetArbeidGroup = page.getByRole("group", {
      name: nb.translation.arbeidssituasjonSteg
        .harDuVaertEllerSkalVaereILonnetArbeidINorgeIMinst1ManedRettForUtsendingen,
    });
    this.harVaertEllerSkalVaereILonnetArbeidRadioGroup = {
      JA: harVaertEllerSkalVaereILonnetArbeidGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: harVaertEllerSkalVaereILonnetArbeidGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.aktivitetIMaanedenFoerUtsendingenTextarea = page.getByLabel(
      nb.translation.arbeidssituasjonSteg.beskriveAktivitetFoerUtsending,
    );

    const skalJobbeForFlereVirksomheterGroup = page.getByRole("group", {
      name: nb.translation.arbeidssituasjonSteg
        .skalDuOgsaDriveSelvstendigVirksomhetEllerJobbeForEnAnnenArbeidsgiver,
    });
    this.skalJobbeForFlereVirksomheterRadioGroup = {
      JA: skalJobbeForFlereVirksomheterGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: skalJobbeForFlereVirksomheterGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(
      `/skjema/arbeidstaker/${this.skjema.id}/arbeidssituasjon`,
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
      `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${this.skjema.id}/arbeidssituasjon`,
    );
    await this.lagreOgFortsettButton.click();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(expectedPayload: ArbeidssituasjonDto) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/arbeidstaker/${this.skjema.id}/utenlandsoppdraget`,
    );
  }
}
