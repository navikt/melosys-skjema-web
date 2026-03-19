import { test } from "@playwright/test";

import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { ArbeidsgiverensVirksomhetINorgeStegPage } from "../../pages/skjema/arbeidsgiverens-virksomhet-i-norge-steg.page";

test.describe("Arbeidsgiverens virksomhet i Norge - validering", () => {
  let stegPage: ArbeidsgiverensVirksomhetINorgeStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
    stegPage = new ArbeidsgiverensVirksomhetINorgeStegPage(
      page,
      testArbeidsgiverSkjema,
    );
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmelding når ingen felter er fylt ut", async () => {
    await stegPage.lagreOgFortsett();

    await stegPage.assertOffentligVirksomhetErPakrevdIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding på oppfølgingsspørsmål når kun offentlig virksomhet er besvart med nei", async () => {
    await stegPage.offentligVirksomhetRadioGroup.NEI.click();

    await stegPage.lagreOgFortsett();

    await stegPage.assertOffentligVirksomhetErPakrevdIsNotVisible();
    await stegPage.assertBemanningsEllerVikarbyraErPakrevdIsVisible();
    await stegPage.assertVanligDriftErPakrevdIsVisible();
    await stegPage.assertStillOnStep();
  });
});
