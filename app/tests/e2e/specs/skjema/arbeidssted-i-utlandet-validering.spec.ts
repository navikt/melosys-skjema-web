import { test } from "../../fixtures/test";

import { ArbeidsstedType } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidsgiver } from "../../fixtures/api-mocks";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { ArbeidsstedIUtlandetStegPage } from "../../pages/skjema/arbeidssted-i-utlandet-steg.page";

test.describe("Arbeidssted i utlandet - validering", () => {
  let stegPage: ArbeidsstedIUtlandetStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidsgiver(
      page,
      testArbeidsgiverSkjema,
      [testOrganization],
      testUserInfo,
    );
    stegPage = new ArbeidsstedIUtlandetStegPage(page, testArbeidsgiverSkjema);
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmelding når arbeidssted type ikke er valgt", async () => {
    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaVelgeArbeidsstedTypeIsVisible();
    await stegPage.assertStillOnStep();
  });

  test.describe("PA_LAND", () => {
    test("viser feilmelding på påkrevde felter når ingen felter er fylt ut", async () => {
      await stegPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.PA_LAND,
      );
      await stegPage.lagreOgFortsett();

      await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
      await stegPage.assertDuMaVelgeFastEllerVekslendeIsVisible();
      await stegPage.assertDuMaSvarePaOmDetErHjemmekontorIsVisible();
      await stegPage.assertStillOnStep();
    });

    test("viser feilmelding på adressefelter samtidig med basisfelt-feil når FAST er valgt", async () => {
      await stegPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.PA_LAND,
      );
      await stegPage.fastEllerVekslendeRadioGroup.FAST.click();
      await stegPage.erHjemmekontorRadioGroup.NEI.click();

      await stegPage.lagreOgFortsett();

      await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
      await stegPage.assertVegadresseErPakrevdIsVisible();
      await stegPage.assertNummerErPakrevdIsVisible();
      await stegPage.assertPostkodeErPakrevdIsVisible();
      await stegPage.assertByStedErPakrevdIsVisible();
      await stegPage.assertStillOnStep();
    });

    test("viser feilmelding på basisfelt når VEKSLENDE er valgt", async () => {
      await stegPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.PA_LAND,
      );
      await stegPage.fastEllerVekslendeRadioGroup.VEKSLENDE.click();
      await stegPage.erHjemmekontorRadioGroup.JA.click();

      await stegPage.lagreOgFortsett();

      await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
      await stegPage.assertStillOnStep();
    });
  });

  test.describe("OFFSHORE", () => {
    test("viser feilmelding på alle påkrevde felter når ingen felter er fylt ut", async () => {
      await stegPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.OFFSHORE,
      );
      await stegPage.lagreOgFortsett();

      await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
      await stegPage.assertNavnPaInnretningErPakrevdIsVisible();
      await stegPage.assertDuMaVelgeTypeInnretningIsVisible();
      await stegPage.assertSokkelLandErPakrevdIsVisible();
      await stegPage.assertStillOnStep();
    });
  });

  test.describe("PA_SKIP", () => {
    test("viser feilmelding på påkrevde felter når ingen felter er fylt ut", async () => {
      await stegPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.PA_SKIP,
      );
      await stegPage.lagreOgFortsett();

      await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
      await stegPage.assertNavnPaSkipErPakrevdIsVisible();
      await stegPage.assertYrketTilArbeidstakerErPakrevdIsVisible();
      await stegPage.assertDuMaVelgeHvorSkipetSeilerIsVisible();
      await stegPage.assertStillOnStep();
    });

    test("viser feilmelding på flaggland samtidig med basisfelt-feil når internasjonalt farvann er valgt", async () => {
      await stegPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.PA_SKIP,
      );
      await stegPage.seilerIRadioGroup.INTERNASJONALT.click();

      await stegPage.lagreOgFortsett();

      await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
      await stegPage.assertNavnPaSkipErPakrevdIsVisible();
      await stegPage.assertYrketTilArbeidstakerErPakrevdIsVisible();
      await stegPage.assertFlagglandErPakrevdIsVisible();
      await stegPage.assertStillOnStep();
    });

    test("viser feilmelding på territorialfarvannLand samtidig med basisfelt-feil når territorialfarvann er valgt", async () => {
      await stegPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.PA_SKIP,
      );
      await stegPage.seilerIRadioGroup.TERRITORIALFARVANN.click();

      await stegPage.lagreOgFortsett();

      await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
      await stegPage.assertNavnPaSkipErPakrevdIsVisible();
      await stegPage.assertYrketTilArbeidstakerErPakrevdIsVisible();
      await stegPage.assertTerritorialfarvannLandErPakrevdIsVisible();
      await stegPage.assertStillOnStep();
    });
  });

  test.describe("OM_BORD_PA_FLY", () => {
    test("viser feilmelding på påkrevde felter når ingen felter er fylt ut", async () => {
      await stegPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.OM_BORD_PA_FLY,
      );
      await stegPage.lagreOgFortsett();

      await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
      await stegPage.assertHjemmebaseLandErPakrevdIsVisible();
      await stegPage.assertHjemmebaseNavnErPakrevdIsVisible();
      await stegPage.assertDuMaSvarePaOmDetErVanligHjemmebaseIsVisible();
      await stegPage.assertStillOnStep();
    });

    test("viser feilmelding på vanlig hjemmebase-felter samtidig med basisfelt-feil når det ikke er vanlig hjemmebase", async () => {
      await stegPage.arbeidsstedTypeSelect.selectOption(
        ArbeidsstedType.OM_BORD_PA_FLY,
      );
      await stegPage.erVanligHjemmebaseRadioGroup.NEI.click();

      await stegPage.lagreOgFortsett();

      await stegPage.assertNavnPaVirksomhetErPakrevdIsVisible();
      await stegPage.assertHjemmebaseLandErPakrevdIsVisible();
      await stegPage.assertHjemmebaseNavnErPakrevdIsVisible();
      await stegPage.assertVanligHjemmebaseLandErPakrevdIsVisible();
      await stegPage.assertVanligHjemmebaseNavnErPakrevdIsVisible();
      await stegPage.assertStillOnStep();
    });
  });
});
