import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "~/i18n/nb";
import { Representasjonstype } from "~/types/melosysSkjemaTypes";

const translations = nb.translation;

export class OversiktPage {
  readonly page: Page;
  readonly representasjonstype: Representasjonstype;
  readonly heading: Locator;
  readonly startSoknadButton: Locator;
  readonly utkastExpansionCard: Locator;
  readonly historikkHeading: Locator;

  // SoknadStarter form elements
  readonly arbeidsgiverOrgnrInput: Locator;
  readonly arbeidsgiverCombobox: Locator;
  readonly skalFylleUtJaRadio: Locator;
  readonly skalFylleUtNeiRadio: Locator;
  readonly arbeidstakerFnrInput: Locator;
  readonly arbeidstakerEtternavnInput: Locator;
  readonly arbeidstakerSokButton: Locator;

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
}
