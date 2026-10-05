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

  test("bemanningsbyrå må fylle ut opplysninger om samlet virksomhet", async () => {
    await stegPage.bemanningsEllerVikarbyraRadioGroup.JA.click();
    await stegPage.assertVanligDriftIsHidden();
    await stegPage.lagreOgFortsett();

    await stegPage.assertSamletVirksomhetPakrevdIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding for ugyldig antall og andel", async () => {
    await stegPage.bemanningsEllerVikarbyraRadioGroup.JA.click();
    await stegPage.assertVanligDriftIsHidden();
    await stegPage.fyllSamletVirksomhet({
      antallAdministrativtAnsatte: 3,
      andelAnsatteRekruttertINorge: 50,
      andelOmsetningINorge: 50,
      andelOppdragUtfortINorge: 50,
      andelOppdragskontrakterInngattINorge: 101,
    });
    await stegPage.fyllFelt("antallUtsendteArbeidstakere", "2,5");
    await stegPage.lagreOgFortsett();

    await stegPage.assertAntallMaVaereHeltallIsVisible();
    await stegPage.assertAndelMaVaereMellom0Og100IsVisible();
    await stegPage.assertStillOnStep();
  });
});
