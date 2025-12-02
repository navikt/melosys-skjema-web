import { z } from "zod";

import { periodeSchema } from "~/components/date/periodeSchema.ts";

export const utenlandsoppdragSchema = z
  .object({
    utsendelseLand: z
      .string({
        error:
          "utenlandsoppdragetSteg.duMaVelgeHvilketLandArbeidstakerenSendesTil",
      })
      .min(
        1,
        "utenlandsoppdragetSteg.duMaVelgeHvilketLandArbeidstakerenSendesTil",
      ),
    arbeidstakerUtsendelsePeriode: periodeSchema,
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
    arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: z
      .boolean()
      .optional(),
    utenlandsoppholdetsBegrunnelse: z.string().optional(),
    ansettelsesforholdBeskrivelse: z.string().optional(),
    forrigeArbeidstakerUtsendelsePeriode: periodeSchema.optional(),
  })
  .superRefine((data, ctx) => {

    // Conditional validation: utenlandsoppholdetsBegrunnelse required when arbeidsgiverHarOppdragILandet is false
    if (
      !data.arbeidsgiverHarOppdragILandet &&
      !data.utenlandsoppholdetsBegrunnelse?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
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
        code: "custom",
        message:
          "utenlandsoppdragetSteg.beskrivelseAvAnsettelsesforholdErPakrevd",
        path: ["ansettelsesforholdBeskrivelse"],
      });
    }

    // Conditional validation: arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget required when arbeidstakerBleAnsattForUtenlandsoppdraget is true
    if (
      data.arbeidstakerBleAnsattForUtenlandsoppdraget &&
      data.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerenVilArbeideForVirksomhetenINorgeEtterOppdraget",
        path: ["arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget"],
      });
    }

    // Conditional validation: forrigeArbeidstakerUtsendelsePeriode.fraDato required when arbeidstakerErstatterAnnenPerson is true
    if (
      data.arbeidstakerErstatterAnnenPerson &&
      !data.forrigeArbeidstakerUtsendelsePeriode?.fraDato
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "utenlandsoppdragetSteg.fraDatoForForrigeArbeidstakerErPakrevd",
        path: ["forrigeArbeidstakerUtsendelsePeriode", "fraDato"],
      });
    }

    // Conditional validation: forrigeArbeidstakerUtsendelsePeriode.tilDato required when arbeidstakerErstatterAnnenPerson is true
    if (
      data.arbeidstakerErstatterAnnenPerson &&
      !data.forrigeArbeidstakerUtsendelsePeriode?.tilDato
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "utenlandsoppdragetSteg.tilDatoForForrigeArbeidstakerErPakrevd",
        path: ["forrigeArbeidstakerUtsendelsePeriode", "tilDato"],
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
    forrigeArbeidstakerUtsendelsePeriode: data.arbeidstakerErstatterAnnenPerson
      ? data.forrigeArbeidstakerUtsendelsePeriode
      : undefined,
  }));
