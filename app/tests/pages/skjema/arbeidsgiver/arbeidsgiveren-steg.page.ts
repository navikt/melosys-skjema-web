import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../src/i18n/nb";
import type {
  ArbeidsgiversSkjemaDto,
  OrganisasjonDto,
} from "../../../../src/types/melosysSkjemaTypes";

export class ArbeidsgiverenStegPage {
  readonly page: Page;
  readonly skjema: ArbeidsgiversSkjemaDto;
  readonly heading: Locator;
  readonly organisasjonsnummerInput: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidsgiversSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.arbeidsgiverSteg.tittel,
    });
    this.organisasjonsnummerInput = page.getByLabel(
      nb.translation.arbeidsgiverSteg.arbeidsgiverensOrganisasjonsnummer,
    );
    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async setValgtRolle(organisasjon: OrganisasjonDto) {
    await this.page.goto("/");
    await this.page.evaluate((org) => {
      sessionStorage.setItem("valgtRolle", JSON.stringify(org));
    }, organisasjon);
  }

  async goto() {
    await this.page.goto(
      `/skjema/arbeidsgiver/${this.skjema.id}/arbeidsgiveren`,
    );
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async assertOrganisasjonsnummerValue(expectedValue: string) {
    await expect(this.organisasjonsnummerInput).toHaveValue(expectedValue);
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${this.skjema.id}/arbeidsgiveren`,
    );
    await this.lagreOgFortsettButton.click();
    return await requestPromise;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/arbeidsgiver/${this.skjema.id}/arbeidsgiverens-virksomhet-i-norge`,
    );
  }
}
