import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type {
  UtenlandsoppdragetDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";
import { selectDateFromCalendar } from "../../../utils/datepicker-helpers";

// Hent felter fra statiske definisjoner
const utenlandsoppdraget =
  SKJEMA_DEFINISJON_A1.seksjoner.utenlandsoppdragetArbeidsgiver;
const felter = utenlandsoppdraget.felter;

export class UtenlandsoppdragetStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly arbeidsgiverHarOppdragILandetRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly arbeidstakerForblirAnsattIHelePeriodenRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly arbeidstakerErstatterAnnenPersonRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdragetRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly utenlandsoppholdetsBegrunnelseTextarea: Locator;
  readonly ansettelsesforholdBeskrivelseTextarea: Locator;
  readonly forrigeArbeidstakerFraDatoInput: Locator;
  readonly forrigeArbeidstakerTilDatoInput: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: utenlandsoppdraget.tittel,
    });

    const arbeidsgiverHarOppdragILandetGroup = page.getByRole("group", {
      name: felter.arbeidsgiverHarOppdragILandet.label,
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
        name: felter.arbeidstakerBleAnsattForUtenlandsoppdraget.label,
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
        name: felter.arbeidstakerForblirAnsattIHelePerioden.label,
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
      name: felter.arbeidstakerErstatterAnnenPerson.label,
    });
    this.arbeidstakerErstatterAnnenPersonRadioGroup = {
      JA: arbeidstakerErstatterAnnenPersonGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: arbeidstakerErstatterAnnenPersonGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    // Conditional fields
    const arbeidstakerVilJobbeEtterOppdragetGroup = page.getByRole("group", {
      name: felter.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget.label,
    });
    this.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdragetRadioGroup = {
      JA: arbeidstakerVilJobbeEtterOppdragetGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: arbeidstakerVilJobbeEtterOppdragetGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.utenlandsoppholdetsBegrunnelseTextarea = page.getByLabel(
      felter.utenlandsoppholdetsBegrunnelse.label,
    );
    this.ansettelsesforholdBeskrivelseTextarea = page.getByLabel(
      felter.ansettelsesforholdBeskrivelse.label,
    );

    this.forrigeArbeidstakerFraDatoInput = page.getByLabel(
      felter.forrigeArbeidstakerUtsendelsePeriode.fraDatoLabel,
    );
    this.forrigeArbeidstakerTilDatoInput = page.getByLabel(
      felter.forrigeArbeidstakerUtsendelsePeriode.tilDatoLabel,
    );

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjema.id}/utenlandsoppdraget`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/utenlandsoppdraget`,
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
      `/skjema/${this.skjema.id}/arbeidssted-i-utlandet`,
    );
  }

  async fillForrigeArbeidstakerFraDato(date: string) {
    await selectDateFromCalendar(
      this.page,
      this.forrigeArbeidstakerFraDatoInput,
      date,
    );
  }

  async fillForrigeArbeidstakerTilDato(date: string) {
    await selectDateFromCalendar(
      this.page,
      this.forrigeArbeidstakerTilDatoInput,
      date,
    );
  }
}
