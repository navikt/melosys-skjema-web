import { test } from "@playwright/test";

import {
  mockFetchSkjema,
  mockInnsendtSkjema,
  mockSkjemaMetadata,
  mockUserInfo,
} from "../../fixtures/api-mocks";
import {
  testArbeidsgiverSkjema,
  testArbeidstakerSkjema,
  testInnsendtSkjemaArbeidsgiverDel,
  testInnsendtSkjemaArbeidstakersDel,
  testInnsendtSkjemaKombinertDel,
  testKombinertSkjema,
  testUserInfo,
} from "../../fixtures/test-data";
import { InnsendtSkjemaPage } from "../../pages/skjema/innsendt/innsendt-skjema.page";

test.describe("Innsendt skjema", () => {
  test("Viser innsendt — arbeidstakers del", async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    await mockSkjemaMetadata(
      page,
      testArbeidstakerSkjema.id,
      testArbeidstakerSkjema.metadata,
    );
    await mockFetchSkjema(page, testArbeidstakerSkjema);
    await mockInnsendtSkjema(
      page,
      testArbeidstakerSkjema.id,
      testInnsendtSkjemaArbeidstakersDel,
    );

    const innsendtPage = new InnsendtSkjemaPage(
      page,
      testArbeidstakerSkjema.id,
    );
    await innsendtPage.goto();
    await innsendtPage.assertIsVisible();
    await innsendtPage.assertReferanseIdVisible("REF-AT-001");
  });

  test("Viser innsendt — arbeidsgivers del", async ({ page }) => {
    await mockUserInfo(page, testUserInfo);
    await mockSkjemaMetadata(
      page,
      testArbeidsgiverSkjema.id,
      testArbeidsgiverSkjema.metadata,
    );
    await mockFetchSkjema(page, testArbeidsgiverSkjema);
    await mockInnsendtSkjema(
      page,
      testArbeidsgiverSkjema.id,
      testInnsendtSkjemaArbeidsgiverDel,
    );

    const innsendtPage = new InnsendtSkjemaPage(
      page,
      testArbeidsgiverSkjema.id,
    );
    await innsendtPage.goto();
    await innsendtPage.assertIsVisible();
    await innsendtPage.assertReferanseIdVisible("REF-AG-001");
  });

  test("Viser innsendt — kombinert (arbeidsgiver og arbeidstakers del)", async ({
    page,
  }) => {
    await mockUserInfo(page, testUserInfo);
    await mockSkjemaMetadata(
      page,
      testKombinertSkjema.id,
      testKombinertSkjema.metadata,
    );
    await mockFetchSkjema(page, testKombinertSkjema);
    await mockInnsendtSkjema(
      page,
      testKombinertSkjema.id,
      testInnsendtSkjemaKombinertDel,
    );

    const innsendtPage = new InnsendtSkjemaPage(page, testKombinertSkjema.id);
    await innsendtPage.goto();
    await innsendtPage.assertIsVisible();
    await innsendtPage.assertReferanseIdVisible("REF-KO-001");
  });
});
