import { expect, test } from "@playwright/test";

import { UtenlandsoppdragetDto } from "~/types/melosysSkjemaTypes";
import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import {
  formFieldValues,
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { UtenlandsoppdragetStegPage } from "../../pages/skjema/arbeidsgiver/utenlandsoppdraget-steg.page";

test.describe("Utenlandsoppdraget", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
  });

  test("happy case - har oppdrag, ikke ansatt for oppdraget, forblir ansatt, erstatter ikke", async ({
    page,
  }) => {
    const utenlandsoppdragetStegPage = new UtenlandsoppdragetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await utenlandsoppdragetStegPage.goto();
    await utenlandsoppdragetStegPage.assertIsVisible();

    await utenlandsoppdragetStegPage.arbeidsgiverHarOppdragILandetRadioGroup.JA.click();
    await utenlandsoppdragetStegPage.arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup.NEI.click();
    await utenlandsoppdragetStegPage.arbeidstakerForblirAnsattIHelePeriodenRadioGroup.JA.click();
    await utenlandsoppdragetStegPage.arbeidstakerErstatterAnnenPersonRadioGroup.NEI.click();

    const expectedPayload: UtenlandsoppdragetDto = {
      arbeidsgiverHarOppdragILandet: true,
      arbeidstakerBleAnsattForUtenlandsoppdraget: false,
      arbeidstakerForblirAnsattIHelePerioden: true,
      arbeidstakerErstatterAnnenPerson: false,
    };

    await utenlandsoppdragetStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await utenlandsoppdragetStegPage.assertNavigatedToNextStep();
  });

  test("variant: alle Ja — viser alle conditional-felter", async ({ page }) => {
    const utenlandsoppdragetStegPage = new UtenlandsoppdragetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await utenlandsoppdragetStegPage.goto();
    await utenlandsoppdragetStegPage.assertIsVisible();

    // Nei -> viser begrunnelse-textarea
    await utenlandsoppdragetStegPage.arbeidsgiverHarOppdragILandetRadioGroup.NEI.click();
    await expect(
      utenlandsoppdragetStegPage.utenlandsoppholdetsBegrunnelseTextarea,
    ).toBeVisible();
    await utenlandsoppdragetStegPage.utenlandsoppholdetsBegrunnelseTextarea.fill(
      "Markedsutvikling i nabolandet",
    );

    // Ja -> viser "vil jobbe etter oppdraget"
    await utenlandsoppdragetStegPage.arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup.JA.click();
    await expect(
      utenlandsoppdragetStegPage
        .arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdragetRadioGroup.JA,
    ).toBeVisible();
    await utenlandsoppdragetStegPage.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdragetRadioGroup.JA.click();

    // Nei -> viser ansettelsesforhold-beskrivelse
    await utenlandsoppdragetStegPage.arbeidstakerForblirAnsattIHelePeriodenRadioGroup.NEI.click();
    await expect(
      utenlandsoppdragetStegPage.ansettelsesforholdBeskrivelseTextarea,
    ).toBeVisible();
    await utenlandsoppdragetStegPage.ansettelsesforholdBeskrivelseTextarea.fill(
      "Midlertidig ansettelse",
    );

    // Ja -> viser forrige arbeidstakers periode — fill required dates
    await utenlandsoppdragetStegPage.arbeidstakerErstatterAnnenPersonRadioGroup.JA.click();
    await utenlandsoppdragetStegPage.fillForrigeArbeidstakerFraDato(
      formFieldValues.periodeFra,
    );
    await utenlandsoppdragetStegPage.fillForrigeArbeidstakerTilDato(
      formFieldValues.periodeTil,
    );

    const expectedPayload: UtenlandsoppdragetDto = {
      arbeidsgiverHarOppdragILandet: false,
      utenlandsoppholdetsBegrunnelse: "Markedsutvikling i nabolandet",
      arbeidstakerBleAnsattForUtenlandsoppdraget: true,
      arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: true,
      arbeidstakerForblirAnsattIHelePerioden: false,
      ansettelsesforholdBeskrivelse: "Midlertidig ansettelse",
      arbeidstakerErstatterAnnenPerson: true,
      forrigeArbeidstakerUtsendelsePeriode: formFieldValues.periode,
    };

    await utenlandsoppdragetStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await utenlandsoppdragetStegPage.assertNavigatedToNextStep();
  });

  test("variant: alle Nei — minimalt med felter", async ({ page }) => {
    const utenlandsoppdragetStegPage = new UtenlandsoppdragetStegPage(
      page,
      testArbeidsgiverSkjema,
    );

    await utenlandsoppdragetStegPage.goto();
    await utenlandsoppdragetStegPage.assertIsVisible();

    await utenlandsoppdragetStegPage.arbeidsgiverHarOppdragILandetRadioGroup.JA.click();
    await utenlandsoppdragetStegPage.arbeidstakerBleAnsattForUtenlandsoppdragetRadioGroup.NEI.click();

    // "Vil jobbe etter" should NOT be visible when not ansatt for oppdraget
    await expect(
      utenlandsoppdragetStegPage
        .arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdragetRadioGroup.JA,
    ).not.toBeVisible();

    await utenlandsoppdragetStegPage.arbeidstakerForblirAnsattIHelePeriodenRadioGroup.JA.click();

    // Ansettelsesforhold-beskrivelse should NOT be visible
    await expect(
      utenlandsoppdragetStegPage.ansettelsesforholdBeskrivelseTextarea,
    ).not.toBeVisible();

    await utenlandsoppdragetStegPage.arbeidstakerErstatterAnnenPersonRadioGroup.NEI.click();

    const expectedPayload: UtenlandsoppdragetDto = {
      arbeidsgiverHarOppdragILandet: true,
      arbeidstakerBleAnsattForUtenlandsoppdraget: false,
      arbeidstakerForblirAnsattIHelePerioden: true,
      arbeidstakerErstatterAnnenPerson: false,
    };

    await utenlandsoppdragetStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await utenlandsoppdragetStegPage.assertNavigatedToNextStep();
  });
});
