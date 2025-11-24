import { Page } from "@playwright/test";

import { UserInfo } from "../../../src/httpClients/dekoratorenClient";
import type {
  ArbeidsgiversSkjemaDto,
  ArbeidstakersSkjemaDto,
  OrganisasjonDto,
} from "../../../src/types/melosysSkjemaTypes";

export async function mockHentTilganger(
  page: Page,
  organisasjoner: OrganisasjonDto[],
) {
  await page.route("/api/hentTilganger", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(organisasjoner),
    });
  });
}

export async function mockUserInfo(page: Page, userInfo: UserInfo) {
  await page.route("/nav-dekoratoren-api/auth", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        authenticated: true,
        ...userInfo,
      }),
    });
  });
}

export async function mockFetchArbeidsgiverSkjema(
  page: Page,
  skjemaDto: ArbeidsgiversSkjemaDto,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/${skjemaDto.id}/arbeidsgiver-view`,
    async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(skjemaDto),
        });
      }
    },
  );
}

export async function mockPostArbeidsgiveren(page: Page, skjemaId: string) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/arbeidsgiveren`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostArbeidstakeren(page: Page, skjemaId: string) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/arbeidstakeren`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostVirksomhetINorge(page: Page, skjemaId: string) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/arbeidsgiverens-virksomhet-i-norge`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostUtenlandsoppdraget(page: Page, skjemaId: string) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/utenlandsoppdraget`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostArbeidsstedIUtlandet(
  page: Page,
  skjemaId: string,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/arbeidssted-i-utlandet`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostArbeidstakerensLonn(
  page: Page,
  skjemaId: string,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/arbeidstakerens-lonn`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostTilleggsopplysningerArbeidsgiver(
  page: Page,
  skjemaId: string,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/tilleggsopplysninger`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockFetchArbeidstakerSkjema(
  page: Page,
  skjemaDto: ArbeidstakersSkjemaDto,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/${skjemaDto.id}/arbeidstaker-view`,
    async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(skjemaDto),
        });
      }
    },
  );
}

export async function mockPostDineOpplysninger(page: Page, skjemaId: string) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/dine-opplysninger`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostArbeidssituasjon(page: Page, skjemaId: string) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/arbeidssituasjon`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostUtenlandsoppdragetArbeidstaker(
  page: Page,
  skjemaId: string,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/utenlandsoppdraget`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostFamiliemedlemmer(page: Page, skjemaId: string) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/familiemedlemmer`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostSkatteforholdOgInntekt(
  page: Page,
  skjemaId: string,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/skatteforhold-og-inntekt`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockPostTilleggsopplysninger(
  page: Page,
  skjemaId: string,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/tilleggsopplysninger`,
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "{}",
        });
      }
    },
  );
}

export async function mockSubmitSkjema(page: Page) {
  await page.route(
    "/api/skjema/utsendt-arbeidstaker/*/submit",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{}",
      });
    },
  );
}

export async function mockGetEregOrganisasjon(page: Page) {
  await page.route("/api/ereg/organisasjon/*", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          organisasjon: {
            organisasjonsnummer: "123456789",
            navn: "Test Organisasjon AS",
            type: "Virksomhet",
          },
          juridiskEnhet: {
            organisasjonsnummer: "123456789",
            navn: "Test Organisasjon AS",
            type: "AS",
          },
        }),
      });
    }
  });
}

export async function setupApiMocksForArbeidsgiver(
  page: Page,
  skjema: ArbeidsgiversSkjemaDto,
  tilganger: OrganisasjonDto[],
  testUserInfo: UserInfo,
) {
  await mockHentTilganger(page, tilganger);
  await mockUserInfo(page, testUserInfo);
  await mockFetchArbeidsgiverSkjema(page, skjema);
  await mockPostArbeidsgiveren(page, skjema.id);
  await mockPostArbeidstakeren(page, skjema.id);
  await mockGetEregOrganisasjon(page);
  await mockPostVirksomhetINorge(page, skjema.id);
  await mockPostUtenlandsoppdraget(page, skjema.id);
  await mockPostArbeidsstedIUtlandet(page, skjema.id);
  await mockPostArbeidstakerensLonn(page, skjema.id);
  await mockPostTilleggsopplysningerArbeidsgiver(page, skjema.id);
  await mockSubmitSkjema(page);
}

export async function setupApiMocksForArbeidstaker(
  page: Page,
  skjema: ArbeidstakersSkjemaDto,
  userInfo: UserInfo,
) {
  await mockUserInfo(page, userInfo);
  await mockHentTilganger(page, []);
  await mockFetchArbeidstakerSkjema(page, skjema);
  await mockPostDineOpplysninger(page, skjema.id);
  await mockPostArbeidssituasjon(page, skjema.id);
  await mockPostUtenlandsoppdragetArbeidstaker(page, skjema.id);
  await mockGetEregOrganisasjon(page);
  await mockPostFamiliemedlemmer(page, skjema.id);
  await mockPostSkatteforholdOgInntekt(page, skjema.id);
  await mockPostTilleggsopplysninger(page, skjema.id);
  await mockSubmitSkjema(page);
}
