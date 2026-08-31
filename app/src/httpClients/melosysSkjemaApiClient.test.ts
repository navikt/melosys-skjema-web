import { afterEach, describe, expect, it, vi } from "vitest";

import {
  postArbeidssituasjon,
  SKJEMA_DEFINISJON_VERSJON_HEADER,
  SkjemaApiError,
  UTDATERT_UTKAST_STORAGE_KEY,
} from "./melsosysSkjemaApiClient.ts";

describe("skjemaversjon på mutasjoner", () => {
  const request = {
    harVaertEllerSkalVaereILonnetArbeidFoerUtsending: false,
    skalJobbeForFlereVirksomheter: false,
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sender utkastets skjemaversjon i header", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await postArbeidssituasjon("skjema-id", "2", request);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/skjema-id/arbeidssituasjon"),
      expect.objectContaining({
        headers: expect.objectContaining({
          [SKJEMA_DEFINISJON_VERSJON_HEADER]: "2",
        }),
      }),
    );
  });

  it("markerer utkastet og laster siden på nytt ved versjonskonflikt", async () => {
    const lagring = new Map<string, string>();
    const reload = vi.fn();
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => lagring.get(key) ?? null,
      setItem: (key: string, value: string) => lagring.set(key, value),
      removeItem: (key: string) => lagring.delete(key),
    });
    vi.stubGlobal("location", { reload });
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

    await expect(
      postArbeidssituasjon("skjema-id", "1", request),
    ).rejects.toEqual(
      expect.objectContaining<Partial<SkjemaApiError>>({
        status: 409,
        errorCode: "SKJEMA_DEFINISJON_VERSJON_UTDATERT",
      }),
    );
    expect(lagring.get(UTDATERT_UTKAST_STORAGE_KEY)).toBe("skjema-id");
    expect(reload).toHaveBeenCalledOnce();
  });
});
