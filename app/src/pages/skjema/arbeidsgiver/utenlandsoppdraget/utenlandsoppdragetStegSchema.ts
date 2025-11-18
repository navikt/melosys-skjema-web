import { z } from "zod";

// Base required fields
const baseUtenlandsoppdragSchema = z.object({
  utsendelseLand: z
    .string()
    .min(1, "utenlandsoppdragetSteg.duMaVelgeHvilketLandArbeidstakerenSendesTil"),
  arbeidstakerUtsendelseFraDato: z
    .string()
    .min(1, "utenlandsoppdragetSteg.fraDatoErPakrevd"),
  arbeidstakerUtsendelseTilDato: z
    .string()
    .min(1, "utenlandsoppdragetSteg.tilDatoErPakrevd"),
}).refine(
  (data) =>
    new Date(data.arbeidstakerUtsendelseFraDato) <=
    new Date(data.arbeidstakerUtsendelseTilDato),
  {
    message: "utenlandsoppdragetSteg.tilDatoKanIkkeVareForFraDato",
    path: ["arbeidstakerUtsendelseTilDato"],
  }
);

// Discriminated union for arbeidsgiverHarOppdragILandet
const harOppdragILandetSchema = z.object({
  arbeidsgiverHarOppdragILandet: z.literal(true),
});

const harIkkeOppdragILandetSchema = z.object({
  arbeidsgiverHarOppdragILandet: z.literal(false),
  utenlandsoppholdetsBegrunnelse: z
    .string()
    .min(1, "utenlandsoppdragetSteg.begrunnelseErPakrevdNarArbeidsgiverIkkeHarOppdragILandet"),
});

// Discriminated union for arbeidstakerBleAnsattForUtenlandsoppdraget
const bleIkkeAnsattForOppdragetSchema = z.object({
  arbeidstakerBleAnsattForUtenlandsoppdraget: z.literal(false),
});

const bleAnsattForOppdragetSchema = z.object({
  arbeidstakerBleAnsattForUtenlandsoppdraget: z.literal(true),
  arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: z.boolean({
    message:
      "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerenVilArbeideForVirksomhetenINorgeEtterOppdraget",
  }),
});

// Discriminated union for arbeidstakerForblirAnsattIHelePerioden
const forblirAnsattIHelePerioden = z.object({
  arbeidstakerForblirAnsattIHelePerioden: z.literal(true),
});

const forblirIkkeAnsattIHelePerioden = z.object({
  arbeidstakerForblirAnsattIHelePerioden: z.literal(false),
  ansettelsesforholdBeskrivelse: z
    .string()
    .min(1, "utenlandsoppdragetSteg.beskrivelseAvAnsettelsesforholdErPakrevd"),
});

// Discriminated union for arbeidstakerErstatterAnnenPerson
const erstatterIkkeAnnenPersonSchema = z.object({
  arbeidstakerErstatterAnnenPerson: z.literal(false),
});

const erstatterAnnenPersonSchema = z.object({
  arbeidstakerErstatterAnnenPerson: z.literal(true),
  forrigeArbeidstakerUtsendelseFradato: z
    .string()
    .min(1, "utenlandsoppdragetSteg.fraDatoForForrigeArbeidstakerErPakrevd"),
  forrigeArbeidstakerUtsendelseTilDato: z
    .string()
    .min(1, "utenlandsoppdragetSteg.tilDatoForForrigeArbeidstakerErPakrevd"),
}).refine(
  (data) =>
    new Date(data.forrigeArbeidstakerUtsendelseFradato) <=
    new Date(data.forrigeArbeidstakerUtsendelseTilDato),
  {
    message: "utenlandsoppdragetSteg.tilDatoKanIkkeVareForFraDato",
    path: ["forrigeArbeidstakerUtsendelseTilDato"],
  }
);

// Combine all discriminated unions with intersection
export const utenlandsoppdragSchema = z
  .intersection(
    baseUtenlandsoppdragSchema,
    z.intersection(
      z.discriminatedUnion("arbeidsgiverHarOppdragILandet", [
        harOppdragILandetSchema,
        harIkkeOppdragILandetSchema,
      ]),
      z.intersection(
        z.discriminatedUnion("arbeidstakerBleAnsattForUtenlandsoppdraget", [
          bleIkkeAnsattForOppdragetSchema,
          bleAnsattForOppdragetSchema,
        ]),
        z.intersection(
          z.discriminatedUnion("arbeidstakerForblirAnsattIHelePerioden", [
            forblirAnsattIHelePerioden,
            forblirIkkeAnsattIHelePerioden,
          ]),
          z.discriminatedUnion("arbeidstakerErstatterAnnenPerson", [
            erstatterIkkeAnnenPersonSchema,
            erstatterAnnenPersonSchema,
          ])
        )
      )
    )
  )
  .transform((data) => ({
    utsendelseLand: data.utsendelseLand,
    arbeidstakerUtsendelseFraDato: data.arbeidstakerUtsendelseFraDato,
    arbeidstakerUtsendelseTilDato: data.arbeidstakerUtsendelseTilDato,
    arbeidsgiverHarOppdragILandet: data.arbeidsgiverHarOppdragILandet,
    utenlandsoppholdetsBegrunnelse: data.arbeidsgiverHarOppdragILandet
      ? undefined
      : data.utenlandsoppholdetsBegrunnelse,
    arbeidstakerBleAnsattForUtenlandsoppdraget:
      data.arbeidstakerBleAnsattForUtenlandsoppdraget,
    arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget:
      data.arbeidstakerBleAnsattForUtenlandsoppdraget
        ? data.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget
        : undefined,
    arbeidstakerForblirAnsattIHelePerioden: data.arbeidstakerForblirAnsattIHelePerioden,
    ansettelsesforholdBeskrivelse: data.arbeidstakerForblirAnsattIHelePerioden
      ? undefined
      : data.ansettelsesforholdBeskrivelse,
    arbeidstakerErstatterAnnenPerson: data.arbeidstakerErstatterAnnenPerson,
    forrigeArbeidstakerUtsendelseFradato: data.arbeidstakerErstatterAnnenPerson
      ? data.forrigeArbeidstakerUtsendelseFradato
      : undefined,
    forrigeArbeidstakerUtsendelseTilDato: data.arbeidstakerErstatterAnnenPerson
      ? data.forrigeArbeidstakerUtsendelseTilDato
      : undefined,
  }));
