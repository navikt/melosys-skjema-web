import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "~/i18n/nb";

export class ArbeidstakerSkjemaVeiledningPage {
  readonly page: Page;
  readonly startSoknadButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startSoknadButton = page.getByRole("button", {
      name: nb.translation.felles.startSoknad,
    });
  }

  async assertStartSoknadButtonVisible() {
    await expect(this.startSoknadButton).toBeVisible();
  }

  async startSoknad() {
    await this.startSoknadButton.click();
  }

  async assertNavigatedToUtsendingsperiodeOgLand(skjemaId: string) {
    await expect(this.page).toHaveURL(
      `/skjema/${skjemaId}/utsendingsperiode-og-land`,
    );
  }
}
