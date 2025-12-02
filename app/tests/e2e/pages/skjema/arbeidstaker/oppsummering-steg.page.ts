import { expect, type Locator, type Page } from "@playwright/test";

import { landKodeTilNavn } from "../../../../../src/components/LandVelgerFormPart";
import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidssituasjonDto,
  ArbeidstakersSkjemaDto,
  FamiliemedlemmerDto,
  SkatteforholdOgInntektDto,
  TilleggsopplysningerDto,
  UtenlandsoppdragetArbeidstakersDelDto,
} from "../../../../../src/types/melosysSkjemaTypes";

export class OppsummeringStegPage {
  readonly page: Page;
  readonly skjema: ArbeidstakersSkjemaDto;
  readonly heading: Locator;

  constructor(page: Page, skjema: ArbeidstakersSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.oppsummeringSteg.tittel,
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
        `dt:has-text("${nb.translation.utenlandsoppdragetArbeidstakerSteg.iHvilketLandSkalDuUtforeArbeid}") + dd`,
      ),
    ).toHaveText(landKodeTilNavn(data.utsendelsesLand));

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetArbeidstakerSteg.fraDato}") + dd`,
      ),
    ).toHaveText(data.utsendelsePeriode.fraDato);

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetArbeidstakerSteg.tilDato}") + dd`,
      ),
    ).toHaveText(data.utsendelsePeriode.tilDato);
  }

  async assertArbeidssituasjonData(data: ArbeidssituasjonDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.arbeidssituasjonSteg.harDuVaertEllerSkalVaereILonnetArbeidINorgeIMinst1ManedRettForUtsendingen}") + dd`,
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
        `dt:has-text("${nb.translation.arbeidssituasjonSteg.skalDuOgsaDriveSelvstendigVirksomhetEllerJobbeForEnAnnenArbeidsgiver}") + dd`,
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
        `dt:has-text("${nb.translation.skatteforholdOgInntektSteg.erDuSkattepliktigTilNorgeIHeleUtsendingsperioden}") + dd`,
      ),
    ).toHaveText(
      data.erSkattepliktigTilNorgeIHeleutsendingsperioden
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.skatteforholdOgInntektSteg.mottarDuPengestotteFraEtAnnetEosLandEllerSveits}") + dd`,
      ),
    ).toHaveText(
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    if (data.landSomUtbetalerPengestotte !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${nb.translation.skatteforholdOgInntektSteg.fraHvilketLandMottarDuPengestotte}") + dd`,
        ),
      ).toHaveText(landKodeTilNavn(data.landSomUtbetalerPengestotte));
    }

    if (data.pengestotteSomMottasFraAndreLandBelop !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${nb.translation.skatteforholdOgInntektSteg.hvorMyePengerMottarDuBruttoPerManed}") + dd`,
        ),
      ).toHaveText(data.pengestotteSomMottasFraAndreLandBelop);
    }

    if (data.pengestotteSomMottasFraAndreLandBeskrivelse !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${nb.translation.skatteforholdOgInntektSteg.hvaSlagsPengestotteMottarDu}") + dd`,
        ),
      ).toHaveText(data.pengestotteSomMottasFraAndreLandBeskrivelse);
    }
  }

  async assertFamiliemedlemmerData(data: FamiliemedlemmerDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.familiemedlemmerSteg.sokerDuForBarnUnder18SomSkalVaereMed}") + dd`,
      ),
    ).toHaveText(
      data.sokerForBarnUnder18SomSkalVaereMed
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.familiemedlemmerSteg.harDuEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad}") + dd`,
      ),
    ).toHaveText(
      data.harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );
  }

  async assertTilleggsopplysningerData(data: TilleggsopplysningerDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${nb.translation.tilleggsopplysningerSteg.harDuNoenFlereOpplysningerTilSoknaden}") + dd`,
      ),
    ).toHaveText(
      data.harFlereOpplysningerTilSoknaden
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    if (data.tilleggsopplysningerTilSoknad !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${nb.translation.tilleggsopplysningerSteg.beskriveFlereOpplysningerTilSoknaden}") + dd`,
        ),
      ).toHaveText(data.tilleggsopplysningerTilSoknad);
    }
  }
}
