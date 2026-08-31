import { describe, expect, it } from "vitest";

import { StegKey } from "~/constants/stegKeys.ts";
import {
  getStegRekkefolge,
  STEG_REKKEFOLGE,
} from "~/pages/skjema/stegRekkefølge.ts";
import {
  Skjemadel,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";

const lagSkjema = (
  skjemaDefinisjonVersjon: string,
  skjemadel: Skjemadel,
  erOffentligArbeidsgiver?: boolean,
) =>
  ({
    skjemaDefinisjonVersjon,
    metadata: { skjemadel, erOffentligArbeidsgiver },
  }) as Pick<
    UtsendtArbeidstakerSkjemaDto,
    "skjemaDefinisjonVersjon" | "metadata"
  >;

const harVirksomhetssteg = (skjema: ReturnType<typeof lagSkjema>) =>
  getStegRekkefolge(skjema).some(
    ({ key }) => key === StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
  );

describe("getStegRekkefolge", () => {
  it.each([
    ["1", Skjemadel.ARBEIDSGIVERS_DEL, true, true],
    ["1", Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, true, true],
    ["2", Skjemadel.ARBEIDSGIVERS_DEL, false, true],
    ["2", Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, false, true],
    ["2", Skjemadel.ARBEIDSGIVERS_DEL, true, false],
    ["2", Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, true, false],
  ])(
    "versjon %s, skjemadel %s og offentlig=%s gir virksomhetssteg=%s",
    (versjon, skjemadel, offentlig, forventet) => {
      expect(harVirksomhetssteg(lagSkjema(versjon, skjemadel, offentlig))).toBe(
        forventet,
      );
    },
  );

  it("endrer aldri arbeidstakerflyten eller grunnlisten", () => {
    const grunnliste = STEG_REKKEFOLGE[Skjemadel.ARBEIDSTAKERS_DEL];

    expect(
      getStegRekkefolge(lagSkjema("2", Skjemadel.ARBEIDSTAKERS_DEL, true)),
    ).toEqual(grunnliste);
    expect(STEG_REKKEFOLGE[Skjemadel.ARBEIDSGIVERS_DEL]).toHaveLength(8);
  });

  it("feiler på ukjent versjon uten fallback", () => {
    expect(() =>
      getStegRekkefolge(
        lagSkjema("ukjent", Skjemadel.ARBEIDSGIVERS_DEL, false),
      ),
    ).toThrow("Ukjent skjemadefinisjonsversjon");
  });
});
