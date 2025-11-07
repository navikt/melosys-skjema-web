import { z } from "zod";

const baseFamiliemedlemmerSchema = z.object({
  sokerForBarnUnder18SomSkalVaereMed: z.boolean().optional(),
  harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad: z
    .boolean()
    .optional(),
});

type BaseFamiliemedlemmerFormData = z.infer<typeof baseFamiliemedlemmerSchema>;

function validerSokerForBarnUnder18Pakrevd(data: BaseFamiliemedlemmerFormData) {
  return data.sokerForBarnUnder18SomSkalVaereMed !== undefined;
}

function validerHarEktefelleEllerBarnOver18Pakrevd(
  data: BaseFamiliemedlemmerFormData,
) {
  return (
    data.harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad !==
    undefined
  );
}

export const familiemedlemmerSchema = baseFamiliemedlemmerSchema
  .refine(validerSokerForBarnUnder18Pakrevd, {
    message:
      "familiemedlemmerSteg.duMaSvarePaOmDuSokerForBarnUnder18SomSkalVaereMed",
    path: ["sokerForBarnUnder18SomSkalVaereMed"],
  })
  .refine(validerHarEktefelleEllerBarnOver18Pakrevd, {
    message:
      "familiemedlemmerSteg.duMaSvarePaOmDuHarEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad",
    path: ["harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad"],
  });
