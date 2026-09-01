import { ArbeidsgiverensVirksomhetINorgeDto } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { ArbeidsgiverensVirksomhetINorgeStegPage } from "../../pages/skjema/arbeidsgiverens-virksomhet-i-norge-steg.page";

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

    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.NEI.click();
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
    await virksomhetStegPage.vanligDriftRadioGroup.NEI.click();

    const expectedPayload: ArbeidsgiverensVirksomhetINorgeDto = {
      erArbeidsgiverenBemanningsEllerVikarbyraa: true,
      opprettholderArbeidsgiverenVanligDrift: false,
    };

    await virksomhetStegPage.lagreOgFortsettAndExpectPayload(expectedPayload);
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
