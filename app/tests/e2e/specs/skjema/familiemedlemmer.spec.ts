import { expect, test } from "@playwright/test";

import { FamiliemedlemmerDto } from "~/types/melosysSkjemaTypes";

import { setupApiMocksForArbeidstaker } from "../../fixtures/api-mocks";
import { testArbeidstakerSkjema, testUserInfo } from "../../fixtures/test-data";
import { FamiliemedlemmerStegPage } from "../../pages/skjema/arbeidstaker/familiemedlemmer-steg.page";

test.describe("Familiemedlemmer", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
  });

  test("happy case - ingen familiemedlemmer", async ({ page }) => {
    const familiemedlemmerStegPage = new FamiliemedlemmerStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await familiemedlemmerStegPage.goto();
    await familiemedlemmerStegPage.assertIsVisible();

    await familiemedlemmerStegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.NEI.click();

    const expectedPayload: FamiliemedlemmerDto = {
      skalHaMedFamiliemedlemmer: false,
      familiemedlemmer: [],
    };

    await familiemedlemmerStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await familiemedlemmerStegPage.assertNavigatedToNextStep();
  });

  test("variant: med familiemedlem med norsk fødselsnummer", async ({
    page,
  }) => {
    const familiemedlemmerStegPage = new FamiliemedlemmerStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await familiemedlemmerStegPage.goto();
    await familiemedlemmerStegPage.assertIsVisible();

    await familiemedlemmerStegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.JA.click();

    // Open modal and fill in family member with Norwegian fnr
    await familiemedlemmerStegPage.leggTilFamiliemedlemButton.click();
    await expect(familiemedlemmerStegPage.modal).toBeVisible();

    await familiemedlemmerStegPage.modalFornavnInput.fill("Kari");
    await familiemedlemmerStegPage.modalEtternavnInput.fill("Nordmann");
    await familiemedlemmerStegPage.modalHarNorskFnrRadioGroup.JA.click();
    await familiemedlemmerStegPage.modalFodselsnummerInput.fill("01019000083");
    await familiemedlemmerStegPage.modalLagreButton.click();

    // Modal should close
    await expect(familiemedlemmerStegPage.modal).not.toBeVisible();

    const expectedPayload: FamiliemedlemmerDto = {
      skalHaMedFamiliemedlemmer: true,
      familiemedlemmer: [
        {
          fornavn: "Kari",
          etternavn: "Nordmann",
          harNorskFodselsnummerEllerDnummer: true,
          fodselsnummer: "01019000083",
        },
      ],
    };

    await familiemedlemmerStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await familiemedlemmerStegPage.assertNavigatedToNextStep();
  });

  test("variant: med familiemedlem med fødselsdato (uten norsk fnr)", async ({
    page,
  }) => {
    const familiemedlemmerStegPage = new FamiliemedlemmerStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await familiemedlemmerStegPage.goto();
    await familiemedlemmerStegPage.assertIsVisible();

    await familiemedlemmerStegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.JA.click();

    // Open modal and fill in family member without Norwegian fnr
    await familiemedlemmerStegPage.leggTilFamiliemedlemButton.click();
    await expect(familiemedlemmerStegPage.modal).toBeVisible();

    await familiemedlemmerStegPage.modalFornavnInput.fill("Hans");
    await familiemedlemmerStegPage.modalEtternavnInput.fill("Schmidt");
    await familiemedlemmerStegPage.modalHarNorskFnrRadioGroup.NEI.click();
    await familiemedlemmerStegPage.modalFodselsdatoInput.fill("15.06.1990");
    await familiemedlemmerStegPage.modalLagreButton.click();

    // Modal should close
    await expect(familiemedlemmerStegPage.modal).not.toBeVisible();

    const expectedPayload: FamiliemedlemmerDto = {
      skalHaMedFamiliemedlemmer: true,
      familiemedlemmer: [
        {
          fornavn: "Hans",
          etternavn: "Schmidt",
          harNorskFodselsnummerEllerDnummer: false,
          fodselsdato: "1990-06-15",
        },
      ],
    };

    await familiemedlemmerStegPage.lagreOgFortsettAndExpectPayload(
      expectedPayload,
    );
    await familiemedlemmerStegPage.assertNavigatedToNextStep();
  });
});
