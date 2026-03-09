import { test } from "@playwright/test";

import {
  Representasjonstype,
  Skjemadel,
  SkjemaInnsendtKvittering,
  SkjemaStatus,
} from "../../../../../src/types/melosysSkjemaTypes";
import { mockSkjemaMetadata, mockUserInfo } from "../../../fixtures/api-mocks";
import { testUserInfo } from "../../../fixtures/test-data";
import { KvitteringPage } from "../../../pages/skjema/kvittering/kvittering-page";

test.describe("Kvittering page", () => {
  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    await mockSkjemaMetadata(page, "test-skjema-id", {
      representasjonstype: Representasjonstype.DEG_SELV,
      juridiskEnhetOrgnr: "123456789",
      arbeidsgiverNavn: "Test Bedrift AS",
      skjemadel: Skjemadel.ARBEIDSTAKERS_DEL,
      metadatatype: "DegSelvMetadata",
    });
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
    await kvitteringPage.assertNavigatedToLandingsside();
  });
});
