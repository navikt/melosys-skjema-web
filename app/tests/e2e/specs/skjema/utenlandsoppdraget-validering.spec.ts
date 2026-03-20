import { test } from "@playwright/test";

import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { UtenlandsoppdragetStegPage } from "../../pages/skjema/utenlandsoppdraget-steg.page";

test.describe("Utenlandsoppdraget - validering", () => {
  let stegPage: UtenlandsoppdragetStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
    stegPage = new UtenlandsoppdragetStegPage(page, testArbeidsgiverSkjema);
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmelding på alle påkrevde felter når ingen felter er fylt ut", async () => {
    await stegPage.lagreOgFortsett();

    await stegPage.assertHarOppdragILandetErPakrevdIsVisible();
    await stegPage.assertBleAnsattForUtenlandsoppdragetErPakrevdIsVisible();
    await stegPage.assertForblirAnsattIHelePeriodenErPakrevdIsVisible();
    await stegPage.assertErstatterAnnenPersonErPakrevdIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding på conditional-felter når de er synlige men ikke fylt ut", async () => {
    // Svar nei på oppdrag -> begrunnelse-textarea blir synlig og påkrevd
    await stegPage.arbeidsgiverHarOppdragILandetRadioGroup.NEI.click();

    // Svar ja på ansatt for oppdraget -> "vil jobbe etter" radio blir synlig og påkrevd
    await stegPage.arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup.JA.click();

    // Svar nei på forblir ansatt -> ansettelsesforhold-beskrivelse blir synlig og påkrevd
    await stegPage.arbeidstakerForblirAnsattIHelePeriodenRadioGroup.NEI.click();

    // Svar nei på erstatter annen person -> periodefeltet rendres IKKE.
    // NB: Periodefeltet kan ikke inkluderes her pga Zod short-circuit:
    // periodeSchema feiler på basenivå og blokkerer superRefine.
    await stegPage.arbeidstakerErstatterAnnenPersonRadioGroup.NEI.click();

    await stegPage.lagreOgFortsett();

    await stegPage.assertBegrunnelseErPakrevdNarIkkeOppdragIsVisible();
    await stegPage.assertVilJobbeEtterOppdragetErPakrevdIsVisible();
    await stegPage.assertAnsettelsesforholdBeskrivelseErPakrevdIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding på datofelter når erstatter annen person er ja men periode ikke er fylt ut", async () => {
    await stegPage.arbeidsgiverHarOppdragILandetRadioGroup.JA.click();
    await stegPage.arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup.NEI.click();
    await stegPage.arbeidstakerForblirAnsattIHelePeriodenRadioGroup.JA.click();
    await stegPage.arbeidstakerErstatterAnnenPersonRadioGroup.JA.click();

    await stegPage.lagreOgFortsett();

    await stegPage.assertPeriodeErPakrevdIsVisible();
    await stegPage.assertStillOnStep();
  });
});
