import { VELG_SITUASJON } from "~/featuretoggle/toggleNavn";

import { mockFeatureToggles, mockUserInfo } from "../fixtures/api-mocks";
import { test } from "../fixtures/test";
import { testUserInfo } from "../fixtures/test-data";
import { RepresentasjonPage } from "../pages/representasjon/representasjon.page";
import { VelgSituasjonPage } from "../pages/velg-situasjon/velg-situasjon.page";
import { E2E_SPRAK } from "../utils/translations";

test.beforeEach(async ({ page }) => {
  if (E2E_SPRAK !== "nb") {
    await page.context().addCookies([
      {
        name: "decorator-language",
        value: E2E_SPRAK,
        url: "http://localhost:5173",
      },
    ]);
  }
});

test.describe("Velg situasjon — toggle på", () => {
  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    await mockFeatureToggles(page, { [VELG_SITUASJON]: true });
  });

  test("/ går til velg situasjon", async ({ page }) => {
    const velgSituasjonPage = new VelgSituasjonPage(page);
    await velgSituasjonPage.gotoRot();
    await velgSituasjonPage.assertIsVisible();
  });

  test("kortet for opphold og «Gå tilbake» lenker til riktige eksterne sider", async ({
    page,
  }) => {
    const velgSituasjonPage = new VelgSituasjonPage(page);
    await velgSituasjonPage.goto();
    await velgSituasjonPage.assertIsVisible();
    await velgSituasjonPage.assertLenkerPekerRiktig();
  });

  test("kortet for utsendt arbeidstaker går til «Hvem skal du opptre som?»", async ({
    page,
  }) => {
    const velgSituasjonPage = new VelgSituasjonPage(page);
    const representasjonPage = new RepresentasjonPage(page);
    await velgSituasjonPage.goto();
    await velgSituasjonPage.velgUtsendt();
    await representasjonPage.assertIsVisible();
  });
});

test.describe("Velg situasjon — toggle av", () => {
  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    await mockFeatureToggles(page, { [VELG_SITUASJON]: false });
  });

  test("/ går rett til «Hvem skal du opptre som?»", async ({ page }) => {
    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.goto();
    await representasjonPage.assertIsVisible();
  });

  test("direkte besøk på /velg-situasjon sendes videre til «Hvem skal du opptre som?»", async ({
    page,
  }) => {
    const velgSituasjonPage = new VelgSituasjonPage(page);
    const representasjonPage = new RepresentasjonPage(page);
    await velgSituasjonPage.goto();
    await representasjonPage.assertIsVisible();
  });
});

test.describe("Velg situasjon — togglene feiler", () => {
  test("/ faller tilbake til «Hvem skal du opptre som?»", async ({ page }) => {
    // Featuretoggle-endepunktet er ikke mocket, så catch-all svarer 404
    await mockUserInfo(page, testUserInfo);
    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.goto();
    await representasjonPage.assertIsVisible();
  });
});
