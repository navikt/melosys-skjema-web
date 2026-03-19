import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type {
  UtsendingsperiodeOgLandDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import { selectDateFromCalendar } from "../../utils/datepicker-helpers";

// Hent felter fra statiske definisjoner
const utsendingsperiodeOgLand =
  SKJEMA_DEFINISJON_A1.seksjoner.utsendingsperiodeOgLand;
const felter = utsendingsperiodeOgLand.felter;

// Tittel hentes fra i18n, ikke fra skjemadefinisjonen
const stegTittel = nb.translation.utsendingsperiodeOgLandSteg.tittel;

// Feilmeldinger
const feilmeldinger = {
  land: nb.translation.utsendingsperiodeOgLandSteg
    .duMaVelgeHvilketLandDuSkalUtforeArbeid,
  datoErPakrevd: nb.translation.periode.datoErPakrevd,
  tilDatoForFraDato: nb.translation.periode.tilDatoMaVareEtterFraDato,
};

export class UtsendingsperiodeOgLandStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly utsendelseLandCombobox: Locator;
  readonly fraDatoInput: Locator;
  readonly tilDatoInput: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: stegTittel,
    });
    this.utsendelseLandCombobox = page.getByRole("combobox", {
      name: felter.utsendelseLand.label,
    });
    this.fraDatoInput = page.getByLabel(nb.translation.periode.fraDato);
    this.tilDatoInput = page.getByLabel(nb.translation.periode.tilDato);
    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjema.id}/utsendingsperiode-og-land`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async velgLand(land: { label: string; value: string }) {
    await this.utsendelseLandCombobox.selectOption(land);
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/utsendingsperiode-og-land`,
    );
    await this.lagreOgFortsett();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(
    expectedPayload: UtsendingsperiodeOgLandDto,
  ) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/arbeidssituasjon`,
    );
  }

  async assertStillOnStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/utsendingsperiode-og-land`,
    );
  }

  async fillFraDato(date: string) {
    await selectDateFromCalendar(this.page, this.fraDatoInput, date);
  }

  async fillTilDato(date: string) {
    await selectDateFromCalendar(this.page, this.tilDatoInput, date);
  }

  async assertLandFeilmeldingIsVisible() {
    await expect(this.page.getByText(feilmeldinger.land)).toBeVisible();
  }

  async assertLandFeilmeldingIsNotVisible() {
    await expect(this.page.getByText(feilmeldinger.land)).not.toBeVisible();
  }

  private fraDatoFieldWrapper() {
    return this.fraDatoInput.locator("..").locator("..");
  }

  private tilDatoFieldWrapper() {
    return this.tilDatoInput.locator("..").locator("..");
  }

  async assertFraDatoErPakrevdIsVisible() {
    await expect(
      this.fraDatoFieldWrapper().getByText(feilmeldinger.datoErPakrevd),
    ).toBeVisible();
  }

  async assertFraDatoErPakrevdIsNotVisible() {
    await expect(
      this.fraDatoFieldWrapper().getByText(feilmeldinger.datoErPakrevd),
    ).not.toBeVisible();
  }

  async assertTilDatoErPakrevdIsVisible() {
    await expect(
      this.tilDatoFieldWrapper().getByText(feilmeldinger.datoErPakrevd),
    ).toBeVisible();
  }

  async assertTilDatoErPakrevdIsNotVisible() {
    await expect(
      this.tilDatoFieldWrapper().getByText(feilmeldinger.datoErPakrevd),
    ).not.toBeVisible();
  }

  async assertTilDatoForFraDatoFeilmeldingIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.tilDatoForFraDato),
    ).toBeVisible();
  }
}
