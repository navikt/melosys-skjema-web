import { expect, type Locator, type Page } from "@playwright/test";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
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

import { E2E_SPRAK, translations } from "../../utils/translations";

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
      name: translations.oppsummeringSteg.tittel,
    });
    this.sendSoknadButton = page.getByRole("button", {
      name: translations.felles.sendSoknad,
    });
  }

  async goto(basePath = "") {
    const normalisertBasePath = basePath.replace(/\/+$/, "");
    await this.page.goto(
      `${normalisertBasePath}/skjema/${this.skjema.id}/oppsummering`,
    );
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async assertArbeidstakerOgArbeidsgiverInfo() {
    await expect(
      this.page.locator(`dt:text-is("${translations.felles.navn}") + dd`),
    ).toHaveText(this.skjema.metadata.arbeidstakerNavn);
    await expect(
      this.page.locator(
        `dt:text-is("${translations.oversiktFelles.arbeidstakerFnrLabel}") + dd`,
      ),
    ).toHaveText(this.skjema.fnr);
    await expect(
      this.page.locator(
        `dt:text-is("${translations.felles.virksomhetsnavn}") + dd`,
      ),
    ).toHaveText(this.skjema.metadata.arbeidsgiverNavn);
    await expect(
      this.page.locator(
        `dt:text-is("${translations.felles.organisasjonsnummer}") + dd`,
      ),
    ).toHaveText(this.skjema.orgnr);
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
        ? translations.felles.ja
        : translations.felles.nei,
    );

    if (data.erArbeidsgiverenBemanningsEllerVikarbyraa !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${virksomhetINorge.felter.erArbeidsgiverenBemanningsEllerVikarbyraa.label}") + dd`,
        ),
      ).toHaveText(
        data.erArbeidsgiverenBemanningsEllerVikarbyraa
          ? translations.felles.ja
          : translations.felles.nei,
      );
    }

    if (data.opprettholderArbeidsgiverenVanligDrift !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${virksomhetINorge.felter.opprettholderArbeidsgiverenVanligDrift.label}") + dd`,
        ),
      ).toHaveText(
        data.opprettholderArbeidsgiverenVanligDrift
          ? translations.felles.ja
          : translations.felles.nei,
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
        ? translations.felles.ja
        : translations.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.arbeidstakerBleAnsattForUtenlandsoppdraget.label}") + dd`,
      ),
    ).toHaveText(
      data.arbeidstakerBleAnsattForUtenlandsoppdraget
        ? translations.felles.ja
        : translations.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.arbeidstakerForblirAnsattIHelePerioden.label}") + dd`,
      ),
    ).toHaveText(
      data.arbeidstakerForblirAnsattIHelePerioden
        ? translations.felles.ja
        : translations.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${utenlandsoppdraget.felter.arbeidstakerErstatterAnnenPerson.label}") + dd`,
      ),
    ).toHaveText(
      data.arbeidstakerErstatterAnnenPerson
        ? translations.felles.ja
        : translations.felles.nei,
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
          ? translations.felles.ja
          : translations.felles.nei,
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
            ? translations.felles.ja
            : translations.felles.nei,
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
        ? translations.felles.ja
        : translations.felles.nei,
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
    ).toHaveText(translations.land[data.utsendelseLand]);

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
        ? translations.felles.ja
        : translations.felles.nei,
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
        ? translations.felles.ja
        : translations.felles.nei,
    );
  }

  async assertSkatteforholdOgInntektData(data: SkatteforholdOgInntektDto) {
    await expect(
      this.page.locator(
        `dt:has-text("${skatteforholdOgInntekt.felter.erSkattepliktigTilNorgeIHeleutsendingsperioden.label}") + dd`,
      ),
    ).toHaveText(
      data.erSkattepliktigTilNorgeIHeleutsendingsperioden
        ? translations.felles.ja
        : translations.felles.nei,
    );

    await expect(
      this.page.locator(
        `dt:has-text("${skatteforholdOgInntekt.felter.mottarPengestotteFraAnnetEosLandEllerSveits.label}") + dd`,
      ),
    ).toHaveText(
      data.mottarPengestotteFraAnnetEosLandEllerSveits
        ? translations.felles.ja
        : translations.felles.nei,
    );

    if (data.landSomUtbetalerPengestotte !== undefined) {
      await expect(
        this.page.locator(
          `dt:has-text("${skatteforholdOgInntekt.felter.landSomUtbetalerPengestotte.label}") + dd`,
        ),
      ).toHaveText(
        translations.land[
          data.landSomUtbetalerPengestotte as keyof typeof translations.land
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
        ? translations.felles.ja
        : translations.felles.nei,
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
        ? translations.felles.ja
        : translations.felles.nei,
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

  async sendInnAndExpectPost(forventetSprak: string = E2E_SPRAK) {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(
            `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/send-inn`,
          ) && response.request().method() === "POST",
    );

    await this.sendSoknadButton.click();
    const response = await responsePromise;

    // Innsendingen skal bære språket brukeren fylte ut på — det styrer den arkiverte PDF-en
    const url = new URL(response.request().url());
    expect(url.searchParams.get("sprak")).toBe(forventetSprak);
  }

  async sendInnAndExpectNoPost() {
    const requestPromise = this.page
      .waitForRequest(
        (request) =>
          request
            .url()
            .includes(
              `/api/skjema/utsendt-arbeidstaker/${this.skjema.id}/send-inn`,
            ) && request.method() === "POST",
        { timeout: 500 },
      )
      .then(() => true)
      .catch(() => false);

    await this.sendSoknadButton.click();

    await expect(await requestPromise).toBe(false);
  }

  async assertManglendeStegVises(steg: Array<{ navn: string; href: string }>) {
    await expect(
      this.page.getByText(translations.felles.stegManglerUtfylling),
    ).toBeVisible();

    for (const { navn, href } of steg) {
      await expect(this.page.getByRole("link", { name: navn })).toHaveAttribute(
        "href",
        href,
      );
    }
  }

  async assertEndreSvarLenkerHarHref(hrefs: string[]) {
    for (const href of hrefs) {
      await expect(
        this.page
          .locator(`a[href="${href}"]`)
          .filter({ hasText: translations.felles.endreSvar }),
      ).toHaveCount(1);
    }
  }

  async assertNavigatedToKvittering() {
    await expect(this.page).toHaveURL(`/skjema/${this.skjema.id}/kvittering`);
  }
}
