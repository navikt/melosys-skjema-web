import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../src/i18n/nb";
import type {
  ArbeidsgiverenDto,
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidsgiversSkjemaDto,
  ArbeidstakerensLonnDto,
  NorskeOgUtenlandskeVirksomheter,
  UtenlandsoppdragetDto,
} from "../../../../src/types/melosysSkjemaTypes";

export class OppsummeringStegPage {
  readonly page: Page;
  readonly skjema: ArbeidsgiversSkjemaDto;
  readonly heading: Locator;

  constructor(page: Page, skjema: ArbeidsgiversSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.oppsummeringSteg.tittel,
    });
  }

  async goto() {
    await this.page.goto(`/skjema/arbeidsgiver/${this.skjema.id}/oppsummering`);
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async assertArbeidsgiverenData(data: ArbeidsgiverenDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.arbeidsgiverSteg.arbeidsgiverensOrganisasjonsnummer}") + dd`,
      ),
    ).toHaveText(data.organisasjonsnummer);

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.arbeidsgiverSteg.organisasjonensNavn}") + dd`,
      ),
    ).toHaveText(data.organisasjonNavn);
  }

  async assertArbeidsgiverensVirksomhetINorgeData(
    data: ArbeidsgiverensVirksomhetINorgeDto,
  ) {
    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEnOffentligVirksomhet}") + dd`,
      ),
    ).toHaveText(
      data.erArbeidsgiverenOffentligVirksomhet
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    if (data.erArbeidsgiverenBemanningsEllerVikarbyraa !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${nb.translation.arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEtBemanningsEllerVikarbyra}") + dd`,
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
          `dt:has-text("${nb.translation.arbeidsgiverensVirksomhetINorgeSteg.opprettholderArbeidsgiverenVanligDriftINorge}") + dd`,
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
        `dt:has-text("${nb.translation.utenlandsoppdragetSteg.hvilketLandSendesArbeidstakerenTil}") + dd`,
      ),
    ).toHaveText(data.utsendelseLand);

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetSteg.fraDato}") + dd`,
      ),
    ).toHaveText(data.arbeidstakerUtsendelseFraDato);

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetSteg.tilDato}") + dd`,
      ),
    ).toHaveText(data.arbeidstakerUtsendelseTilDato);

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetSteg.harDuSomArbeidsgiverOppdragILandetArbeidstakerSkalSendesUtTil}") + dd`,
      ),
    ).toHaveText(
      data.arbeidsgiverHarOppdragILandet
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetSteg.bleArbeidstakerAnsattPaGrunnAvDetteUtenlandsoppdraget}") + dd`,
      ),
    ).toHaveText(
      data.arbeidstakerBleAnsattForUtenlandsoppdraget
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetSteg.vilArbeidstakerFortsattVareAnsattHostDereIHeleUtsendingsperioden}") + dd`,
      ),
    ).toHaveText(
      data.arbeidstakerForblirAnsattIHelePerioden
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetSteg.erstatterArbeidstakerEnAnnenPersonSomVarSendtUtForAGjoreDetSammeArbeidet}") + dd`,
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
          `dt:has-text("${nb.translation.utenlandsoppdragetSteg.vilArbeidstakerenArbeideForVirksomhetenINorgeEtterUtenlandsoppdraget}") + dd`,
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
          `dt:has-text("${nb.translation.utenlandsoppdragetSteg.hvorforSkalArbeidstakerenArbeideIUtlandet}") + dd`,
        ),
      ).toHaveText(data.utenlandsoppholdetsBegrunnelse);
    }

    if (data.ansettelsesforholdBeskrivelse !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${nb.translation.utenlandsoppdragetSteg.beskrivArbeidstakerensAnsettelsesforholdIUtsendingsperioden}") + dd`,
        ),
      ).toHaveText(data.ansettelsesforholdBeskrivelse);
    }
  }

  async assertArbeidstakerensLonnData(data: ArbeidstakerensLonnDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.arbeidstakerenslonnSteg.utbetalerDuSomArbeidsgiverAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden}") + dd`,
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
}
