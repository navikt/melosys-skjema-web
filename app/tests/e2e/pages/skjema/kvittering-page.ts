import { expect, type Locator, type Page } from "@playwright/test";

import { SkjemaInnsendtKvittering } from "~/types/melosysSkjemaTypes";

import { translations } from "../../utils/translations";

export class KvitteringPage {
  readonly page: Page;
  readonly skjemaId: string;
  readonly heading: Locator;
  readonly melding: Locator;
  readonly infoOversikt: Locator;
  readonly tilOversiktLink: Locator;

  constructor(page: Page, skjemaId: string) {
    this.page = page;
    this.skjemaId = skjemaId;
    this.heading = page.getByRole("heading", {
      name: translations.kvittering.tittel,
    });
    this.melding = page.getByText(translations.kvittering.melding);
    this.infoOversikt = page.getByText(translations.kvittering.infoOversikt);
    this.tilOversiktLink = page.getByRole("button", {
      name: translations.kvittering.tilOversikt,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjemaId}/kvittering`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async assertMeldingIsVisible() {
    await expect(this.melding).toBeVisible();
  }

  async assertInfoOversiktIsVisible() {
    await expect(this.infoOversikt).toBeVisible();
  }

  async assertTilOversiktLinkIsVisible() {
    await expect(this.tilOversiktLink).toBeVisible();
  }

  async clickTilOversiktLink() {
    await this.tilOversiktLink.click();
  }

  async assertNavigatedToLandingsside() {
    await expect(this.page).toHaveURL(/\/oversikt\?representasjonstype=/);
  }

  async mockKvittering(kvittering: SkjemaInnsendtKvittering) {
    await this.page.route(
      `/api/skjema/utsendt-arbeidstaker/${this.skjemaId}/innsendt-kvittering`,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(kvittering),
        });
      },
    );
  }
}
