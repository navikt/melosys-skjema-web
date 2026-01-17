import { expect, type Locator, type Page } from "@playwright/test";

import { landKodeTilNavn } from "../../../../../src/components/LandVelgerFormPart";
import { SKJEMA_DEFINISJON_A1 } from "../../../../../src/constants/skjemaDefinisjonA1";
import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidssituasjonDto,
  ArbeidstakersSkjemaDto,
  FamiliemedlemmerDto,
  SkatteforholdOgInntektDto,
  TilleggsopplysningerDto,
  UtenlandsoppdragetArbeidstakersDelDto,
} from "../../../../../src/types/melosysSkjemaTypes";

// Hent felter fra statiske definisjoner
const utenlandsoppdraget =
  SKJEMA_DEFINISJON_A1.seksjoner.utenlandsoppdragetArbeidstaker;
const arbeidssituasjon = SKJEMA_DEFINISJON_A1.seksjoner.arbeidssituasjon;
const skatteforholdOgInntekt =
  SKJEMA_DEFINISJON_A1.seksjoner.skatteforholdOgInntekt;
const familiemedlemmer = SKJEMA_DEFINISJON_A1.seksjoner.familiemedlemmer;
const tilleggsopplysninger =
  SKJEMA_DEFINISJON_A1.seksjoner.tilleggsopplysningerArbeidstaker;

export class OppsummeringStegPage {
  readonly page: Page;
  readonly skjema: ArbeidstakersSkjemaDto;
  readonly heading: Locator;
  readonly sendSoknadButton: Locator;

  constructor(page: Page, skjema: ArbeidstakersSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.oppsummeringSteg.tittel,
    });
    this.sendSoknadButton = page.getByRole("button", {
      name: nb.translation.felles.sendSoknad,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/arbeidstaker/${this.skjema.id}/oppsummering`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async assertUtenlandsoppdragetData(
    data: UtenlandsoppdragetArbeidstakersDelDto,
  ) {
    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.utsendelsesLand.label}") + dd`,
      ),
    ).toHaveText(landKodeTilNavn(data.utsendelsesLand));

    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.utsendelsePeriode.fraDatoLabel}") + dd`,
      ),
    ).toHaveText(data.utsendelsePeriode.fraDato);

    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.utsendelsePeriode.tilDatoLabel}") + dd`,
      ),
    ).toHaveText(data.utsendelsePeriode.tilDato);
  }

  async assertArbeidssituasjonData(data: ArbeidssituasjonDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${arbeidssituasjon.felter.harVaertEllerSkalVaereILonnetArbeidFoerUtsending.label}") + dd`,
      ),
    ).toHaveText(
      data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    if (data.aktivitetIMaanedenFoerUtsendingen !== undefined) {
      await expect(
        this.page.getByText(data.aktivitetIMaanedenFoerUtsendingen),
      ).toBeVisible();
    }

    await expect(
      this.page.locator(
        `dt:has-text("${arbeidssituasjon.felter.skalJobbeForFlereVirksomheter.label}") + dd`,
      ),
    ).toHaveText(
      data.skalJobbeForFlereVirksomheter
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );
  }

  async assertSkatteforholdOgInntektData(data: SkatteforholdOgInntektDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${skatteforholdOgInntekt.felter.erSkattepliktigTilNorgeIHeleutsendingsperioden.label}") + dd`,
      ),
    ).toHaveText(
      data.erSkattepliktigTilNorgeIHeleutsendingsperioden
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${skatteforholdOgInntekt.felter.mottarPengestotteFraAnnetEosLandEllerSveits.label}") + dd`,
      ),
    ).toHaveText(
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    if (data.landSomUtbetalerPengestotte !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${skatteforholdOgInntekt.felter.landSomUtbetalerPengestotte.label}") + dd`,
        ),
      ).toHaveText(landKodeTilNavn(data.landSomUtbetalerPengestotte));
    }

    if (data.pengestotteSomMottasFraAndreLandBelop !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${skatteforholdOgInntekt.felter.pengestotteSomMottasFraAndreLandBelop.label}") + dd`,
        ),
      ).toHaveText(data.pengestotteSomMottasFraAndreLandBelop);
    }

    if (data.pengestotteSomMottasFraAndreLandBeskrivelse !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${skatteforholdOgInntekt.felter.pengestotteSomMottasFraAndreLandBeskrivelse.label}") + dd`,
        ),
      ).toHaveText(data.pengestotteSomMottasFraAndreLandBeskrivelse);
    }
  }

  async assertFamiliemedlemmerData(data: FamiliemedlemmerDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${familiemedlemmer.felter.skalHaMedFamiliemedlemmer.label}") + dd`,
      ),
    ).toHaveText(
      data.skalHaMedFamiliemedlemmer
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );
  }

  async assertTilleggsopplysningerData(data: TilleggsopplysningerDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${tilleggsopplysninger.felter.harFlereOpplysningerTilSoknaden.label}") + dd`,
      ),
    ).toHaveText(
      data.harFlereOpplysningerTilSoknaden
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    if (data.tilleggsopplysningerTilSoknad !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${tilleggsopplysninger.felter.tilleggsopplysningerTilSoknad.label}") + dd`,
        ),
      ).toHaveText(data.tilleggsopplysningerTilSoknad);
    }
  }

  async sendInnAndExpectPost() {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(
            `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/send-inn`,
          ) && response.request().method() === "POST",
    );

    await this.sendSoknadButton.click();
    await responsePromise;
  }

  async assertNavigatedToKvittering() {
    await expect(this.page).toHaveURL(`/skjema/${this.skjema.id}/kvittering`);
  }
}
