import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../../src/i18n/nb";
import type { UtsendtArbeidstakerSkjemaDto } from "../../../../../src/types/melosysSkjemaTypes";

export class VedleggStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly lagreOgFortsettButton: Locator;
  readonly fileInput: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.vedleggSteg.tittel,
    });

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });

    this.fileInput = page.locator("input[type='file']");
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjema.id}/vedlegg`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async uploadFile(fileName: string, mimeType: string, content: Buffer) {
    await this.fileInput.setInputFiles({
      name: fileName,
      mimeType,
      buffer: content,
    });
  }

  async assertFileItemVisible(fileName: string) {
    await expect(this.page.getByText(fileName)).toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(`/skjema/${this.skjema.id}/oppsummering`);
  }
}
