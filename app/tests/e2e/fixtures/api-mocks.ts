import { Page } from "@playwright/test";

import { UserInfo } from "../../../src/httpClients/dekoratorenClient";
import type {
  OrganisasjonDto,
  UtsendtArbeidstakerMetadata,
  UtsendtArbeidstakerSkjemaDto,
} from "../../../src/types/melosysSkjemaTypes";
import { skjemaInnsendtKvittering } from "./test-data";

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

export async function mockSkjemaMetadata(
  page: Page,
  skjemaId: string,
  metadata: UtsendtArbeidstakerMetadata,
) {
  await page.route(`/api/skjema/${skjemaId}/metadata`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(metadata),
    });
  });
}

export async function mockFetchSkjema(
  page: Page,
  skjemaDto: UtsendtArbeidstakerSkjemaDto,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/${skjemaDto.id}`,
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

export async function mockPostVirksomhetINorge(page: Page, skjemaId: string) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/${skjemaId}/arbeidsgiverens-virksomhet-i-norge`,
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
    `/api/skjema/utsendt-arbeidstaker/${skjemaId}/utenlandsoppdraget`,
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
    `/api/skjema/utsendt-arbeidstaker/${skjemaId}/arbeidssted-i-utlandet`,
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
    `/api/skjema/utsendt-arbeidstaker/${skjemaId}/arbeidstakerens-lonn`,
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
    `/api/skjema/utsendt-arbeidstaker/${skjemaId}/tilleggsopplysninger`,
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
    `/api/skjema/utsendt-arbeidstaker/${skjemaId}/arbeidssituasjon`,
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

export async function mockPostUtsendingsperiodeOgLand(
  page: Page,
  skjemaId: string,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/${skjemaId}/utsendingsperiode-og-land`,
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
    `/api/skjema/utsendt-arbeidstaker/${skjemaId}/familiemedlemmer`,
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
    `/api/skjema/utsendt-arbeidstaker/${skjemaId}/skatteforhold-og-inntekt`,
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

export async function mockSendInnSkjema(page: Page, skjemaId: string) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/${skjemaId}/send-inn`,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ...skjemaInnsendtKvittering,
          skjemaId: skjemaId,
        }),
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
  skjema: UtsendtArbeidstakerSkjemaDto,
  tilganger: OrganisasjonDto[],
  testUserInfo: UserInfo,
) {
  await mockHentTilganger(page, tilganger);
  await mockUserInfo(page, testUserInfo);
  await mockSkjemaMetadata(page, skjema.id, skjema.metadata);
  await mockFetchSkjema(page, skjema);
  await mockGetEregOrganisasjon(page);
  await mockPostVirksomhetINorge(page, skjema.id);
  await mockPostUtenlandsoppdraget(page, skjema.id);
  await mockPostArbeidsstedIUtlandet(page, skjema.id);
  await mockPostArbeidstakerensLonn(page, skjema.id);
  await mockPostTilleggsopplysninger(page, skjema.id);
  await mockSendInnSkjema(page, skjema.id);
}

export async function setupApiMocksForArbeidstaker(
  page: Page,
  skjema: UtsendtArbeidstakerSkjemaDto,
  userInfo: UserInfo,
) {
  await mockUserInfo(page, userInfo);
  await mockHentTilganger(page, []);
  await mockSkjemaMetadata(page, skjema.id, skjema.metadata);
  await mockFetchSkjema(page, skjema);
  await mockPostArbeidssituasjon(page, skjema.id);
  await mockPostUtsendingsperiodeOgLand(page, skjema.id);
  await mockGetEregOrganisasjon(page);
  await mockPostFamiliemedlemmer(page, skjema.id);
  await mockPostSkatteforholdOgInntekt(page, skjema.id);
  await mockPostTilleggsopplysninger(page, skjema.id);
  await mockSendInnSkjema(page, skjema.id);
}
