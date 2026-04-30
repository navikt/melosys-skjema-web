import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type {
  ArbeidsgiverensVirksomhetINorgeDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import type { RadioButtonGroupJaNeiLocator } from "../../../types/playwright-types";
import { mockFetchSkjema } from "../../fixtures/api-mocks";

// Hent felter fra statiske definisjoner
const virksomhetINorge =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsgiverensVirksomhetINorge;
const felter = virksomhetINorge.felter;

// Feilmeldinger
const feilmeldinger = {
  offentligVirksomhetErPakrevd:
    nb.translation.arbeidsgiverensVirksomhetINorgeSteg
      .duMaSvarePaOmArbeidsgiverenErEnOffentligVirksomhet,
  bemanningsEllerVikarbyraErPakrevd:
    nb.translation.arbeidsgiverensVirksomhetINorgeSteg
      .duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra,
  vanligDriftErPakrevd:
    nb.translation.arbeidsgiverensVirksomhetINorgeSteg
      .duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge,
};

export class ArbeidsgiverensVirksomhetINorgeStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly offentligVirksomhetRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly bemanningsEllerVikarbyraRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly vanligDriftRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: virksomhetINorge.tittel,
    });

    const offentligVirksomhetGroup = page.getByRole("radiogroup", {
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

    const bemanningsEllerVikarbyraGroup = page.getByRole("radiogroup", {
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

    const vanligDriftGroup = page.getByRole("radiogroup", {
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
      `/skjema/${this.skjema.id}/arbeidsgiverens-virksomhet-i-norge`,
    );
  }

  async mockArbeidsgiverensVirksomhetINorgeStegData(
    virksomhetINorgeData: ArbeidsgiverensVirksomhetINorgeDto,
  ) {
    await mockFetchSkjema(this.page, {
      ...this.skjema,
      data: {
        ...this.skjema.data,
        arbeidsgiverensVirksomhetINorge: virksomhetINorgeData,
      } as UtsendtArbeidstakerSkjemaDto["data"],
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
      `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/arbeidsgiverens-virksomhet-i-norge`,
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
      `/skjema/${this.skjema.id}/utenlandsoppdraget`,
    );
  }

  async assertStillOnStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/arbeidsgiverens-virksomhet-i-norge`,
    );
  }

  // --- Validation assertions ---

  private offentligVirksomhetFieldset() {
    return this.page.getByRole("radiogroup", {
      name: felter.erArbeidsgiverenOffentligVirksomhet.label,
    });
  }

  private bemanningsEllerVikarbyraFieldset() {
    return this.page.getByRole("radiogroup", {
      name: felter.erArbeidsgiverenBemanningsEllerVikarbyraa.label,
    });
  }

  private vanligDriftFieldset() {
    return this.page.getByRole("radiogroup", {
      name: felter.opprettholderArbeidsgiverenVanligDrift.label,
    });
  }

  async assertOffentligVirksomhetErPakrevdIsVisible() {
    await expect(
      this.offentligVirksomhetFieldset().getByText(
        feilmeldinger.offentligVirksomhetErPakrevd,
      ),
    ).toBeVisible();
  }

  async assertOffentligVirksomhetErPakrevdIsNotVisible() {
    await expect(
      this.offentligVirksomhetFieldset().getByText(
        feilmeldinger.offentligVirksomhetErPakrevd,
      ),
    ).not.toBeVisible();
  }

  async assertBemanningsEllerVikarbyraErPakrevdIsVisible() {
    await expect(
      this.bemanningsEllerVikarbyraFieldset().getByText(
        feilmeldinger.bemanningsEllerVikarbyraErPakrevd,
      ),
    ).toBeVisible();
  }

  async assertVanligDriftErPakrevdIsVisible() {
    await expect(
      this.vanligDriftFieldset().getByText(feilmeldinger.vanligDriftErPakrevd),
    ).toBeVisible();
  }
}
