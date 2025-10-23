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
import { ArbeidsgiverenStegPage } from "../pages/skjema/arbeidsgiver/arbeidsgiveren-steg.page";
import { ArbeidsgiverensVirksomhetINorgeStegPage } from "../pages/skjema/arbeidsgiver/arbeidsgiverens-virksomhet-i-norge-steg.page";
import { ArbeidstakerensLonnStegPage } from "../pages/skjema/arbeidsgiver/arbeidstakerens-lonn-steg.page";
import { UtenlandsoppdragetStegPage } from "../pages/skjema/arbeidsgiver/utenlandsoppdraget-steg.page";

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
    const arbeidsgiverStegPage = new ArbeidsgiverenStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Sett valgt rolle i session storage
    await arbeidsgiverStegPage.setValgtRolle(testOrganization);

    // Naviger direkte til steget
    await arbeidsgiverStegPage.goto();

    await arbeidsgiverStegPage.assertIsVisible();

    // Verifiser at organisasjonsnummer er forhåndsutfylt
    await arbeidsgiverStegPage.assertOrganisasjonsnummerValue(
      testOrganization.orgnr,
    );

    // Lagre og fortsett
    const lagreArbeidsgiverenApiCall =
      await arbeidsgiverStegPage.lagreOgFortsettAndWaitForApiRequest();

    const expectedArbeidsgiverPayload: ArbeidsgiverenDto = {
      organisasjonsnummer: testOrganization.orgnr,
      organisasjonNavn: testOrganization.navn,
    };

    expect(lagreArbeidsgiverenApiCall.postDataJSON()).toStrictEqual(
      expectedArbeidsgiverPayload,
    );

    // Verifiser navigerering til neste steg
    await arbeidsgiverStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut arbeidsgiverens virksomhet i Norge steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const virksomhetStegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Naviger direkte til steget
    await virksomhetStegPage.goto();

    await virksomhetStegPage.assertIsVisible();

    // Svar på spørsmål
    await virksomhetStegPage.offentligVirksomhetRadioGroup.NEI.click();
    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.NEI.click();
    await virksomhetStegPage.vanligDriftRadioGroup.JA.click();

    // Lagre og fortsett
    const lagreArbeidsgiverensVirksomhetINorgeApiCall =
      await virksomhetStegPage.lagreOgFortsettAndWaitForApiRequest();

    const expectedVirksomhetPayload: ArbeidsgiverensVirksomhetINorgeDto = {
      erArbeidsgiverenOffentligVirksomhet: false,
      erArbeidsgiverenBemanningsEllerVikarbyraa: false,
      opprettholderArbeidsgiverenVanligDrift: true,
    };

    expect(
      lagreArbeidsgiverensVirksomhetINorgeApiCall.postDataJSON(),
    ).toStrictEqual(expectedVirksomhetPayload);

    // Verifiser navigerering til neste steg
    await virksomhetStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut utenlandsoppdraget steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const utenlandsoppdragetStegPage = new UtenlandsoppdragetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Naviger direkte til steget
    await utenlandsoppdragetStegPage.goto();

    await utenlandsoppdragetStegPage.assertIsVisible();

    // Svar på spørsmål
    await utenlandsoppdragetStegPage.utsendelseLandCombobox.selectOption(
      formFieldValues.utsendelseLand,
    );
    await utenlandsoppdragetStegPage.fraDatoInput.fill(
      formFieldValues.periodeFra,
    );
    await utenlandsoppdragetStegPage.tilDatoInput.fill(
      formFieldValues.periodeTil,
    );

    await utenlandsoppdragetStegPage.arbeidsgiverHarOppdragILandetRadioGroup.JA.click();
    await utenlandsoppdragetStegPage.arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup.NEI.click();
    await utenlandsoppdragetStegPage.arbeidstakerForblirAnsattIHelePeriodenRadioGroup.JA.click();
    await utenlandsoppdragetStegPage.arbeidstakerErstatterAnnenPersonRadioGroup.NEI.click();

    // Lagre og fortsett
    const lagreUtenlandsoppdragetApiCall =
      await utenlandsoppdragetStegPage.lagreOgFortsettAndWaitForApiRequest();

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
    await utenlandsoppdragetStegPage.assertNavigatedToNextStep();
  });

  test("skal fylle ut arbeidstakerens lønn steg og gjøre forventet POST request", async ({
    page,
  }) => {
    const arbeidstakerensLonnStegPage = new ArbeidstakerensLonnStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    // Naviger direkte til steget
    await arbeidstakerensLonnStegPage.goto();

    await arbeidstakerensLonnStegPage.assertIsVisible();

    // Svar på spørsmål
    await arbeidstakerensLonnStegPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.JA.click();

    // Lagre og fortsett
    const lagreArbeidstakerensLonnApiCall =
      await arbeidstakerensLonnStegPage.lagreOgFortsettAndWaitForApiRequest();

    const expectedArbeidstakerensLonnPayload: ArbeidstakerensLonnDto = {
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: true,
    };

    expect(lagreArbeidstakerensLonnApiCall.postDataJSON()).toStrictEqual(
      expectedArbeidstakerensLonnPayload,
    );

    // Verifiser navigerering til neste steg
    await arbeidstakerensLonnStegPage.assertNavigatedToNextStep();
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
