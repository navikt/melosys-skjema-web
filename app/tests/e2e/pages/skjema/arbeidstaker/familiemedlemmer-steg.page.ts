import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "../../../../../src/constants/skjemaDefinisjonA1";
import { nb } from "../../../../../src/i18n/nb";
import type {
  FamiliemedlemmerDto,
  UtsendtArbeidstakerSkjemaDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";

// Hent felter fra statiske definisjoner
const familiemedlemmerSeksjon = SKJEMA_DEFINISJON_A1.seksjoner.familiemedlemmer;
const felter = familiemedlemmerSeksjon.felter;
const elementDef = felter.familiemedlemmer.elementDefinisjon;

export class FamiliemedlemmerStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly harDuFamiliemedlemmerSomSkalVaereMedRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly leggTilFamiliemedlemButton: Locator;
  readonly lagreOgFortsettButton: Locator;

  // Modal locators
  readonly modal: Locator;
  readonly modalFornavnInput: Locator;
  readonly modalEtternavnInput: Locator;
  readonly modalHarNorskFnrRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly modalFodselsnummerInput: Locator;
  readonly modalFodselsdatoInput: Locator;
  readonly modalLagreButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: familiemedlemmerSeksjon.tittel,
    });

    const harDuFamiliemedlemmerSomSkalVaereMedGroup = page.getByRole("group", {
      name: felter.skalHaMedFamiliemedlemmer.label,
    });
    this.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup = {
      JA: harDuFamiliemedlemmerSomSkalVaereMedGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: harDuFamiliemedlemmerSomSkalVaereMedGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.leggTilFamiliemedlemButton = page.getByRole("button", {
      name: felter.familiemedlemmer.leggTilLabel,
    });

    // Modal locators (scoped to the dialog)
    this.modal = page.getByRole("dialog");
    this.modalFornavnInput = this.modal.getByLabel(elementDef.fornavn.label);
    this.modalEtternavnInput = this.modal.getByLabel(
      elementDef.etternavn.label,
    );

    const modalHarNorskFnrGroup = this.modal.getByRole("group", {
      name: elementDef.harNorskFodselsnummerEllerDnummer.label,
    });
    this.modalHarNorskFnrRadioGroup = {
      JA: modalHarNorskFnrGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: modalHarNorskFnrGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.modalFodselsnummerInput = this.modal.getByLabel(
      elementDef.fodselsnummer.label,
    );
    this.modalFodselsdatoInput = this.modal.getByLabel(
      elementDef.fodselsdato.label,
    );
    this.modalLagreButton = this.modal.getByRole("button", {
      name: nb.translation.felles.lagre,
    });

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjema.id}/familiemedlemmer`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/familiemedlemmer`,
    );
    await this.lagreOgFortsettButton.click();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(expectedPayload: FamiliemedlemmerDto) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/tilleggsopplysninger`,
    );
  }
}
