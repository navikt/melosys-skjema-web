import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterSchema } from "~/components/virksomheter/virksomheterSchema.ts";

export const arbeidssituasjonSchema = z
  .object({
    harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.boolean().optional(),
    aktivitetIMaanedenFoerUtsendingen: z.string().optional(),
    skalJobbeForFlereVirksomheter: z.boolean().optional(),
    virksomheterArbeidstakerJobberForIutsendelsesPeriode:
      norskeOgUtenlandskeVirksomheterSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "arbeidssituasjonSteg.duMaSvarePaOmDuHarVertEllerSkalVareILonnetArbeidINorgeForUtsending",
        path: ["harVaertEllerSkalVaereILonnetArbeidFoerUtsending"],
      });
    }
    if (data.skalJobbeForFlereVirksomheter === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "arbeidssituasjonSteg.duMaSvarePaOmDuSkalJobbeForFlereVirksomheterIPerioden",
        path: ["skalJobbeForFlereVirksomheter"],
      });
    }

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
  })
  .transform((data) => ({
    harVaertEllerSkalVaereILonnetArbeidFoerUtsending:
      data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending!,
    skalJobbeForFlereVirksomheter: data.skalJobbeForFlereVirksomheter!,
    aktivitetIMaanedenFoerUtsendingen:
      data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending
        ? undefined
        : data.aktivitetIMaanedenFoerUtsendingen,
    virksomheterArbeidstakerJobberForIutsendelsesPeriode:
      data.skalJobbeForFlereVirksomheter
        ? data.virksomheterArbeidstakerJobberForIutsendelsesPeriode
        : undefined,
  }));
