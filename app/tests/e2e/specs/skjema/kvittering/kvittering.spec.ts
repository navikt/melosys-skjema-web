import { test } from "@playwright/test";

import {
  Representasjonstype,
  SkjemaInnsendtKvittering,
  SkjemaStatus,
} from "../../../../../src/types/melosysSkjemaTypes";
import { mockUserInfo } from "../../../fixtures/api-mocks";
import { testUserInfo } from "../../../fixtures/test-data";
import { KvitteringPage } from "../../../pages/skjema/kvittering/kvittering-page";

test.describe("Kvittering page", () => {
  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    // Set representation type in sessionStorage before navigation
    await page.addInitScript((repType) => {
      sessionStorage.setItem(
        "representasjonKontekst",
        JSON.stringify({
          representasjonstype: repType,
        }),
      );
    }, Representasjonstype.DEG_SELV);
  });

  test("should display receipt after successful submission", async ({
    page,
  }) => {
    const skjemaId = "test-skjema-id";
    const kvittering: SkjemaInnsendtKvittering = {
      skjemaId: skjemaId,
      status: SkjemaStatus.SENDT,
      referanseId: "ABX1244",
    };

    const kvitteringPage = new KvitteringPage(page, skjemaId);

    await kvitteringPage.mockKvittering(kvittering);

    await kvitteringPage.goto();
    await kvitteringPage.assertIsVisible();
    await kvitteringPage.assertMeldingIsVisible();
    await kvitteringPage.assertInfoOversiktIsVisible();
    await kvitteringPage.assertTilOversiktLinkIsVisible();

    await kvitteringPage.clickTilOversiktLink();
    await kvitteringPage.assertNavigatedToOversikt();
  });
});
