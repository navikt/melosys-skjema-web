import { Page } from "@playwright/test";

import type {
  ArbeidsgiversSkjemaDto,
  ArbeidstakersSkjemaDto,
  OrganisasjonDto,
} from "../../src/types/melosysSkjemaTypes";
import {
  testArbeidsgiverSkjema,
  testArbeidstakerSkjema,
  testUserInfo,
} from "./test-data";

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

export async function mockUserInfo(page: Page) {
  await page.route("/api/userinfo", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(testUserInfo),
    });
  });
}

export async function mockCreateArbeidsgiverSkjema(page: Page) {
  await page.route(
    "/api/skjema/utsendt-arbeidstaker/arbeidsgiver",
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: testArbeidsgiverSkjema.id,
            data: {},
          }),
        });
      }
    },
  );
}

export async function mockCreateArbeidstakerSkjema(page: Page) {
  await page.route(
    "/api/skjema/utsendt-arbeidstaker/arbeidstaker",
    async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: testArbeidstakerSkjema.id,
            data: {},
          }),
        });
      }
    },
  );
}

export async function mockFetchArbeidsgiverSkjema(
  page: Page,
  skjemaDto: ArbeidsgiversSkjemaDto,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaDto.id}`,
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

export async function mockFetchArbeidstakerSkjema(
  page: Page,
  skjemaDto: ArbeidstakersSkjemaDto,
) {
  await page.route(
    `/api/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaDto.id}`,
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

export async function setupApiMocksForArbeidsgiver(
  page: Page,
  skjema: ArbeidsgiversSkjemaDto,
  tilganger: OrganisasjonDto[],
) {
  await mockHentTilganger(page, tilganger);
  await mockUserInfo(page);
  await mockCreateArbeidsgiverSkjema(page);
  await mockFetchArbeidsgiverSkjema(page, skjema);
  await mockPostArbeidsgiveren(page, skjema.id);
  await mockPostVirksomhetINorge(page, skjema.id);
  await mockPostUtenlandsoppdraget(page, skjema.id);
  await mockPostArbeidstakerensLonn(page, skjema.id);
  await mockSubmitSkjema(page);
}
