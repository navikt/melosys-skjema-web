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

const lagSkjema = (skjemadel: Skjemadel, erOffentligArbeidsgiver?: boolean) =>
  ({
    metadata: { skjemadel, erOffentligArbeidsgiver },
  }) as Pick<UtsendtArbeidstakerSkjemaDto, "metadata">;

const harVirksomhetssteg = (skjema: ReturnType<typeof lagSkjema>) =>
  getStegRekkefolge(skjema).some(
    ({ key }) => key === StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
  );

describe("getStegRekkefolge", () => {
  it.each([
    [Skjemadel.ARBEIDSGIVERS_DEL, false, true],
    [Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, false, true],
    [Skjemadel.ARBEIDSGIVERS_DEL, true, false],
    [Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, true, false],
  ])(
    "skjemadel %s og offentlig=%s gir virksomhetssteg=%s",
    (skjemadel, offentlig, forventet) => {
      expect(harVirksomhetssteg(lagSkjema(skjemadel, offentlig))).toBe(
        forventet,
      );
    },
  );

  it("endrer aldri arbeidstakerflyten eller grunnlisten", () => {
    const grunnliste = STEG_REKKEFOLGE[Skjemadel.ARBEIDSTAKERS_DEL];

    expect(
      getStegRekkefolge(lagSkjema(Skjemadel.ARBEIDSTAKERS_DEL, true)),
    ).toEqual(grunnliste);

    getStegRekkefolge(lagSkjema(Skjemadel.ARBEIDSGIVERS_DEL, true));
    expect(STEG_REKKEFOLGE[Skjemadel.ARBEIDSGIVERS_DEL]).toContainEqual(
      expect.objectContaining({
        key: StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
      }),
    );
  });
});
