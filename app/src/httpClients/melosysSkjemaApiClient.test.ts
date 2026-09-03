import { afterEach, describe, expect, it, vi } from "vitest";

import { SKJEMA_DEFINISJON_VERSJON } from "~/constants/skjemaVersjon.ts";

import {
  postArbeidssituasjon,
  SKJEMA_DEFINISJON_VERSJON_HEADER,
  SkjemaApiError,
  UTDATERT_UTKAST_STORAGE_KEY,
  UtdatertKlientError,
  VERSJON_RELOAD_FORSOKT_KEY,
} from "./melsosysSkjemaApiClient.ts";

const stubSessionStorage = (initielt: Record<string, string> = {}) => {
  const lagring = new Map(Object.entries(initielt));
  vi.stubGlobal("sessionStorage", {
    getItem: (key: string) => lagring.get(key) ?? null,
    setItem: (key: string, value: string) => lagring.set(key, value),
    removeItem: (key: string) => lagring.delete(key),
  });
  return lagring;
};

const stubVersjonskonflikt = () =>
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      Response.json(
        {
          message: "Utdatert versjon",
          error: "SKJEMA_DEFINISJON_VERSJON_UTDATERT",
        },
        { status: 409, headers: { "Content-Type": "application/json" } },
      ),
    ),
  );

describe("skjemaversjon på mutasjoner", () => {
  const request = {
    harVaertEllerSkalVaereILonnetArbeidFoerUtsending: false,
    skalJobbeForFlereVirksomheter: false,
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sender bundelens egen skjemaversjon i header", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await postArbeidssituasjon("skjema-id", request);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/skjema-id/arbeidssituasjon"),
      expect.objectContaining({
        headers: expect.objectContaining({
          [SKJEMA_DEFINISJON_VERSJON_HEADER]: SKJEMA_DEFINISJON_VERSJON,
        }),
      }),
    );
  });

  it("markerer utkastet og laster siden på nytt ved versjonskonflikt", async () => {
    const lagring = stubSessionStorage();
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });
    stubVersjonskonflikt();

    await expect(postArbeidssituasjon("skjema-id", request)).rejects.toEqual(
      expect.objectContaining<Partial<SkjemaApiError>>({
        status: 409,
        errorCode: "SKJEMA_DEFINISJON_VERSJON_UTDATERT",
      }),
    );
    expect(lagring.get(UTDATERT_UTKAST_STORAGE_KEY)).toBe("skjema-id");
    expect(reload).toHaveBeenCalledOnce();
  });

  it("laster ikke på nytt igjen når reloaden ikke hjalp", async () => {
    const lagring = stubSessionStorage({
      [VERSJON_RELOAD_FORSOKT_KEY]: "skjema-id",
      [UTDATERT_UTKAST_STORAGE_KEY]: "skjema-id",
    });
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });
    stubVersjonskonflikt();

    await expect(
      postArbeidssituasjon("skjema-id", request),
    ).rejects.toBeInstanceOf(UtdatertKlientError);

    expect(reload).not.toHaveBeenCalled();
    // Utkastet ble aldri reinitialisert - backend avviste klienten før den kom så langt,
    // så varselet om at svar er fjernet skal ikke stå igjen.
    expect(lagring.has(UTDATERT_UTKAST_STORAGE_KEY)).toBe(false);
  });
});
