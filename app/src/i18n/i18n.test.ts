import { describe, expect, it } from "vitest";

import { resources } from "./i18n.ts";

/**
 * react-i18next faller stille tilbake til nb når en nøkkel mangler i nn/en —
 * hull oppdages først i produksjon. Denne testen krever identiske nøkkelsett.
 */

function flattenEntries(obj: unknown, prefix = ""): Array<[string, string]> {
  if (typeof obj === "string") return [[prefix, obj]];
  if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj).flatMap(([key, value]) =>
      flattenEntries(value, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [];
}

function placeholders(tekst: string): string[] {
  return [...tekst.matchAll(/\{\{\s*(\w+)\s*\}\}/g)]
    .map((m) => m[1]!)
    .toSorted();
}

describe("i18n-ressursene", () => {
  const nbEntries = new Map(flattenEntries(resources.nb.translation));
  const nnEntries = new Map(flattenEntries(resources.nn.translation));
  const enEntries = new Map(flattenEntries(resources.en.translation));

  it("nb, nn og en har identiske nøkkelsett", () => {
    const nbKeys = [...nbEntries.keys()].toSorted();
    expect([...nnEntries.keys()].toSorted()).toEqual(nbKeys);
    expect([...enEntries.keys()].toSorted()).toEqual(nbKeys);
  });

  it("ingen tomme oversettelser", () => {
    for (const [lang, entries] of [
      ["nb", nbEntries],
      ["nn", nnEntries],
      ["en", enEntries],
    ] as const) {
      for (const [key, verdi] of entries) {
        expect(verdi.trim(), `${lang}:${key}`).not.toBe("");
      }
    }
  });

  it("interpolasjons-plassholdere er like på tvers av språk", () => {
    for (const [key, nbVerdi] of nbEntries) {
      const forventet = placeholders(nbVerdi);
      expect(placeholders(nnEntries.get(key) ?? ""), `nn:${key}`).toEqual(
        forventet,
      );
      expect(placeholders(enEntries.get(key) ?? ""), `en:${key}`).toEqual(
        forventet,
      );
    }
  });
});
