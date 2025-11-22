import { z } from "zod";

export const familiemedlemmerSchema = z.object({
  sokerForBarnUnder18SomSkalVaereMed: z.boolean({
    message:
      "familiemedlemmerSteg.duMaSvarePaOmDuSokerForBarnUnder18SomSkalVaereMed",
  }),
  harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad: z.boolean({
    message:
      "familiemedlemmerSteg.duMaSvarePaOmDuHarEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad",
  }),
});
