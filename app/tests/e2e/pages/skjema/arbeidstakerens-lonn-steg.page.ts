import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type {
  ArbeidstakerensLonnDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import type { RadioButtonGroupJaNeiLocator } from "../../../types/playwright-types";

// Hent felter fra statiske definisjoner
const arbeidstakerensLonn = SKJEMA_DEFINISJON_A1.seksjoner.arbeidstakerensLonn;
const felter = arbeidstakerensLonn.felter;
const t = nb.translation;

// Feilmeldinger
const feilmeldinger = {
  duMaSvarePaOmDuBetalerAllLonn:
    t.arbeidstakerenslonnSteg
      .duMaSvarePaOmDuBetalerAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden,
  duMaLeggeTilMinstEnVirksomhet:
    t.arbeidstakerenslonnSteg
      .duMaLeggeTilMinstEnVirksomhetNarDuIkkeBetalerAllLonnSelv,
  // Norsk virksomhet modal
  organisasjonsnummerErPakrevd:
    t.generellValidering.organisasjonsnummerErPakrevd,
  // Utenlandsk virksomhet modal
  navnPaVirksomhetErPakrevd: t.generellValidering.navnPaVirksomhetErPakrevd,
  vegnavnOgHusnummerErPakrevd: t.generellValidering.vegnavnOgHusnummerErPakrevd,
  landErPakrevd: t.generellValidering.landErPakrevd,
  duMaSvarePaOmVirksomhetenTilhorerSammeKonsern:
    t.generellValidering.duMaSvarePaOmVirksomhetenTilhorerSammeKonsern,
};

export class ArbeidstakerensLonnStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly leggTilNorskVirksomhetButton: Locator;
  readonly leggTilUtenlandskVirksomhetButton: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: arbeidstakerensLonn.tittel,
    });

    const arbeidsgiverBetalerAllLonnOgNaturaytelserGroup = page.getByRole(
      "radiogroup",
      {
        name: felter
          .arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden.label,
      },
    );
    this.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup = {
      JA: arbeidsgiverBetalerAllLonnOgNaturaytelserGroup.getByRole("radio", {
        name: t.felles.ja,
      }),
      NEI: arbeidsgiverBetalerAllLonnOgNaturaytelserGroup.getByRole("radio", {
        name: t.felles.nei,
      }),
    };

    this.leggTilNorskVirksomhetButton = page.getByRole("button", {
      name: t.norskeVirksomheterFormPart.leggTilNorskVirksomhet,
    });
    this.leggTilUtenlandskVirksomhetButton = page.getByRole("button", {
      name: t.utenlandskeVirksomheterFormPart.leggTilUtenlandskVirksomhet,
    });

    this.lagreOgFortsettButton = page.getByRole("button", {
      name: t.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/${this.skjema.id}/arbeidstakerens-lonn`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  /**
   * Opens the "Legg til norsk virksomhet" modal, types the given orgnr
   * (OrganisasjonSoker auto-searches when 9 digits are entered),
   * waits for the org name to appear, and clicks Lagre.
   */
  async leggTilNorskVirksomhet(orgnr: string) {
    await this.leggTilNorskVirksomhetButton.click();

    const dialog = this.page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog
      .getByLabel(t.norskeVirksomheterFormPart.organisasjonsnummer)
      .fill(orgnr);

    // OrganisasjonSoker auto-searches when 9 digits are typed — wait for result
    await dialog
      .getByText("Test Organisasjon AS")
      .waitFor({ state: "visible" });

    await dialog.getByRole("button", { name: t.felles.lagre }).click();

    // Wait for modal to close
    await expect(dialog).not.toBeVisible();
  }

  /**
   * Opens the "Legg til utenlandsk virksomhet" modal, fills required fields, clicks Lagre.
   */
  async leggTilUtenlandskVirksomhet(opts: {
    navn: string;
    vegnavnOgHusnummer: string;
    land: string;
    tilhorerSammeKonsern: boolean;
  }) {
    await this.leggTilUtenlandskVirksomhetButton.click();

    const dialog = this.page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog
      .getByLabel(t.utenlandskeVirksomheterFormPart.navnPaVirksomhet)
      .fill(opts.navn);
    await dialog
      .getByLabel(
        t.utenlandskeVirksomheterFormPart.vegnavnOgHusnummerEvtPostboks,
      )
      .fill(opts.vegnavnOgHusnummer);

    await dialog
      .getByRole("combobox", {
        name: t.utenlandskeVirksomheterFormPart.land,
      })
      .selectOption(opts.land);

    const konsernGroup = dialog.getByRole("radiogroup", {
      name: t.utenlandskeVirksomheterFormPart
        .tilhorerVirksomhetenSammeKonsernSomDenNorskeArbeidsgiveren,
    });
    await (opts.tilhorerSammeKonsern
      ? konsernGroup.getByRole("radio", { name: t.felles.ja }).click()
      : konsernGroup.getByRole("radio", { name: t.felles.nei }).click());

    await dialog.getByRole("button", { name: t.felles.lagre }).click();

    // Wait for modal to close
    await expect(dialog).not.toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/arbeidstakerens-lonn`,
    );
    await this.lagreOgFortsett();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(
    expectedPayload: ArbeidstakerensLonnDto,
  ) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/tilleggsopplysninger`,
    );
  }

  async assertStillOnStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/arbeidstakerens-lonn`,
    );
  }

  // --- Validation assertions ---

  private betalerAllLonnFieldset() {
    return this.page.getByRole("radiogroup", {
      name: felter.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden
        .label,
    });
  }

  async assertDuMaSvarePaOmDuBetalerAllLonnIsVisible() {
    await expect(
      this.betalerAllLonnFieldset().getByText(
        feilmeldinger.duMaSvarePaOmDuBetalerAllLonn,
      ),
    ).toBeVisible();
  }

  async assertDuMaLeggeTilMinstEnVirksomhetIsVisible() {
    await expect(
      this.page.getByText(feilmeldinger.duMaLeggeTilMinstEnVirksomhet),
    ).toBeVisible();
  }

  // --- Norsk virksomhet modal validation ---

  /**
   * Opens the "Legg til norsk virksomhet" modal and clicks Lagre without
   * filling anything, leaving the modal open for validation assertions.
   */
  async clickLagreInNorskVirksomhetModal() {
    await this.leggTilNorskVirksomhetButton.click();
    const dialog = this.page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: t.felles.lagre }).click();
  }

  async assertOrganisasjonsnummerErPakrevdIsVisible() {
    const dialog = this.page.getByRole("dialog");
    await expect(
      dialog.getByText(feilmeldinger.organisasjonsnummerErPakrevd),
    ).toBeVisible();
  }

  async assertNorskVirksomhetModalIsOpen() {
    await expect(this.page.getByRole("dialog")).toBeVisible();
  }

  // --- Utenlandsk virksomhet modal validation ---

  /**
   * Opens the "Legg til utenlandsk virksomhet" modal and clicks Lagre without
   * filling anything, leaving the modal open for validation assertions.
   */
  async clickLagreInUtenlandskVirksomhetModal() {
    await this.leggTilUtenlandskVirksomhetButton.click();
    const dialog = this.page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: t.felles.lagre }).click();
  }

  async assertNavnPaVirksomhetErPakrevdIsVisible() {
    const dialog = this.page.getByRole("dialog");
    await expect(
      dialog.getByText(feilmeldinger.navnPaVirksomhetErPakrevd),
    ).toBeVisible();
  }

  async assertVegnavnOgHusnummerErPakrevdIsVisible() {
    const dialog = this.page.getByRole("dialog");
    await expect(
      dialog.getByText(feilmeldinger.vegnavnOgHusnummerErPakrevd),
    ).toBeVisible();
  }

  async assertLandErPakrevdIsVisible() {
    const dialog = this.page.getByRole("dialog");
    await expect(dialog.getByText(feilmeldinger.landErPakrevd)).toBeVisible();
  }

  async assertDuMaSvarePaOmVirksomhetenTilhorerSammeKonsernIsVisible() {
    const dialog = this.page.getByRole("dialog");
    await expect(
      dialog.getByText(
        feilmeldinger.duMaSvarePaOmVirksomhetenTilhorerSammeKonsern,
      ),
    ).toBeVisible();
  }

  async assertUtenlandskVirksomhetModalIsOpen() {
    await expect(this.page.getByRole("dialog")).toBeVisible();
  }
}
