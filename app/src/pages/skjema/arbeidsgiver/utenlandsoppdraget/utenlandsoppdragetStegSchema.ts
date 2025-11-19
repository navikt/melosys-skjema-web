import { z } from "zod";

const baseSchema = z.object({
  utsendelseLand: z
    .string()
    .min(1, "utenlandsoppdragetSteg.duMaVelgeHvilketLandArbeidstakerenSendesTil"),
  arbeidstakerUtsendelseFraDato: z
    .string()
    .min(1, "utenlandsoppdragetSteg.fraDatoErPakrevd"),
  arbeidstakerUtsendelseTilDato: z
    .string()
    .min(1, "utenlandsoppdragetSteg.tilDatoErPakrevd"),
  arbeidsgiverHarOppdragILandet: z.boolean(),
  arbeidstakerBleAnsattForUtenlandsoppdraget: z.boolean(),
  arbeidstakerForblirAnsattIHelePerioden: z.boolean(),
  arbeidstakerErstatterAnnenPerson: z.boolean(),
  arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: z.boolean().optional(),
  utenlandsoppholdetsBegrunnelse: z.string().optional(),
  ansettelsesforholdBeskrivelse: z.string().optional(),
  forrigeArbeidstakerUtsendelseFradato: z.string().optional(),
  forrigeArbeidstakerUtsendelseTilDato: z.string().optional(),
});

export const utenlandsoppdragSchema = baseSchema
  .superRefine((data, ctx) => {
    // Validate date ranges
    if (
      new Date(data.arbeidstakerUtsendelseFraDato) >
      new Date(data.arbeidstakerUtsendelseTilDato)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "utenlandsoppdragetSteg.tilDatoKanIkkeVareForFraDato",
        path: ["arbeidstakerUtsendelseTilDato"],
      });
    }

    // Conditional validation: utenlandsoppholdetsBegrunnelse required when arbeidsgiverHarOppdragILandet is false
    if (
      !data.arbeidsgiverHarOppdragILandet &&
      !data.utenlandsoppholdetsBegrunnelse?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "utenlandsoppdragetSteg.begrunnelseErPakrevdNarArbeidsgiverIkkeHarOppdragILandet",
        path: ["utenlandsoppholdetsBegrunnelse"],
      });
    }

    // Conditional validation: ansettelsesforholdBeskrivelse required when arbeidstakerForblirAnsattIHelePerioden is false
    if (
      !data.arbeidstakerForblirAnsattIHelePerioden &&
      !data.ansettelsesforholdBeskrivelse?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "utenlandsoppdragetSteg.beskrivelseAvAnsettelsesforholdErPakrevd",
        path: ["ansettelsesforholdBeskrivelse"],
      });
    }

    // Conditional validation: arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget required when arbeidstakerBleAnsattForUtenlandsoppdraget is true
    if (
      data.arbeidstakerBleAnsattForUtenlandsoppdraget &&
      data.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerenVilArbeideForVirksomhetenINorgeEtterOppdraget",
        path: ["arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget"],
      });
    }

    // Conditional validation: forrigeArbeidstakerUtsendelseFradato required when arbeidstakerErstatterAnnenPerson is true
    if (
      data.arbeidstakerErstatterAnnenPerson &&
      !data.forrigeArbeidstakerUtsendelseFradato
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "utenlandsoppdragetSteg.fraDatoForForrigeArbeidstakerErPakrevd",
        path: ["forrigeArbeidstakerUtsendelseFradato"],
      });
    }

    // Conditional validation: forrigeArbeidstakerUtsendelseTilDato required when arbeidstakerErstatterAnnenPerson is true
    if (
      data.arbeidstakerErstatterAnnenPerson &&
      !data.forrigeArbeidstakerUtsendelseTilDato
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "utenlandsoppdragetSteg.tilDatoForForrigeArbeidstakerErPakrevd",
        path: ["forrigeArbeidstakerUtsendelseTilDato"],
      });
    }

    // Validate previous employee date range if both dates are provided
    if (
      data.forrigeArbeidstakerUtsendelseFradato &&
      data.forrigeArbeidstakerUtsendelseTilDato &&
      new Date(data.forrigeArbeidstakerUtsendelseFradato) >
        new Date(data.forrigeArbeidstakerUtsendelseTilDato)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "utenlandsoppdragetSteg.tilDatoKanIkkeVareForFraDato",
        path: ["forrigeArbeidstakerUtsendelseTilDato"],
      });
    }
  })
  .transform((data) => ({
    ...data,
    // Clear conditional fields when their conditions are false
    arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget:
      data.arbeidstakerBleAnsattForUtenlandsoppdraget
        ? data.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget
        : undefined,
    utenlandsoppholdetsBegrunnelse: data.arbeidsgiverHarOppdragILandet
      ? undefined
      : data.utenlandsoppholdetsBegrunnelse,
    ansettelsesforholdBeskrivelse: data.arbeidstakerForblirAnsattIHelePerioden
      ? undefined
      : data.ansettelsesforholdBeskrivelse,
    forrigeArbeidstakerUtsendelseFradato: data.arbeidstakerErstatterAnnenPerson
      ? data.forrigeArbeidstakerUtsendelseFradato
      : undefined,
    forrigeArbeidstakerUtsendelseTilDato: data.arbeidstakerErstatterAnnenPerson
      ? data.forrigeArbeidstakerUtsendelseTilDato
      : undefined,
  }));
