import { z } from "zod";

export const AKTIVITET_OPTIONS = [
  { value: "studier", labelKey: "arbeidstakerenSteg.studier" },
  { value: "ferie", labelKey: "arbeidstakerenSteg.ferie" },
  {
    value: "selvstendig-virksomhet",
    labelKey: "arbeidstakerenSteg.selvstendingVirksomhet",
  },
  {
    value: "kontantytelse-fra-nav",
    labelKey: "arbeidstakerenSteg.kontantytelseFraNav",
  },
] as const;

const norskVirksomhetSchema = z.object({
  organisasjonsnummer: z
    .string({
      message: "generellValidering.organisasjonsnummerErPakrevd",
    })
    .min(1, {
      message: "generellValidering.organisasjonsnummerErPakrevd",
    })
    .regex(/^\d{9}$/, {
      message: "generellValidering.organisasjonsnummerMaVare9Siffer",
    }),
});

const utenlandskVirksomhetSchema = z.object({
  navn: z
    .string({
      message: "generellValidering.navnPaVirksomhetErPakrevd",
    })
    .min(1, {
      message: "generellValidering.navnPaVirksomhetErPakrevd",
    }),
  organisasjonsnummer: z.string().optional(),
  vegnavnOgHusnummer: z
    .string({
      message: "generellValidering.vegnavnOgHusnummerErPakrevd",
    })
    .min(1, {
      message: "generellValidering.vegnavnOgHusnummerErPakrevd",
    }),
  bygning: z.string().optional(),
  postkode: z.string().optional(),
  byStedsnavn: z.string().optional(),
  region: z.string().optional(),
  land: z
    .string({
      message: "generellValidering.landErPakrevd",
    })
    .min(1, {
      message: "generellValidering.landErPakrevd",
    }),
  tilhorerSammeKonsern: z.boolean({
    message: "generellValidering.duMaSvarePaOmVirksomhetenTilhorerSammeKonsern",
  }),
});

const baseArbeidstakerSchema = z.object({
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.boolean().optional(),
  aktivitetIMaanedenFoerUtsendingen: z.string().optional(),
  skalJobbeForFlereVirksomheter: z.boolean().optional(),
  virksomheterArbeidstakerJobberForIutsendelsesPeriode: z
    .object({
      norskeVirksomheter: z.array(norskVirksomhetSchema).optional(),
      utenlandskeVirksomheter: z.array(utenlandskVirksomhetSchema).optional(),
    })
    .optional(),
  harNorskFodselsnummer: z.boolean().optional(),
  fodselsnummer: z.string().optional(),
  fornavn: z.string().optional(),
  etternavn: z.string().optional(),
  fodselsdato: z.string().optional(),
});

type BaseArbeidstakerFormData = z.infer<typeof baseArbeidstakerSchema>;

function validerFodselsdato(data: BaseArbeidstakerFormData) {
  if (!data.harNorskFodselsnummer) {
    return data.fodselsdato && data.fodselsdato.length > 0;
  }
  return true;
}

function validerEtternavn(data: BaseArbeidstakerFormData) {
  if (!data.harNorskFodselsnummer) {
    return data.etternavn && data.etternavn.length >= 2;
  }
  return true;
}

function validerFodselsnummer(data: BaseArbeidstakerFormData) {
  if (data.harNorskFodselsnummer) {
    return data.fodselsnummer && data.fodselsnummer.length > 0;
  }
  return true;
}

function validerFodselsnummerFormat(data: BaseArbeidstakerFormData) {
  if (data.fodselsnummer && data.fodselsnummer.length > 0) {
    return /^\d{11}$/.test(data.fodselsnummer);
  }
  return true;
}

function validerFornavn(data: BaseArbeidstakerFormData) {
  if (!data.harNorskFodselsnummer) {
    return data.fornavn && data.fornavn.length >= 2;
  }
  return true;
}

function validerHarVaertEllerSkalVaereILonnetArbeidFoerUtsendingerPakrevd(
  data: BaseArbeidstakerFormData,
) {
  return data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending !== undefined;
}

function validerSkalJobbeForFlereVirksomheterPakrevd(
  data: BaseArbeidstakerFormData,
) {
  return data.skalJobbeForFlereVirksomheter !== undefined;
}

function validerHarNorskFodselsnummerPakrevd(data: BaseArbeidstakerFormData) {
  return data.harNorskFodselsnummer !== undefined;
}

function validerHarVaertEllerSkalVaereILonnetArbeidFoerUtsending(
  data: BaseArbeidstakerFormData,
) {
  if (data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending) {
    return true;
  }

  const validOptions = [
    "studier",
    "ferie",
    "selvstendig-virksomhet",
    "kontantytelse-fra-nav",
  ];
  return (
    data.aktivitetIMaanedenFoerUtsendingen &&
    (validOptions as string[]).includes(data.aktivitetIMaanedenFoerUtsendingen)
  );
}

function validerVirksomheterPakrevd(data: BaseArbeidstakerFormData) {
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

export const arbeidstakerSchema = baseArbeidstakerSchema
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
  }))
  .refine(validerHarVaertEllerSkalVaereILonnetArbeidFoerUtsendingerPakrevd, {
    message:
      "arbeidstakerenSteg.duMaSvarePaOmDuHarVertEllerSkalVareILonnetArbeidINorgeForUtsending",
    path: ["harVaertEllerSkalVaereILonnetArbeidFoerUtsending"],
  })
  .refine(validerSkalJobbeForFlereVirksomheterPakrevd, {
    message:
      "arbeidstakerenSteg.duMaSvarePaOmDuSkalJobbeForFlereVirksomheterIPerioden",
    path: ["skalJobbeForFlereVirksomheter"],
  })
  .refine(validerHarNorskFodselsnummerPakrevd, {
    message:
      "arbeidstakerenSteg.duMaSvarePaOmArbeidstakerenHarNorskFodselsnummer",
    path: ["harNorskFodselsnummer"],
  })
  .refine(validerFodselsnummer, {
    message:
      "arbeidstakerenSteg.fodselsnummerEllerDNummerErPakrevdNarArbeidstakerenHarNorskFodselsnummer",
    path: ["fodselsnummer"],
  })
  .refine(validerFodselsnummerFormat, {
    message: "arbeidstakerenSteg.fodselsnummerEllerDNummerMaVare11Siffer",
    path: ["fodselsnummer"],
  })
  .refine(validerFornavn, {
    message: "arbeidstakerenSteg.fornavnErPakrevdOgMaVareMinst2Tegn",
    path: ["fornavn"],
  })
  .refine(validerEtternavn, {
    message: "arbeidstakerenSteg.etternavnErPakrevdOgMaVareMinst2Tegn",
    path: ["etternavn"],
  })
  .refine(validerFodselsdato, {
    message: "arbeidstakerenSteg.fodselsdatoErPakrevd",
    path: ["fodselsdato"],
  })
  .refine(validerHarVaertEllerSkalVaereILonnetArbeidFoerUtsending, {
    message:
      "arbeidstakerenSteg.duMaVelgeEnAktivitetNarDuIkkeHarVertILonnetArbeid",
    path: ["aktivitetIMaanedenFoerUtsendingen"],
  })
  .refine(validerVirksomheterPakrevd, {
    message:
      "arbeidstakerenSteg.duMaLeggeTilMinstEnVirksomhetNarDuSkalJobbeForFlereVirksomheter",
    path: ["virksomheterArbeidstakerJobberForIutsendelsesPeriode"],
  });
