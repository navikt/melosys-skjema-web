import { Page } from "@playwright/test";

import { UserInfo } from "~/httpClients/dekoratorenClient";
import type {
  InnsendteSoknaderResponse,
  InnsendtSkjemaResponse,
  OrganisasjonDto,
  OrganisasjonMedJuridiskEnhetDto,
  PersonMedFullmaktDto,
  UtkastListeResponse,
  UtsendtArbeidstakerMetadata,
  UtsendtArbeidstakerSkjemaDto,
  VedleggDto,
} from "~/types/melosysSkjemaTypes";

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

export async function mockGetEregOrganisasjon(
  page: Page,
  navn = "Test Organisasjon AS",
) {
  await page.route("/api/ereg/organisasjon/*", async (route) => {
    if (route.request().method() === "GET") {
      // Extract the orgnr from the URL so the response matches the search value
      const url = route.request().url();
      const orgnrFromUrl = url.split("/api/ereg/organisasjon/")[1];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ orgnr: orgnrFromUrl, navn }),
      });
    }
  });
}

export async function mockGetEregOrganisasjonMedJuridiskEnhet(
  page: Page,
  response?: OrganisasjonMedJuridiskEnhetDto,
) {
  await page.route(
    "/api/ereg/organisasjon-med-juridisk-enhet/*",
    async (route) => {
      if (route.request().method() === "GET") {
        const body =
          response ??
          (() => {
            const url = route.request().url();
            const orgnr = url.split(
              "/api/ereg/organisasjon-med-juridisk-enhet/",
            )[1];
            return {
              organisasjon: { orgnr, navn: "Test Organisasjon AS" },
              juridiskEnhet: { orgnr, navn: "Test Organisasjon AS" },
            };
          })();
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(body),
        });
      }
    },
  );
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
  await mockGetEregOrganisasjonMedJuridiskEnhet(page);
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
  await mockGetEregOrganisasjonMedJuridiskEnhet(page);
  await mockPostFamiliemedlemmer(page, skjema.id);
  await mockPostSkatteforholdOgInntekt(page, skjema.id);
  await mockPostTilleggsopplysninger(page, skjema.id);
  await mockSendInnSkjema(page, skjema.id);
}

export async function setupApiMocksForKombinert(
  page: Page,
  skjema: UtsendtArbeidstakerSkjemaDto,
  tilganger: OrganisasjonDto[],
  userInfo: UserInfo,
) {
  await mockHentTilganger(page, tilganger);
  await mockUserInfo(page, userInfo);
  await mockSkjemaMetadata(page, skjema.id, skjema.metadata);
  await mockFetchSkjema(page, skjema);
  await mockGetEregOrganisasjon(page);
  await mockGetEregOrganisasjonMedJuridiskEnhet(page);
  // Arbeidsgiver steps
  await mockPostVirksomhetINorge(page, skjema.id);
  await mockPostUtenlandsoppdraget(page, skjema.id);
  await mockPostArbeidsstedIUtlandet(page, skjema.id);
  await mockPostArbeidstakerensLonn(page, skjema.id);
  // Arbeidstaker steps
  await mockPostArbeidssituasjon(page, skjema.id);
  await mockPostSkatteforholdOgInntekt(page, skjema.id);
  await mockPostFamiliemedlemmer(page, skjema.id);
  await mockPostUtsendingsperiodeOgLand(page, skjema.id);
  // Shared steps
  await mockPostTilleggsopplysninger(page, skjema.id);
  await mockSendInnSkjema(page, skjema.id);
}

// ============ Oversikt SoknadStarter mocks ============

export async function mockPersonerMedFullmakt(
  page: Page,
  personer: PersonMedFullmaktDto[],
) {
  await page.route("/api/representasjon/personer", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(personer),
    });
  });
}

export async function mockVerifiserPerson(
  page: Page,
  response: { navn: string; fodselsdato: string },
) {
  await page.route("/api/arbeidstaker/verifiser-person", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(response),
      });
    }
  });
}

// ============ Oversikt page mocks ============

export async function mockUtkastListe(
  page: Page,
  response: UtkastListeResponse,
) {
  await page.route(
    /\/api\/skjema\/utsendt-arbeidstaker\/utkast/,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(response),
      });
    },
  );
}

export async function mockInnsendteSoknader(
  page: Page,
  response: InnsendteSoknaderResponse,
) {
  await page.route(
    "/api/skjema/utsendt-arbeidstaker/innsendte",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(response),
      });
    },
  );
}

/**
 * Mock som returnerer ulike svar basert på søkeordet i POST-body.
 * Brukes for å teste søkefunksjonaliteten i innsendte søknader-tabellen.
 */
export async function mockInnsendteSoknaderMedSok(
  page: Page,
  responseMap: Record<string, InnsendteSoknaderResponse>,
  defaultResponse: InnsendteSoknaderResponse,
) {
  await page.route(
    "/api/skjema/utsendt-arbeidstaker/innsendte",
    async (route) => {
      const body = route.request().postDataJSON();
      const sok = body?.sok as string | undefined;
      const response =
        sok && sok in responseMap ? responseMap[sok] : defaultResponse;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(response),
      });
    },
  );
}

/**
 * Mock som returnerer HTTP 500 for innsendte søknader.
 * Brukes for å teste feilhåndtering i innsendte søknader-tabellen.
 */
export async function mockInnsendteSoknaderFeil(page: Page) {
  await page.route(
    "/api/skjema/utsendt-arbeidstaker/innsendte",
    async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    },
  );
}

export async function mockOpprettSoknad(page: Page, responseId: string) {
  await page.route(
    "/api/skjema/utsendt-arbeidstaker/opprett-med-kontekst",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: responseId, status: "UTKAST" }),
      });
    },
  );
}

/**
 * Intercepts the opprett-soknad POST request and returns the request body.
 * Use this variant when you need to assert on the POST payload.
 */
export function interceptOpprettSoknad(
  page: Page,
  responseId: string,
): Promise<unknown> {
  return new Promise((resolve) => {
    void page.route(
      "/api/skjema/utsendt-arbeidstaker/opprett-med-kontekst",
      async (route) => {
        const body = route.request().postDataJSON();
        resolve(body);
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: responseId, status: "UTKAST" }),
        });
      },
    );
  });
}

// ============ Vedlegg mocks ============

export async function mockHentVedlegg(
  page: Page,
  skjemaId: string,
  vedlegg: VedleggDto[] = [],
) {
  await page.route(
    new RegExp(`/api/skjema/${skjemaId}/vedlegg$`),
    async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(vedlegg),
        });
      }
    },
  );
}

export async function mockLastOppVedlegg(
  page: Page,
  skjemaId: string,
  response: VedleggDto,
) {
  await page.route(
    new RegExp(`/api/skjema/${skjemaId}/vedlegg$`),
    async (route) => {
      await (route.request().method() === "POST"
        ? route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(response),
          })
        : route.fallback());
    },
  );
}

// ============ Innsendt skjema mocks ============

export async function mockInnsendtSkjema(
  page: Page,
  skjemaId: string,
  response: InnsendtSkjemaResponse,
) {
  await page.route(
    new RegExp(`/api/skjema/utsendt-arbeidstaker/${skjemaId}/innsendt`),
    async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(response),
        });
      }
    },
  );
}

// ============ Oversikt composite setup ============

export async function setupApiMocksForOversikt(
  page: Page,
  userInfo: UserInfo,
  organisasjoner: OrganisasjonDto[],
  utkast: UtkastListeResponse,
  innsendteSoknader: InnsendteSoknaderResponse,
) {
  await mockUserInfo(page, userInfo);
  await mockHentTilganger(page, organisasjoner);
  await mockGetEregOrganisasjon(page);
  await mockUtkastListe(page, utkast);
  await mockInnsendteSoknader(page, innsendteSoknader);
}
