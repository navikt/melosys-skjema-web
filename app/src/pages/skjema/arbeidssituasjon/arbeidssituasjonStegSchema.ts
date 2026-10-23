import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterMedAnsettelsesformSchema } from "~/components/virksomheter/virksomheterSchema.ts";

/**
 * I arbeidstakerdelen for statsansatte stilles ikke spørsmålene om
 * lønnet arbeid og aktivitet før utsendingen.
 */
export const lagArbeidssituasjonSchema = ({
  statsansattFlyt,
}: {
  statsansattFlyt: boolean;
}) =>
  z
    .object({
      harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z
        .boolean({
          error:
            "arbeidssituasjonSteg.duMaSvarePaOmDuHarVertEllerSkalVareILonnetArbeidINorgeForUtsending",
        })
        .optional(),
      aktivitetIMaanedenFoerUtsendingen: z.string().optional(),
      skalJobbeForFlereVirksomheter: z.boolean({
        error:
          "arbeidssituasjonSteg.duMaSvarePaOmDuSkalJobbeForFlereVirksomheterIPerioden",
      }),
      virksomheterArbeidstakerJobberForIutsendelsesPeriode:
        norskeOgUtenlandskeVirksomheterMedAnsettelsesformSchema.optional(),
    })
    .refine(
      (data) =>
        statsansattFlyt ||
        data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending !== undefined,
      {
        error:
          "arbeidssituasjonSteg.duMaSvarePaOmDuHarVertEllerSkalVareILonnetArbeidINorgeForUtsending",
        path: ["harVaertEllerSkalVaereILonnetArbeidFoerUtsending"],
        when: () => true,
      },
    )
    .refine(
      (data) =>
        statsansattFlyt ||
        data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending !== false ||
        !!data.aktivitetIMaanedenFoerUtsendingen?.trim(),
      {
        error:
          "arbeidssituasjonSteg.duMaBeskriveAktivitetenNarDuIkkeHarVertILonnetArbeid",
        path: ["aktivitetIMaanedenFoerUtsendingen"],
        when: () => true,
      },
    )
    .refine(
      (data) => {
        if (!data.skalJobbeForFlereVirksomheter) return true;
        const v = data.virksomheterArbeidstakerJobberForIutsendelsesPeriode;
        return (
          (v?.norskeVirksomheter?.length ?? 0) > 0 ||
          (v?.utenlandskeVirksomheter?.length ?? 0) > 0
        );
      },
      {
        error:
          "arbeidssituasjonSteg.duMaLeggeTilMinstEnVirksomhetNarDuSkalJobbeForFlereVirksomheter",
        path: ["virksomheterArbeidstakerJobberForIutsendelsesPeriode"],
        when: () => true,
      },
    )
    .transform((data) => ({
      harVaertEllerSkalVaereILonnetArbeidFoerUtsending: statsansattFlyt
        ? undefined
        : data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending,
      skalJobbeForFlereVirksomheter: data.skalJobbeForFlereVirksomheter,
      aktivitetIMaanedenFoerUtsendingen:
        statsansattFlyt || data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending
          ? undefined
          : data.aktivitetIMaanedenFoerUtsendingen,
      virksomheterArbeidstakerJobberForIutsendelsesPeriode:
        data.skalJobbeForFlereVirksomheter
          ? data.virksomheterArbeidstakerJobberForIutsendelsesPeriode
          : undefined,
    }));

export const arbeidssituasjonSchema = lagArbeidssituasjonSchema({
  statsansattFlyt: false,
});
