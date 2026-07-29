import { UtsendingsperiodeOgLandDto } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { test } from "../../fixtures/test";
import {
  formFieldValues,
  testArbeidstakerSkjema,
  testArbeidstakerSkjemaFraMotpartCta,
  testArbeidstakerSkjemaMedAvvikFraMotpart,
  testUserInfo,
} from "../../fixtures/test-data";
import { UtsendingsperiodeOgLandStegPage } from "../../pages/skjema/utsendingsperiode-og-land-steg.page";

test.describe("Utsendingsperiode og land", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
  });

  test("skjema startet via motpart-CTA viser infoboks med motpartens verdier og prefilte felter", async ({
    page,
  }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjemaFraMotpartCta,
      testUserInfo,
    );

    const stegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testArbeidstakerSkjemaFraMotpartCta,
    );
    await stegPage.goto();
    await stegPage.assertIsVisible();
    await stegPage.assertPreutfyltInfoboksVisible(
      "Sverige",
      "01.02.2026",
      "31.08.2026",
    );
    await stegPage.assertLesevisningVisible("Sverige");

    await stegPage.clickEndreLandEllerPeriode();
    await stegPage.assertLandValgt("SE");
    await stegPage.assertFraDatoValue("01.02.2026");
  });

  test("viser avviks-info når lagrede verdier avviker fra motpartens", async ({
    page,
  }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjemaMedAvvikFraMotpart,
      testUserInfo,
    );

    const stegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testArbeidstakerSkjemaMedAvvikFraMotpart,
    );
    await stegPage.goto();
    await stegPage.assertIsVisible();
    await stegPage.assertArbeidsgiverOppgaLandVisible("Sverige");
    await stegPage.assertArbeidsgiverOppgaPeriodeVisible(
      "01.02.2026",
      "31.08.2026",
    );
    await stegPage.assertLandValgt("DE");
  });

  test("vanlig skjema viser ikke preutfylt-infoboks", async ({ page }) => {
    const stegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testArbeidstakerSkjema,
    );
    await stegPage.goto();
    await stegPage.assertIsVisible();
    await stegPage.assertPreutfyltInfoboksNotVisible();
  });

  test("happy case - fyller ut land og periode og gjør forventet POST request", async ({
    page,
  }) => {
    const utsendingsperiodeOgLandStegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await utsendingsperiodeOgLandStegPage.goto();
    await utsendingsperiodeOgLandStegPage.assertIsVisible();

    await utsendingsperiodeOgLandStegPage.velgLand(
      formFieldValues.utsendelseLand,
    );

    await utsendingsperiodeOgLandStegPage.fillFraDato(
      formFieldValues.periodeFra,
    );
    await utsendingsperiodeOgLandStegPage.fillTilDato(
      formFieldValues.periodeTil,
    );

    const expectedPayload: UtsendingsperiodeOgLandDto = {
      utsendelseLand: formFieldValues.utsendelseLand.value,
      utsendelsePeriode: formFieldValues.periode,
    };

    await utsendingsperiodeOgLandStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );

    await utsendingsperiodeOgLandStegPage.assertNavigatedToNextStep();
  });
});
