import { z } from "zod";

const baseFamiliemedlemmerSchema = z.object({
  sokerForBarnUnder18SomSkalVaereMed: z.boolean({
    message:
      "familiemedlemmerSteg.duMaSvarePaOmDuSokerForBarnUnder18SomSkalVaereMed",
  }),
  harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad: z.boolean({
    message:
      "familiemedlemmerSteg.duMaSvarePaOmDuHarEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad",
  }),
});

export const familiemedlemmerSchema = baseFamiliemedlemmerSchema;
