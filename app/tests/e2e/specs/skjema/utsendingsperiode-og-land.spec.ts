import { STATSANSATT_FLYT } from "~/featuretoggle/toggleNavn";
import {
  LandKode,
  UtsendingsperiodeOgLandDto,
} from "~/types/melosysSkjemaTypes";

import {
  mockAaregSjekk,
  mockFeatureToggles,
  setupApiMocksForArbeidstaker,
} from "../../fixtures/api-mocks";
import { expect, test } from "../../fixtures/test";
import {
  formFieldValues,
  testArbeidstakerMedStatligArbeidsgiverSkjema,
  testArbeidstakerSkjema,
  testArbeidstakerSkjemaFraMotpartCta,
  testArbeidstakerSkjemaMedAvvikFraMotpart,
  testStatsansattSkjema,
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

  test("Neste i lesevisning sender motpartens verdier uendret", async ({
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
    await stegPage.assertLesevisningVisible("Sverige");

    await stegPage.lagreOgFortsettAndExpectPayload({
      utsendelseLand: LandKode.SE,
      utsendelsePeriode: { fraDato: "2026-02-01", tilDato: "2026-08-31" },
    });
    await stegPage.assertNavigatedToNextStep();
  });

  test("viser live avviks-info under landfeltet når bruker endrer land", async ({
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
    await stegPage.clickEndreLandEllerPeriode();

    await stegPage.velgLand({ label: "Tyskland", value: LandKode.DE });
    await stegPage.assertArbeidsgiverOppgaLandVisible("Sverige");
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

  test("viser AAREG-varsel når arbeidsforholdet ikke finnes for hele perioden", async ({
    page,
  }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testStatsansattSkjema,
      testUserInfo,
    );
    await mockAaregSjekk(page, testStatsansattSkjema.id, false);

    const stegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testStatsansattSkjema,
    );
    await stegPage.goto();
    await stegPage.assertIsVisible();
    await stegPage.assertAaregVarselIsVisible();
  });

  test("statlig arbeidsgiver uten avklart AAREG-treff viser bare stegnummer i fremgangsindikatoren", async ({
    page,
  }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerMedStatligArbeidsgiverSkjema,
      testUserInfo,
    );

    const stegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testArbeidstakerMedStatligArbeidsgiverSkjema,
    );
    await stegPage.goto();
    await stegPage.assertIsVisible();
    await stegPage.assertFremgangsindikatorViserUkjenteSteg();
  });

  test("AAREG-varsel annonseres som alert uten å flytte fokus", async ({
    page,
  }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testStatsansattSkjema,
      testUserInfo,
    );
    let svarPaAaregSjekk!: () => void;
    // eslint-disable-next-line unicorn/prefer-promise-with-resolvers -- Promise.withResolvers er ikke tilgjengelig i prosjektets ES2023-typer.
    const ventPaSvar = new Promise<void>((resolve) => {
      svarPaAaregSjekk = resolve;
    });
    await page.route(
      `/api/skjema/utsendt-arbeidstaker/${testStatsansattSkjema.id}/aareg-sjekk`,
      async (route) => {
        await ventPaSvar;
        await route.fulfill({
          json: { harArbeidsforhold: false },
        });
      },
    );

    const stegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testStatsansattSkjema,
    );
    await stegPage.goto();
    await stegPage.assertIsVisible();
    await stegPage.assertAaregVarselIsNotVisible();
    await stegPage.focusTilDato();
    svarPaAaregSjekk();
    await stegPage.assertAaregVarselBeholderFokus();
  });

  test("MIDLERTIDIG MELOSYS-7694 viser AAREG-varsel og beholder vanlig navigasjon når statsansattflyten er av", async ({
    page,
  }) => {
    await mockFeatureToggles(page, { [STATSANSATT_FLYT]: false });
    await setupApiMocksForArbeidstaker(
      page,
      testStatsansattSkjema,
      testUserInfo,
    );
    await mockAaregSjekk(page, testStatsansattSkjema.id, false);
    let antallAaregKall = 0;
    page.on("request", (request) => {
      if (request.url().includes("/aareg-sjekk")) antallAaregKall++;
    });
    const stegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testStatsansattSkjema,
    );

    await stegPage.goto();
    await stegPage.assertIsVisible();
    await stegPage.assertAaregVarselIsVisible();
    await stegPage.lagreOgFortsettAndExpectPayload(
      testStatsansattSkjema.data!.utsendingsperiodeOgLand!,
    );
    await stegPage.assertNavigatedToNextStep();

    expect(antallAaregKall).toBe(1);
  });
});
