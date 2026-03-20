import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterMedAnsettelsesformSchema } from "~/components/virksomheter/virksomheterSchema.ts";

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
      norskeOgUtenlandskeVirksomheterMedAnsettelsesformSchema.optional(),
  })
  .refine(
    (data) =>
      data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending ||
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
