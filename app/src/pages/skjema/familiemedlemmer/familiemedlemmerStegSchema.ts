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
      error:
        "familiemedlemmerSteg.duMaSvarePaOmFamiliemedlemmetHarNorskFodselsnummerEllerDnummer",
    }),
    fodselsnummer: z.string().optional(),
    fodselsdato: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.harNorskFodselsnummerEllerDnummer || !!data.fodselsnummer?.trim(),
    {
      error: "familiemedlemmerSteg.fodselsnummerErPakrevd",
      path: ["fodselsnummer"],
      when: () => true,
    },
  )
  .refine(
    (data) =>
      !data.harNorskFodselsnummerEllerDnummer ||
      !data.fodselsnummer?.trim() ||
      erGyldigFnrEllerDnr(data.fodselsnummer),
    {
      error: "felles.ugyldigFodselsnummerEllerDnummer",
      path: ["fodselsnummer"],
      when: () => true,
    },
  )
  .refine(
    (data) =>
      data.harNorskFodselsnummerEllerDnummer || !!data.fodselsdato?.trim(),
    {
      error: "familiemedlemmerSteg.fodselsdatoErPakrevd",
      path: ["fodselsdato"],
      when: () => true,
    },
  );

export const familiemedlemmerSchema = z
  .object({
    skalHaMedFamiliemedlemmer: z.boolean({
      error:
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
