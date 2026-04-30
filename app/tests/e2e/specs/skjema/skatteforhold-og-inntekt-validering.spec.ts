import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
import { testArbeidstakerSkjema, testUserInfo } from "../../fixtures/test-data";
import { SkatteforholdOgInntektStegPage } from "../../pages/skjema/skatteforhold-og-inntekt-steg.page";

test.describe("Skatteforhold og inntekt - validering", () => {
  let stegPage: SkatteforholdOgInntektStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
    stegPage = new SkatteforholdOgInntektStegPage(page, testArbeidstakerSkjema);
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmeldinger når ingen felter er besvart", async () => {
    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaSvarePaOmDuErSkattepliktigIsVisible();
    await stegPage.assertDuMaSvarePaOmDuMottarPengestotteIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmeldinger på alle pengestøtte-felter når mottar pengestøtte er ja men ingen detaljer er fylt ut", async () => {
    await stegPage.erSkattepliktigTilNorgeRadioGroup.JA.click();
    await stegPage.mottarPengestotteFraAnnetEosLandRadioGroup.JA.click();

    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaBeskriveHvaSlagsPengestotteIsVisible();
    await stegPage.assertDuMaVelgeHvilketLandSomUtbetalerPengestottenIsVisible();
    await stegPage.assertDuMaOppgiEtGyldigBelopIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding på beløp når ugyldig beløp er oppgitt", async () => {
    await stegPage.erSkattepliktigTilNorgeRadioGroup.JA.click();
    await stegPage.mottarPengestotteFraAnnetEosLandRadioGroup.JA.click();

    await stegPage.pengestotteBelopInput.fill("abc");

    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaOppgiEtGyldigBelopIsVisible();
    await stegPage.assertStillOnStep();
  });
});
