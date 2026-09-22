import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
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

    await stegPage.assertBemanningsEllerVikarbyraErPakrevdIsVisible();
    await stegPage.assertVanligDriftErPakrevdIsVisible();
    await stegPage.assertStillOnStep();
  });
});
