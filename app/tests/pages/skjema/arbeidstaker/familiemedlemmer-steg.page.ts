import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../src/i18n/nb";
import type {
  ArbeidstakersSkjemaDto,
  FamiliemedlemmerDto,
} from "../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../types/playwright-types";

export class FamiliemedlemmerStegPage {
  readonly page: Page;
  readonly skjema: ArbeidstakersSkjemaDto;
  readonly heading: Locator;
  readonly sokerForBarnUnder18RadioGroup: RadioButtonGroupJaNeiLocator;
  readonly harEktefelleEllerBarnOver18RadioGroup: RadioButtonGroupJaNeiLocator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidstakersSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.familiemedlemmerSteg.tittel,
    });

    const sokerForBarnUnder18Group = page.getByRole("group", {
      name: nb.translation.familiemedlemmerSteg
        .sokerDuForBarnUnder18SomSkalVaereMed,
    });
    this.sokerForBarnUnder18RadioGroup = {
      JA: sokerForBarnUnder18Group.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: sokerForBarnUnder18Group.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    const harEktefelleEllerBarnOver18Group = page.getByRole("group", {
      name: nb.translation.familiemedlemmerSteg
        .harDuEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad,
    });
    this.harEktefelleEllerBarnOver18RadioGroup = {
      JA: harEktefelleEllerBarnOver18Group.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: harEktefelleEllerBarnOver18Group.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(
      `/skjema/arbeidstaker/${this.skjema.id}/familiemedlemmer`,
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
      `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${this.skjema.id}/familiemedlemmer`,
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
      `/skjema/arbeidstaker/${this.skjema.id}/tilleggsopplysninger`,
    );
  }
}
