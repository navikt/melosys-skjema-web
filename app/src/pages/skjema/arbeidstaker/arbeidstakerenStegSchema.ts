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

const baseArbeidstakerSchema = z.object({
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.boolean().nullish(),
  aktivitetIMaanedenFoerUtsendingen: z.string().nullish(),
  skalJobbeForFlereVirksomheter: z.boolean().nullish(),
  virksomheterArbeidstakerJobberForIutsendelsesPeriode: z
    .object({
      norskeVirksomheter: z
        .array(
          z.object({
            organisasjonsnummer: z
              .string()
              .min(1, "generellValidering.organisasjonsnummerErPakrevd")
              .regex(
                /^\d{9}$/,
                "generellValidering.organisasjonsnummerMaVare9Siffer",
              ),
          }),
        )
        .optional(),
      utenlandskeVirksomheter: z
        .array(
          z.object({
            navn: z
              .string()
              .min(1, "generellValidering.navnPaVirksomhetErPakrevd"),
            organisasjonsnummer: z.string().optional(),
            vegnavnOgHusnummer: z
              .string()
              .min(1, "generellValidering.vegnavnOgHusnummerErPakrevd"),
            bygning: z.string().optional(),
            postkode: z.string().optional(),
            byStedsnavn: z.string().optional(),
            region: z.string().optional(),
            land: z.string().min(1, "generellValidering.landErPakrevd"),
            tilhorerSammeKonsern: z.boolean({
              message:
                "generellValidering.duMaSvarePaOmVirksomhetenTilhorerSammeKonsern",
            }),
          }),
        )
        .optional(),
    })
    .optional(),
  harNorskFodselsnummer: z.boolean().nullish(),
  fodselsnummer: z.string().nullish(),
  fornavn: z.string().nullish(),
  etternavn: z.string().nullish(),
  fodselsdato: z.string().nullish(),
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
  return (
    data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending !== undefined &&
    data.harVaertEllerSkalVaereILonnetArbeidFoerUtsending !== null
  );
}

function validerSkalJobbeForFlereVirksomheterPakrevd(
  data: BaseArbeidstakerFormData,
) {
  return (
    data.skalJobbeForFlereVirksomheter !== undefined &&
    data.skalJobbeForFlereVirksomheter !== null
  );
}

function validerHarNorskFodselsnummerPakrevd(data: BaseArbeidstakerFormData) {
  return (
    data.harNorskFodselsnummer !== undefined &&
    data.harNorskFodselsnummer !== null
  );
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
  });
