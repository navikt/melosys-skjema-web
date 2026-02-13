import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "../../../../../src/constants/skjemaDefinisjonA1";
import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidsgiversSkjemaDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";
import { mockFetchArbeidsgiverSkjema } from "../../../fixtures/api-mocks";

// Hent felter fra statiske definisjoner
const virksomhetINorge =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsgiverensVirksomhetINorge;
const felter = virksomhetINorge.felter;

export class ArbeidsgiverensVirksomhetINorgeStegPage {
  readonly page: Page;
  readonly skjema: ArbeidsgiversSkjemaDto;
  readonly heading: Locator;
  readonly offentligVirksomhetRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly bemanningsEllerVikarbyraRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly vanligDriftRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidsgiversSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: virksomhetINorge.tittel,
    });

    const offentligVirksomhetGroup = page.getByRole("group", {
      name: felter.erArbeidsgiverenOffentligVirksomhet.label,
    });
    this.offentligVirksomhetRadioGroup = {
      JA: offentligVirksomhetGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: offentligVirksomhetGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    const bemanningsEllerVikarbyraGroup = page.getByRole("group", {
      name: felter.erArbeidsgiverenBemanningsEllerVikarbyraa.label,
    });
    this.bemanningsEllerVikarbyraRadioGroup = {
      JA: bemanningsEllerVikarbyraGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: bemanningsEllerVikarbyraGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    const vanligDriftGroup = page.getByRole("group", {
      name: felter.opprettholderArbeidsgiverenVanligDrift.label,
    });
    this.vanligDriftRadioGroup = {
      JA: vanligDriftGroup.getByRole("radio", {
        name: nb.translation.felles.ja,
      }),
      NEI: vanligDriftGroup.getByRole("radio", {
        name: nb.translation.felles.nei,
      }),
    };

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(
      `/skjema/arbeidsgiver/${this.skjema.id}/arbeidsgiverens-virksomhet-i-norge`,
    );
  }

  async mockArbeidsgiverensVirksomhetINorgeStegData(
    virksomhetINorgeData: ArbeidsgiverensVirksomhetINorgeDto,
  ) {
    await mockFetchArbeidsgiverSkjema(this.page, {
      ...this.skjema,
      data: {
        ...this.skjema.data,
        arbeidsgiverensVirksomhetINorge: virksomhetINorgeData,
      },
    });
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${this.skjema.id}/arbeidsgiverens-virksomhet-i-norge`,
    );
    await this.lagreOgFortsett();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(
    expectedPayload: ArbeidsgiverensVirksomhetINorgeDto,
  ) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/arbeidsgiver/${this.skjema.id}/utenlandsoppdraget`,
    );
  }
}
