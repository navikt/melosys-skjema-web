import { z } from "zod";

import { periodeSchema } from "~/components/date/periodeSchema.ts";

const baseSchema = z.object({
  arbeidsgiverHarOppdragILandet: z.boolean({
    error: "utenlandsoppdragetSteg.duMaSvarePaOmDereHarOppdragILandet",
  }),
  arbeidstakerBleAnsattForUtenlandsoppdraget: z.boolean({
    error:
      "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerBleAnsattPaGrunnAvDetteUtenlandsoppdraget",
  }),
  arbeidstakerForblirAnsattIHelePerioden: z.boolean({
    error:
      "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerVilFortsattVareAnsattIHeleUtsendingsperioden",
  }),
  arbeidstakerErstatterAnnenPerson: z.boolean({
    error:
      "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerErstatterEnAnnenPerson",
  }),
  arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: z.boolean().optional(),
  utenlandsoppholdetsBegrunnelse: z.string().optional(),
  ansettelsesforholdBeskrivelse: z.string().optional(),
  forrigeArbeidstakerUtsendelsePeriode: periodeSchema.optional(),
});

export const utenlandsoppdragSchema = baseSchema
  .refine(
    (data) =>
      data.arbeidsgiverHarOppdragILandet ||
      !!data.utenlandsoppholdetsBegrunnelse?.trim(),
    {
      error:
        "utenlandsoppdragetSteg.begrunnelseErPakrevdNarArbeidsgiverIkkeHarOppdragILandet",
      path: ["utenlandsoppholdetsBegrunnelse"],
      when: () => true,
    },
  )
  .refine(
    (data) =>
      data.arbeidstakerForblirAnsattIHelePerioden ||
      !!data.ansettelsesforholdBeskrivelse?.trim(),
    {
      error: "utenlandsoppdragetSteg.beskrivelseAvAnsettelsesforholdErPakrevd",
      path: ["ansettelsesforholdBeskrivelse"],
      when: () => true,
    },
  )
  .refine(
    (data) =>
      !data.arbeidstakerBleAnsattForUtenlandsoppdraget ||
      data.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget !== undefined,
    {
      error:
        "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerenVilArbeideForVirksomhetenINorgeEtterOppdraget",
      path: ["arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget"],
      when: () => true,
    },
  )
  .refine(
    (data) =>
      !data.arbeidstakerErstatterAnnenPerson ||
      !!data.forrigeArbeidstakerUtsendelsePeriode,
    {
      error: "periode.datoErPakrevd",
      path: ["forrigeArbeidstakerUtsendelsePeriode"],
      when: () => true,
    },
  )
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
    forrigeArbeidstakerUtsendelsePeriode: data.arbeidstakerErstatterAnnenPerson
      ? data.forrigeArbeidstakerUtsendelsePeriode
      : undefined,
  }));
