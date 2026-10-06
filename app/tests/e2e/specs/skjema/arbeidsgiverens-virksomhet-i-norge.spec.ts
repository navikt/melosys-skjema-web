import { ArbeidsgiverensVirksomhetINorgeDto } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import {
  ArbeidsgiverensVirksomhetINorgeStegPage,
  type SamletVirksomhetData,
} from "../../pages/skjema/arbeidsgiverens-virksomhet-i-norge-steg.page";

const samletVirksomhet: SamletVirksomhetData = {
  antallAdministrativtAnsatte: 3,
  antallUtsendteArbeidstakere: 2,
  andelAnsatteRekruttertINorge: 80,
  andelOmsetningINorge: 60,
  andelOppdragUtfortINorge: 0,
  andelOppdragskontrakterInngattINorge: 100,
};

const skjemaMedFaaAnsatte = {
  ...testArbeidsgiverSkjema,
  metadata: { ...testArbeidsgiverSkjema.metadata, antallAnsatte: 5 },
};

test.describe("Arbeidsgiverens virksomhet i Norge", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
  });

  test("happy case - privat virksomhet, ikke bemanningsbyrå, vanlig drift", async ({
    page,
  }) => {
    const virksomhetStegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await virksomhetStegPage.goto();
    await virksomhetStegPage.assertIsVisible();
    await virksomhetStegPage.assertIngenRegisterinfoboks();
    await virksomhetStegPage.assertSamletVirksomhetIsHidden();

    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.NEI.click();
    await virksomhetStegPage.assertVanligDriftIsVisible();
    await virksomhetStegPage.vanligDriftRadioGroup.JA.click();

    const expectedPayload: ArbeidsgiverensVirksomhetINorgeDto = {
      erArbeidsgiverenBemanningsEllerVikarbyraa: false,
      opprettholderArbeidsgiverenVanligDrift: true,
    };

    await virksomhetStegPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await virksomhetStegPage.assertNavigatedToNextStep();
  });

  test("variant: privat virksomhet + bemanningsbyrå", async ({ page }) => {
    const virksomhetStegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await virksomhetStegPage.goto();
    await virksomhetStegPage.assertIsVisible();

    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.JA.click();
    await virksomhetStegPage.assertVanligDriftIsHidden();
    await virksomhetStegPage.assertSamletVirksomhetIsVisible();
    await virksomhetStegPage.assertSamletVirksomhetStyling();
    await virksomhetStegPage.fyllSamletVirksomhet(samletVirksomhet);

    const expectedPayload: ArbeidsgiverensVirksomhetINorgeDto = {
      erArbeidsgiverenBemanningsEllerVikarbyraa: true,
      ...samletVirksomhet,
    };

    await virksomhetStegPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await virksomhetStegPage.assertNavigatedToNextStep();
  });

  test("færre enn 20 ansatte - viser samlet virksomhet uten infoboks", async ({
    page,
  }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      skjemaMedFaaAnsatte,
      [testOrganization],
      testUserInfo,
    );
    const virksomhetStegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      skjemaMedFaaAnsatte,
    );

    await virksomhetStegPage.goto();
    await virksomhetStegPage.assertIsVisible();
    await virksomhetStegPage.assertIngenRegisterinfoboks();
    await virksomhetStegPage.assertSamletVirksomhetIsVisible();
    await virksomhetStegPage.assertVanligDriftIsHidden();

    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.NEI.click();
    await virksomhetStegPage.fyllSamletVirksomhet(samletVirksomhet);

    await virksomhetStegPage.lagreOgFortsettAndExpectPayload({
      erArbeidsgiverenBemanningsEllerVikarbyraa: false,
      ...samletVirksomhet,
    });
    await virksomhetStegPage.assertNavigatedToNextStep();
  });

  test("viser lagrede opplysninger om samlet virksomhet", async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      skjemaMedFaaAnsatte,
      [testOrganization],
      testUserInfo,
    );
    const virksomhetStegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      skjemaMedFaaAnsatte,
    );
    await virksomhetStegPage.mockArbeidsgiverensVirksomhetINorgeStegData({
      erArbeidsgiverenBemanningsEllerVikarbyraa: false,
      ...samletVirksomhet,
    });

    await virksomhetStegPage.goto();
    await virksomhetStegPage.assertIsVisible();
    await virksomhetStegPage.assertSamletVirksomhetVerdier(samletVirksomhet);
    await virksomhetStegPage.assertVanligDriftIsHidden();
  });

  test("bemanningsbyrå som angrer - skjulte felter sendes ikke", async ({
    page,
  }) => {
    const virksomhetStegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await virksomhetStegPage.goto();
    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.NEI.click();
    await virksomhetStegPage.vanligDriftRadioGroup.JA.click();
    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.JA.click();
    await virksomhetStegPage.assertVanligDriftIsHidden();
    await virksomhetStegPage.fyllSamletVirksomhet(samletVirksomhet);
    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.NEI.click();
    await virksomhetStegPage.assertSamletVirksomhetIsHidden();
    await virksomhetStegPage.assertVanligDriftIsVisible();

    await virksomhetStegPage.lagreOgFortsettAndExpectPayload({
      erArbeidsgiverenBemanningsEllerVikarbyraa: false,
      opprettholderArbeidsgiverenVanligDrift: true,
    });
    await virksomhetStegPage.assertNavigatedToNextStep();
  });

  test("tidligere svar om vanlig drift sendes ikke når bemanningsbyrå velges", async ({
    page,
  }) => {
    const virksomhetStegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await virksomhetStegPage.goto();
    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.NEI.click();
    await virksomhetStegPage.vanligDriftRadioGroup.JA.click();
    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.JA.click();
    await virksomhetStegPage.assertVanligDriftIsHidden();
    await virksomhetStegPage.fyllSamletVirksomhet(samletVirksomhet);

    await virksomhetStegPage.lagreOgFortsettAndExpectPayload({
      erArbeidsgiverenBemanningsEllerVikarbyraa: true,
      ...samletVirksomhet,
    });
    await virksomhetStegPage.assertNavigatedToNextStep();
  });

  test("offentlig virksomhet kan ikke åpne steget direkte", async ({
    page,
  }) => {
    const offentligSkjema = {
      ...testArbeidsgiverSkjema,
      metadata: {
        ...testArbeidsgiverSkjema.metadata,
        erOffentligArbeidsgiver: true,
      },
    };
    await setupApiMocksForArbeidsgiver(
      page,
      offentligSkjema,
      [testOrganization],
      testUserInfo,
    );
    const virksomhetStegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      offentligSkjema,
    );

    await virksomhetStegPage.goto();
    await virksomhetStegPage.assertNavigatedToNextStep();
  });
});
