import { createInstance } from "i18next";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { describe, expect, it } from "vitest";

import type { PeriodeFeltDefinisjon } from "~/types/melosysSkjemaTypes.ts";

import { FeltOppsummering } from "./FeltOppsummering.tsx";

describe("FeltOppsummering", () => {
  it("viser periodedatoer i norsk datoformat", async () => {
    const i18n = createInstance();
    await i18n.use(initReactI18next).init({
      lng: "nb",
      resources: { nb: { translation: {} } },
    });

    const felt: PeriodeFeltDefinisjon = {
      type: "PERIOD",
      label: "Utsendingsperiode",
      pakrevd: true,
      fraDatoLabel: "Fra dato",
      tilDatoLabel: "Til dato",
    };
    const markup = renderToStaticMarkup(
      createElement(
        I18nextProvider,
        { i18n },
        createElement(FeltOppsummering, {
          felt,
          verdi: { fraDato: "2026-01-01", tilDato: "2026-12-31" },
        }),
      ),
    );

    expect(markup).toContain("01.01.2026");
    expect(markup).toContain("31.12.2026");
    expect(markup).not.toContain("2026-01-01");
  });
});
