import { LandKode } from "~/types/melosysSkjemaTypes";

import {
  mockFetchSkjemaDynamic,
  mockHentTilganger,
  mockPostArbeidssituasjon,
  mockPostUtsendingsperiodeOgLand,
  mockSkjemaMetadata,
  mockUserInfo,
} from "../../fixtures/api-mocks";
import { expect, test } from "../../fixtures/test";
import {
  formFieldValues,
  testArbeidstakerSkjema,
  testUserInfo,
} from "../../fixtures/test-data";
import { UtsendingsperiodeOgLandStegPage } from "../../pages/skjema/utsendingsperiode-og-land-steg.page";

test.describe("Utsendingsperiode og land - fram og tilbake", () => {
  test("etter Lagre og fortsett → Forrige steg → Lagre og fortsett, skal lagring lykkes", async ({
    page,
  }) => {
    const skjemaState = { current: testArbeidstakerSkjema };

    await mockUserInfo(page, testUserInfo);
    await mockHentTilganger(page, []);
    await mockSkjemaMetadata(
      page,
      testArbeidstakerSkjema.id,
      testArbeidstakerSkjema.metadata,
    );
    await mockFetchSkjemaDynamic(page, testArbeidstakerSkjema.id, skjemaState);
    await mockPostUtsendingsperiodeOgLand(page, testArbeidstakerSkjema.id);
    await mockPostArbeidssituasjon(page, testArbeidstakerSkjema.id);

    const stegPage = new UtsendingsperiodeOgLandStegPage(
      page,
      testArbeidstakerSkjema,
    );

    await stegPage.goto();
    await stegPage.assertIsVisible();

    await stegPage.velgLand(formFieldValues.utsendelseLand);
    await stegPage.fillFraDato(formFieldValues.periodeFra);
    await stegPage.fillTilDato(formFieldValues.periodeTil);

    skjemaState.current = {
      ...testArbeidstakerSkjema,
      data: {
        ...testArbeidstakerSkjema.data,
        utsendingsperiodeOgLand: {
          utsendelseLand: LandKode.SE,
          utsendelsePeriode: formFieldValues.periode,
        },
      },
    } as typeof testArbeidstakerSkjema;

    await stegPage.lagreOgFortsett();
    await stegPage.assertNavigatedToNextStep();

    await stegPage.forrigeSteg();
    await stegPage.assertIsVisible();

    await stegPage.lagreOgFortsett();

    await stegPage.assertFraDatoErPakrevdIsNotVisible();
    await stegPage.assertTilDatoErPakrevdIsNotVisible();
    await expect(page).toHaveURL(
      `/skjema/${testArbeidstakerSkjema.id}/arbeidssituasjon`,
    );
  });
});
