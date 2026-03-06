import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterSchema } from "~/components/virksomheter/virksomheterSchema.ts";

export const arbeidstakerensLonnSchema = z
  .object({
    arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z.boolean({
      error:
        "arbeidstakerenslonnSteg.duMaSvarePaOmDuBetalerAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden",
    }),
    virksomheterSomUtbetalerLonnOgNaturalytelser:
      norskeOgUtenlandskeVirksomheterSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden) {
      const v = data.virksomheterSomUtbetalerLonnOgNaturalytelser;
      const hasAny =
        (v?.norskeVirksomheter?.length ?? 0) > 0 ||
        (v?.utenlandskeVirksomheter?.length ?? 0) > 0;

      if (!hasAny) {
        ctx.addIssue({
          code: "custom",
          message:
            "arbeidstakerenslonnSteg.duMaLeggeTilMinstEnVirksomhetNarDuIkkeBetalerAllLonnSelv",
          path: ["virksomheterSomUtbetalerLonnOgNaturalytelser"],
        });
      }
    }
  })
  .transform((data) => ({
    ...data,
    virksomheterSomUtbetalerLonnOgNaturalytelser:
      data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden
        ? undefined
        : data.virksomheterSomUtbetalerLonnOgNaturalytelser,
  }));
