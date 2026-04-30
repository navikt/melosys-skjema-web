import { ArbeidsgiverensVirksomhetINorgeDto } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import { expect, test } from "../../fixtures/test";
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

    await virksomhetStegPage.mockArbeidsgiverensVirksomhetINorgeStegData({
      erArbeidsgiverenOffentligVirksomhet: false,
    });

    await virksomhetStegPage.goto();
    await virksomhetStegPage.assertIsVisible();

    await virksomhetStegPage.offentligVirksomhetRadioGroup.NEI.click();
    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.NEI.click();
    await virksomhetStegPage.vanligDriftRadioGroup.JA.click();

    const expectedPayload: ArbeidsgiverensVirksomhetINorgeDto = {
      erArbeidsgiverenOffentligVirksomhet: false,
      erArbeidsgiverenBemanningsEllerVikarbyraa: false,
      opprettholderArbeidsgiverenVanligDrift: true,
    };

    await virksomhetStegPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await virksomhetStegPage.assertNavigatedToNextStep();
  });

  test("variant: offentlig virksomhet — ingen oppfølgingsspørsmål", async ({
    page,
  }) => {
    const virksomhetStegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await virksomhetStegPage.goto();
    await virksomhetStegPage.assertIsVisible();

    await virksomhetStegPage.offentligVirksomhetRadioGroup.JA.click();

    // Bemanningsbyrå and vanlig drift should NOT be visible
    await expect(
      virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.JA,
    ).not.toBeVisible();
    await expect(virksomhetStegPage.vanligDriftRadioGroup.JA).not.toBeVisible();

    const expectedPayload: ArbeidsgiverensVirksomhetINorgeDto = {
      erArbeidsgiverenOffentligVirksomhet: true,
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

    await virksomhetStegPage.offentligVirksomhetRadioGroup.NEI.click();
    await virksomhetStegPage.bemanningsEllerVikarbyraRadioGroup.JA.click();
    await virksomhetStegPage.vanligDriftRadioGroup.NEI.click();

    const expectedPayload: ArbeidsgiverensVirksomhetINorgeDto = {
      erArbeidsgiverenOffentligVirksomhet: false,
      erArbeidsgiverenBemanningsEllerVikarbyraa: true,
      opprettholderArbeidsgiverenVanligDrift: false,
    };

    await virksomhetStegPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await virksomhetStegPage.assertNavigatedToNextStep();
  });
});
