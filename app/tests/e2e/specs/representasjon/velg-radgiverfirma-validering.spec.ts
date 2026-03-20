import { test } from "@playwright/test";

import { mockUserInfo } from "../../fixtures/api-mocks";
import { testUserInfo } from "../../fixtures/test-data";
import { VelgRadgiverfirmaPage } from "../../pages/representasjon/velg-radgiverfirma.page";

test.describe("Velg rådgiverfirma - validering", () => {
  let velgRadgiverfirmaPage: VelgRadgiverfirmaPage;

  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    velgRadgiverfirmaPage = new VelgRadgiverfirmaPage(page);
    await velgRadgiverfirmaPage.goto();
    await velgRadgiverfirmaPage.assertIsVisible();
  });

  test("viser feilmelding når man klikker Ok uten å ha søkt etter firma", async () => {
    await velgRadgiverfirmaPage.klikKOk();
    await velgRadgiverfirmaPage.assertDuMaSokeForstFeilmeldingIsVisible();
    await velgRadgiverfirmaPage.assertStillOnPage();
  });
});
