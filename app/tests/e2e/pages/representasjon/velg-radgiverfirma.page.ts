import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../src/i18n/nb";

const translations = nb.translation.velgRadgiverfirma;

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
    });
    this.avbrytButton = page.getByRole("button", {
      name: nb.translation.felles.avbryt,
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
}
