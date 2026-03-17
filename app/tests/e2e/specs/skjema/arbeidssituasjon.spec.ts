import { test } from "@playwright/test";

import type { ArbeidssituasjonDto } from "../../../../src/types/melosysSkjemaTypes";
import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { testArbeidstakerSkjema, testUserInfo } from "../../fixtures/test-data";
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
});
