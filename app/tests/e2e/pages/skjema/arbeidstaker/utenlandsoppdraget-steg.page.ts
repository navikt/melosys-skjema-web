import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "../../../../../src/constants/skjemaDefinisjonA1";
import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidstakersSkjemaDto,
  UtenlandsoppdragetArbeidstakersDelDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import { selectDateFromCalendar } from "../../../utils/datepicker-helpers";

// Hent felter fra statiske definisjoner
const utenlandsoppdraget =
  SKJEMA_DEFINISJON_A1.seksjoner.utenlandsoppdragetArbeidstaker;
const felter = utenlandsoppdraget.felter;

export class UtenlandsoppdragetStegPage {
  readonly page: Page;
  readonly skjema: ArbeidstakersSkjemaDto;
  readonly heading: Locator;
  readonly utsendelsesLandCombobox: Locator;
  readonly fraDatoInput: Locator;
  readonly tilDatoInput: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidstakersSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: utenlandsoppdraget.tittel,
    });
    this.utsendelsesLandCombobox = page.getByRole("combobox", {
      name: felter.utsendelsesLand.label,
    });
    this.fraDatoInput = page.getByLabel(nb.translation.periode.fraDato);
    this.tilDatoInput = page.getByLabel(nb.translation.periode.tilDato);
    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(
      `/skjema/arbeidstaker/${this.skjema.id}/utenlandsoppdraget`,
    );
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${this.skjema.id}/utenlandsoppdraget`,
    );
    await this.lagreOgFortsett();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(
    expectedPayload: UtenlandsoppdragetArbeidstakersDelDto,
  ) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/arbeidstaker/${this.skjema.id}/arbeidssituasjon`,
    );
  }

  async fillFraDato(date: string) {
    await selectDateFromCalendar(this.page, this.fraDatoInput, date);
  }

  async fillTilDato(date: string) {
    await selectDateFromCalendar(this.page, this.tilDatoInput, date);
  }
}
