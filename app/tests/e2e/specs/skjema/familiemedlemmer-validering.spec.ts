import { test } from "@playwright/test";

import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { testArbeidstakerSkjema, testUserInfo } from "../../fixtures/test-data";
import { FamiliemedlemmerStegPage } from "../../pages/skjema/familiemedlemmer-steg.page";

test.describe("Familiemedlemmer - validering", () => {
  let stegPage: FamiliemedlemmerStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
    stegPage = new FamiliemedlemmerStegPage(page, testArbeidstakerSkjema);
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmelding når skalHaMedFamiliemedlemmer ikke er besvart", async () => {
    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaSvarePaOmDuHarFamiliemedlemmerIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmeldinger i modal når ingen felter er fylt ut", async () => {
    await stegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.JA.click();
    await stegPage.clickLagreInFamiliemedlemModal();

    await stegPage.assertModalFornavnErPakrevdIsVisible();
    await stegPage.assertModalEtternavnErPakrevdIsVisible();
    await stegPage.assertModalDuMaSvarePaOmHarNorskFnrIsVisible();
    await stegPage.assertFamiliemedlemModalIsOpen();
  });

  test("viser feilmelding på fødselsnummer når har norsk fnr er ja men fnr er tomt", async () => {
    await stegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.JA.click();
    await stegPage.leggTilFamiliemedlemButton.click();

    await stegPage.modalFornavnInput.fill("Kari");
    await stegPage.modalEtternavnInput.fill("Nordmann");
    await stegPage.modalHarNorskFnrRadioGroup.JA.click();

    await stegPage.modalLagreButton.click();

    await stegPage.assertModalFodselsnummerErPakrevdIsVisible();
    await stegPage.assertFamiliemedlemModalIsOpen();
  });

  test("viser feilmelding på fødselsnummer når ugyldig fnr er oppgitt", async () => {
    await stegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.JA.click();
    await stegPage.leggTilFamiliemedlemButton.click();

    await stegPage.modalFornavnInput.fill("Kari");
    await stegPage.modalEtternavnInput.fill("Nordmann");
    await stegPage.modalHarNorskFnrRadioGroup.JA.click();
    await stegPage.modalFodselsnummerInput.fill("12345678901");

    await stegPage.modalLagreButton.click();

    await stegPage.assertModalUgyldigFodselsnummerIsVisible();
    await stegPage.assertFamiliemedlemModalIsOpen();
  });

  test("viser feilmelding på fødselsdato når har norsk fnr er nei men fødselsdato er tom", async () => {
    await stegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.JA.click();
    await stegPage.leggTilFamiliemedlemButton.click();

    await stegPage.modalFornavnInput.fill("Hans");
    await stegPage.modalEtternavnInput.fill("Schmidt");
    await stegPage.modalHarNorskFnrRadioGroup.NEI.click();

    await stegPage.modalLagreButton.click();

    await stegPage.assertModalFodselsdatoErPakrevdIsVisible();
    await stegPage.assertFamiliemedlemModalIsOpen();
  });
});
