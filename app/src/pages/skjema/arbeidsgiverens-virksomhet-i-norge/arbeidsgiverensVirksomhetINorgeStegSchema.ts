import { z } from "zod";

/**
 * Foretak med færre ansatte enn dette (eller bemannings-/vikarbyråer) må oppgi
 * opplysninger om foretakets samlede virksomhet.
 * Må holdes i synk med ANSATTGRENSE_SAMLET_VIRKSOMHET i melosys-skjema-api.
 */
export const ANSATTGRENSE_SAMLET_VIRKSOMHET = 20;

export function skalOppgiSamletVirksomhet(
  antallAnsatte: number | undefined,
  erBemanningsEllerVikarbyraa: boolean | undefined,
): boolean {
  return (
    erBemanningsEllerVikarbyraa === true ||
    (antallAnsatte !== undefined &&
      antallAnsatte < ANSATTGRENSE_SAMLET_VIRKSOMHET)
  );
}

export const ANTALLFELTER = [
  "antallAdministrativtAnsatte",
  "antallUtsendteArbeidstakere",
] as const;

export const ANDELFELTER = [
  "andelAnsatteRekruttertINorge",
  "andelOmsetningINorge",
  "andelOppdragUtfortINorge",
  "andelOppdragskontrakterInngattINorge",
] as const;

export type SamletVirksomhetFelt =
  (typeof ANTALLFELTER)[number] | (typeof ANDELFELTER)[number];

const PAKREVD_FEILMELDING: Record<SamletVirksomhetFelt, string> = {
  antallAdministrativtAnsatte:
    "arbeidsgiverensVirksomhetINorgeSteg.duMaOppgiAntallAdministrativtAnsatte",
  antallUtsendteArbeidstakere:
    "arbeidsgiverensVirksomhetINorgeSteg.duMaOppgiAntallUtsendteArbeidstakere",
  andelAnsatteRekruttertINorge:
    "arbeidsgiverensVirksomhetINorgeSteg.duMaOppgiAndelAnsatteRekruttertINorge",
  andelOmsetningINorge:
    "arbeidsgiverensVirksomhetINorgeSteg.duMaOppgiAndelOmsetningINorge",
  andelOppdragUtfortINorge:
    "arbeidsgiverensVirksomhetINorgeSteg.duMaOppgiAndelOppdragUtfortINorge",
  andelOppdragskontrakterInngattINorge:
    "arbeidsgiverensVirksomhetINorgeSteg.duMaOppgiAndelOppdragskontrakterInngattINorge",
};

function normaliser(verdi: string | undefined): string {
  return (verdi ?? "").replaceAll(/[\s%]/g, "");
}

function tilHeltall(verdi: string | undefined): number | undefined {
  const normalisert = normaliser(verdi);
  return /^\d+$/.test(normalisert) ? Number(normalisert) : undefined;
}

export function tallTilFeltverdi(verdi: number | null | undefined): string {
  return verdi === undefined || verdi === null ? "" : String(verdi);
}

const baseSchema = z.object({
  erArbeidsgiverenBemanningsEllerVikarbyraa: z.boolean({
    error:
      "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra",
  }),
  opprettholderArbeidsgiverenVanligDrift: z.boolean().optional(),
  antallAdministrativtAnsatte: z.string().optional(),
  antallUtsendteArbeidstakere: z.string().optional(),
  andelAnsatteRekruttertINorge: z.string().optional(),
  andelOmsetningINorge: z.string().optional(),
  andelOppdragUtfortINorge: z.string().optional(),
  andelOppdragskontrakterInngattINorge: z.string().optional(),
});

type SchemaInput = z.input<typeof baseSchema>;

export function lagArbeidsgiverensVirksomhetSchema(
  antallAnsatte: number | undefined,
) {
  const skalOppgi = (data: SchemaInput) =>
    skalOppgiSamletVirksomhet(
      antallAnsatte,
      data.erArbeidsgiverenBemanningsEllerVikarbyraa,
    );

  return baseSchema
    .superRefine(
      (data, context) => {
        if (
          !skalOppgi(data) &&
          data.opprettholderArbeidsgiverenVanligDrift === undefined
        ) {
          context.addIssue({
            code: "custom",
            message:
              "arbeidsgiverensVirksomhetINorgeSteg.duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge",
            path: ["opprettholderArbeidsgiverenVanligDrift"],
          });
        }
        if (!skalOppgi(data)) return;

        for (const felt of [...ANTALLFELTER, ...ANDELFELTER]) {
          const verdi = normaliser(data[felt]);
          const erAndel = (ANDELFELTER as readonly string[]).includes(felt);
          const tall = tilHeltall(verdi);

          if (verdi === "") {
            context.addIssue({
              code: "custom",
              message: PAKREVD_FEILMELDING[felt],
              path: [felt],
            });
          } else if (erAndel && (tall === undefined || tall > 100)) {
            context.addIssue({
              code: "custom",
              message:
                "arbeidsgiverensVirksomhetINorgeSteg.andelMaVaereEtHeltallMellom0Og100",
              path: [felt],
            });
          } else if (tall === undefined) {
            context.addIssue({
              code: "custom",
              message:
                "arbeidsgiverensVirksomhetINorgeSteg.antallMaVaereEtHeltallSomErNullEllerMer",
              path: [felt],
            });
          }
        }
      },
      { when: () => true },
    )
    .transform((data) => {
      const medSamletVirksomhet = skalOppgi(data);
      const tall = (felt: SamletVirksomhetFelt) =>
        medSamletVirksomhet ? tilHeltall(data[felt]) : undefined;

      return {
        erArbeidsgiverenBemanningsEllerVikarbyraa:
          data.erArbeidsgiverenBemanningsEllerVikarbyraa,
        opprettholderArbeidsgiverenVanligDrift: medSamletVirksomhet
          ? undefined
          : data.opprettholderArbeidsgiverenVanligDrift,
        antallAdministrativtAnsatte: tall("antallAdministrativtAnsatte"),
        antallUtsendteArbeidstakere: tall("antallUtsendteArbeidstakere"),
        andelAnsatteRekruttertINorge: tall("andelAnsatteRekruttertINorge"),
        andelOmsetningINorge: tall("andelOmsetningINorge"),
        andelOppdragUtfortINorge: tall("andelOppdragUtfortINorge"),
        andelOppdragskontrakterInngattINorge: tall(
          "andelOppdragskontrakterInngattINorge",
        ),
      };
    });
}
