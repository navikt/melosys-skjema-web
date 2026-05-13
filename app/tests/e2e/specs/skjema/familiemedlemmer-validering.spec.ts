import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
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
});
