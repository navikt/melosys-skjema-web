import {
  ARBEIDSFORHOLD_AAREG,
  STATSANSATT_FLYT,
} from "~/featuretoggle/toggleNavn";
import { Representasjonstype } from "~/types/melosysSkjemaTypes";

import {
  mockArbeidsgivereIAareg,
  mockFeatureToggles,
  mockGetEregOrganisasjonMedJuridiskEnhetIkkeFunnet,
  mockHentTilganger,
  mockPersonerMedFullmakt,
  setupApiMocksForOversikt,
} from "../fixtures/api-mocks";
import { test } from "../fixtures/test";
import {
  emptyInnsendteSoknader,
  emptyUtkastListe,
  korrektFormatertOrgnr,
  testAaregArbeidsgivere,
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

  test("DEG_SELV med arbeidsforhold fra Aa-registeret: viser feilmelding når ingen arbeidsgiver er valgt", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockFeatureToggles(page, {
      [STATSANSATT_FLYT]: true,
      [ARBEIDSFORHOLD_AAREG]: true,
    });
    await mockArbeidsgivereIAareg(page, testAaregArbeidsgivere);

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.clickStartSoknad();

    await oversiktPage.assertArbeidsforholdSelectManglerArbeidsgiverFeil();
    await oversiktPage.assertValideringManglerArbeidsgiverIsVisible();
    await oversiktPage.assertStillOnPage();
  });

  test("DEG_SELV: viser warning-melding (ikke rød feilboks) når organisasjonssøk gir 404", async ({
    page,
  }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockGetEregOrganisasjonMedJuridiskEnhetIkkeFunnet(page);

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertIsVisible();

    await oversiktPage.fillArbeidsgiverOrgnr(korrektFormatertOrgnr);

    // Manglende treff vises som warning-melding, og feltet er ikke i feiltilstand.
    await oversiktPage.assertOrganisasjonIkkeFunnetIsVisible();
    await oversiktPage.assertArbeidsgiverOrgnrIkkeIFeiltilstand();
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
