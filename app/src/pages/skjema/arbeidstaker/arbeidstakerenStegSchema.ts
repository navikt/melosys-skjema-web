import { z } from "zod";

export const AKTIVITET_OPTIONS = [
  { value: "studier", labelKey: "aktiviteter.studier" },
  { value: "ferie", labelKey: "aktiviteter.ferie" },
  {
    value: "selvstendig-virksomhet",
    labelKey: "aktiviteter.selvstendingVirksomhet",
  },
  {
    value: "kontantytelse-fra-nav",
    labelKey: "aktiviteter.kontantytelseFraNav",
  },
] as const;

const baseArbeidstakerSchema = z.object({
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: z.boolean({
    message: "validering.maSvarePaLonnetArbeid",
  }),
  aktivitetIMaanedenFoerUtsendingen: z.string().optional(),
  skalJobbeForFlereVirksomheter: z.boolean({
    message: "validering.maSvarePaFlereVirksomheter",
  }),
  norskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode: z
    .array(
      z.object({
        organisasjonsnummer: z
          .string()
          .min(1, "validering.organisasjonsnummerPakrevd")
          .regex(/^\d{9}$/, "validering.organisasjonsnummerFormat"),
      }),
    )
    .optional(),
  utenlandskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode: z
    .array(
      z.object({
        navn: z.string().min(1, "validering.virksomhetsnavnPakrevd"),
        organisasjonsnummer: z.string().optional(),
        vegnavnOgHusnummer: z.string().min(1, "validering.adressePakrevd"),
        bygning: z.string().optional(),
        postkode: z.string().optional(),
        byStedsnavn: z.string().optional(),
        region: z.string().optional(),
        land: z.string().min(1, "validering.landPakrevd"),
        tilhorerSammeKonsern: z.boolean({
          message: "validering.maSvarePaSammeKonsern",
        }),
      }),
    )
    .optional(),
  harNorskFodselsnummer: z.boolean({
    message: "validering.maSvarePaNorskFodselsnummer",
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
    message: "validering.fodselsnummerPakrevdNarNorsk",
    path: ["fodselsnummer"],
  })
  .refine(validerFodselsnummerFormat, {
    message: "validering.fodselsnummerMaVare11Siffer",
    path: ["fodselsnummer"],
  })
  .refine(validerFornavn, {
    message: "validering.fornavnPakrevd",
    path: ["fornavn"],
  })
  .refine(validerEtternavn, {
    message: "validering.etternavnPakrevd",
    path: ["etternavn"],
  })
  .refine(validerFodselsdato, {
    message: "validering.fodselsdatoPakrevd",
    path: ["fodselsdato"],
  })
  .refine(validerHarVaertEllerSkalVaereILonnetArbeidFoerUtsending, {
    message: "validering.maVelgeAktivitetNarIkkeLonnetArbeid",
    path: ["aktivitetIMaanedenFoerUtsendingen"],
  });
