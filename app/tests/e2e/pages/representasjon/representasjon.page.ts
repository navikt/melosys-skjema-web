import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "~/i18n/nb";

const translations = nb.translation.landingsside;

export class RepresentasjonPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly degSelvButton: Locator;
  readonly arbeidsgiverButton: Locator;
  readonly radgiverButton: Locator;
  readonly annenPersonButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: translations.hvemVilDuBrukeNavPaVegneAv,
    });
    this.degSelvButton = page.getByRole("button", {
      name: translations.degSelv,
    });
    this.arbeidsgiverButton = page.getByRole("button", {
      name: `${translations.dinArbeidsgiver} ${translations.dinArbeidsgiverBeskrivelse}`,
    });
    this.radgiverButton = page.getByRole("button", {
      name: `${translations.enArbeidsgiverSomRadgiver} ${translations.enArbeidsgiverSomRadgiverBeskrivelse}`,
    });
    this.annenPersonButton = page.getByRole("button", {
      name: translations.annenPerson,
    });
  }

  async goto() {
    await this.page.goto("/");
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  /**
   * Start disse FØR goto() — negative badge-assertions er ellers racy mot
   * featuretoggle-/ventende-queriene som avgjør om badgen rendres.
   */
  ventPaaFeatureToggles(): Promise<unknown> {
    return this.page.waitForResponse((response) =>
      response.url().includes("/api/featuretoggle"),
    );
  }

  ventPaaVentendeMotpartSoknader(): Promise<unknown> {
    return this.page.waitForResponse((response) =>
      response.url().includes("/ventende-motpart-soknader"),
    );
  }

  async assertSoknadVenterBadgeVisible() {
    await expect(
      this.degSelvButton.getByText(translations.soknadVenterPaaDeg),
    ).toBeVisible();
  }

  async assertSoknadVenterBadgeNotVisible() {
    await expect(
      this.degSelvButton.getByText(translations.soknadVenterPaaDeg),
    ).not.toBeVisible();
  }

  async velgDegSelv() {
    await this.degSelvButton.click();
  }

  async velgArbeidsgiver() {
    await this.arbeidsgiverButton.click();
  }

  async velgRadgiver() {
    await this.radgiverButton.click();
  }

  async velgAnnenPerson() {
    await this.annenPersonButton.click();
  }

  async assertNavigatedToOversikt() {
    await expect(this.page).toHaveURL(/\/oversikt\?representasjonstype=/);
  }

  async assertNavigatedToVelgRadgiverfirma() {
    await expect(this.page).toHaveURL("/representasjon/velg-radgiverfirma");
  }
}
