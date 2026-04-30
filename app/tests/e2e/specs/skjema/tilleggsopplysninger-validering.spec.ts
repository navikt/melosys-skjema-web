import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
import { testArbeidstakerSkjema, testUserInfo } from "../../fixtures/test-data";
import { TilleggsopplysningerStegPage } from "../../pages/skjema/tilleggsopplysninger-steg.page";

test.describe("Tilleggsopplysninger - validering", () => {
  let stegPage: TilleggsopplysningerStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
    stegPage = new TilleggsopplysningerStegPage(page, testArbeidstakerSkjema);
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmelding når ingen felter er besvart", async () => {
    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaSvarePaOmDuHarFlereOpplysningerIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding når har flere opplysninger er ja men tekst ikke er fylt ut", async () => {
    await stegPage.harFlereOpplysningerRadioGroup.JA.click();

    await stegPage.lagreOgFortsett();

    await stegPage.assertTilleggsopplysningerErPakrevdIsVisible();
    await stegPage.assertStillOnStep();
  });
});
