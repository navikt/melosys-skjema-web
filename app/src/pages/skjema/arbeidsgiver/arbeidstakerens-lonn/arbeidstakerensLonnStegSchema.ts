import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterSchema } from "~/components/virksomheter/virksomheterSchema.ts";

// Discriminated union approach - clean and direct validation
const arbeidsgiverBetalerAlleLonnSchema = z.object({
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z.literal(true),
});

const andreBetalerLonnSchema = z.object({
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: z.literal(false),
  virksomheterSomUtbetalerLonnOgNaturalytelser: norskeOgUtenlandskeVirksomheterSchema,
}).refine(
  (data) => {
    const harNorskeVirksomheter =
      data.virksomheterSomUtbetalerLonnOgNaturalytelser.norskeVirksomheter &&
      data.virksomheterSomUtbetalerLonnOgNaturalytelser.norskeVirksomheter.length > 0;
    const harUtenlandskeVirksomheter =
      data.virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter &&
      data.virksomheterSomUtbetalerLonnOgNaturalytelser.utenlandskeVirksomheter.length > 0;
    return harNorskeVirksomheter || harUtenlandskeVirksomheter;
  },
  {
    message: "arbeidstakerenslonnSteg.duMaLeggeTilMinstEnVirksomhetNarDuIkkeBetalerAllLonnSelv",
    path: ["virksomheterSomUtbetalerLonnOgNaturalytelser"],
  }
);

export const arbeidstakerensLonnSchema = z
  .discriminatedUnion("arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden", [
    arbeidsgiverBetalerAlleLonnSchema,
    andreBetalerLonnSchema,
  ])
  .transform((data) => ({
    arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden:
      data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden,
    virksomheterSomUtbetalerLonnOgNaturalytelser:
      data.arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden
        ? undefined
        : data.virksomheterSomUtbetalerLonnOgNaturalytelser,
  }));
