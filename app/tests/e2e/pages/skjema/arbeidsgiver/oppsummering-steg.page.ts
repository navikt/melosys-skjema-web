import { expect, type Locator, type Page } from "@playwright/test";

import { landKodeTilNavn } from "../../../../../src/components/LandVelgerFormPart";
import { SKJEMA_DEFINISJON_A1 } from "../../../../../src/constants/skjemaDefinisjonA1";
import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidsgiversSkjemaDto,
  ArbeidsstedIUtlandetDto,
  ArbeidstakerensLonnDto,
  NorskeOgUtenlandskeVirksomheter,
  TilleggsopplysningerDto,
  UtenlandsoppdragetDto,
} from "../../../../../src/types/melosysSkjemaTypes";

// Hent felter fra statiske definisjoner
const virksomhetINorge =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsgiverensVirksomhetINorge;
const utenlandsoppdraget =
  SKJEMA_DEFINISJON_A1.seksjoner.utenlandsoppdragetArbeidsgiver;
const arbeidsstedIUtlandet =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedIUtlandet;
const paLandFelter = SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedPaLand.felter;
const arbeidstakerensLonn = SKJEMA_DEFINISJON_A1.seksjoner.arbeidstakerensLonn;
const tilleggsopplysninger =
  SKJEMA_DEFINISJON_A1.seksjoner.tilleggsopplysningerArbeidsgiver;

export class OppsummeringStegPage {
  readonly page: Page;
  readonly skjema: ArbeidsgiversSkjemaDto;
  readonly heading: Locator;
  readonly sendSoknadButton: Locator;

  constructor(page: Page, skjema: ArbeidsgiversSkjemaDto) {
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
    await this.page.goto(`/skjema/arbeidsgiver/${this.skjema.id}/oppsummering`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

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
        `dt:has-text("${utenlandsoppdraget.felter.utsendelseLand.label}") + dd`,
      ),
    ).toHaveText(landKodeTilNavn(data.utsendelseLand));

    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.arbeidstakerUtsendelsePeriode.fraDatoLabel}") + dd`,
      ),
    ).toHaveText(data.arbeidstakerUtsendelsePeriode.fraDato);

    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.arbeidstakerUtsendelsePeriode.tilDatoLabel}") + dd`,
      ),
    ).toHaveText(data.arbeidstakerUtsendelsePeriode.tilDato);

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
