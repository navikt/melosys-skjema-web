import { describe, expect, it } from "vitest";

import { organisasjonsnummerHarGyldigFormat } from "./valideringUtils";

describe("organisasjonsnummerHarGyldigFormat", () => {
  const gyldigeOrgnr = [
    "889640782", // NAV
    "974760673", // Skatteetaten
    "971526157", // Politiet
    "912998827", // Brønnøysundregistrene
  ];

  it.each(gyldigeOrgnr)("godtar gyldig orgnr: %s", (orgnr) => {
    expect(organisasjonsnummerHarGyldigFormat(orgnr)).toBe(true);
  });

  it("avviser for kort input", () => {
    expect(organisasjonsnummerHarGyldigFormat("12345678")).toBe(false);
  });

  it("avviser for lang input", () => {
    expect(organisasjonsnummerHarGyldigFormat("1234567890")).toBe(false);
  });

  it("avviser tom streng", () => {
    expect(organisasjonsnummerHarGyldigFormat("")).toBe(false);
  });

  it("avviser bokstaver", () => {
    expect(organisasjonsnummerHarGyldigFormat("12345678a")).toBe(false);
  });

  it("avviser med mellomrom", () => {
    expect(organisasjonsnummerHarGyldigFormat("889 640 782")).toBe(false);
  });

  it("avviser feil kontrollsiffer", () => {
    // 889640782 er gyldig — endre siste siffer
    expect(organisasjonsnummerHarGyldigFormat("889640783")).toBe(false);
  });

  it("avviser når MOD11-rest gir kontrollsiffer 10", () => {
    // Prefix "00000006": vektet sum = 2*6 = 12, 12 % 11 = 1, kontrollsiffer = 10 → ugyldig.
    // Ingen siste siffer 0-9 kan gjøre dette gyldig.
    for (let d = 0; d <= 9; d++) {
      expect(organisasjonsnummerHarGyldigFormat(`00000006${d}`)).toBe(false);
    }
  });
});
