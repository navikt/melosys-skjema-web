import { expect, test } from "@playwright/test";

import { UtenlandsoppdragetDto } from "~/types/melosysSkjemaTypes";

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
    // Periodevalidering testes separat i neste test.
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

  test("kan submitte når erstatter annen person endres fra ja til nei", async () => {
    await stegPage.arbeidsgiverHarOppdragILandetRadioGroup.JA.click();
    await stegPage.arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup.NEI.click();
    await stegPage.arbeidstakerForblirAnsattIHelePeriodenRadioGroup.JA.click();

    // Velg Ja først slik at datofelter rendres
    await stegPage.arbeidstakerErstatterAnnenPersonRadioGroup.JA.click();
    await expect(stegPage.forrigeArbeidstakerFraDatoInput).toBeVisible();

    // Endre til Nei - datofelter skal forsvinne og validering skal ikke trigges
    await stegPage.arbeidstakerErstatterAnnenPersonRadioGroup.NEI.click();
    await expect(stegPage.forrigeArbeidstakerFraDatoInput).not.toBeVisible();

    const expectedPayload: UtenlandsoppdragetDto = {
      arbeidsgiverHarOppdragILandet: true,
      arbeidstakerBleAnsattForUtenlandsoppdraget: false,
      arbeidstakerForblirAnsattIHelePerioden: true,
      arbeidstakerErstatterAnnenPerson: false,
    };

    await stegPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await stegPage.assertNavigatedToNextStep();
  });
});
