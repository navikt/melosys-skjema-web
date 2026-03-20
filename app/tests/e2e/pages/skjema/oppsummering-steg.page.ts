import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { nb } from "~/i18n/nb";
import type {
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidssituasjonDto,
  ArbeidsstedIUtlandetDto,
  ArbeidstakerensLonnDto,
  FamiliemedlemmerDto,
  NorskeOgUtenlandskeVirksomheter,
  SkatteforholdOgInntektDto,
  TilleggsopplysningerDto,
  UtenlandsoppdragetDto,
  UtsendingsperiodeOgLandDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

// Hent felter fra statiske definisjoner
const virksomhetINorge =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsgiverensVirksomhetINorge;
const utenlandsoppdraget =
  SKJEMA_DEFINISJON_A1.seksjoner.utenlandsoppdragetArbeidsgiver;
const arbeidsstedIUtlandet =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedIUtlandet;
const paLandFelter = SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedPaLand.felter;
const arbeidstakerensLonn = SKJEMA_DEFINISJON_A1.seksjoner.arbeidstakerensLonn;
const utsendingsperiodeOgLand =
  SKJEMA_DEFINISJON_A1.seksjoner.utsendingsperiodeOgLand;
const arbeidssituasjon = SKJEMA_DEFINISJON_A1.seksjoner.arbeidssituasjon;
const skatteforholdOgInntekt =
  SKJEMA_DEFINISJON_A1.seksjoner.skatteforholdOgInntekt;
const familiemedlemmer = SKJEMA_DEFINISJON_A1.seksjoner.familiemedlemmer;
const tilleggsopplysninger =
  SKJEMA_DEFINISJON_A1.seksjoner.tilleggsopplysningerArbeidsgiver;

export class OppsummeringStegPage {
  readonly page: Page;
  readonly skjema: UtsendtArbeidstakerSkjemaDto;
  readonly heading: Locator;
  readonly sendSoknadButton: Locator;

  constructor(page: Page, skjema: UtsendtArbeidstakerSkjemaDto) {
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
    await this.page.goto(`/skjema/${this.skjema.id}/oppsummering`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  // --- Arbeidsgiver assertions ---

  async assertArbeidsgiverensVirksomhetINorgeData(
    data: ArbeidsgiverensVirksomhetINorgeDto,
  ) {
    await expect(
      this.page.locator(
        `dt:has-text("${virksomhetINorge.felter.erArbeidsgiverenOffentligVirksomhet.label}") + dd`,
      ),
    ).toHaveText(
      data.erArbeidsgiverenOffentligVirksomhet
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    if (data.erArbeidsgiverenBemanningsEllerVikarbyraa !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${virksomhetINorge.felter.erArbeidsgiverenBemanningsEllerVikarbyraa.label}") + dd`,
        ),
      ).toHaveText(
        data.erArbeidsgiverenBemanningsEllerVikarbyraa
          ? nb.translation.felles.ja
          : nb.translation.felles.nei,
      );
    }

    if (data.opprettholderArbeidsgiverenVanligDrift !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${virksomhetINorge.felter.opprettholderArbeidsgiverenVanligDrift.label}") + dd`,
        ),
      ).toHaveText(
        data.opprettholderArbeidsgiverenVanligDrift
          ? nb.translation.felles.ja
          : nb.translation.felles.nei,
      );
    }
  }

  async assertUtenlandsoppdragetData(data: UtenlandsoppdragetDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.arbeidsgiverHarOppdragILandet.label}") + dd`,
      ),
    ).toHaveText(
      data.arbeidsgiverHarOppdragILandet
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.arbeidstakerBleAnsattForUtenlandsoppdraget.label}") + dd`,
      ),
    ).toHaveText(
      data.arbeidstakerBleAnsattForUtenlandsoppdraget
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.arbeidstakerForblirAnsattIHelePerioden.label}") + dd`,
      ),
    ).toHaveText(
      data.arbeidstakerForblirAnsattIHelePerioden
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.arbeidstakerErstatterAnnenPerson.label}") + dd`,
      ),
    ).toHaveText(
      data.arbeidstakerErstatterAnnenPerson
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    if (
      data.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget !== undefined
    ) {
      await expect(
        this.page.locator(
          `dt:has-text("${utenlandsoppdraget.felter.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget.label}") + dd`,
        ),
      ).toHaveText(
        data.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget
          ? nb.translation.felles.ja
          : nb.translation.felles.nei,
      );
    }

    if (data.utenlandsoppholdetsBegrunnelse !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${utenlandsoppdraget.felter.utenlandsoppholdetsBegrunnelse.label}") + dd`,
        ),
      ).toHaveText(data.utenlandsoppholdetsBegrunnelse);
    }

    if (data.ansettelsesforholdBeskrivelse !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${utenlandsoppdraget.felter.ansettelsesforholdBeskrivelse.label}") + dd`,
        ),
      ).toHaveText(data.ansettelsesforholdBeskrivelse);
    }
  }

  async assertArbeidsstedIUtlandetData(data: ArbeidsstedIUtlandetDto) {
    // Verifiser arbeidssted type
    await expect(
      this.page.locator(
        `dt:has-text("${arbeidsstedIUtlandet.felter.arbeidsstedType.label}") + dd`,
      ),
    ).toBeVisible();

    // Verifiser på land data hvis det finnes
    if (data.paLand) {
      if (data.paLand.fastEllerVekslendeArbeidssted) {
        await expect(
          this.page.locator(
            `dt:has-text("${paLandFelter.fastEllerVekslendeArbeidssted.label}") + dd`,
          ),
        ).toBeVisible();
      }

      if (
        data.paLand.fastArbeidssted &&
        data.paLand.fastArbeidssted.vegadresse
      ) {
        await expect(
          this.page.locator(
            `dt:has-text("${paLandFelter.vegadresse.label}") + dd`,
          ),
        ).toHaveText(data.paLand.fastArbeidssted.vegadresse);
      }

      if (data.paLand.erHjemmekontor !== undefined) {
        await expect(
          this.page.locator(
            `dt:has-text("${paLandFelter.erHjemmekontor.label}") + dd`,
          ),
        ).toHaveText(
          data.paLand.erHjemmekontor
            ? nb.translation.felles.ja
            : nb.translation.felles.nei,
        );
      }
    }
  }

  async assertArbeidstakerensLonnData(data: ArbeidstakerensLonnDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${arbeidstakerensLonn.felter.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden.label}") + dd`,
      ),
    ).toHaveText(
      data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    if (data.virksomheterSomUtbetalerLonnOgNaturalytelser !== undefined) {
      await this.assertVirksomheterSomUtbetalerLonnOgNaturalytelser(
        data.virksomheterSomUtbetalerLonnOgNaturalytelser,
      );
    }
  }

  private async assertVirksomheterSomUtbetalerLonnOgNaturalytelser(
    data: NorskeOgUtenlandskeVirksomheter,
  ) {
    if (data.norskeVirksomheter !== undefined) {
      for (const virksomhet of data.norskeVirksomheter) {
        await expect(
          this.page.getByText(virksomhet.organisasjonsnummer),
        ).toBeVisible();
      }
    }

    if (data.utenlandskeVirksomheter !== undefined) {
      for (const virksomhet of data.utenlandskeVirksomheter) {
        await expect(this.page.getByText(virksomhet.navn)).toBeVisible();
        await expect(this.page.getByText(virksomhet.land)).toBeVisible();
      }
    }
  }

  // --- Arbeidstaker assertions ---

  async assertUtsendingsperiodeOgLandData(data: UtsendingsperiodeOgLandDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${utsendingsperiodeOgLand.felter.utsendelseLand.label}") + dd`,
      ),
    ).toHaveText(nb.translation.land[data.utsendelseLand]);

    await expect(
      this.page.locator(
        `dt:has-text("${utsendingsperiodeOgLand.felter.utsendelsePeriode.fraDatoLabel}") + dd`,
      ),
    ).toHaveText(data.utsendelsePeriode.fraDato);

    await expect(
      this.page.locator(
        `dt:has-text("${utsendingsperiodeOgLand.felter.utsendelsePeriode.tilDatoLabel}") + dd`,
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
      ).toHaveText(
        nb.translation.land[
          data.landSomUtbetalerPengestotte as keyof typeof nb.translation.land
        ],
      );
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

  // --- Delte assertions ---

  async assertTilleggsopplysningerData(data: TilleggsopplysningerDto) {
    // Use .first() because kombinert view shows tilleggsopplysninger in both
    // arbeidsgiver and arbeidstaker sections, causing duplicate dt/dd matches
    await expect(
      this.page
        .locator(
          `dt:has-text("${tilleggsopplysninger.felter.harFlereOpplysningerTilSoknaden.label}") + dd`,
        )
        .first(),
    ).toHaveText(
      data.harFlereOpplysningerTilSoknaden
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    if (data.tilleggsopplysningerTilSoknad !== undefined) {
      await expect(
        this.page
          .locator(
            `dt:has-text("${tilleggsopplysninger.felter.tilleggsopplysningerTilSoknad.label}") + dd`,
          )
          .first(),
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
