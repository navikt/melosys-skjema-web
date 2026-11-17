import { expect, type Locator, type Page } from "@playwright/test";

import { translations as alleTranslations } from "../../utils/translations";

const translations = alleTranslations.velgSituasjon;

export class VelgSituasjonPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly utsendtLenke: Locator;
  readonly oppholdLenke: Locator;

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
  }

  async goto() {
    await this.page.goto("/velg-situasjon");
  }

  async assertIsVisible() {
    await expect(this.page).toHaveURL(/\/velg-situasjon$/);
    await expect(this.heading).toBeVisible();
    await expect(this.utsendtLenke).toBeVisible();
    await expect(this.oppholdLenke).toBeVisible();
  }

  async assertOppholdLenkePekerRiktig() {
    await expect(this.oppholdLenke).toHaveAttribute(
      "href",
      translations.oppholdLenke,
    );
  }

  async velgUtsendt() {
    await this.utsendtLenke.click();
  }
}
