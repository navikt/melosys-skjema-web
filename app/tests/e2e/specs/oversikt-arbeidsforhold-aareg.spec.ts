import {
  ARBEIDSFORHOLD_AAREG,
  STATSANSATT_FLYT,
} from "~/featuretoggle/toggleNavn";
import { OpprettetVia, Representasjonstype } from "~/types/melosysSkjemaTypes";

import {
  interceptOpprettSoknad,
  mockArbeidsgivereIAareg,
  mockArbeidsgivereIAaregFeiler,
  mockFeatureToggles,
  mockGetEregOrganisasjonMedJuridiskEnhet,
  setupApiMocksForOversikt,
} from "../fixtures/api-mocks";
import { expect, test } from "../fixtures/test";
import {
  emptyInnsendteSoknader,
  emptyUtkastListe,
  korrektFormatertOrgnr,
  testAaregArbeidsgiver,
  testAaregArbeidsgivere,
  testEregOrganisasjon,
  testOpprettSoknadResponseId,
  testUserInfo,
} from "../fixtures/test-data";
import { OversiktPage } from "../pages/oversikt/oversikt.page";
import { SkjemaStartPage } from "../pages/skjema/skjema-start.page";

test.describe("Oversikt — arbeidsforhold fra Aa-registeret (DEG_SELV)", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocksForOversikt(
      page,
      testUserInfo,
      [],
      emptyUtkastListe,
      emptyInnsendteSoknader,
    );
    await mockFeatureToggles(page, {
      [STATSANSATT_FLYT]: true,
      [ARBEIDSFORHOLD_AAREG]: true,
    });
  });

  test("viser arbeidsgiverne fra Aa-registeret og starter søknad med valgt arbeidsgiver", async ({
    page,
  }) => {
    await mockArbeidsgivereIAareg(page, testAaregArbeidsgivere);
    const requestBodyPromise = interceptOpprettSoknad(
      page,
      testOpprettSoknadResponseId,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertArbeidsforholdValg(testAaregArbeidsgivere);
    await oversiktPage.assertArbeidsgiverOrgnrInputNotVisible();

    await oversiktPage.selectArbeidsforhold(testAaregArbeidsgiver);
    await oversiktPage.clickStartSoknad();
    await new SkjemaStartPage(page).bekreftOgStart(
      oversiktPage.representasjonstype,
    );

    expect(await requestBodyPromise).toEqual({
      opprettetVia: OpprettetVia.ORDINAER,
      representasjonstype: Representasjonstype.DEG_SELV,
      arbeidsgiver: testAaregArbeidsgiver,
      arbeidstaker: {
        fnr: testUserInfo.userId,
        etternavn: testUserInfo.name,
      },
    });
  });

  test("«Annen arbeidsgiver» viser org.nr.-feltet og starter søknad med oppgitt arbeidsgiver", async ({
    page,
  }) => {
    await mockArbeidsgivereIAareg(page, testAaregArbeidsgivere);
    await mockGetEregOrganisasjonMedJuridiskEnhet(page, testEregOrganisasjon);
    const requestBodyPromise = interceptOpprettSoknad(
      page,
      testOpprettSoknadResponseId,
    );

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.selectAnnenArbeidsgiver();
    await oversiktPage.fillArbeidsgiverOrgnr(korrektFormatertOrgnr);
    await oversiktPage.waitForOrgLookup(
      testEregOrganisasjon.juridiskEnhet.navn,
    );

    await oversiktPage.clickStartSoknad();
    await new SkjemaStartPage(page).bekreftOgStart(
      oversiktPage.representasjonstype,
    );

    expect(await requestBodyPromise).toEqual({
      opprettetVia: OpprettetVia.ORDINAER,
      representasjonstype: Representasjonstype.DEG_SELV,
      arbeidsgiver: testEregOrganisasjon.juridiskEnhet,
      arbeidstaker: {
        fnr: testUserInfo.userId,
        etternavn: testUserInfo.name,
      },
    });
  });

  test("uten arbeidsforhold i Aa-registeret vises bare org.nr.-feltet", async ({
    page,
  }) => {
    await mockArbeidsgivereIAareg(page, []);

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertArbeidsgiverOrgnrInputVisible();
    await oversiktPage.assertArbeidsforholdSelectNotVisible();
  });

  test("viser feilmelding og ikke skjemaet når Aa-registeret feiler", async ({
    page,
  }) => {
    await mockArbeidsgivereIAaregFeiler(page);

    const oversiktPage = new OversiktPage(page, Representasjonstype.DEG_SELV);
    await oversiktPage.goto();
    await oversiktPage.assertArbeidsforholdFeilmelding();
    await expect(oversiktPage.startSoknadButton).not.toBeVisible();
  });
});
