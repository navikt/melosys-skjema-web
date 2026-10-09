import { expect, type Locator, type Page } from "@playwright/test";

import { translations as alleTranslations } from "../../utils/translations";

const translations = alleTranslations.landingsside;

export class RepresentasjonPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly degSelvLenke: Locator;
  readonly arbeidsgiverLenke: Locator;
  readonly radgiverLenke: Locator;
  readonly annenPersonLenke: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: translations.hvemVilDuBrukeNavPaVegneAv,
    });
    this.degSelvLenke = page.getByRole("link", {
      name: translations.degSelv,
      exact: true,
    });
    this.arbeidsgiverLenke = page.getByRole("link", {
      name: translations.dinArbeidsgiver,
      exact: true,
    });
    this.radgiverLenke = page.getByRole("link", {
      name: translations.enArbeidsgiverSomRadgiver,
      exact: true,
    });
    this.annenPersonLenke = page.getByRole("link", {
      name: translations.annenPerson,
      exact: true,
    });
  }

  private kortFor(lenke: Locator): Locator {
    return this.page.locator(".aksel-link-card").filter({ has: lenke });
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
      this.kortFor(this.degSelvLenke).getByText(
        translations.soknadVenterPaaDeg,
      ),
    ).toBeVisible();
  }

  async assertSoknadVenterBadgeNotVisible() {
    await expect(
      this.kortFor(this.degSelvLenke).getByText(
        translations.soknadVenterPaaDeg,
      ),
    ).not.toBeVisible();
  }

  async velgDegSelv() {
    await this.degSelvLenke.click();
  }

  async velgArbeidsgiver() {
    await this.arbeidsgiverLenke.click();
  }

  async velgRadgiver() {
    await this.radgiverLenke.click();
  }

  async velgAnnenPerson() {
    await this.annenPersonLenke.click();
  }

  async assertNavigatedToOversikt() {
    await expect(this.page).toHaveURL(/\/oversikt\?representasjonstype=/);
  }

  async assertNavigatedToVelgRadgiverfirma() {
    await expect(this.page).toHaveURL("/representasjon/velg-radgiverfirma");
  }
}
