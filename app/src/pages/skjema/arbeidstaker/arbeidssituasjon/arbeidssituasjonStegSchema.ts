import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterSchema } from "~/components/virksomheter/virksomheterSchema.ts";

const baseArbeidssituasjonSchema = z.object({
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.boolean(),
  aktivitetIMaanedenFoerUtsendingen: z.string().optional(),
  skalJobbeForFlereVirksomheter: z.boolean(),
  virksomheterArbeidstakerJobberForIutsendelsesPeriode:
    norskeOgUtenlandskeVirksomheterSchema.optional(),
});

export const arbeidssituasjonSchema = baseArbeidssituasjonSchema.superRefine(
  (data, ctx) => {
    if (
      data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending === false &&
      !data.aktivitetIMaanedenFoerUtsendingen?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "arbeidssituasjonSteg.duMaBeskriveAktivitetenNarDuIkkeHarVertILonnetArbeid",
        path: ["aktivitetIMaanedenFoerUtsendingen"],
      });
    }

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
  },
);
