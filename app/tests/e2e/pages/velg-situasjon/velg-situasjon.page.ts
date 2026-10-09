import { expect, type Locator, type Page } from "@playwright/test";

import { VALG_DIGITAL_ELLER_PAPIR_URL } from "~/pages/velgSituasjon/VelgSituasjonPage";

import { translations as alleTranslations } from "../../utils/translations";

const translations = alleTranslations.velgSituasjon;

export class VelgSituasjonPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly utsendtLenke: Locator;
  readonly oppholdLenke: Locator;
  readonly gaTilbakeKnapp: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      level: 1,
      name: translations.tittel,
    });
    this.utsendtLenke = page.getByRole("link", {
      name: translations.utsendtTittel,
    });
    this.oppholdLenke = page.getByRole("link", {
      name: translations.oppholdTittel,
    });
    // Aksel Button as="a" får role="button"
    this.gaTilbakeKnapp = page.getByRole("button", {
      name: translations.gaTilbake,
    });
  }

  async gotoRot() {
    await this.page.goto("/");
  }

  async goto() {
    await this.page.goto("/velg-situasjon");
  }

  async assertIsVisible() {
    await expect(this.page).toHaveURL(/\/velg-situasjon$/);
    await expect(this.heading).toBeVisible();
    await expect(this.utsendtLenke).toBeVisible();
    await expect(this.oppholdLenke).toBeVisible();
    await expect(this.gaTilbakeKnapp).toBeVisible();
  }

  async assertLenkerPekerRiktig() {
    await expect(this.oppholdLenke).toHaveAttribute(
      "href",
      translations.oppholdLenke,
    );
    await expect(this.gaTilbakeKnapp).toHaveAttribute(
      "href",
      VALG_DIGITAL_ELLER_PAPIR_URL,
    );
  }

  async velgUtsendt() {
    await this.utsendtLenke.click();
  }
}
