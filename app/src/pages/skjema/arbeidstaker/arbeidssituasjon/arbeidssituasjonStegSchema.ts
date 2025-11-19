import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterSchema } from "~/components/virksomheter/virksomheterSchema.ts";

const harVertILonnetArbeidSchema = z.object({
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.literal(true),
  skalJobbeForFlereVirksomheter: z.boolean(),
  virksomheterArbeidstakerJobberForIutsendelsesPeriode:
    norskeOgUtenlandskeVirksomheterSchema.optional(),
});

const harIkkeVertILonnetArbeidSchema = z.object({
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.literal(false),
  aktivitetIMaanedenFoerUtsendingen: z
    .string()
    .min(
      1,
      "arbeidssituasjonSteg.duMaBeskriveAktivitetenNarDuIkkeHarVertILonnetArbeid",
    ),
  skalJobbeForFlereVirksomheter: z.boolean(),
  virksomheterArbeidstakerJobberForIutsendelsesPeriode:
    norskeOgUtenlandskeVirksomheterSchema.optional(),
});

export const arbeidssituasjonSchema = z
  .discriminatedUnion("harVaertEllerSkalVaereILonnetArbeidFoerUtsending", [
    harVertILonnetArbeidSchema,
    harIkkeVertILonnetArbeidSchema,
  ])
  .superRefine((data, ctx) => {
    if (data.skalJobbeForFlereVirksomheter === true) {
      const v = data.virksomheterArbeidstakerJobberForIutsendelsesPeriode;
      const hasAny =
        (v?.norskeVirksomheter?.length ?? 0) > 0 ||
        (v?.utenlandskeVirksomheter?.length ?? 0) > 0;

      if (!hasAny) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "arbeidssituasjonSteg.duMaLeggeTilMinstEnVirksomhetNarDuSkalJobbeForFlereVirksomheter",
          path: ["virksomheterArbeidstakerJobberForIutsendelsesPeriode"],
        });
      }
    }
  })
  .transform((data) => ({
    harVaertEllerSkalVaereILonnetArbeidFoerUtsending:
      data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending,
    skalJobbeForFlereVirksomheter: data.skalJobbeForFlereVirksomheter,
    // Clear activity description when user has been in paid work
    aktivitetIMaanedenFoerUtsendingen:
      data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending
        ? undefined
        : data.aktivitetIMaanedenFoerUtsendingen,
    // Clear companies list when user will not work for multiple companies
    virksomheterArbeidstakerJobberForIutsendelsesPeriode:
      data.skalJobbeForFlereVirksomheter
        ? data.virksomheterArbeidstakerJobberForIutsendelsesPeriode
        : undefined,
  }));
