import { describe, expect, it } from "vitest";

import { StegKey } from "~/constants/stegKeys.ts";
import {
  ARBEIDSGIVER_IKON,
  ARBEIDSTAKER_IKON,
  getStegRekkefolge,
  STEG_REKKEFOLGE,
} from "~/pages/skjema/stegRekkefølge.ts";
import {
  type FlytGrunnlag,
  getUtsendtArbeidstakerFlyt,
} from "~/pages/skjema/utsendtArbeidstakerFlyt.ts";
import {
  LandKode,
  Skjemadel,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";

const lagSkjema = (
  skjemadel: Skjemadel,
  erStatligArbeidsgiver?: boolean,
  harArbeidsforholdIAareg?: boolean,
  forhandsutfyltFraArbeidsgiver = false,
) =>
  ({
    metadata: { skjemadel, erStatligArbeidsgiver, harArbeidsforholdIAareg },
    motpartensUtsendingsperiodeOgLand: forhandsutfyltFraArbeidsgiver
      ? {
          utsendelseLand: LandKode.SE,
          utsendelsePeriode: { fraDato: "2026-01-01", tilDato: "2026-12-31" },
        }
      : undefined,
  }) as FlytGrunnlag & Pick<UtsendtArbeidstakerSkjemaDto, "metadata">;

const stegKeys = (skjema: FlytGrunnlag) =>
  getStegRekkefolge(skjema).map(({ key }) => key);

const harVirksomhetssteg = (skjema: FlytGrunnlag) =>
  stegKeys(skjema).includes(StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE);

describe("getStegRekkefolge", () => {
  it.each([
    [Skjemadel.ARBEIDSGIVERS_DEL, false],
    [Skjemadel.ARBEIDSGIVERS_DEL, true],
    [Skjemadel.ARBEIDSTAKERS_DEL, false],
    [Skjemadel.ARBEIDSTAKERS_DEL, true],
  ])(
    "viser ingen stegikoner i skjemadel %s med statlig=%s",
    (skjemadel, statlig) => {
      const steg = getStegRekkefolge(lagSkjema(skjemadel, statlig, true));

      expect(steg.every(({ icon }) => icon === undefined)).toBe(true);
    },
  );

  it("beholder rolleikonene kun på delspesifikke steg i kombinert skjema", () => {
    const steg = getStegRekkefolge(
      lagSkjema(Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, false),
    );

    expect(
      steg
        .filter(({ icon }) => icon === ARBEIDSGIVER_IKON)
        .map(({ key }) => key),
    ).toEqual([
      StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
      StegKey.UTENLANDSOPPDRAGET,
      StegKey.ARBEIDSSTED_I_UTLANDET,
      StegKey.ARBEIDSTAKERENS_LONN,
    ]);
    expect(
      steg
        .filter(({ icon }) => icon === ARBEIDSTAKER_IKON)
        .map(({ key }) => key),
    ).toEqual([
      StegKey.ARBEIDSSITUASJON,
      StegKey.SKATTEFORHOLD_OG_INNTEKT,
      StegKey.FAMILIEMEDLEMMER,
    ]);
    expect(steg.filter(({ icon }) => !icon).map(({ key }) => key)).toEqual([
      StegKey.UTSENDINGSPERIODE_OG_LAND,
      StegKey.TILLEGGSOPPLYSNINGER,
      StegKey.VEDLEGG,
      StegKey.OPPSUMMERING,
    ]);
  });

  it.each([
    [Skjemadel.ARBEIDSGIVERS_DEL, false, true],
    [Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, false, true],
    [Skjemadel.ARBEIDSGIVERS_DEL, true, false],
    [Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, true, false],
  ])(
    "skjemadel %s og statlig=%s gir virksomhetssteg=%s",
    (skjemadel, statlig, forventet) => {
      expect(harVirksomhetssteg(lagSkjema(skjemadel, statlig))).toBe(forventet);
    },
  );

  it.each([
    [Skjemadel.ARBEIDSGIVERS_DEL, false, true],
    [Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, false, true],
    [Skjemadel.ARBEIDSGIVERS_DEL, true, false],
    [Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, true, false],
  ])(
    "skjemadel %s og statlig=%s gir utenlandsoppdraget=%s",
    (skjemadel, statlig, forventet) => {
      expect(
        stegKeys(lagSkjema(skjemadel, statlig, true)).includes(
          StegKey.UTENLANDSOPPDRAGET,
        ),
      ).toBe(forventet);
    },
  );

  it("gir statlig arbeidsgiver periode, arbeidssted og lønn i arbeidsgivers del", () => {
    expect(stegKeys(lagSkjema(Skjemadel.ARBEIDSGIVERS_DEL, true))).toEqual([
      StegKey.UTSENDINGSPERIODE_OG_LAND,
      StegKey.ARBEIDSSTED_I_UTLANDET,
      StegKey.ARBEIDSTAKERENS_LONN,
      StegKey.TILLEGGSOPPLYSNINGER,
      StegKey.VEDLEGG,
      StegKey.OPPSUMMERING,
    ]);
  });

  it("legger arbeidssted etter arbeidssituasjon når statsansatt sender først", () => {
    expect(
      stegKeys(lagSkjema(Skjemadel.ARBEIDSTAKERS_DEL, true, true)),
    ).toEqual([
      StegKey.UTSENDINGSPERIODE_OG_LAND,
      StegKey.ARBEIDSSITUASJON,
      StegKey.ARBEIDSSTED_I_UTLANDET,
      StegKey.SKATTEFORHOLD_OG_INNTEKT,
      StegKey.FAMILIEMEDLEMMER,
      StegKey.TILLEGGSOPPLYSNINGER,
      StegKey.VEDLEGG,
      StegKey.OPPSUMMERING,
    ]);
  });

  it.each([
    ["arbeidsgiver har sendt først", true, true, true],
    ["ingen treff i AAREG", true, false, false],
    ["ikke-statlig arbeidsgiver", false, true, false],
  ])(
    "gir vanlig arbeidstakerflyt når %s",
    (_, statlig, harAareg, forhandsutfylt) => {
      expect(
        getStegRekkefolge(
          lagSkjema(
            Skjemadel.ARBEIDSTAKERS_DEL,
            statlig,
            harAareg,
            forhandsutfylt,
          ),
        ),
      ).toEqual(STEG_REKKEFOLGE[Skjemadel.ARBEIDSTAKERS_DEL]);
    },
  );

  it("endrer aldri grunnlistene", () => {
    getStegRekkefolge(lagSkjema(Skjemadel.ARBEIDSGIVERS_DEL, true));
    getStegRekkefolge(lagSkjema(Skjemadel.ARBEIDSTAKERS_DEL, true, true));

    expect(STEG_REKKEFOLGE[Skjemadel.ARBEIDSGIVERS_DEL]).toContainEqual(
      expect.objectContaining({
        key: StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
      }),
    );
    expect(
      STEG_REKKEFOLGE[Skjemadel.ARBEIDSTAKERS_DEL].map(({ key }) => key),
    ).not.toContain(StegKey.ARBEIDSSTED_I_UTLANDET);
  });
});

describe("getUtsendtArbeidstakerFlyt", () => {
  it.each([
    [Skjemadel.ARBEIDSTAKERS_DEL, true, undefined, true],
    [Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, true, undefined, true],
    [Skjemadel.ARBEIDSGIVERS_DEL, true, undefined, false],
    [Skjemadel.ARBEIDSTAKERS_DEL, false, undefined, false],
    [Skjemadel.ARBEIDSTAKERS_DEL, true, false, false],
    [Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, true, true, false],
  ])(
    "skjemadel %s, statlig=%s og AAREG=%s gir ukjent flyt=%s",
    (skjemadel, statlig, harAareg, forventet) => {
      expect(
        getUtsendtArbeidstakerFlyt(lagSkjema(skjemadel, statlig, harAareg))
          .flytenErUkjent,
      ).toBe(forventet);
    },
  );

  it("tilpasser arbeidstakerdelen til statsansattflyten i kombinert skjema", () => {
    expect(
      getUtsendtArbeidstakerFlyt(
        lagSkjema(Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL, true, true),
      ),
    ).toEqual({
      utenlandsoppdragetSkalOppgis: false,
      arbeidsstedSkalOppgis: true,
      arbeidsstedForStatsansatt: true,
      arbeidstakerdelForStatsansatt: true,
      lonnOppgisISkatteforhold: false,
      flytenErUkjent: false,
    });
  });

  it("lar statsansatt som sender først oppgi arbeidssted og lønn", () => {
    expect(
      getUtsendtArbeidstakerFlyt(
        lagSkjema(Skjemadel.ARBEIDSTAKERS_DEL, true, true),
      ),
    ).toEqual({
      utenlandsoppdragetSkalOppgis: false,
      arbeidsstedSkalOppgis: true,
      arbeidsstedForStatsansatt: true,
      arbeidstakerdelForStatsansatt: true,
      lonnOppgisISkatteforhold: true,
      flytenErUkjent: false,
    });
  });

  it("reduserer arbeidstakerdelen uten arbeidssted og lønn når arbeidsgiver har sendt først", () => {
    const flyt = getUtsendtArbeidstakerFlyt(
      lagSkjema(Skjemadel.ARBEIDSTAKERS_DEL, true, true, true),
    );
    expect(flyt.arbeidstakerdelForStatsansatt).toBe(true);
    expect(flyt.arbeidsstedSkalOppgis).toBe(false);
    expect(flyt.lonnOppgisISkatteforhold).toBe(false);
  });
});
