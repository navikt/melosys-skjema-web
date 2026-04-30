import { test } from "../../fixtures/test";

import {
  type DegSelvMetadata,
  Representasjonstype,
  Skjemadel,
  SkjemaInnsendtKvittering,
  SkjemaStatus,
  SkjemaType,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

import {
  mockFetchSkjema,
  mockSkjemaMetadata,
  mockUserInfo,
} from "../../fixtures/api-mocks";
import { testUserInfo } from "../../fixtures/test-data";
import { KvitteringPage } from "../../pages/skjema/kvittering-page";

test.describe("Kvittering", () => {
  const skjemaId = "test-skjema-id";
  const metadata: DegSelvMetadata = {
    representasjonstype: Representasjonstype.DEG_SELV,
    juridiskEnhetOrgnr: "123456789",
    arbeidsgiverNavn: "Test Bedrift AS",
    skjemadel: Skjemadel.ARBEIDSTAKERS_DEL,
    metadatatype: "DegSelvMetadata",
  };
  const skjema: UtsendtArbeidstakerSkjemaDto = {
    id: skjemaId,
    fnr: testUserInfo.userId,
    orgnr: "",
    status: SkjemaStatus.UTKAST,
    type: SkjemaType.UTSENDT_ARBEIDSTAKER,
    opprettetDato: "2026-01-15T10:00:00Z",
    endretDato: "2026-01-16T14:30:00Z",
    metadata,
    data: { type: "UTSENDT_ARBEIDSTAKER_ARBEIDSTAKERS_DEL" },
  };

  test.beforeEach(async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    await mockSkjemaMetadata(page, skjemaId, metadata);
    await mockFetchSkjema(page, skjema);
  });

  test("viser kvittering etter vellykket innsending", async ({ page }) => {
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
