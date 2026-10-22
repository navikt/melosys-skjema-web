import {
  setupApiMocksForArbeidsgiver,
  setupApiMocksForArbeidstaker,
  setupApiMocksForKombinert,
} from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
import {
  testArbeidsgiverSkjema,
  testKombinertSkjema,
  testOffentligTjenestepersonSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { ArbeidsstedIUtlandetStegPage } from "../../pages/skjema/arbeidssted-i-utlandet-steg.page";

test.describe("Rolleikoner i stegtittel og stegvelger", () => {
  test("skjuler ikonene i arbeidsgivers del", async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
    const steg = new ArbeidsstedIUtlandetStegPage(page, testArbeidsgiverSkjema);

    await steg.goto();
    await steg.assertIsVisible();
    await steg.assertStegIkonerErSkjult();
  });

  test("skjuler ikonene når arbeidssted inngår i arbeidstakers del", async ({
    page,
  }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testOffentligTjenestepersonSkjema,
      testUserInfo,
    );
    const steg = new ArbeidsstedIUtlandetStegPage(
      page,
      testOffentligTjenestepersonSkjema,
      { erArbeidstaker: true },
    );

    await steg.goto();
    await steg.assertIsVisible();
    await steg.assertStegIkonerErSkjult();
  });

  test("beholder ikonene i kombinert skjema", async ({ page }) => {
    await setupApiMocksForKombinert(
      page,
      testKombinertSkjema,
      [testOrganization],
      testUserInfo,
    );
    const steg = new ArbeidsstedIUtlandetStegPage(page, testKombinertSkjema);

    await steg.goto();
    await steg.assertIsVisible();
    await steg.assertStegIkonerErSynlige();
  });
});
