import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "../../../../../src/constants/skjemaDefinisjonA1";
import { nb } from "../../../../../src/i18n/nb";
import type {
  UtsendingsperiodeOgLandDto,
  UtsendtArbeidstakerSkjemaDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import { selectDateFromCalendar } from "../../../utils/datepicker-helpers";

// Hent felter fra statiske definisjoner
const utsendingsperiodeOgLand =
  SKJEMA_DEFINISJON_A1.seksjoner.utsendingsperiodeOgLand;
const felter = utsendingsperiodeOgLand.felter;

// Tittel hentes fra i18n, ikke fra skjemadefinisjonen
const stegTittel = nb.translation.utsendingsperiodeOgLandSteg.tittel;

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

  async fillFraDato(date: string) {
    await selectDateFromCalendar(this.page, this.fraDatoInput, date);
  }

  async fillTilDato(date: string) {
    await selectDateFromCalendar(this.page, this.tilDatoInput, date);
  }
}
