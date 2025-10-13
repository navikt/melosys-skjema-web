import { z } from "zod";

const baseFamiliemedlemmerSchema = z.object({
  sokerForBarnUnder18SomSkalVaereMed: z.boolean().nullish(),
  harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad: z
    .boolean()
    .nullish(),
});

type BaseFamiliemedlemmerFormData = z.infer<typeof baseFamiliemedlemmerSchema>;

function validerSokerForBarnUnder18Pakrevd(data: BaseFamiliemedlemmerFormData) {
  return (
    data.sokerForBarnUnder18SomSkalVaereMed !== undefined &&
    data.sokerForBarnUnder18SomSkalVaereMed !== null
  );
}

function validerHarEktefelleEllerBarnOver18Pakrevd(
  data: BaseFamiliemedlemmerFormData,
) {
  return (
    data.harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad !==
      undefined &&
    data.harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad !== null
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
