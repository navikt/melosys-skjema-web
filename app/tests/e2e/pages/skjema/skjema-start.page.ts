import { expect, type Locator, type Page } from "@playwright/test";

import { Representasjonstype } from "~/types/melosysSkjemaTypes";

import { translations } from "../../utils/translations";

const tekster = translations.skjemaStart;

const ROLLE_INFO: Partial<Record<Representasjonstype, string>> = {
  [Representasjonstype.ANNEN_PERSON]: tekster.annenPersonInfo,
  [Representasjonstype.ARBEIDSGIVER]: tekster.arbeidsgiverInfo,
  [Representasjonstype.RADGIVER]: tekster.radgiverInfo,
};

/**
Introsiden (/skjema/start) der brukeren bekrefter før utkastet opprettes.
*/
export class SkjemaStartPage {
  readonly page: Page;
  readonly bekreftelseCheckbox: Locator;
  readonly startSoknadButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bekreftelseCheckbox = page.getByRole("checkbox", {
      name: tekster.bekreftAtVilSvareRiktig,
    });
    this.startSoknadButton = page.getByRole("button", {
      name: tekster.startSoknad,
    });
  }

  async assertIsVisible() {
    await expect(this.page).toHaveURL(/\/skjema\/start(\?|$)/);
    await expect(this.bekreftelseCheckbox).toBeVisible();
  }

  async assertInnhold(representasjonstype: Representasjonstype) {
    await expect(
      this.page.getByRole("heading", {
        name: tekster.informasjonViHenterInn,
      }),
    ).toBeVisible();
    await expect(
      this.page.getByText(tekster.informasjonViHenterInnIntro),
    ).toBeVisible();
    for (const tekst of [
      tekster.folkeregisteret,
      tekster.enhetsregisteret,
      tekster.aaRegisteret,
    ]) {
      await expect(this.page.getByText(tekst)).toBeVisible();
    }
    const personvernLink = this.page.getByRole("link", {
      name: tekster.personvernLinkText,
    });
    await expect(personvernLink).toHaveAttribute(
      "href",
      "https://www.nav.no/personvernerklaering",
    );
    await expect(personvernLink).toHaveAttribute("target", "_blank");
    await expect(personvernLink).toHaveAttribute("rel", "noopener noreferrer");
    await expect(this.page.getByText(tekster.intro)).toBeVisible();
    const bekreftelsesLink = this.page.getByRole("link", {
      name: tekster.linkText,
    });
    await expect(bekreftelsesLink).toHaveAttribute(
      "href",
      "https://www.nav.no/endringer",
    );
    await expect(bekreftelsesLink).toHaveAttribute("target", "_blank");

    for (const [type, tekst] of Object.entries(ROLLE_INFO)) {
      await (type === representasjonstype
        ? expect(this.page.getByText(tekst)).toBeVisible()
        : expect(this.page.getByText(tekst)).not.toBeVisible());
    }
  }

  async bekreft() {
    await this.bekreftelseCheckbox.check();
  }

  async startSoknad() {
    await this.startSoknadButton.click();
  }

  /**
  Verifiserer siden for rollen, bekrefter og starter søknaden.
  */
  async bekreftOgStart(representasjonstype: Representasjonstype) {
    await this.assertIsVisible();
    await this.assertInnhold(representasjonstype);
    await this.bekreft();
    await this.startSoknad();
  }

  async assertManglerBekreftelseVisible() {
    await expect(this.page.getByText(tekster.manglerBekreftelse)).toBeVisible();
    await expect(this.page).toHaveURL(/\/skjema\/start(\?|$)/);
  }
}
