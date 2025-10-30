import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../src/i18n/nb";
import type {
  ArbeidstakerenDto,
  ArbeidstakersSkjemaDto,
} from "../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../types/playwright-types";

export class ArbeidstakerenStegPage {
  readonly page: Page;
  readonly skjema: ArbeidstakersSkjemaDto;
  readonly heading: Locator;
  readonly harNorskFodselsnummerRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly fodselsnummerInput: Locator;
  readonly fornavnInput: Locator;
  readonly etternavnInput: Locator;
  readonly fodselsdatoInput: Locator;
  readonly harVaertEllerSkalVaereILonnetArbeidRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly skalJobbeForFlereVirksomheterRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidstakersSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.arbeidstakerenSteg.tittel,
    });

    const harNorskFodselsnummerGroup = page.getByRole("group", {
      name: nb.translation.arbeidstakerenSteg
        .harArbeidstakerenNorskFodselsnummerEllerDNummer,
    });
    this.harNorskFodselsnummerRadioGroup = {
      JA: harNorskFodselsnummerGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: harNorskFodselsnummerGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.fodselsnummerInput = page.getByLabel(
      nb.translation.arbeidstakerenSteg
        .arbeidstakerensFodselsnummerEllerDNummer,
    );
    this.fornavnInput = page.getByLabel(
      nb.translation.arbeidstakerenSteg.arbeidstakerensFornavn,
    );
    this.etternavnInput = page.getByLabel(
      nb.translation.arbeidstakerenSteg.arbeidstakerensEtternavn,
    );
    this.fodselsdatoInput = page.getByLabel(
      nb.translation.arbeidstakerenSteg.arbeidstakerensFodselsdato,
    );

    const harVaertEllerSkalVaereILonnetArbeidGroup = page.getByRole("group", {
      name: nb.translation.arbeidstakerenSteg
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

    const skalJobbeForFlereVirksomheterGroup = page.getByRole("group", {
      name: nb.translation.arbeidstakerenSteg
        .skalDuJobbeForFlereVirksomheterIPerioden,
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
      `/skjema/arbeidstaker/${this.skjema.id}/arbeidstakeren`,
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
      `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${this.skjema.id}/arbeidstakeren`,
    );
    await this.lagreOgFortsettButton.click();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(expectedPayload: ArbeidstakerenDto) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/arbeidstaker/${this.skjema.id}/skatteforhold-og-inntekt`,
    );
  }

  async assertHarNorskFodselsnummerIsJa() {
    await expect(this.harNorskFodselsnummerRadioGroup.JA).toBeChecked();
  }

  async assertFodselsnummerValue(expectedValue: string) {
    await expect(this.fodselsnummerInput).toHaveValue(expectedValue);
  }
}
