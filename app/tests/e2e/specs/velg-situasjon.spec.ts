import { expect } from "@playwright/test";

import { Representasjonstype } from "~/types/melosysSkjemaTypes";

import { mockUserInfo, setupApiMocksForOversikt } from "../fixtures/api-mocks";
import { test } from "../fixtures/test";
import {
  emptyInnsendteSoknader,
  emptyUtkastListe,
  testUserInfo,
} from "../fixtures/test-data";
import { OversiktPage } from "../pages/oversikt/oversikt.page";
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
  });

  test("/velg-situasjon er tilgjengelig uten tilgjengelige toggles", async ({
    page,
  }) => {
    const velgSituasjonPage = new VelgSituasjonPage(page);
    await velgSituasjonPage.goto();
    await velgSituasjonPage.assertIsVisible();
  });

  test("kortet for opphold lenker til riktig ekstern side", async ({
    page,
  }) => {
    const velgSituasjonPage = new VelgSituasjonPage(page);
    await velgSituasjonPage.goto();
    await velgSituasjonPage.assertIsVisible();
    await velgSituasjonPage.assertOppholdLenkePekerRiktig();
  });

  test("kortet for utsendt arbeidstaker går til oversikten for DEG_SELV", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    const velgSituasjonPage = new VelgSituasjonPage(page);
    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await velgSituasjonPage.goto();
    await velgSituasjonPage.velgUtsendt();
    await expect(page).toHaveURL(/\/oversikt\?representasjonstype=DEG_SELV$/);
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertDegSelvInfoVisible();
  });
});
