import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type { UtsendtArbeidstakerSkjemaDto } from "~/types/melosysSkjemaTypes";

const harAnnenDokumentasjonFelt =
  SKJEMA_DEFINISJON_A1.seksjoner.vedleggArbeidstaker.felter
    .harAnnenDokumentasjon;

export class VedleggStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly lagreOgFortsettButton: Locator;
  readonly fileInput: Locator;
  readonly jaRadio: Locator;
  readonly neiRadio: Locator;

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

    this.jaRadio = page.getByRole("radio", {
      name: harAnnenDokumentasjonFelt.jaLabel,
    });
    this.neiRadio = page.getByRole("radio", {
      name: harAnnenDokumentasjonFelt.neiLabel,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjema.id}/vedlegg`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async velgHarAnnenDokumentasjonJa() {
    await this.jaRadio.check();
  }

  async velgHarAnnenDokumentasjonNei() {
    await this.neiRadio.check();
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

  async deleteFileItem() {
    await this.page.getByRole("button", { name: "Slett filen" }).click();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(`/skjema/${this.skjema.id}/oppsummering`);
  }
}
