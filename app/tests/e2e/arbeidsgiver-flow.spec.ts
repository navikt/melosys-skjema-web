import { expect, test } from "@playwright/test";

import { nb } from "../../src/i18n/nb";
import {
  ArbeidsgiverenDto,
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidstakerensLonnDto,
  UtenlandsoppdragetDto,
} from "../../src/types/melosysSkjemaTypes";
import {
  mockFetchArbeidsgiverSkjema,
  setupApiMocksForArbeidsgiver,
} from "../fixtures/api-mocks";
import {
  formFieldValues,
  testArbeidsgiverSkjema,
  testOrganization,
} from "../fixtures/test-data";
import { RollevelgerPage } from "../pages/rollevelger/rollevelger.page";
import { ArbeidsgiverSkjemaVeiledningPage } from "../pages/skjema/arbeidsgiver/arbeidsgiver-skjema-veiledning.page";

test.describe("Arbeidsgiver komplett flyt", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(page, testArbeidsgiverSkjema, [
      testOrganization,
    ]);
  });

  const skjemaBaseRoute = `/skjema/arbeidsgiver/${testArbeidsgiverSkjema.id}`;
  const apiBaseUrlWithSkjemaId = `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${testArbeidsgiverSkjema.id}`;

  test("skal velge rolle som arbeidsgiver og starte søknad", async ({
    page,
  }) => {
    const rollevelgerPage = new RollevelgerPage(page);
    const veiledningPage = new ArbeidsgiverSkjemaVeiledningPage(page);

    // Start fra rollevelger og velg organisasjons
    await rollevelgerPage.goto();

    // Velg test organisasjonen (navigerer direkte)
    await rollevelgerPage.selectOrganization(testOrganization.navn);

    // Skal vise veiledningsside
    await veiledningPage.assertStartSoknadButtonVisible();
    await veiledningPage.startSoknad();

    await veiledningPage.assertNavigatedToArbeidsgiveren(
      testArbeidsgiverSkjema.id,
    );
  });

  test("skal fylle ut arbeidsgiveren steg og gjøre forventet POST request", async ({
    page,
  }) => {
    // Sett valgt rolle i session storage
    await page.goto("/");
    await page.evaluate((org) => {
      sessionStorage.setItem("valgtRolle", JSON.stringify(org));
    }, testOrganization);

    // Naviger direkte til steget
    await page.goto(`${skjemaBaseRoute}/arbeidsgiveren`);

    await expect(
      page.getByRole("heading", {
        name: nb.translation.arbeidsgiverSteg.tittel,
      }),
    ).toBeVisible();

    // Verifiser at organisasjonsnummer er forhåndsutfylt
    await expect(
      page.getByLabel(
        nb.translation.arbeidsgiverSteg.arbeidsgiverensOrganisasjonsnummer,
      ),
    ).toHaveValue(testOrganization.orgnr);

    // Lagre og fortsett
    const lagreArbeidsgiverenRequest = page.waitForRequest(
      `${apiBaseUrlWithSkjemaId}/arbeidsgiveren`,
    );
    await page
      .getByRole("button", { name: nb.translation.felles.lagreOgFortsett })
      .click();

    // Verifiser forventet API kall
    const lagreArbeidsgiverenApiCall = await lagreArbeidsgiverenRequest;

    const expectedArbeidsgiverPayload: ArbeidsgiverenDto = {
      organisasjonsnummer: testOrganization.orgnr,
      organisasjonNavn: testOrganization.navn,
    };

    expect(lagreArbeidsgiverenApiCall.postDataJSON()).toStrictEqual(
      expectedArbeidsgiverPayload,
    );

    // Verifiser navigerering til neste steg
    await expect(page).toHaveURL(
      `${skjemaBaseRoute}/arbeidsgiverens-virksomhet-i-norge`,
    );
  });

  test("skal fylle ut arbeidsgiverens virksomhet i Norge steg og gjøre forventet POST request", async ({
    page,
  }) => {
    // Naviger direkte til steget
    await page.goto(`${skjemaBaseRoute}/arbeidsgiverens-virksomhet-i-norge`);

    await expect(
      page.getByRole("heading", {
        name: nb.translation.arbeidsgiverensVirksomhetINorgeSteg.tittel,
      }),
    ).toBeVisible();

    // Svar på spørsmål
    await page
      .getByRole("group", {
        name: nb.translation.arbeidsgiverensVirksomhetINorgeSteg
          .erArbeidsgiverenEnOffentligVirksomhet,
      })
      .getByRole("radio", { name: nb.translation.felles.nei })
      .click();

    await page
      .getByRole("group", {
        name: nb.translation.arbeidsgiverensVirksomhetINorgeSteg
          .erArbeidsgiverenEtBemanningsEllerVikarbyra,
      })
      .getByRole("radio", { name: nb.translation.felles.nei })
      .click();

    await page
      .getByRole("group", {
        name: nb.translation.arbeidsgiverensVirksomhetINorgeSteg
          .opprettholderArbeidsgiverenVanligDriftINorge,
      })
      .getByRole("radio", { name: nb.translation.felles.ja })
      .click();

    // Lagre og fortsett
    const lagreArbeidsgiverensVirksomhetINorgeRequest = page.waitForRequest(
      `${apiBaseUrlWithSkjemaId}/arbeidsgiverens-virksomhet-i-norge`,
    );
    await page
      .getByRole("button", { name: nb.translation.felles.lagreOgFortsett })
      .click();

    // Verifiser forventet API kall
    const lagreArbeidsgiverensVirksomhetINorgeApiCall =
      await lagreArbeidsgiverensVirksomhetINorgeRequest;

    const expectedVirksomhetPayload: ArbeidsgiverensVirksomhetINorgeDto = {
      erArbeidsgiverenOffentligVirksomhet: false,
      erArbeidsgiverenBemanningsEllerVikarbyraa: false,
      opprettholderArbeidsgiverenVanligDrift: true,
    };

    expect(
      lagreArbeidsgiverensVirksomhetINorgeApiCall.postDataJSON(),
    ).toStrictEqual(expectedVirksomhetPayload);

    // Verifiser navigerering til neste steg
    await expect(page).toHaveURL(`${skjemaBaseRoute}/utenlandsoppdraget`);
  });

  test("skal fylle ut utenlandsoppdraget steg og gjøre forventet POST request", async ({
    page,
  }) => {
    // Naviger direkte til steget
    await page.goto(`${skjemaBaseRoute}/utenlandsoppdraget`);

    await expect(
      page.getByRole("heading", {
        name: nb.translation.utenlandsoppdragetSteg.tittel,
      }),
    ).toBeVisible();

    // Svar på spørsmål
    await page
      .getByRole("combobox", {
        name: nb.translation.utenlandsoppdragetSteg
          .hvilketLandSendesArbeidstakerenTil,
      })
      .selectOption(formFieldValues.utsendelseLand);
    await page
      .getByLabel(nb.translation.utenlandsoppdragetSteg.fraDato)
      .fill(formFieldValues.periodeFra);
    await page
      .getByLabel(nb.translation.utenlandsoppdragetSteg.tilDato)
      .fill(formFieldValues.periodeTil);

    await page
      .getByRole("group", {
        name: nb.translation.utenlandsoppdragetSteg
          .harDuSomArbeidsgiverOppdragILandetArbeidstakerSkalSendesUtTil,
      })
      .getByRole("radio", { name: nb.translation.felles.ja })
      .click();

    await page
      .getByRole("group", {
        name: nb.translation.utenlandsoppdragetSteg
          .bleArbeidstakerAnsattPaGrunnAvDetteUtenlandsoppdraget,
      })
      .getByRole("radio", { name: nb.translation.felles.nei })
      .click();

    await page
      .getByRole("group", {
        name: nb.translation.utenlandsoppdragetSteg
          .vilArbeidstakerFortsattVareAnsattHostDereIHeleUtsendingsperioden,
      })
      .getByRole("radio", { name: nb.translation.felles.ja })
      .click();

    await page
      .getByRole("group", {
        name: nb.translation.utenlandsoppdragetSteg
          .erstatterArbeidstakerEnAnnenPersonSomVarSendtUtForAGjoreDetSammeArbeidet,
      })
      .getByRole("radio", { name: nb.translation.felles.nei })
      .click();

    // Lagre og fortsett
    const lagreUtenlandsoppdragetRequest = page.waitForRequest(
      `${apiBaseUrlWithSkjemaId}/utenlandsoppdraget`,
    );
    await page
      .getByRole("button", { name: nb.translation.felles.lagreOgFortsett })
      .click();

    // Verifiser forventet API kall
    const lagreUtenlandsoppdragetApiCall = await lagreUtenlandsoppdragetRequest;

    const expectedUtenlandsoppdragetPayload: UtenlandsoppdragetDto = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      arbeidstakerUtsendelseFraDato: formFieldValues.periodeFraIso,
      arbeidstakerUtsendelseTilDato: formFieldValues.periodeTilIso,
      arbeidsgiverHarOppdragILandet: true,
      arbeidstakerBleAnsattForUtenlandsoppdraget: false,
      arbeidstakerForblirAnsattIHelePerioden: true,
      arbeidstakerErstatterAnnenPerson: false,
    };

    expect(lagreUtenlandsoppdragetApiCall.postDataJSON()).toStrictEqual(
      expectedUtenlandsoppdragetPayload,
    );

    // Verifiser navigerering til neste steg
    await expect(page).toHaveURL(`${skjemaBaseRoute}/arbeidstakerens-lonn`);
  });

  test("skal fylle ut arbeidstakerens lønn steg og gjøre forventet POST request", async ({
    page,
  }) => {
    // Naviger direkte til steget
    await page.goto(`${skjemaBaseRoute}/arbeidstakerens-lonn`);

    await expect(
      page.getByRole("heading", {
        name: nb.translation.arbeidstakerenslonnSteg.tittel,
      }),
    ).toBeVisible();

    // Svar på spørsmål
    await page
      .getByRole("group", {
        name: nb.translation.arbeidstakerenslonnSteg
          .utbetalerDuSomArbeidsgiverAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden,
      })
      .getByRole("radio", { name: nb.translation.felles.ja })
      .click();

    // Lagre og fortsett
    const lagreArbeidstakerensLonnRequest = page.waitForRequest(
      `${apiBaseUrlWithSkjemaId}/arbeidstakerens-lonn`,
    );

    await page
      .getByRole("button", { name: nb.translation.felles.lagreOgFortsett })
      .click();

    // Verifiser forventet API kall
    const lagreArbeidstakerensLonnApiCall =
      await lagreArbeidstakerensLonnRequest;

    const expectedArbeidstakerensLonnPayload: ArbeidstakerensLonnDto = {
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: true,
    };

    expect(lagreArbeidstakerensLonnApiCall.postDataJSON()).toStrictEqual(
      expectedArbeidstakerensLonnPayload,
    );

    // Verifiser navigerering til neste steg
    await expect(page).toHaveURL(`${skjemaBaseRoute}/oppsummering`);
  });

  test("Oppsummering viser alle utfylte data fra tidligere steg", async ({
    page,
  }) => {
    const arbeidsgiverenData: ArbeidsgiverenDto = {
      organisasjonsnummer: testOrganization.orgnr,
      organisasjonNavn: testOrganization.navn,
    };

    const arbeidsgiverensVirksomhetINorgeData: ArbeidsgiverensVirksomhetINorgeDto =
      {
        erArbeidsgiverenOffentligVirksomhet: false,
        erArbeidsgiverenBemanningsEllerVikarbyraa: false,
        opprettholderArbeidsgiverenVanligDrift: true,
      };

    const utenlandsoppdragetData: UtenlandsoppdragetDto = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      arbeidstakerUtsendelseFraDato: formFieldValues.periodeFraIso,
      arbeidstakerUtsendelseTilDato: formFieldValues.periodeTilIso,
      arbeidsgiverHarOppdragILandet: true,
      arbeidstakerBleAnsattForUtenlandsoppdraget: false,
      arbeidstakerForblirAnsattIHelePerioden: true,
      arbeidstakerErstatterAnnenPerson: false,
    };

    const arbeidstakerensLonnData: ArbeidstakerensLonnDto = {
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: true,
    };

    // Mock komplett skjema data for oppsummering
    await mockFetchArbeidsgiverSkjema(page, {
      ...testArbeidsgiverSkjema,
      data: {
        arbeidsgiveren: arbeidsgiverenData,
        arbeidsgiverensVirksomhetINorge: arbeidsgiverensVirksomhetINorgeData,
        utenlandsoppdraget: utenlandsoppdragetData,
        arbeidstakerensLonn: arbeidstakerensLonnData,
      },
    });

    // Naviger direkte til oppsummering
    await page.goto(`${skjemaBaseRoute}/oppsummering`);

    await expect(
      page.getByRole("heading", {
        name: nb.translation.oppsummeringSteg.tittel,
      }),
    ).toBeVisible();

    // Verifiser at oppsummeringen viser utfylte data

    // Arbeidsgiveren
    await expect(
      page.locator(
        `dt:has-text("${nb.translation.arbeidsgiverSteg.arbeidsgiverensOrganisasjonsnummer}") + dd`,
      ),
    ).toHaveText(arbeidsgiverenData.organisasjonsnummer);

    await expect(
      page.locator(
        `dt:has-text("${nb.translation.arbeidsgiverSteg.organisasjonensNavn}") + dd`,
      ),
    ).toHaveText(arbeidsgiverenData.organisasjonNavn);

    // Arbeidsgiverens virksomhet i Norge
    await expect(
      page.locator(
        `dt:has-text("${nb.translation.arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEnOffentligVirksomhet}") + dd`,
      ),
    ).toHaveText(
      arbeidsgiverensVirksomhetINorgeData.erArbeidsgiverenOffentligVirksomhet
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      page.locator(
        `dt:has-text("${nb.translation.arbeidsgiverensVirksomhetINorgeSteg.erArbeidsgiverenEtBemanningsEllerVikarbyra}") + dd`,
      ),
    ).toHaveText(
      arbeidsgiverensVirksomhetINorgeData.erArbeidsgiverenBemanningsEllerVikarbyraa
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    await expect(
      page.locator(
        `dt:has-text("${nb.translation.arbeidsgiverensVirksomhetINorgeSteg.opprettholderArbeidsgiverenVanligDriftINorge}") + dd`,
      ),
    ).toHaveText(
      arbeidsgiverensVirksomhetINorgeData.opprettholderArbeidsgiverenVanligDrift
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );

    // Utenlandsoppdraget
    await expect(
      page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetSteg.hvilketLandSendesArbeidstakerenTil}") + dd`,
      ),
    ).toHaveText(utenlandsoppdragetData.utsendelseLand);

    await expect(
      page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetSteg.fraDato}") + dd`,
      ),
    ).toHaveText(utenlandsoppdragetData.arbeidstakerUtsendelseFraDato);

    await expect(
      page.locator(
        `dt:has-text("${nb.translation.utenlandsoppdragetSteg.tilDato}") + dd`,
      ),
    ).toHaveText(utenlandsoppdragetData.arbeidstakerUtsendelseTilDato);

    // Arbeidstakerens lønn
    await expect(
      page.locator(
        `dt:has-text("${nb.translation.arbeidstakerenslonnSteg.utbetalerDuSomArbeidsgiverAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden}") + dd`,
      ),
    ).toHaveText(
      arbeidstakerensLonnData.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden
        ? nb.translation.felles.ja
        : nb.translation.felles.nei,
    );
  });
});
