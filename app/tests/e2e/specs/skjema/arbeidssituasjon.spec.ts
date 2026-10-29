import type { ArbeidssituasjonDto } from "~/types/melosysSkjemaTypes";
import { Ansettelsesform, LandKode } from "~/types/melosysSkjemaTypes";

import {
  mockFeatureToggles,
  setupApiMocksForArbeidstaker,
} from "../../fixtures/api-mocks";
import { expect, test } from "../../fixtures/test";
import {
  korrektFormatertOrgnr,
  testArbeidstakerSkjema,
  testStatsansattSkjema,
  testUserInfo,
} from "../../fixtures/test-data";
import { ArbeidssituasjonStegPage } from "../../pages/skjema/arbeidssituasjon-steg.page";
import { translations } from "../../utils/translations";

test.describe("Arbeidssituasjon", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
  });

  test("MIDLERTIDIG MELOSYS-7694 statsansatt får vanlige spørsmål og validering når togglen er av", async ({
    page,
  }) => {
    await mockFeatureToggles(page, { [STATSANSATT_FLYT]: false });
    await setupApiMocksForArbeidstaker(
      page,
      testStatsansattSkjema,
      testUserInfo,
    );
    const stegPage = new ArbeidssituasjonStegPage(page, testStatsansattSkjema);

    await stegPage.goto();
    await stegPage.assertIsVisible();
    await stegPage.skalJobbeForFlereVirksomheterRadioGroup.NEI.click();
    await stegPage.lagreOgFortsett();
    await stegPage.assertDuMaSvarePaOmDuHarVertILonnetArbeidIsVisible();
    await stegPage.harVaertILonnetArbeidRadioGroup.JA.click();
    await stegPage.lagreOgFortsettAndExpectPayload({
      harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
      skalJobbeForFlereVirksomheter: false,
    });
    await stegPage.assertNavigatedToNextStep();
  });

  test("happy case - har vært i arbeid, ikke flere virksomheter", async ({
    page,
  }) => {
    const arbeidssituasjonPage = new ArbeidssituasjonStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await arbeidssituasjonPage.goto();
    await arbeidssituasjonPage.assertIsVisible();

    await arbeidssituasjonPage.harVaertILonnetArbeidRadioGroup.JA.click();
    await arbeidssituasjonPage.skalJobbeForFlereVirksomheterRadioGroup.NEI.click();

    const expectedPayload: ArbeidssituasjonDto = {
      harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
      skalJobbeForFlereVirksomheter: false,
    };

    await arbeidssituasjonPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidssituasjonPage.assertNavigatedToNextStep();
  });

  test("variant: ikke vært i arbeid — viser aktivitetsbeskrivelse", async ({
    page,
  }) => {
    const arbeidssituasjonPage = new ArbeidssituasjonStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await arbeidssituasjonPage.goto();
    await arbeidssituasjonPage.assertIsVisible();

    await arbeidssituasjonPage.harVaertILonnetArbeidRadioGroup.NEI.click();

    // Aktivitet-textarea should now be visible
    await arbeidssituasjonPage.aktivitetTextarea.waitFor({ state: "visible" });
    await arbeidssituasjonPage.aktivitetTextarea.fill("Studier og ferie");

    await arbeidssituasjonPage.skalJobbeForFlereVirksomheterRadioGroup.NEI.click();

    const expectedPayload: ArbeidssituasjonDto = {
      harVaertEllerSkalVaereILonnetArbeidFoerUtsending: false,
      aktivitetIMaanedenFoerUtsendingen: "Studier og ferie",
      skalJobbeForFlereVirksomheter: false,
    };

    await arbeidssituasjonPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidssituasjonPage.assertNavigatedToNextStep();
  });

  test("variant: flere virksomheter — norsk virksomhet", async ({ page }) => {
    const arbeidssituasjonPage = new ArbeidssituasjonStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await arbeidssituasjonPage.goto();
    await arbeidssituasjonPage.assertIsVisible();

    await arbeidssituasjonPage.harVaertILonnetArbeidRadioGroup.JA.click();
    await arbeidssituasjonPage.skalJobbeForFlereVirksomheterRadioGroup.JA.click();

    // Virksomheter section should appear
    await expect(
      arbeidssituasjonPage.leggTilNorskVirksomhetButton,
    ).toBeVisible();

    await arbeidssituasjonPage.leggTilNorskVirksomhet(korrektFormatertOrgnr);

    const expectedPayload: ArbeidssituasjonDto = {
      harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
      skalJobbeForFlereVirksomheter: true,
      virksomheterArbeidstakerJobberForIutsendelsesPeriode: {
        norskeVirksomheter: [{ organisasjonsnummer: korrektFormatertOrgnr }],
        utenlandskeVirksomheter: [],
      },
    };

    await arbeidssituasjonPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidssituasjonPage.assertNavigatedToNextStep();
  });

  test("variant: flere virksomheter — utenlandsk virksomhet", async ({
    page,
  }) => {
    const arbeidssituasjonPage = new ArbeidssituasjonStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await arbeidssituasjonPage.goto();
    await arbeidssituasjonPage.assertIsVisible();

    await arbeidssituasjonPage.harVaertILonnetArbeidRadioGroup.JA.click();
    await arbeidssituasjonPage.skalJobbeForFlereVirksomheterRadioGroup.JA.click();

    await arbeidssituasjonPage.leggTilUtenlandskVirksomhetMedAnsettelsesform({
      navn: "Swedish Corp AB",
      vegnavnOgHusnummer: "Drottninggatan 5",
      postkode: "111 51",
      byStedsnavn: "Stockholm",
      land: "SE",
      tilhorerSammeKonsern: true,
      ansettelsesformLabel:
        translations.utenlandskeVirksomheterFormPart.arbeidstakerEllerFrilanser,
    });

    const expectedPayload: ArbeidssituasjonDto = {
      harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
      skalJobbeForFlereVirksomheter: true,
      virksomheterArbeidstakerJobberForIutsendelsesPeriode: {
        norskeVirksomheter: [],
        utenlandskeVirksomheter: [
          {
            navn: "Swedish Corp AB",
            organisasjonsnummer: "",
            vegnavnOgHusnummer: "Drottninggatan 5",
            bygning: "",
            postkode: "111 51",
            byStedsnavn: "Stockholm",
            region: "",
            land: LandKode.SE,
            tilhorerSammeKonsern: true,
            ansettelsesform: Ansettelsesform.ARBEIDSTAKER_ELLER_FRILANSER,
          },
        ],
      },
    };

    await arbeidssituasjonPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidssituasjonPage.assertNavigatedToNextStep();
  });
});

test.describe("Arbeidssituasjon - statsansatt", () => {
  test("spør bare om flere virksomheter og går videre til arbeidssted", async ({
    page,
  }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testStatsansattSkjema,
      testUserInfo,
    );
    const arbeidssituasjonPage = new ArbeidssituasjonStegPage(
      page,
      testStatsansattSkjema,
    );

    await arbeidssituasjonPage.goto();
    await arbeidssituasjonPage.assertIsVisible();
    await arbeidssituasjonPage.assertHarVaertILonnetArbeidIsHidden();

    await arbeidssituasjonPage.skalJobbeForFlereVirksomheterRadioGroup.NEI.click();

    const expectedPayload: ArbeidssituasjonDto = {
      skalJobbeForFlereVirksomheter: false,
    };
    await arbeidssituasjonPage.lagreOgFortsettAndExpectPayload(expectedPayload);
    await arbeidssituasjonPage.assertNavigatedToArbeidssted();
  });
});
import { STATSANSATT_FLYT } from "~/featuretoggle/toggleNavn";
