import type { Page } from "@playwright/test";

import type {
  ArbeidsgiverensVirksomhetINorgeDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import { test } from "../../fixtures/test";
import {
  testArbeidsgiverSkjema,
  testOrganization,
  testUserInfo,
} from "../../fixtures/test-data";
import { OppsummeringStegPage } from "../../pages/skjema/oppsummering-steg.page";

const basePath = "/medlemskap-lovvalg/soknad";

async function setupBasePathMocks(
  page: Page,
  skjema: UtsendtArbeidstakerSkjemaDto,
) {
  await page.route(`${basePath}/nav-dekoratoren-api/auth`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        authenticated: true,
        ...testUserInfo,
      }),
    });
  });

  await page.route(`${basePath}/api/hentTilganger`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([testOrganization]),
    });
  });

  await page.route(
    `${basePath}/api/skjema/${skjema.id}/metadata`,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(skjema.metadata),
      });
    },
  );

  await page.route(
    `${basePath}/api/skjema/utsendt-arbeidstaker/${skjema.id}`,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(skjema),
      });
    },
  );
}

test.describe("Oppsummering med basepath", () => {
  test.skip(
    process.env.BASE_PATH !== `${basePath}/`,
    `Kjøres med BASE_PATH=${basePath}/`,
  );

  test("prefikser Endre svar-lenker med basepath", async ({ page }) => {
    const arbeidsgiverensVirksomhetINorgeData: ArbeidsgiverensVirksomhetINorgeDto =
      {
        erArbeidsgiverenOffentligVirksomhet: false,
        erArbeidsgiverenBemanningsEllerVikarbyraa: false,
        opprettholderArbeidsgiverenVanligDrift: true,
      };
    const skjema = {
      ...testArbeidsgiverSkjema,
      data: {
        type: "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVERS_DEL",
        arbeidsgiverensVirksomhetINorge: arbeidsgiverensVirksomhetINorgeData,
        vedlegg: { harAnnenDokumentasjon: false },
      } as UtsendtArbeidstakerSkjemaDto["data"],
    };

    await setupBasePathMocks(page, skjema);

    const oppsummeringStegPage = new OppsummeringStegPage(page, skjema);
    await oppsummeringStegPage.goto(basePath);
    await oppsummeringStegPage.assertIsVisible();

    await oppsummeringStegPage.assertEndreSvarLenkerHarHref([
      `${basePath}/skjema/${skjema.id}/arbeidsgiverens-virksomhet-i-norge`,
      `${basePath}/skjema/${skjema.id}/vedlegg`,
    ]);
  });
});
