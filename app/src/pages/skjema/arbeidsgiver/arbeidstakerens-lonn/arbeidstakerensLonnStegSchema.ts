import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterSchema } from "~/components/virksomheter/virksomheterSchema.ts";

const arbeidsgiverBetalerAllLonnSchema = z.object({
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z.literal(true),
});

const arbeidsgiverBetalerIkkeAllLonnSchema = z.object({
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z.literal(false),
  virksomheterSomUtbetalerLonnOgNaturalytelser:
    norskeOgUtenlandskeVirksomheterSchema.optional(),
});

export const arbeidstakerensLonnSchema = z
  .discriminatedUnion(
    "arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden",
    [arbeidsgiverBetalerAllLonnSchema, arbeidsgiverBetalerIkkeAllLonnSchema],
  )
  .superRefine((data, ctx) => {
    if (!data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden) {
      const v = data.virksomheterSomUtbetalerLonnOgNaturalytelser;
      const hasAny =
        (v?.norskeVirksomheter?.length ?? 0) > 0 ||
        (v?.utenlandskeVirksomheter?.length ?? 0) > 0;

      if (!hasAny) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "arbeidstakerenslonnSteg.duMaLeggeTilMinstEnVirksomhetNarDuIkkeBetalerAllLonnSelv",
          path: ["virksomheterSomUtbetalerLonnOgNaturalytelser"],
        });
      }
    }
  });
