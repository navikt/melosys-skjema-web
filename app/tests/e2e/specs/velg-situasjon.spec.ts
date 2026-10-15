import { expect } from "@playwright/test";

import { mockUserInfo } from "../fixtures/api-mocks";
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

test.describe("Velg situasjon", () => {
  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
  });

  test("/ går rett til «Hvem skal du opptre som?» uten tilgjengelige toggles", async ({
    page,
  }) => {
    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.goto();
    await expect(page).toHaveURL(/\/representasjon$/);
    await representasjonPage.assertIsVisible();
    await representasjonPage.assertGaTilbakeKnappIkkeFinnes();
  });

  test("/velg-situasjon er tilgjengelig uten tilgjengelige toggles", async ({
    page,
  }) => {
    const velgSituasjonPage = new VelgSituasjonPage(page);
    await velgSituasjonPage.goto();
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
    await representasjonPage.assertGaTilbakeKnappIkkeFinnes();
  });
});
