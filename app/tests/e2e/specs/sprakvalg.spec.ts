// Denne specen tester selve språkbyttet og importerer derfor alle tre bundlene
// direkte — den er bevisst ikke bundet til det parameteriserte testspråket.
import { en } from "~/i18n/en";
import { nb } from "~/i18n/nb";
import { nn } from "~/i18n/nn";
import type { UtsendtArbeidstakerSkjemaDto } from "~/types/melosysSkjemaTypes";

import {
  mockFetchSkjema,
  mockSendInnSkjema,
  mockUserInfo,
  setupApiMocksForArbeidstaker,
} from "../fixtures/api-mocks";
import { expect, test } from "../fixtures/test";
import {
  formFieldValues,
  testArbeidstakerSkjema,
  testUserInfo,
} from "../fixtures/test-data";
import { RepresentasjonPage } from "../pages/representasjon/representasjon.page";
import { OppsummeringStegPage } from "../pages/skjema/oppsummering-steg.page";

const BASE_URL = "http://localhost:5173";

test.describe("Språkvalg", () => {
  test("bytter mellom bokmål, nynorsk og engelsk med riktig lang, fanetittel og tekster", async ({
    page,
  }) => {
    await mockUserInfo(page, testUserInfo);
    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.goto();

    // Default er bokmål
    await expect(page.locator("html")).toHaveAttribute("lang", "nb");
    await expect(page).toHaveTitle(nb.translation.appHeader.tittel);
    await expect(
      page.getByRole("heading", {
        name: nb.translation.landingsside.hvemVilDuBrukeNavPaVegneAv,
      }),
    ).toBeVisible();

    // Bytt til nynorsk
    await page.getByRole("button", { name: "Bokmål" }).click();
    await page.getByRole("button", { name: "Nynorsk" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "nn");
    await expect(page).toHaveTitle(nn.translation.appHeader.tittel);
    await expect(
      page.getByRole("heading", {
        name: nn.translation.landingsside.hvemVilDuBrukeNavPaVegneAv,
      }),
    ).toBeVisible();

    // Bytt til engelsk
    await page.getByRole("button", { name: "Nynorsk" }).click();
    await page.getByRole("button", { name: "English" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle(en.translation.appHeader.tittel);
    await expect(
      page.getByRole("heading", {
        name: en.translation.landingsside.hvemVilDuBrukeNavPaVegneAv,
      }),
    ).toBeVisible();

    // Og tilbake til bokmål
    await page.getByRole("button", { name: "English" }).click();
    await page.getByRole("button", { name: "Bokmål" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "nb");
    await expect(page).toHaveTitle(nb.translation.appHeader.tittel);
  });

  test("ugyldig språkkode i decorator-cookien faller trygt tilbake til bokmål", async ({
    page,
  }) => {
    await page
      .context()
      .addCookies([{ name: "decorator-language", value: "se", url: BASE_URL }]);
    await mockUserInfo(page, testUserInfo);

    const representasjonPage = new RepresentasjonPage(page);
    await representasjonPage.goto();

    await expect(page.locator("html")).toHaveAttribute("lang", "nb");
    await expect(
      page.getByRole("heading", {
        name: nb.translation.landingsside.hvemVilDuBrukeNavPaVegneAv,
      }),
    ).toBeVisible();
  });

  test("innsending mens engelsk er valgt sender sprak=en", async ({ page }) => {
    await page
      .context()
      .addCookies([{ name: "decorator-language", value: "en", url: BASE_URL }]);
    await setupApiMocksForArbeidstaker(
      page,
      testArbeidstakerSkjema,
      testUserInfo,
    );
    await mockFetchSkjema(page, {
      ...testArbeidstakerSkjema,
      data: {
        type: "UTSENDT_ARBEIDSTAKER_ARBEIDSTAKERS_DEL",
        arbeidssituasjon: {
          harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
          skalJobbeForFlereVirksomheter: false,
        },
        utsendingsperiodeOgLand: {
          utsendelseLand: formFieldValues.utsendelseLand.value,
          utsendelsePeriode: formFieldValues.periode,
        },
        familiemedlemmer: { skalHaMedFamiliemedlemmer: false },
        skatteforholdOgInntekt: {
          erSkattepliktigTilNorgeIHeleutsendingsperioden: true,
          mottarPengestotteFraAnnetEosLandEllerSveits: false,
        },
        tilleggsopplysninger: { harFlereOpplysningerTilSoknaden: false },
        vedlegg: { harAnnenDokumentasjon: false },
      } as UtsendtArbeidstakerSkjemaDto["data"],
    });
    await mockSendInnSkjema(page, testArbeidstakerSkjema.id);

    const oppsummeringPage = new OppsummeringStegPage(
      page,
      testArbeidstakerSkjema,
    );
    await oppsummeringPage.goto();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const responsePromise = page.waitForResponse(
      (response) =>
        response
          .url()
          .includes(
            `/api/skjema/utsendt-arbeidstaker/${testArbeidstakerSkjema.id}/send-inn`,
          ) && response.request().method() === "POST",
    );
    await page
      .getByRole("button", { name: en.translation.felles.sendSoknad })
      .click();
    const response = await responsePromise;

    expect(new URL(response.request().url()).searchParams.get("sprak")).toBe(
      "en",
    );
  });
});
