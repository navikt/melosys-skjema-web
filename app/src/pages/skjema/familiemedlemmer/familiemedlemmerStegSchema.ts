import { z } from "zod";

export const familiemedlemmerSchema = z
  .object({
    skalHaMedFamiliemedlemmer: z.boolean({
      error:
        "familiemedlemmerSteg.duMaSvarePaOmDuHarFamiliemedlemmerSomSkalVaereMed",
    }),
  })
  .transform((data) => ({
    ...data,
    familiemedlemmer: [],
  }));
