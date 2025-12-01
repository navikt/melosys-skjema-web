import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterSchema } from "~/components/virksomheter/virksomheterSchema.ts";

export const arbeidssituasjonSchema = z
  .object({
    harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.boolean({
      error:
        "arbeidssituasjonSteg.duMaSvarePaOmDuHarVertEllerSkalVareILonnetArbeidINorgeForUtsending",
    }),
    aktivitetIMaanedenFoerUtsendingen: z.string().optional(),
    skalJobbeForFlereVirksomheter: z.boolean({
      error:
        "arbeidssituasjonSteg.duMaSvarePaOmDuSkalJobbeForFlereVirksomheterIPerioden",
    }),
    virksomheterArbeidstakerJobberForIutsendelsesPeriode:
      norskeOgUtenlandskeVirksomheterSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending &&
      !data.aktivitetIMaanedenFoerUtsendingen?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "arbeidssituasjonSteg.duMaBeskriveAktivitetenNarDuIkkeHarVertILonnetArbeid",
        path: ["aktivitetIMaanedenFoerUtsendingen"],
      });
    }

    if (data.skalJobbeForFlereVirksomheter) {
      const v = data.virksomheterArbeidstakerJobberForIutsendelsesPeriode;
      const hasAny =
        (v?.norskeVirksomheter?.length ?? 0) > 0 ||
        (v?.utenlandskeVirksomheter?.length ?? 0) > 0;

      if (!hasAny) {
        ctx.addIssue({
          code: "custom",
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
    aktivitetIMaanedenFoerUtsendingen:
      data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending
        ? undefined
        : data.aktivitetIMaanedenFoerUtsendingen,
    virksomheterArbeidstakerJobberForIutsendelsesPeriode:
      data.skalJobbeForFlereVirksomheter
        ? data.virksomheterArbeidstakerJobberForIutsendelsesPeriode
        : undefined,
  }));
