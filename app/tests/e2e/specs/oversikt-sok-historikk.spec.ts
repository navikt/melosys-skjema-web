import { test } from "@playwright/test";

import { Representasjonstype } from "~/types/melosysSkjemaTypes";

import {
  mockGetEregOrganisasjon,
  mockHentTilganger,
  mockInnsendteSoknaderFeil,
  mockInnsendteSoknaderMedSok,
  mockUserInfo,
  mockUtkastListe,
} from "../fixtures/api-mocks";
import {
  emptyInnsendteSoknader,
  emptyUtkastListe,
  testInnsendteSoknader,
  testInnsendteSoknaderToTreff,
  testUserInfo,
} from "../fixtures/test-data";
import { OversiktPage } from "../pages/oversikt/oversikt.page";

test.describe("Oversikt — Søk i innsendte søknader", () => {
  test("Søk som gir treff viser filtrerte resultater", async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    await mockHentTilganger(page, []);
    await mockGetEregOrganisasjon(page);
    await mockUtkastListe(page, emptyUtkastListe);
    await mockInnsendteSoknaderMedSok(
      page,
      { REF001: testInnsendteSoknader },
      testInnsendteSoknaderToTreff,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertHistorikkVisible();

    // Verifiser at begge søknader vises før søk
    await oversiktPage.assertHistorikkAntallTreff(2);
    await oversiktPage.assertHistorikkRowVisible("REF001");
    await oversiktPage.assertHistorikkRowVisible("REF002");

    // Søk på REF001
    await oversiktPage.searchHistorikk("REF001");

    // Verifiser at kun den matchende søknaden vises
    await oversiktPage.assertHistorikkAntallTreff(1);
    await oversiktPage.assertHistorikkRowVisible("REF001");
    await oversiktPage.assertHistorikkRowNotVisible("REF002");
  });

  test("Søk uten treff viser 'ingen resultater' og beholder søkeboksen", async ({
    page,
  }) => {
    await mockUserInfo(page, testUserInfo);
    await mockHentTilganger(page, []);
    await mockGetEregOrganisasjon(page);
    await mockUtkastListe(page, emptyUtkastListe);
    await mockInnsendteSoknaderMedSok(
      page,
      { "finnes-ikke": emptyInnsendteSoknader },
      testInnsendteSoknaderToTreff,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertHistorikkVisible();
    await oversiktPage.assertHistorikkAntallTreff(2);

    // Søk på noe som ikke finnes
    await oversiktPage.searchHistorikk("finnes-ikke");

    // Tabellen skal fortsatt vises med søkeboks og "ingen resultater"-melding
    await oversiktPage.assertHistorikkVisible();
    await oversiktPage.assertHistorikkSearchInputVisible();
    await oversiktPage.assertHistorikkIngenResultater();
  });

  test("Søk som feiler viser feilmelding i stedet for å skjule tabellen", async ({
    page,
  }) => {
    // Først sett opp med vanlig mock som fungerer for initial lasting
    await mockUserInfo(page, testUserInfo);
    await mockHentTilganger(page, []);
    await mockGetEregOrganisasjon(page);
    await mockUtkastListe(page, emptyUtkastListe);
    await mockInnsendteSoknaderMedSok(page, {}, testInnsendteSoknaderToTreff);

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertHistorikkVisible();
    await oversiktPage.assertHistorikkAntallTreff(2);

    // Bytt til feil-mock før vi søker
    await page.unrouteAll();
    await mockUserInfo(page, testUserInfo);
    await mockHentTilganger(page, []);
    await mockGetEregOrganisasjon(page);
    await mockUtkastListe(page, emptyUtkastListe);
    await mockInnsendteSoknaderFeil(page);

    // Søk som trigger et nytt API-kall som feiler
    await oversiktPage.searchHistorikk("noe-som-feiler");

    // Feilmelding skal vises, ikke tom side
    await oversiktPage.assertHistorikkFeilmelding();
  });

  test("Nullstilling av søk med X-knapp viser alle resultater igjen", async ({
    page,
  }) => {
    await mockUserInfo(page, testUserInfo);
    await mockHentTilganger(page, []);
    await mockGetEregOrganisasjon(page);
    await mockUtkastListe(page, emptyUtkastListe);
    await mockInnsendteSoknaderMedSok(
      page,
      { REF001: testInnsendteSoknader },
      testInnsendteSoknaderToTreff,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertHistorikkVisible();
    await oversiktPage.assertHistorikkAntallTreff(2);

    // Søk på REF001 — kun 1 treff
    await oversiktPage.searchHistorikk("REF001");
    await oversiktPage.assertHistorikkAntallTreff(1);

    // Klikk X for å tømme søket — alle resultater skal vises igjen
    await oversiktPage.clearHistorikkSearch();
    await oversiktPage.assertHistorikkAntallTreff(2);
    await oversiktPage.assertHistorikkRowVisible("REF001");
    await oversiktPage.assertHistorikkRowVisible("REF002");
  });
});
