import { describe, expect, it } from "vitest";

import { Sprak } from "~/types/melosysSkjemaTypes.ts";

import { mapToSupportedLanguage, toSprak } from "./languages.ts";

describe("mapToSupportedLanguage", () => {
  it.each(["nb", "nn", "en"] as const)("beholder støttet språk %s", (lang) => {
    expect(mapToSupportedLanguage(lang)).toBe(lang);
  });

  // decorator-language-cookien kan inneholde språk appen ikke støtter
  it.each(["se", "pl", "uk", "ru", "", "no", "en-GB"])(
    "faller tilbake til nb for %j",
    (lang) => {
      expect(mapToSupportedLanguage(lang)).toBe("nb");
    },
  );
});

describe("toSprak", () => {
  it("mapper til API-enumen med nb-fallback", () => {
    expect(toSprak("nn")).toBe(Sprak.Nn);
    expect(toSprak("en")).toBe(Sprak.En);
    expect(toSprak("nb")).toBe(Sprak.Nb);
    expect(toSprak("se")).toBe(Sprak.Nb);
  });
});
