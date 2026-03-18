import { expect, test } from "@playwright/test";

import { nb } from "~/i18n/nb";
import type { ArbeidssituasjonDto } from "~/types/melosysSkjemaTypes";
import { Ansettelsesform, LandKode } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import {
  korrektFormatertOrgnr,
  testArbeidstakerSkjema,
  testUserInfo,
} from "../../fixtures/test-data";
import { ArbeidssituasjonStegPage } from "../../pages/skjema/arbeidstaker/arbeidssituasjon-steg.page";

test.describe("Arbeidssituasjon", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
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
      land: "SE",
      tilhorerSammeKonsern: true,
      ansettelsesformLabel:
        nb.translation.utenlandskeVirksomheterFormPart
          .arbeidstakerEllerFrilanser,
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
            postkode: "",
            byStedsnavn: "",
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
