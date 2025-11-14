import { z } from "zod";

import { norskeOgUtenlandskeVirksomheterSchema } from "~/components/virksomheter/virksomheterSchema.ts";

const baseArbeidssituasjonSchema = z.object({
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.boolean().optional(),
  aktivitetIMaanedenFoerUtsendingen: z.string().optional(),
  skalJobbeForFlereVirksomheter: z.boolean().optional(),
  virksomheterArbeidstakerJobberForIutsendelsesPeriode:
    norskeOgUtenlandskeVirksomheterSchema.optional(),
});

type BaseArbeidssituasjonFormData = z.infer<typeof baseArbeidssituasjonSchema>;

function validerHarVaertEllerSkalVaereILonnetArbeidFoerUtsendingerPakrevd(
  data: BaseArbeidssituasjonFormData,
) {
  return data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending !== undefined;
}

function validerSkalJobbeForFlereVirksomheterPakrevd(
  data: BaseArbeidssituasjonFormData,
) {
  return data.skalJobbeForFlereVirksomheter !== undefined;
}

function validerAktivitetBeskrivelse(data: BaseArbeidssituasjonFormData) {
  if (data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending) {
    return true;
  }

  return (
    data.aktivitetIMaanedenFoerUtsendingen &&
    data.aktivitetIMaanedenFoerUtsendingen.trim().length > 0
  );
}

function validerVirksomheterPakrevd(data: BaseArbeidssituasjonFormData) {
  if (data.skalJobbeForFlereVirksomheter) {
    const harNorskeVirksomheter =
      data.virksomheterArbeidstakerJobberForIutsendelsesPeriode
        ?.norskeVirksomheter &&
      data.virksomheterArbeidstakerJobberForIutsendelsesPeriode
        .norskeVirksomheter.length > 0;
    const harUtenlandskeVirksomheter =
      data.virksomheterArbeidstakerJobberForIutsendelsesPeriode
        ?.utenlandskeVirksomheter &&
      data.virksomheterArbeidstakerJobberForIutsendelsesPeriode
        .utenlandskeVirksomheter.length > 0;

    return harNorskeVirksomheter || harUtenlandskeVirksomheter;
  }
  return true;
}

export const arbeidssituasjonSchema = baseArbeidssituasjonSchema
  .refine(validerHarVaertEllerSkalVaereILonnetArbeidFoerUtsendingerPakrevd, {
    message:
      "arbeidssituasjonSteg.duMaSvarePaOmDuHarVertEllerSkalVareILonnetArbeidINorgeForUtsending",
    path: ["harVaertEllerSkalVaereILonnetArbeidFoerUtsending"],
  })
  .refine(validerSkalJobbeForFlereVirksomheterPakrevd, {
    message:
      "arbeidssituasjonSteg.duMaSvarePaOmDuSkalJobbeForFlereVirksomheterIPerioden",
    path: ["skalJobbeForFlereVirksomheter"],
  })
  .refine(validerAktivitetBeskrivelse, {
    message:
      "arbeidssituasjonSteg.duMaBeskriveAktivitetenNarDuIkkeHarVertILonnetArbeid",
    path: ["aktivitetIMaanedenFoerUtsendingen"],
  })
  .refine(validerVirksomheterPakrevd, {
    message:
      "arbeidssituasjonSteg.duMaLeggeTilMinstEnVirksomhetNarDuSkalJobbeForFlereVirksomheter",
    path: ["virksomheterArbeidstakerJobberForIutsendelsesPeriode"],
  })
  .transform((data) => ({
    ...data,
    // Clear aktivitet field when harVaertEllerSkalVaereILonnetArbeidFoerUtsending is true
    aktivitetIMaanedenFoerUtsendingen:
      data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending
        ? undefined
        : data.aktivitetIMaanedenFoerUtsendingen,
    // Clear virksomheter field when skalJobbeForFlereVirksomheter is false
    virksomheterArbeidstakerJobberForIutsendelsesPeriode:
      data.skalJobbeForFlereVirksomheter
        ? data.virksomheterArbeidstakerJobberForIutsendelsesPeriode
        : undefined,
  }));
