import { nb } from "~/i18n/nb";
import { VedleggFiltype } from "~/types/melosysSkjemaTypes";

import {
  mockFetchSkjema,
  mockHentVedlegg,
  mockHentVedleggFeil,
  mockLastOppVedlegg,
  mockPostFamiliemedlemmerFeil,
  mockSendInnSkjemaFeil,
  mockSlettUtkastFeil,
  mockSlettVedleggFeil,
  setupApiMocksForArbeidstaker,
} from "../../fixtures/api-mocks";
import { expect, test } from "../../fixtures/test";
import { testArbeidstakerSkjema, testUserInfo } from "../../fixtures/test-data";
import { FamiliemedlemmerStegPage } from "../../pages/skjema/familiemedlemmer-steg.page";
import { VedleggStegPage } from "../../pages/skjema/vedlegg-steg.page";

const t = nb.translation;

test.describe("Feilhåndtering", () => {
  test.describe("SkjemaSteg - submit-feil viser Alert", () => {
    test("viser feilmelding i steg når POST feiler", async ({ page }) => {
      // Sett opp standard mocks, men overstyr familiemedlemmer med feil-mock
      await setupApiMocksForArbeidstaker(
        page,
        testArbeidstakerSkjema,
        testUserInfo,
      );
      await mockPostFamiliemedlemmerFeil(page, testArbeidstakerSkjema.id);

      const familiemedlemmerStegPage = new FamiliemedlemmerStegPage(
        page,
        testArbeidstakerSkjema,
      );

      await familiemedlemmerStegPage.goto();
      await familiemedlemmerStegPage.assertIsVisible();

      // Feilmelding skal ikke vises før submit
      await expect(page.getByText(t.felles.feilVedInnsending)).toBeHidden();

      // Fyll ut og submit
      await familiemedlemmerStegPage.harDuFamiliemedlemmerSomSkalVaereMedRadioGroup.NEI.click();
      await familiemedlemmerStegPage.lagreOgFortsett();

      // Feilmelding skal nå være synlig
      await expect(
        page.getByRole("alert").filter({ hasText: t.felles.feilVedInnsending }),
      ).toBeVisible();

      // Bruker skal fortsatt være på samme steg
      await familiemedlemmerStegPage.assertStillOnStep();
    });
  });

  test.describe("VedleggSteg - hentVedlegg-feil", () => {
    test("viser feilmelding når henting av vedlegg feiler", async ({
      page,
    }) => {
      await setupApiMocksForArbeidstaker(
        page,
        testArbeidstakerSkjema,
        testUserInfo,
      );
      await mockHentVedleggFeil(page, testArbeidstakerSkjema.id);

      const vedleggStegPage = new VedleggStegPage(page, testArbeidstakerSkjema);

      await vedleggStegPage.goto();
      await vedleggStegPage.assertIsVisible();

      // Feilmelding for henting av vedlegg skal vises
      await expect(
        page
          .getByRole("alert")
          .filter({ hasText: t.vedleggSteg.feilVedHentingAvVedlegg }),
      ).toBeVisible();
    });
  });

  test.describe("VedleggSteg - slettVedlegg-feil", () => {
    test("vedlegg forblir synlig når sletting feiler", async ({ page }) => {
      const skjemaId = testArbeidstakerSkjema.id;
      const vedleggResponse = {
        id: "vedlegg-456",
        filnavn: "dokument.pdf",
        filtype: VedleggFiltype.PDF,
        filstorrelse: 5000,
        opprettetDato: "2026-01-15T10:00:00Z",
      };

      await setupApiMocksForArbeidstaker(
        page,
        testArbeidstakerSkjema,
        testUserInfo,
      );
      await mockHentVedlegg(page, skjemaId);
      await mockLastOppVedlegg(page, skjemaId, vedleggResponse);
      await mockSlettVedleggFeil(page, skjemaId);

      const vedleggStegPage = new VedleggStegPage(page, testArbeidstakerSkjema);

      await vedleggStegPage.goto();
      await vedleggStegPage.assertIsVisible();
      await vedleggStegPage.velgHarAnnenDokumentasjonJa();

      // Last opp en fil
      await vedleggStegPage.uploadFile(
        "dokument.pdf",
        "application/pdf",
        Buffer.from("fake-pdf-content"),
      );
      await vedleggStegPage.assertFileItemVisible("dokument.pdf");

      // Prøv å slette — skal feile
      await vedleggStegPage.deleteFileItem();

      // Feilmelding for sletting skal vises
      await expect(
        page
          .getByRole("alert")
          .filter({ hasText: t.vedleggSteg.feilVedSlettingAvVedlegg }),
      ).toBeVisible();

      // Vedlegget skal fortsatt være synlig (ikke fjernet fra UI)
      await vedleggStegPage.assertFileItemVisible("dokument.pdf");
    });
  });

  test.describe("SendInnSkjemaKnapp - innsending feiler", () => {
    test("viser feilmelding når innsending feiler", async ({ page }) => {
      await setupApiMocksForArbeidstaker(
        page,
        testArbeidstakerSkjema,
        testUserInfo,
      );
      // Overstyr send-inn med feil
      await mockSendInnSkjemaFeil(page, testArbeidstakerSkjema.id);
      // Mock vedlegg for oppsummeringssiden
      await mockHentVedlegg(page, testArbeidstakerSkjema.id);

      // Naviger til oppsummeringssiden med utfylt data
      await mockFetchSkjema(page, {
        ...testArbeidstakerSkjema,
        data: {
          type: "UTSENDT_ARBEIDSTAKER_ARBEIDSTAKERS_DEL",
          arbeidssituasjon: {
            harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
            skalJobbeForFlereVirksomheter: false,
          },
          familiemedlemmer: { skalHaMedFamiliemedlemmer: false },
          skatteforholdOgInntekt: {
            erSkattepliktigTilNorgeIHeleutsendingsperioden: true,
            mottarPengestotteFraAnnetEosLandEllerSveits: false,
          },
          tilleggsopplysninger: { harFlereOpplysningerTilSoknaden: false },
          utsendingsperiodeOgLand: {
            utsendelseLand: "SE",
            utsendelsePeriode: {
              fraDato: "2026-01-01",
              tilDato: "2026-12-31",
            },
          },
          vedlegg: { harAnnenDokumentasjon: false },
        } as typeof testArbeidstakerSkjema.data,
      });

      await page.goto(`/skjema/${testArbeidstakerSkjema.id}/oppsummering`);

      // Klikk "Send søknad"
      const sendKnapp = page.getByRole("button", {
        name: t.felles.sendSoknad,
      });
      await sendKnapp.click();

      // Feilmelding skal vises
      await expect(
        page.getByRole("alert").filter({ hasText: t.felles.feilVedInnsending }),
      ).toBeVisible();

      // Skal fortsatt være på oppsummeringssiden
      await expect(page).toHaveURL(
        `/skjema/${testArbeidstakerSkjema.id}/oppsummering`,
      );
    });
  });

  test.describe("AvbrytOgSlettKnapp - sletting feiler", () => {
    test("viser feilmelding i modal når sletting feiler", async ({ page }) => {
      await setupApiMocksForArbeidstaker(
        page,
        testArbeidstakerSkjema,
        testUserInfo,
      );
      await mockSlettUtkastFeil(page, testArbeidstakerSkjema.id);

      const familiemedlemmerStegPage = new FamiliemedlemmerStegPage(
        page,
        testArbeidstakerSkjema,
      );

      await familiemedlemmerStegPage.goto();
      await familiemedlemmerStegPage.assertIsVisible();

      // Åpne avbryt-og-slett-modal
      await page.getByRole("button", { name: t.felles.avbrytOgSlett }).click();

      // Bekreft sletting
      await page
        .getByRole("button", { name: t.felles.jaAvbrytOgSlettUtkast })
        .click();

      // Feilmelding skal vises inne i modalen
      const modal = page.getByRole("dialog");
      await expect(
        modal.getByRole("alert").filter({ hasText: t.felles.feil }),
      ).toBeVisible();
    });
  });
});
