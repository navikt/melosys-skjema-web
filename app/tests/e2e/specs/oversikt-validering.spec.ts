import { test } from "@playwright/test";

import { Representasjonstype } from "~/types/melosysSkjemaTypes";

import {
  mockHentTilganger,
  mockPersonerMedFullmakt,
  setupApiMocksForOversikt,
} from "../fixtures/api-mocks";
import {
  emptyInnsendteSoknader,
  emptyUtkastListe,
  testArbeidsgiverOrganization,
  testOrganization,
  testUserInfo,
} from "../fixtures/test-data";
import { OversiktPage } from "../pages/oversikt/oversikt.page";

test.describe("Oversikt - validering", () => {
  test("DEG_SELV: viser feilmelding for manglende arbeidsgiver når man klikker Start søknad uten å søke opp org", async ({
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

    await oversiktPage.clickStartSoknad();

    await oversiktPage.assertValideringManglerArbeidsgiverIsVisible();
    await oversiktPage.assertStillOnPage();
  });

  test("ARBEIDSGIVER: viser feilmeldinger for manglende arbeidsgiver og arbeidstaker samtidig", async ({
    page,
  }) => {
    // Use two organizations to prevent auto-selection of arbeidsgiver
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [testOrganization, testArbeidsgiverOrganization],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockHentTilganger(page, [
      testOrganization,
      testArbeidsgiverOrganization,
    ]);
    await mockPersonerMedFullmakt(page, []);

    const oversiktPage = new OversiktPage(
      page,
      Representasjonstype.ARBEIDSGIVER,
    );
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();

    await oversiktPage.clickStartSoknad();

    await oversiktPage.assertValideringManglerArbeidsgiverIsVisible();
    await oversiktPage.assertValideringManglerArbeidstakerIsVisible();
    await oversiktPage.assertStillOnPage();
  });
});
