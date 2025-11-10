import { expect, type Locator, type Page } from "@playwright/test";

import { nb } from "../../../../../src/i18n/nb";
import type {
  ArbeidsgiversSkjemaDto,
  ArbeidstakerenArbeidsgiversDelDto,
} from "../../../../../src/types/melosysSkjemaTypes";
import { mockFetchArbeidsgiverSkjema } from "../../../fixtures/api-mocks";

export class ArbeidstakerenStegPage {
  readonly page: Page;
  readonly skjema: ArbeidsgiversSkjemaDto;
  readonly heading: Locator;
  readonly fodselsnummerInput: Locator;
  readonly lagreOgFortsettButton: Locator;

  constructor(page: Page, skjema: ArbeidsgiversSkjemaDto) {
    this.page = page;
    this.skjema = skjema;
    this.heading = page.getByRole("heading", {
      name: nb.translation.arbeidstakerenSteg.tittel,
    });
    this.fodselsnummerInput = page.getByLabel(
      nb.translation.arbeidstakerenSteg
        .harArbeidstakerenNorskFodselsnummerEllerDNummer,
    );
    this.lagreOgFortsettButton = page.getByRole("button", {
      name: nb.translation.felles.lagreOgFortsett,
    });
  }

  async goto() {
    await this.page.goto(
      `/skjema/arbeidsgiver/${this.skjema.id}/arbeidstakeren`,
    );
  }

  async assertIsVisible() {
    await expect(this.heading).toBeVisible();
  }

  async fillFodselsnummer(fodselsnummer: string) {
    await this.fodselsnummerInput.fill(fodselsnummer);
  }

  async lagreOgFortsett() {
    await this.lagreOgFortsettButton.click();
  }

  async lagreOgFortsettAndWaitForApiRequest() {
    const requestPromise = this.page.waitForRequest(
      `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${this.skjema.id}/arbeidstakeren`,
    );
    await this.lagreOgFortsett();
    return await requestPromise;
  }

  async lagreOgFortsettAndExpectPayload(
    expectedPayload: ArbeidstakerenArbeidsgiversDelDto,
  ) {
    // Mock skjema with arbeidstakeren data BEFORE clicking button
    await mockFetchArbeidsgiverSkjema(this.page, {
      ...this.skjema,
      data: {
        ...this.skjema.data,
        arbeidstakeren: expectedPayload,
      },
    });

    const apiCall = await this.lagreOgFortsettAndWaitForApiRequest();
    expect(apiCall.postDataJSON()).toStrictEqual(expectedPayload);

    return apiCall;
  }

  async assertNavigatedToNextStep() {
    await expect(this.page).toHaveURL(
      `/skjema/arbeidsgiver/${this.skjema.id}/arbeidsgiverens-virksomhet-i-norge`,
    );
  }
}
