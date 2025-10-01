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
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.boolean({
    message: "arbeidstakerenSteg.duMaSvarePaOmDuHarVertEllerSkalVareILonnetArbeidINorgeForUtsending",
  }),
  aktivitetIMaanedenFoerUtsendingen: z.string().optional(),
  skalJobbeForFlereVirksomheter: z.boolean({
    message: "arbeidstakerenSteg.duMaSvarePaOmDuSkalJobbeForFlereVirksomheterIPerioden",
  }),
  norskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode: z
    .array(
      z.object({
        organisasjonsnummer: z
          .string()
          .min(1, "generellValidering.organisasjonsnummerErPakrevd")
          .regex(/^\d{9}$/, "generellValidering.organisasjonsnummerMaVare9Siffer"),
      }),
    )
    .optional(),
  utenlandskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode: z
    .array(
      z.object({
        navn: z.string().min(1, "generellValidering.navnPaVirksomhetErPakrevd"),
        organisasjonsnummer: z.string().optional(),
        vegnavnOgHusnummer: z.string().min(1, "generellValidering.vegnavnOgHusnummerErPakrevd"),
        bygning: z.string().optional(),
        postkode: z.string().optional(),
        byStedsnavn: z.string().optional(),
        region: z.string().optional(),
        land: z.string().min(1, "generellValidering.landErPakrevd"),
        tilhorerSammeKonsern: z.boolean({
          message: "generellValidering.duMaSvarePaOmVirksomhetenTilhorerSammeKonsern",
        }),
      }),
    )
    .optional(),
  harNorskFodselsnummer: z.boolean({
    message: "arbeidstakerenSteg.duMaSvarePaOmArbeidstakerenHarNorskFodselsnummer",
  }),
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
  .refine(validerFodselsnummer, {
    message: "arbeidstakerenSteg.fodselsnummerEllerDNummerErPakrevdNarArbeidstakerenHarNorskFodselsnummer",
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
    message: "arbeidstakerenSteg.duMaVelgeEnAktivitetNarDuIkkeHarVertILonnetArbeid",
    path: ["aktivitetIMaanedenFoerUtsendingen"],
  });
