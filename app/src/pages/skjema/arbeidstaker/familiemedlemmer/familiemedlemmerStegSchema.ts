import { z } from "zod";

const familiemedlemSchema = z.object({
  fornavn: z.string(),
  etternavn: z.string(),
  harNorskFodselsnummerEllerDnummer: z.boolean(),
  fodselsnummer: z.string().optional(),
  fodselsdato: z.string().optional(),
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
      ? data.familiemedlemmer
      : [],
  }));
