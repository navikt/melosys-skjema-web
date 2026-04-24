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
  valideringManglerBekreftelse:
    translations.oversiktFelles.valideringManglerBekreftelse,
};

const bekreftelseTekster = {
  intro: translations.oversiktBekreftelse.intro,
  linkText: translations.oversiktBekreftelse.linkText,
  bekreftAtVilSvareRiktig:
    translations.oversiktBekreftelse.bekreftAtVilSvareRiktig,
  bekreftAtLestOgForstatt:
    translations.oversiktBekreftelse.bekreftAtLestOgForstatt,
  annenPersonInfoBullet2:
    translations.oversiktBekreftelse.annenPersonInfoBullet2,
  arbeidsgiverInfoBullet2:
    translations.oversiktBekreftelse.arbeidsgiverInfoBullet2,
  radgiverInfoBullet2: translations.oversiktBekreftelse.radgiverInfoBullet2,
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
  readonly bekreftelseCheckboxDegSelv: Locator;
  readonly bekreftelseCheckboxAndre: Locator;
  readonly bekreftelseIntro: Locator;
  readonly bekreftelseLink: Locator;
  readonly annenPersonInfoBullet: Locator;
  readonly arbeidsgiverInfoBullet: Locator;
  readonly radgiverInfoBullet: Locator;

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

    this.bekreftelseCheckboxDegSelv = page.getByRole("checkbox", {
      name: translations.oversiktBekreftelse.bekreftAtVilSvareRiktig,
    });
    this.bekreftelseCheckboxAndre = page.getByRole("checkbox", {
      name: translations.oversiktBekreftelse.bekreftAtLestOgForstatt,
    });
    this.bekreftelseIntro = page.getByText(bekreftelseTekster.intro);
    this.bekreftelseLink = page.getByRole("link", {
      name: bekreftelseTekster.linkText,
    });
    this.annenPersonInfoBullet = page.getByText(
      bekreftelseTekster.annenPersonInfoBullet2,
    );
    this.arbeidsgiverInfoBullet = page.getByText(
      bekreftelseTekster.arbeidsgiverInfoBullet2,
    );
    this.radgiverInfoBullet = page.getByText(
      bekreftelseTekster.radgiverInfoBullet2,
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
    await expect(
      this.representasjonstype === Representasjonstype.DEG_SELV
        ? this.bekreftelseCheckboxDegSelv
        : this.bekreftelseCheckboxAndre,
    ).toBeVisible();
  }

  async assertBekreftelseBoksContentForRepresentasjonstype() {
    await expect(this.bekreftelseIntro).toBeVisible();
    await expect(this.bekreftelseLink).toBeVisible();

    switch (this.representasjonstype) {
      case Representasjonstype.DEG_SELV: {
        await expect(this.bekreftelseCheckboxDegSelv).toBeVisible();
        await expect(this.bekreftelseCheckboxAndre).not.toBeVisible();
        await expect(this.annenPersonInfoBullet).not.toBeVisible();
        await expect(this.arbeidsgiverInfoBullet).not.toBeVisible();
        await expect(this.radgiverInfoBullet).not.toBeVisible();
        break;
      }
      case Representasjonstype.ANNEN_PERSON: {
        await expect(this.bekreftelseCheckboxAndre).toBeVisible();
        await expect(this.annenPersonInfoBullet).toBeVisible();
        await expect(this.arbeidsgiverInfoBullet).not.toBeVisible();
        await expect(this.radgiverInfoBullet).not.toBeVisible();
        break;
      }
      case Representasjonstype.ARBEIDSGIVER:
      case Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT: {
        await expect(this.bekreftelseCheckboxAndre).toBeVisible();
        await expect(this.arbeidsgiverInfoBullet).toBeVisible();
        await expect(this.annenPersonInfoBullet).not.toBeVisible();
        await expect(this.radgiverInfoBullet).not.toBeVisible();
        break;
      }
      case Representasjonstype.RADGIVER:
      case Representasjonstype.RADGIVER_MED_FULLMAKT: {
        await expect(this.bekreftelseCheckboxAndre).toBeVisible();
        await expect(this.radgiverInfoBullet).toBeVisible();
        await expect(this.annenPersonInfoBullet).not.toBeVisible();
        await expect(this.arbeidsgiverInfoBullet).not.toBeVisible();
        break;
      }
    }
  }

  async checkBekreftelseCheckbox() {
    await (
      this.representasjonstype === Representasjonstype.DEG_SELV
        ? this.bekreftelseCheckboxDegSelv
        : this.bekreftelseCheckboxAndre
    ).check();
  }

  async assertValideringManglerBekreftelseDegSelvIsVisible() {
    await expect(
      this.page
        .getByRole("listitem")
        .filter({ hasText: feilmeldinger.valideringManglerBekreftelseDegSelv }),
    ).toBeVisible();
  }

  async assertValideringManglerBekreftelseIsVisible() {
    await expect(
      this.page
        .getByRole("listitem")
        .filter({ hasText: feilmeldinger.valideringManglerBekreftelse }),
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
