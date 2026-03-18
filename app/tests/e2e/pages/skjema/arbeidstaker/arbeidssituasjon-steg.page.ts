import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type {
  ArbeidssituasjonDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";
import type { RadioButtonGroupJaNeiLocator } from "../../../../types/playwright-types";

const arbeidssituasjon = SKJEMA_DEFINISJON_A1.seksjoner.arbeidssituasjon;
const felter = arbeidssituasjon.felter;
const t = nb.translation;

export class ArbeidssituasjonStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly harVaertILonnetArbeidRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly aktivitetTextarea: Locator;
  readonly skalJobbeForFlereVirksomheterRadioGroup: RadioButtonGroupJaNeiLocator;
  readonly leggTilNorskVirksomhetButton: Locator;
  readonly leggTilUtenlandskVirksomhetButton: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: arbeidssituasjon.tittel,
    });

    const harVaertGroup = page.getByRole("group", {
      name: felter.harVaertEllerSkalVaereILonnetArbeidFoerUtsending.label,
    });
    this.harVaertILonnetArbeidRadioGroup = {
      JA: harVaertGroup.getByRole("radio", {
        name: t.felles.ja,
      }),
      NEI: harVaertGroup.getByRole("radio", {
        name: t.felles.nei,
      }),
    };

    this.aktivitetTextarea = page.getByLabel(
      felter.aktivitetIMaanedenFoerUtsendingen.label,
    );

    const skalJobbeGroup = page.getByRole("group", {
      name: felter.skalJobbeForFlereVirksomheter.label,
    });
    this.skalJobbeForFlereVirksomheterRadioGroup = {
      JA: skalJobbeGroup.getByRole("radio", {
        name: t.felles.ja,
      }),
      NEI: skalJobbeGroup.getByRole("radio", {
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
    await this.page.goto(`/skjema/${this.skjema.id}/arbeidssituasjon`);
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

    // Wait for org lookup to resolve — ValgtOrganisasjon renders the org name
    await dialog
      .getByText("Test Organisasjon AS")
      .waitFor({ state: "visible" });

    await dialog.getByRole("button", { name: t.felles.lagre }).click();
    await expect(dialog).not.toBeVisible();
  }

  /**
   * Opens the "Legg til utenlandsk virksomhet" modal with ansettelsesform
   * (since arbeidssituasjon uses includeAnsettelsesform=true).
   */
  async leggTilUtenlandskVirksomhetMedAnsettelsesform(opts: {
    navn: string;
    vegnavnOgHusnummer: string;
    land: string;
    tilhorerSammeKonsern: boolean;
    ansettelsesformLabel: string;
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

    // Ansettelsesform radio group (only in arbeidssituasjon context)
    const ansettelsesformGroup = dialog.getByRole("group", {
      name: t.utenlandskeVirksomheterFormPart.ansettelsesform,
    });
    await ansettelsesformGroup
      .getByRole("radio", { name: opts.ansettelsesformLabel })
      .click();

    await dialog.getByRole("button", { name: t.felles.lagre }).click();
    await expect(dialog).not.toBeVisible();
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/arbeidssituasjon`,
    );
    await this.lagreOgFortsett();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(expectedPayload: ArbeidssituasjonDto) {
    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);
    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/${this.skjema.id}/skatteforhold-og-inntekt`,
    );
  }
}
