import { z } from "zod";

export const vedleggStegSchema = z.object({
  harAnnenDokumentasjon: z.boolean({
    error: "vedleggSteg.duMaSvarePaOmDuHarAnnenDokumentasjon",
  }),
});
