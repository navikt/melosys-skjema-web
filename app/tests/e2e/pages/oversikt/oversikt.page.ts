import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "~/i18n/nb";
import { Representasjonstype } from "~/types/melosysSkjemaTypes";

const translations = nb.translation;

const feilmeldinger = {
  valideringManglerArbeidsgiver:
    translations.oversiktFelles.valideringManglerArbeidsgiver,
  valideringManglerArbeidstaker:
    translations.oversiktFelles.valideringManglerArbeidstaker,
  valideringManglerBekreftelseDegSelv:
    translations.oversiktFelles.valideringManglerBekreftelseDegSelv,
};

const bekreftelseTekster = {
  intro: translations.oversiktBekreftelse.intro,
  linkText: translations.oversiktBekreftelse.linkText,
  bekreftAtVilSvareRiktig:
    translations.oversiktBekreftelse.bekreftAtVilSvareRiktig,
  annenPersonInfo: translations.oversiktBekreftelse.annenPersonInfo,
  arbeidsgiverInfo: translations.oversiktBekreftelse.arbeidsgiverInfo,
  radgiverInfo: translations.oversiktBekreftelse.radgiverInfo,
};

export class OversiktPage {
  readonly page: Page;
  readonly representasjonstype: Representasjonstype;
  readonly heading: Locator;
  readonly startSoknadButton: Locator;
  readonly utkastExpansionCard: Locator;
  readonly historikkHeading: Locator;
  readonly historikkSearchInput: Locator;
  readonly historikkSearchButton: Locator;

  // SoknadStarter form elements
  readonly arbeidsgiverOrgnrInput: Locator;
  readonly arbeidsgiverCombobox: Locator;
  readonly skalFylleUtJaRadio: Locator;
  readonly skalFylleUtNeiRadio: Locator;
  readonly arbeidstakerFnrInput: Locator;
  readonly arbeidstakerEtternavnInput: Locator;
  readonly arbeidstakerSokButton: Locator;
  readonly bekreftelseCheckbox: Locator;
  readonly bekreftelseIntro: Locator;
  readonly bekreftelseLink: Locator;
  readonly annenPersonInfo: Locator;
  readonly arbeidsgiverInfo: Locator;
  readonly radgiverInfo: Locator;

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

    this.historikkSearchInput = page.getByRole("searchbox", {
      name: translations.oversiktFelles.historikkSokPlaceholder,
    });

    this.historikkSearchButton = page.getByRole("button", {
      name: "Søk",
      exact: true,
    });

    // DEG_SELV: OrganisasjonSoker text input for org number
    this.arbeidsgiverOrgnrInput = page.getByRole("textbox", {
      name: translations.oversiktFelles.arbeidsgiverOrgnrLabel,
    });

    // ARBEIDSGIVER/RADGIVER: Combobox for selecting arbeidsgiver from Altinn list
    this.arbeidsgiverCombobox = page.getByRole("combobox", {
      name: translations.oversiktFelles.arbeidsgiverVelgerLabel,
    });

    // Fullmakt radio buttons (Ja/Nei)
    this.skalFylleUtJaRadio = page.getByRole("radio", {
      name: translations.felles.ja,
    });
    this.skalFylleUtNeiRadio = page.getByRole("radio", {
      name: translations.felles.nei,
    });

    // Uten fullmakt: manual arbeidstaker input fields
    this.arbeidstakerFnrInput = page.getByRole("textbox", {
      name: translations.oversiktFelles.arbeidstakerFnrLabel,
    });
    this.arbeidstakerEtternavnInput = page.getByRole("textbox", {
      name: translations.oversiktFelles.arbeidstakerFulltNavnLabel,
    });
    this.arbeidstakerSokButton = page.getByRole("button", {
      name: translations.oversiktFelles.arbeidstakerSokKnapp,
      exact: true,
    });

    this.bekreftelseCheckbox = page.getByRole("checkbox", {
      name: bekreftelseTekster.bekreftAtVilSvareRiktig,
    });
    this.bekreftelseIntro = page.getByText(bekreftelseTekster.intro);
    this.bekreftelseLink = page.getByRole("link", {
      name: bekreftelseTekster.linkText,
    });
    this.annenPersonInfo = page.getByText(
      bekreftelseTekster.annenPersonInfo,
    );
    this.arbeidsgiverInfo = page.getByText(
      bekreftelseTekster.arbeidsgiverInfo,
    );
    this.radgiverInfo = page.getByText(
      bekreftelseTekster.radgiverInfo,
    );
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

  // ============ SoknadStarter form interactions ============

  /** DEG_SELV: Type org number into the OrganisasjonSoker text field */
  async fillArbeidsgiverOrgnr(orgnr: string) {
    await this.arbeidsgiverOrgnrInput.fill(orgnr);
  }

  /** ARBEIDSGIVER/RADGIVER: Select arbeidsgiver from Altinn combobox */
  async selectArbeidsgiver(orgName: string) {
    await this.arbeidsgiverCombobox.click();
    await this.page.getByRole("option", { name: new RegExp(orgName) }).click();
  }

  /** Click "Ja" on the "Skal du fylle ut for arbeidstaker?" radio */
  async selectSkalFylleUtJa() {
    await this.skalFylleUtJaRadio.click();
  }

  /** Click "Nei" on the "Skal du fylle ut for arbeidstaker?" radio */
  async selectSkalFylleUtNei() {
    await this.skalFylleUtNeiRadio.click();
  }

  /** Med fullmakt: Select person from the fullmakt combobox */
  async selectArbeidstakerMedFullmakt(personName: string) {
    // The UNSAFE_Combobox has label="" with a separate Label rendered above it,
    // so we locate by placeholder text instead
    const fullmaktCombobox = this.page.getByPlaceholder(
      translations.oversiktFelles.arbeidstakerMedFullmaktPlaceholder,
    );
    await fullmaktCombobox.click();
    await this.page
      .getByRole("option", { name: new RegExp(personName) })
      .click();
  }

  /** Uten fullmakt: Fill in fnr and etternavn, then click Søk */
  async fillArbeidstakerUtenFullmakt(fnr: string, etternavn: string) {
    await this.arbeidstakerFnrInput.fill(fnr);
    await this.arbeidstakerEtternavnInput.fill(etternavn);
    await this.arbeidstakerSokButton.click();
  }

  /** Wait for the OrganisasjonSoker to resolve and show the org name */
  async waitForOrgLookup(orgName: string) {
    await expect(this.page.getByText(orgName)).toBeVisible();
  }

  /** Wait for the verifiser-person response to show verified person */
  async waitForPersonVerified(personName: string) {
    await expect(this.page.getByText(personName)).toBeVisible();
  }

  // ============ Validation assertions ============

  async assertStillOnPage() {
    await expect(this.page).toHaveURL(/\/oversikt/);
  }

  async assertValideringManglerArbeidsgiverIsVisible() {
    await expect(
      this.page
        .getByRole("listitem")
        .filter({ hasText: feilmeldinger.valideringManglerArbeidsgiver }),
    ).toBeVisible();
  }

  async assertValideringManglerArbeidstakerIsVisible() {
    await expect(
      this.page
        .getByRole("listitem")
        .filter({ hasText: feilmeldinger.valideringManglerArbeidstaker }),
    ).toBeVisible();
  }

  async assertBekreftelseCheckboxForRepresentasjonstypeIsVisible() {
    await expect(this.bekreftelseCheckbox).toBeVisible();
  }

  async assertBekreftelseBoksContentForRepresentasjonstype() {
    await expect(this.bekreftelseIntro).toBeVisible();
    await expect(this.bekreftelseLink).toBeVisible();
    await expect(this.bekreftelseLink).toHaveAttribute(
      "href",
      "https://www.nav.no/endringer",
    );
    await expect(this.bekreftelseCheckbox).toBeVisible();

    switch (this.representasjonstype) {
      case Representasjonstype.DEG_SELV: {
        await expect(this.annenPersonInfo).not.toBeVisible();
        await expect(this.arbeidsgiverInfo).not.toBeVisible();
        await expect(this.radgiverInfo).not.toBeVisible();
        break;
      }
      case Representasjonstype.ANNEN_PERSON: {
        await expect(this.annenPersonInfo).toBeVisible();
        await expect(this.arbeidsgiverInfo).not.toBeVisible();
        await expect(this.radgiverInfo).not.toBeVisible();
        break;
      }
      case Representasjonstype.ARBEIDSGIVER:
      case Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT: {
        await expect(this.arbeidsgiverInfo).toBeVisible();
        await expect(this.annenPersonInfo).not.toBeVisible();
        await expect(this.radgiverInfo).not.toBeVisible();
        break;
      }
      case Representasjonstype.RADGIVER:
      case Representasjonstype.RADGIVER_MED_FULLMAKT: {
        await expect(this.radgiverInfo).toBeVisible();
        await expect(this.annenPersonInfo).not.toBeVisible();
        await expect(this.arbeidsgiverInfo).not.toBeVisible();
        break;
      }
    }
  }

  async checkBekreftelseCheckbox() {
    await this.bekreftelseCheckbox.check();
  }

  async assertValideringManglerBekreftelseIsVisible() {
    await expect(
      this.page
        .getByRole("listitem")
        .filter({ hasText: feilmeldinger.valideringManglerBekreftelseDegSelv }),
    ).toBeVisible();
  }

  // ============ Historikk søk interactions ============

  async searchHistorikk(searchTerm: string) {
    await this.historikkSearchInput.fill(searchTerm);
    await this.historikkSearchButton.click();
  }

  async clearHistorikkSearch() {
    await this.page
      .getByRole("button", { name: "Tøm feltet", exact: true })
      .click();
  }

  async assertHistorikkSearchInputVisible() {
    await expect(this.historikkSearchInput).toBeVisible();
  }

  async assertHistorikkIngenResultater() {
    await expect(
      this.page.getByText(translations.oversiktFelles.historikkIngenResultater),
    ).toBeVisible();
  }

  async assertHistorikkFeilmelding() {
    await expect(
      this.page.getByText(translations.oversiktFelles.historikkFeilmelding),
    ).toBeVisible();
  }

  async assertHistorikkAntallTreff(antall: number) {
    await expect(this.page.getByText(`${antall} treff`)).toBeVisible();
  }

  async assertHistorikkRowVisible(text: string) {
    await expect(this.page.getByRole("cell", { name: text })).toBeVisible();
  }

  async assertHistorikkRowNotVisible(text: string) {
    await expect(this.page.getByRole("cell", { name: text })).not.toBeVisible();
  }
}
