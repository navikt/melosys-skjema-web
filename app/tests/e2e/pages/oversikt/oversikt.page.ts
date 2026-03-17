import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../src/i18n/nb";
import { Representasjonstype } from "../../../../src/types/melosysSkjemaTypes";

const translations = nb.translation;

export class OversiktPage {
  readonly page: Page;
  readonly representasjonstype: Representasjonstype;
  readonly heading: Locator;
  readonly startSoknadButton: Locator;
  readonly utkastExpansionCard: Locator;
  readonly historikkHeading: Locator;

  constructor(page: Page, representasjonstype: Representasjonstype) {
    this.page = page;
    this.representasjonstype = representasjonstype;

    // All representasjonstyper share the same tittel
    this.heading = page.getByRole("heading", {
      name: translations.oversiktDegSelv.tittel,
    });

    this.startSoknadButton = page.getByRole("button", {
      name: translations.oversiktFelles.gaTilSkjemaKnapp,
    });

    this.utkastExpansionCard = page.getByText(
      translations.oversiktFelles.utkastTittel,
    );

    this.historikkHeading = page.getByRole("heading", {
      name: translations.oversiktFelles.historikkTittel,
    });
  }

  async goto() {
    const params = new URLSearchParams({
      representasjonstype: this.representasjonstype,
    });
    await this.page.goto(`/oversikt?${params.toString()}`);
  }

  async gotoWithRadgiver(radgiverOrgnr: string) {
    const params = new URLSearchParams({
      representasjonstype: Representasjonstype.RADGIVER,
      radgiverOrgnr,
    });
    await this.page.goto(`/oversikt?${params.toString()}`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async assertStartSoknadVisible() {
    await expect(this.startSoknadButton).toBeVisible();
  }

  async clickStartSoknad() {
    await this.startSoknadButton.click();
  }

  async assertUtkastListVisible() {
    await expect(this.utkastExpansionCard.first()).toBeVisible();
  }

  async assertHistorikkVisible() {
    await expect(this.historikkHeading).toBeVisible();
  }

  async assertNavigatedToSkjema() {
    await expect(this.page).toHaveURL(/\/skjema\//);
  }
}
