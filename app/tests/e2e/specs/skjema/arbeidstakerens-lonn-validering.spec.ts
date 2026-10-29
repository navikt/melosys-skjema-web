import { LandKode } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { ArbeidstakerensLonnStegPage } from "../../pages/skjema/arbeidstakerens-lonn-steg.page";

test.describe("Arbeidstakerens lønn - validering", () => {
  let stegPage: ArbeidstakerensLonnStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
    stegPage = new ArbeidstakerensLonnStegPage(page, testArbeidsgiverSkjema);
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmelding når det ikke er svart på om arbeidsgiver betaler all lønn", async () => {
    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaSvarePaOmDuBetalerAllLonnIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding når arbeidsgiver ikke betaler all lønn og ingen virksomheter er lagt til", async () => {
    await stegPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.NEI.click();

    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaLeggeTilMinstEnVirksomhetIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding i norsk virksomhet-modal når organisasjonsnummer ikke er fylt ut", async () => {
    await stegPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.NEI.click();

    await stegPage.clickLagreInNorskVirksomhetModal();

    await stegPage.assertOrganisasjonsnummerErPakrevdIsVisible();
    await stegPage.assertNorskVirksomhetModalIsOpen();
  });

  test("viser feilmeldinger i utenlandsk virksomhet-modal når påkrevde felter ikke er fylt ut", async () => {
    await stegPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.NEI.click();

    await stegPage.clickLagreInUtenlandskVirksomhetModal();

    await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
    await stegPage.assertVegnavnOgHusnummerErPakrevdIsVisible();
    await stegPage.assertPostkodeErPakrevdIsVisible();
    await stegPage.assertByStedsnavnErPakrevdIsVisible();
    await stegPage.assertLandErPakrevdIsVisible();
    await stegPage.assertDuMaSvarePaOmVirksomhetenTilhorerSammeKonsernIsVisible();
    await stegPage.assertUtenlandskVirksomhetModalIsOpen();
  });

  test("viser feilmeldinger i utenlandsk virksomhet-modal når påkrevde felter bare inneholder mellomrom", async () => {
    await stegPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.NEI.click();

    await stegPage.fyllUtFelterOgLagreInUtenlandskVirksomhetModal({
      navn: " ".repeat(3),
      postkode: " ".repeat(3),
      byStedsnavn: " ".repeat(3),
    });

    await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
    await stegPage.assertPostkodeErPakrevdIsVisible();
    await stegPage.assertByStedsnavnErPakrevdIsVisible();
    await stegPage.assertUtenlandskVirksomhetModalIsOpen();
  });

  test("viser feilmelding i utenlandsk virksomhet-modal når organisasjonsnummer er lengre enn 25 tegn", async () => {
    await stegPage.arbeidsgiverBetalerAllLonnOgNaturaytelserRadioGroup.NEI.click();

    await stegPage.fyllUtFelterOgLagreInUtenlandskVirksomhetModal({
      organisasjonsnummer: "A".repeat(26),
    });

    await stegPage.assertOrganisasjonsnummerErForLangtIsVisible();
    await stegPage.assertUtenlandskVirksomhetModalIsOpen();
  });

  test("viser feilmelding på lagret utenlandsk virksomhet som mangler påkrevde felter", async () => {
    await stegPage.mockArbeidstakerensLonnData({
      arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: false,
      virksomheterSomUtbetalerLonnOgNaturalytelser: {
        norskeVirksomheter: [],
        utenlandskeVirksomheter: [
          {
            navn: "Foreign Corp AB",
            vegnavnOgHusnummer: "Kungsgatan 10",
            land: LandKode.SE,
            tilhorerSammeKonsern: false,
          },
        ],
      },
    });
    await stegPage.goto();
    await stegPage.assertIsVisible();

    await stegPage.lagreOgFortsett();

    await stegPage.assertUtenlandskVirksomhetManglerPakrevdeOpplysningerIsVisible();
    await stegPage.assertStillOnStep();
  });
});
