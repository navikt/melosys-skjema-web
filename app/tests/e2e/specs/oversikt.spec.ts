import { test } from "@playwright/test";

import { Representasjonstype } from "../../../src/types/melosysSkjemaTypes";
import {
  mockHentTilganger,
  setupApiMocksForOversikt,
} from "../fixtures/api-mocks";
import {
  emptyInnsendteSoknader,
  emptyUtkastListe,
  testInnsendteSoknader,
  testOrganization,
  testUserInfo,
  testUtkastListe,
} from "../fixtures/test-data";
import { OversiktPage } from "../pages/oversikt/oversikt.page";

test.describe("Oversikt", () => {
  test("Viser oversiktssiden for DEG_SELV med start-søknad-knapp", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertStartSoknadVisible();
  });

  test("Viser utkastliste når det finnes påbegynte søknader", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      testUtkastListe,
      emptyInnsendteSoknader,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertUtkastListVisible();
  });

  test("Viser innsendte søknader-tabell når det finnes innsendte søknader", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [testOrganization],
      emptyUtkastListe,
      testInnsendteSoknader,
    );

    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ARBEIDSGIVER,
    );
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertHistorikkVisible();
  });

  test("Viser start-søknad-skjema med arbeidsgivervalg for ARBEIDSGIVER", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [testOrganization],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockHentTilganger(page, [testOrganization]);

    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ARBEIDSGIVER,
    );
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();
    await oversiktPage.assertStartSoknadVisible();
  });
});
