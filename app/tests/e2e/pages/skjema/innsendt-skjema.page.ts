import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "~/i18n/nb";
import type { UtsendtArbeidstakerSkjemaDto } from "~/types/melosysSkjemaTypes";

const translations = nb.translation.innsendtSkjema;

export class InnsendtSkjemaPage {
  readonly page: Page;
  readonly skjemaId: string;
  readonly heading: Locator;
  readonly arbeidstakersDelHeading: Locator;
  readonly arbeidsgiverDelHeading: Locator;
  readonly tilbakeTilOversiktButton: Locator;

  constructor(page: Page, skjemaId: string) {
    this.page = page;
    this.skjemaId = skjemaId;
    this.heading = page.getByRole("heading", {
      name: translations.tittel,
    });
    this.arbeidstakersDelHeading = page.getByRole("heading", {
      name: translations.arbeidstakersDel,
    });
    this.arbeidsgiverDelHeading = page.getByRole("heading", {
      name: translations.arbeidsgiverDel,
    });
    this.tilbakeTilOversiktButton = page.getByRole("button", {
      name: translations.tilbakeTilOversikt,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjemaId}/innsendt`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async assertArbeidstakersDelVisible() {
    await expect(this.arbeidstakersDelHeading).toBeVisible();
  }

  async assertArbeidsgiverDelVisible() {
    await expect(this.arbeidsgiverDelHeading).toBeVisible();
  }

  async assertArbeidstakersDelNotVisible() {
    await expect(this.arbeidstakersDelHeading).not.toBeVisible();
  }

  async assertArbeidsgiverDelNotVisible() {
    await expect(this.arbeidsgiverDelHeading).not.toBeVisible();
  }

  async clickTilbakeTilOversikt() {
    await this.tilbakeTilOversiktButton.click();
  }

  async assertNavigatedToOversikt() {
    await expect(this.page).toHaveURL(/\/oversikt\?representasjonstype=/);
  }

  async assertReferanseIdVisible(referanseId: string) {
    await expect(this.page.getByText(referanseId)).toBeVisible();
  }

  async assertArbeidstakerOgArbeidsgiverInfo(
    skjema: UtsendtArbeidstakerSkjemaDto,
  ) {
    await expect(
      this.page.locator(`dt:text-is("${nb.translation.felles.navn}") + dd`),
    ).toHaveText(skjema.metadata.arbeidstakerNavn);
    await expect(
      this.page.locator(
        `dt:text-is("${nb.translation.oversiktFelles.arbeidstakerFnrLabel}") + dd`,
      ),
    ).toHaveText(skjema.fnr);
    await expect(
      this.page.locator(
        `dt:text-is("${nb.translation.felles.virksomhetsnavn}") + dd`,
      ),
    ).toHaveText(skjema.metadata.arbeidsgiverNavn);
    await expect(
      this.page.locator(
        `dt:text-is("${nb.translation.felles.organisasjonsnummer}") + dd`,
      ),
    ).toHaveText(skjema.orgnr);
  }
}
