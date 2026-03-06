import { z } from "zod";

import { erGyldigFnrEllerDnr } from "~/utils/valideringUtils.ts";

export const familiemedlemSchema = z
  .object({
    fornavn: z.string().trim().min(1, "familiemedlemmerSteg.fornavnErPakrevd"),
    etternavn: z
      .string()
      .trim()
      .min(1, "familiemedlemmerSteg.etternavnErPakrevd"),
    harNorskFodselsnummerEllerDnummer: z.boolean({
      message:
        "familiemedlemmerSteg.duMaSvarePaOmFamiliemedlemmetHarNorskFodselsnummerEllerDnummer",
    }),
    fodselsnummer: z.string().optional(),
    fodselsdato: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.harNorskFodselsnummerEllerDnummer) {
      if (!data.fodselsnummer?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "familiemedlemmerSteg.fodselsnummerErPakrevd",
          path: ["fodselsnummer"],
        });
      } else if (!erGyldigFnrEllerDnr(data.fodselsnummer)) {
        ctx.addIssue({
          code: "custom",
          message: "felles.ugyldigFodselsnummerEllerDnummer",
          path: ["fodselsnummer"],
        });
      }
    } else {
      if (!data.fodselsdato?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "familiemedlemmerSteg.fodselsdatoErPakrevd",
          path: ["fodselsdato"],
        });
      }
    }
  });

export const familiemedlemmerSchema = z
  .object({
    skalHaMedFamiliemedlemmer: z.boolean({
      message:
        "familiemedlemmerSteg.duMaSvarePaOmDuHarFamiliemedlemmerSomSkalVaereMed",
    }),
    familiemedlemmer: z.array(familiemedlemSchema).default([]),
  })
  .transform((data) => ({
    skalHaMedFamiliemedlemmer: data.skalHaMedFamiliemedlemmer,
    familiemedlemmer: data.skalHaMedFamiliemedlemmer
      ? data.familiemedlemmer.map((medlem) => ({
          ...medlem,
          fodselsnummer: medlem.harNorskFodselsnummerEllerDnummer
            ? medlem.fodselsnummer
            : undefined,
          fodselsdato: medlem.harNorskFodselsnummerEllerDnummer
            ? undefined
            : medlem.fodselsdato,
        }))
      : [],
  }));
