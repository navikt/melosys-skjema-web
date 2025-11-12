import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidstakersSkjemaDto,
  TilleggsopplysningerDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";

export class TilleggsopplysningerStegPage {
  readonly page: Page;
  readonly skjema: ArbeidstakersSkjemaDto;
  readonly heading: Locator;
  readonly harFlereOpplysningerRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly tilleggsopplysningerTextarea: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidstakersSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.tilleggsopplysningerSteg.tittel,
    });

    const harFlereOpplysningerGroup = page.getByRole("group", {
      name: nb.translation.tilleggsopplysningerSteg
        .harDuNoenFlereOpplysningerTilSoknaden,
    });
    this.harFlereOpplysningerRadioGroup = {
      JA: harFlereOpplysningerGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: harFlereOpplysningerGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.tilleggsopplysningerTextarea = page.getByLabel(
      nb.translation.tilleggsopplysningerSteg
        .beskriveFlereOpplysningerTilSoknaden,
    );

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(
      `/skjema/arbeidstaker/${this.skjema.id}/tilleggsopplysninger`,
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
      `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${this.skjema.id}/tilleggsopplysninger`,
    );
    await this.lagreOgFortsettButton.click();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(
    expectedPayload: TilleggsopplysningerDto,
  ) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToOppsummering() {
    await expect(this.page).toHaveURL(
      `/skjema/arbeidstaker/${this.skjema.id}/vedlegg`,
    );
  }
}
