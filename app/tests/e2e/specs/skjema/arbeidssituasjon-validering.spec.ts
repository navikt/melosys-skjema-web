import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
import { testArbeidstakerSkjema, testUserInfo } from "../../fixtures/test-data";
import { ArbeidssituasjonStegPage } from "../../pages/skjema/arbeidssituasjon-steg.page";

test.describe("Arbeidssituasjon - validering", () => {
  let stegPage: ArbeidssituasjonStegPage;

  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
    stegPage = new ArbeidssituasjonStegPage(page, testArbeidstakerSkjema);
    await stegPage.goto();
    await stegPage.assertIsVisible();
  });

  test("viser feilmeldinger når ingen felter er besvart", async () => {
    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaSvarePaOmDuHarVertILonnetArbeidIsVisible();
    await stegPage.assertDuMaSvarePaOmDuSkalJobbeForFlereVirksomheterIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding når arbeidstaker ikke har vært i lønnet arbeid og aktivitet ikke er beskrevet", async () => {
    await stegPage.harVaertILonnetArbeidRadioGroup.NEI.click();
    await stegPage.skalJobbeForFlereVirksomheterRadioGroup.NEI.click();

    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaBeskriveAktivitetenIsVisible();
    await stegPage.assertStillOnStep();
  });

  test("viser feilmelding når arbeidstaker skal jobbe for flere virksomheter men ingen er lagt til", async () => {
    await stegPage.harVaertILonnetArbeidRadioGroup.JA.click();
    await stegPage.skalJobbeForFlereVirksomheterRadioGroup.JA.click();

    await stegPage.lagreOgFortsett();

    await stegPage.assertDuMaLeggeTilMinstEnVirksomhetIsVisible();
    await stegPage.assertStillOnStep();
  });
});
