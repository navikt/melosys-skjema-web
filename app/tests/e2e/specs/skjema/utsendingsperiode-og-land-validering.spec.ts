import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { expect, test } from "../../fixtures/test";
import {
  formFieldValues,
  testArbeidstakerSkjema,
  testUserInfo,
} from "../../fixtures/test-data";
import { UtsendingsperiodeOgLandStegPage } from "../../pages/skjema/utsendingsperiode-og-land-steg.page";

test.describe("Utsendingsperiode og land - validering", () => {
  let stegPage: UtsendingsperiodeOgLandStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
    stegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testArbeidstakerSkjema,
    );
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmelding på alle felter når ingen felter er fylt ut", async () => {
    await stegPage.lagreOgFortsett();

    await stegPage.assertLandFeilmeldingIsVisible();
    await stegPage.assertFraDatoErPakrevdIsVisible();
    await stegPage.assertTilDatoErPakrevdIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding på begge datofelter når kun land er valgt", async () => {
    await stegPage.velgLand(formFieldValues.utsendelseLand);

    await stegPage.lagreOgFortsett();

    await stegPage.assertLandFeilmeldingIsNotVisible();
    await stegPage.assertFraDatoErPakrevdIsVisible();
    await stegPage.assertTilDatoErPakrevdIsVisible();
  });

  test("viser feilmelding på tomt datofelt når kun ett datofelt er fylt ut", async () => {
    await stegPage.velgLand(formFieldValues.utsendelseLand);
    await stegPage.fillFraDato(formFieldValues.periodeFra);

    await stegPage.lagreOgFortsett();

    await stegPage.assertLandFeilmeldingIsNotVisible();
    await stegPage.assertFraDatoErPakrevdIsNotVisible();
    await stegPage.assertTilDatoErPakrevdIsVisible();
  });

  test("viser feilmelding når til-dato er før fra-dato", async () => {
    await stegPage.velgLand(formFieldValues.utsendelseLand);
    await stegPage.fillFraDato(formFieldValues.periodeTil);
    await stegPage.fillTilDato(formFieldValues.periodeFra);

    await stegPage.lagreOgFortsett();

    await stegPage.assertTilDatoForFraDatoFeilmeldingIsVisible();
    await stegPage.assertFraDatoErPakrevdIsNotVisible();
    await stegPage.assertTilDatoErPakrevdIsNotVisible();
  });

  test("tømmer til-dato uten umiddelbar påkrevd-feil når fra-dato settes etter til-dato", async () => {
    await stegPage.velgLand(formFieldValues.utsendelseLand);
    await stegPage.fillFraDato(formFieldValues.periodeFra);
    await stegPage.fillTilDato(formFieldValues.periodeTil);
    await expect(stegPage.tilDatoInput).toHaveValue(formFieldValues.periodeTil);

    await stegPage.fraDatoInput.fill("01.01.2027");
    await stegPage.fraDatoInput.blur();

    await expect(stegPage.tilDatoInput).toHaveValue("");
    await stegPage.assertTilDatoErPakrevdIsNotVisible();

    await stegPage.lagreOgFortsett();

    await stegPage.assertTilDatoErPakrevdIsVisible();
  });
});
