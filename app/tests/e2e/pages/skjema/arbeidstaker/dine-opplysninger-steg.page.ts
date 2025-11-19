import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidstakersSkjemaDto,
  DineOpplysningerDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";

export class DineOpplysningerStegPage {
  readonly page: Page;
  readonly skjema: ArbeidstakersSkjemaDto;
  readonly heading: Locator;
  readonly harNorskFodselsnummerRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly fodselsnummerInput: Locator;
  readonly fornavnInput: Locator;
  readonly etternavnInput: Locator;
  readonly fodselsdatoInput: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidstakersSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.dineOpplysningerSteg.tittel,
    });

    const harNorskFodselsnummerGroup = page.getByRole("group", {
      name: nb.translation.dineOpplysningerSteg
        .harDuNorskFodselsnummerEllerDNummer,
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
      nb.translation.dineOpplysningerSteg.dittFodselsnummerEllerDNummer,
    );
    this.fornavnInput = page.getByLabel(
      nb.translation.dineOpplysningerSteg.dittFornavn,
    );
    this.etternavnInput = page.getByLabel(
      nb.translation.dineOpplysningerSteg.dittEtternavn,
    );
    this.fodselsdatoInput = page.getByLabel(
      nb.translation.dineOpplysningerSteg.dinFodselsdato,
    );

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(
      `/skjema/arbeidstaker/${this.skjema.id}/dine-opplysninger`,
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
      `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${this.skjema.id}/dine-opplysninger`,
    );
    await this.lagreOgFortsettButton.click();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(expectedPayload: DineOpplysningerDto) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/arbeidstaker/${this.skjema.id}/utenlandsoppdraget`,
    );
  }

  async assertHarNorskFodselsnummerIsJa() {
    await expect(this.harNorskFodselsnummerRadioGroup.JA).toBeChecked();
  }

  async assertFodselsnummerValue(expectedValue: string) {
    await expect(this.fodselsnummerInput).toHaveValue(expectedValue);
  }
}
