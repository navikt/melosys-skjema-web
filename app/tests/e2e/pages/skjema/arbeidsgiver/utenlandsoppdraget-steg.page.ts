import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidsgiversSkjemaDto,
  UtenlandsoppdragetDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";
import { selectDateFromCalendar } from "../../../utils/datepicker-helpers";

export class UtenlandsoppdragetStegPage {
  readonly page: Page;
  readonly skjema: ArbeidsgiversSkjemaDto;
  readonly heading: Locator;
  readonly utsendelseLandCombobox: Locator;
  readonly fraDatoInput: Locator;
  readonly tilDatoInput: Locator;
  readonly arbeidsgiverHarOppdragILandetRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly arbeidstakerForblirAnsattIHelePeriodenRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly arbeidstakerErstatterAnnenPersonRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidsgiversSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.utenlandsoppdragetSteg.tittel,
    });
    this.utsendelseLandCombobox = page.getByRole("combobox", {
      name: nb.translation.utenlandsoppdragetSteg
        .hvilketLandSendesArbeidstakerenTil,
    });
    this.fraDatoInput = page.getByLabel(nb.translation.periode.fraDato);
    this.tilDatoInput = page.getByLabel(nb.translation.periode.tilDato);

    const arbeidsgiverHarOppdragILandetGroup = page.getByRole("group", {
      name: nb.translation.utenlandsoppdragetSteg
        .harDuSomArbeidsgiverOppdragILandetArbeidstakerSkalSendesUtTil,
    });
    this.arbeidsgiverHarOppdragILandetRadioGroup = {
      JA: arbeidsgiverHarOppdragILandetGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: arbeidsgiverHarOppdragILandetGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    const arbeidstakerBleAnsattForUtenlandsoppdragetGroup = page.getByRole(
      "group",
      {
        name: nb.translation.utenlandsoppdragetSteg
          .bleArbeidstakerAnsattPaGrunnAvDetteUtenlandsoppdraget,
      },
    );
    this.arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup = {
      JA: arbeidstakerBleAnsattForUtenlandsoppdragetGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: arbeidstakerBleAnsattForUtenlandsoppdragetGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    const arbeidstakerForblirAnsattIHelePeriodenGroup = page.getByRole(
      "group",
      {
        name: nb.translation.utenlandsoppdragetSteg
          .vilArbeidstakerFortsattVareAnsattHostDereIHeleUtsendingsperioden,
      },
    );
    this.arbeidstakerForblirAnsattIHelePeriodenRadioGroup = {
      JA: arbeidstakerForblirAnsattIHelePeriodenGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: arbeidstakerForblirAnsattIHelePeriodenGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    const arbeidstakerErstatterAnnenPersonGroup = page.getByRole("group", {
      name: nb.translation.utenlandsoppdragetSteg
        .erstatterArbeidstakerEnAnnenPersonSomVarSendtUtForAGjoreDetSammeArbeidet,
    });
    this.arbeidstakerErstatterAnnenPersonRadioGroup = {
      JA: arbeidstakerErstatterAnnenPersonGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: arbeidstakerErstatterAnnenPersonGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(
      `/skjema/arbeidsgiver/${this.skjema.id}/utenlandsoppdraget`,
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
      `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${this.skjema.id}/utenlandsoppdraget`,
    );
    await this.lagreOgFortsett();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(
    expectedPayload: UtenlandsoppdragetDto,
  ) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/arbeidsgiver/${this.skjema.id}/arbeidssted-i-utlandet`,
    );
  }

  async fillFraDato(date: string) {
    await selectDateFromCalendar(this.page, this.fraDatoInput, date);
  }

  async fillTilDato(date: string) {
    await selectDateFromCalendar(this.page, this.tilDatoInput, date);
  }
}
