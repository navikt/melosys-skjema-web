import { expect, type Locator, type Page } from "@playwright/test";

import { translations as alleTranslations } from "../../utils/translations";

const translations = alleTranslations.velgRadgiverfirma;

const feilmeldinger = {
  duMaSokeForst: translations.duMaSokeForstFeil,
};

export class VelgRadgiverfirmaPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly sokPaVirksomhetInput: Locator;
  readonly okButton: Locator;
  readonly avbrytButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: translations.tittel,
    });
    this.sokPaVirksomhetInput = page.getByLabel(translations.sokPaVirksomhet);
    this.okButton = page.getByRole("button", {
      name: translations.ok,
      // «Ok» er substring av «Bokmål» — språkvelgeren i headeren krever eksakt match
      exact: true,
    });
    this.avbrytButton = page.getByRole("button", {
      name: alleTranslations.felles.avbryt,
    });
  }

  async goto() {
    await this.page.goto("/representasjon/velg-radgiverfirma");
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async sokOgVelgFirma(orgnr: string, expectedOrgName: string) {
    await this.sokPaVirksomhetInput.fill(orgnr);
    // Wait for the search result to appear — the ValgtOrganisasjon component renders the org name
    await this.page.getByText(expectedOrgName).waitFor();
  }

  async klikKOk() {
    await this.okButton.click();
  }

  async klikKAvbryt() {
    await this.avbrytButton.click();
  }

  async assertNavigatedToOversikt() {
    await expect(this.page).toHaveURL(
      /\/oversikt\?representasjonstype=RADGIVER/,
    );
  }

  async assertStillOnPage() {
    await expect(this.page).toHaveURL(/\/representasjon\/velg-radgiverfirma/);
  }

  async assertDuMaSokeForstFeilmeldingIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.duMaSokeForst),
    ).toBeVisible();
  }
}
