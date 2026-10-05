import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import type {
  ArbeidsgiverensVirksomhetINorgeDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import type { RadioButtonGroupJaNeiLocator } from "../../../types/playwright-types";
import { mockFetchSkjema } from "../../fixtures/api-mocks";
import { translations } from "../../utils/translations";

// Hent felter fra statiske definisjoner
const virksomhetINorge =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsgiverensVirksomhetINorge;
const felter = virksomhetINorge.felter;

// Feilmeldinger
const feilmeldinger = {
  bemanningsEllerVikarbyraErPakrevd:
    translations.arbeidsgiverensVirksomhetINorgeSteg
      .duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra,
  vanligDriftErPakrevd:
    translations.arbeidsgiverensVirksomhetINorgeSteg
      .duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge,
  antallAdministrativtAnsatteErPakrevd:
    translations.arbeidsgiverensVirksomhetINorgeSteg
      .duMaOppgiAntallAdministrativtAnsatte,
  antallUtsendteArbeidstakereErPakrevd:
    translations.arbeidsgiverensVirksomhetINorgeSteg
      .duMaOppgiAntallUtsendteArbeidstakere,
  andelAnsatteRekruttertINorgeErPakrevd:
    translations.arbeidsgiverensVirksomhetINorgeSteg
      .duMaOppgiAndelAnsatteRekruttertINorge,
  andelOmsetningINorgeErPakrevd:
    translations.arbeidsgiverensVirksomhetINorgeSteg
      .duMaOppgiAndelOmsetningINorge,
  andelOppdragUtfortINorgeErPakrevd:
    translations.arbeidsgiverensVirksomhetINorgeSteg
      .duMaOppgiAndelOppdragUtfortINorge,
  andelOppdragskontrakterInngattINorgeErPakrevd:
    translations.arbeidsgiverensVirksomhetINorgeSteg
      .duMaOppgiAndelOppdragskontrakterInngattINorge,
  antallMaVaereHeltall:
    translations.arbeidsgiverensVirksomhetINorgeSteg
      .antallMaVaereEtHeltallSomErNullEllerMer,
  andelMaVaereMellom0Og100:
    translations.arbeidsgiverensVirksomhetINorgeSteg
      .andelMaVaereEtHeltallMellom0Og100,
};

export type SamletVirksomhetData = Pick<
  ArbeidsgiverensVirksomhetINorgeDto,
  | "antallAdministrativtAnsatte"
  | "antallUtsendteArbeidstakere"
  | "andelAnsatteRekruttertINorge"
  | "andelOmsetningINorge"
  | "andelOppdragUtfortINorge"
  | "andelOppdragskontrakterInngattINorge"
>;

type SamletVirksomhetFelt = keyof SamletVirksomhetData;

const SAMLET_VIRKSOMHET_FELTER: SamletVirksomhetFelt[] = [
  "antallAdministrativtAnsatte",
  "antallUtsendteArbeidstakere",
  "andelAnsatteRekruttertINorge",
  "andelOmsetningINorge",
  "andelOppdragUtfortINorge",
  "andelOppdragskontrakterInngattINorge",
];

export class ArbeidsgiverensVirksomhetINorgeStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly bemanningsEllerVikarbyraRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly vanligDriftRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly samletVirksomhetHeading: Locator;
  readonly samletVirksomhetFelter: Record<SamletVirksomhetFelt, Locator>;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: virksomhetINorge.tittel,
    });

    const bemanningsEllerVikarbyraGroup = page.getByRole("radiogroup", {
      name: felter.erArbeidsgiverenBemanningsEllerVikarbyraa.label,
    });
    this.bemanningsEllerVikarbyraRadioGroup = {
      JA: bemanningsEllerVikarbyraGroup.getByRole("radio", {
        name: translations.felles.ja,
      }),
      NEI: bemanningsEllerVikarbyraGroup.getByRole("radio", {
        name: translations.felles.nei,
      }),
    };

    const vanligDriftGroup = page.getByRole("radiogroup", {
      name: felter.opprettholderArbeidsgiverenVanligDrift.label,
    });
    this.vanligDriftRadioGroup = {
      JA: vanligDriftGroup.getByRole("radio", {
        name: translations.felles.ja,
      }),
      NEI: vanligDriftGroup.getByRole("radio", {
        name: translations.felles.nei,
      }),
    };

    this.samletVirksomhetHeading = page.getByRole("heading", {
      name: translations.arbeidsgiverensVirksomhetINorgeSteg
        .opplysningerOmForetaketsSamledeVirksomhet,
    });
    this.samletVirksomhetFelter = Object.fromEntries(
      SAMLET_VIRKSOMHET_FELTER.map((felt) => [
        felt,
        page.getByRole("textbox", { name: felter[felt].label, exact: true }),
      ]),
    ) as Record<SamletVirksomhetFelt, Locator>;

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: translations.felles.lagreOgFortsett,
    });
  }

  // --- Validation assertions ---

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

  async fyllSamletVirksomhet(data: SamletVirksomhetData) {
    for (const felt of SAMLET_VIRKSOMHET_FELTER) {
      const verdi = data[felt];
      if (verdi !== undefined) {
        await this.samletVirksomhetFelter[felt].fill(String(verdi));
      }
    }
  }

  async fyllFelt(felt: SamletVirksomhetFelt, verdi: string) {
    await this.samletVirksomhetFelter[felt].fill(verdi);
  }

  async assertSamletVirksomhetIsVisible() {
    await expect(this.samletVirksomhetHeading).toBeVisible();
    for (const felt of SAMLET_VIRKSOMHET_FELTER) {
      await expect(this.samletVirksomhetFelter[felt]).toBeVisible();
    }
  }

  async assertSamletVirksomhetIsHidden() {
    await expect(this.samletVirksomhetHeading).toBeHidden();
    for (const felt of SAMLET_VIRKSOMHET_FELTER) {
      await expect(this.samletVirksomhetFelter[felt]).toBeHidden();
    }
  }

  async assertSamletVirksomhetVerdier(data: SamletVirksomhetData) {
    for (const felt of SAMLET_VIRKSOMHET_FELTER) {
      await expect(this.samletVirksomhetFelter[felt]).toHaveValue(
        String(data[felt] ?? ""),
      );
    }
  }

  async assertIngenRegisterinfoboks() {
    await expect(this.page.getByRole("alert")).toHaveCount(0);
  }

  async assertSamletVirksomhetPakrevdIsVisible() {
    for (const felt of SAMLET_VIRKSOMHET_FELTER) {
      await expect(
        this.page.getByText(feilmeldinger[`${felt}ErPakrevd`]),
      ).toBeVisible();
    }
  }

  async assertAntallMaVaereHeltallIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.antallMaVaereHeltall),
    ).toBeVisible();
  }

  async assertAndelMaVaereMellom0Og100IsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.andelMaVaereMellom0Og100),
    ).toBeVisible();
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
