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
      "group",
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
   * Opens the "Legg til norsk virksomhet" modal, searches for the given orgnr,
   * waits for the org name to appear, and clicks Lagre.
   */
  async leggTilNorskVirksomhet(orgnr: string) {
    await this.leggTilNorskVirksomhetButton.click();

    const dialog = this.page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog
      .getByLabel(t.norskeVirksomheterFormPart.organisasjonsnummer)
      .fill(orgnr);
    await dialog
      .getByRole("button", { name: t.oversiktFelles.arbeidstakerSokKnapp })
      .click();

    // Wait for the org lookup to resolve — ValgtOrganisasjon renders the org name
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

    const konsernGroup = dialog.getByRole("group", {
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
}
