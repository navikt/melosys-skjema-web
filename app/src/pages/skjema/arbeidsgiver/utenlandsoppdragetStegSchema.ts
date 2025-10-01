import { z } from "zod";

const utenlandsoppdragSchema = z
  .object({
    utsendelseLand: z
      .string({
        message:
          "utenlandsoppdragetSteg.duMaVelgeHvilketLandArbeidstakerenSendesTil",
      })
      .min(
        1,
        "utenlandsoppdragetSteg.duMaVelgeHvilketLandArbeidstakerenSendesTil",
      ),
    arbeidstakerUtsendelseFraDato: z
      .string({
        message: "utenlandsoppdragetSteg.fraDatoErPakrevd",
      })
      .min(1, "utenlandsoppdragetSteg.fraDatoErPakrevd"),
    arbeidstakerUtsendelseTilDato: z
      .string({
        message: "utenlandsoppdragetSteg.tilDatoErPakrevd",
      })
      .min(1, "utenlandsoppdragetSteg.tilDatoErPakrevd"),
    arbeidsgiverHarOppdragILandet: z.boolean({
      message: "utenlandsoppdragetSteg.duMaSvarePaOmDereHarOppdragILandet",
    }),
    arbeidstakerBleAnsattForUtenlandsoppdraget: z.boolean({
      message:
        "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerBleAnsattPaGrunnAvDetteUtenlandsoppdraget",
    }),
    arbeidstakerForblirAnsattIHelePerioden: z.boolean({
      message:
        "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerVilFortsattVareAnsattIHeleUtsendingsperioden",
    }),
    arbeidstakerErstatterAnnenPerson: z.boolean({
      message:
        "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerErstatterEnAnnenPerson",
    }),
    arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: z
      .boolean()
      .optional(),
    utenlandsoppholdetsBegrunnelse: z.string().optional(),
    ansettelsesforholdBeskrivelse: z.string().optional(),
    forrigeArbeidstakerUtsendelseFradato: z.string().optional(),
    forrigeArbeidstakerUtsendelseTilDato: z.string().optional(),
  })
  .refine(
    (data) => {
      // Always validate main dates if both are present
      if (
        data.arbeidstakerUtsendelseFraDato &&
        data.arbeidstakerUtsendelseTilDato
      ) {
        return (
          new Date(data.arbeidstakerUtsendelseFraDato) <=
          new Date(data.arbeidstakerUtsendelseTilDato)
        );
      }
      return true;
    },
    {
      message: "utenlandsoppdragetSteg.tilDatoKanIkkeVareForFraDato",
      path: ["arbeidstakerUtsendelseTilDato"],
    },
  )
  .refine(
    (data) => {
      // Always validate forrige arbeidstaker dates if both are present
      if (
        data.forrigeArbeidstakerUtsendelseFradato &&
        data.forrigeArbeidstakerUtsendelseTilDato
      ) {
        return (
          new Date(data.forrigeArbeidstakerUtsendelseFradato) <=
          new Date(data.forrigeArbeidstakerUtsendelseTilDato)
        );
      }
      return true;
    },
    {
      message: "utenlandsoppdragetSteg.tilDatoKanIkkeVareForFraDato",
      path: ["forrigeArbeidstakerUtsendelseTilDato"],
    },
  )
  .refine(
    (data) => {
      if (!data.arbeidsgiverHarOppdragILandet) {
        return (
          data.utenlandsoppholdetsBegrunnelse &&
          data.utenlandsoppholdetsBegrunnelse.trim() !== ""
        );
      }
      return true;
    },
    {
      message:
        "utenlandsoppdragetSteg.begrunnelseErPakrevdNarArbeidsgiverIkkeHarOppdragILandet",
      path: ["utenlandsoppholdetsBegrunnelse"],
    },
  )
  .refine(
    (data) => {
      if (!data.arbeidstakerForblirAnsattIHelePerioden) {
        return (
          data.ansettelsesforholdBeskrivelse &&
          data.ansettelsesforholdBeskrivelse.trim() !== ""
        );
      }
      return true;
    },
    {
      message:
        "utenlandsoppdragetSteg.beskrivelseAvAnsettelsesforholdErPakrevd",
      path: ["ansettelsesforholdBeskrivelse"],
    },
  )
  .refine(
    (data) => {
      if (data.arbeidstakerBleAnsattForUtenlandsoppdraget) {
        return (
          data.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget !==
          undefined
        );
      }
      return true;
    },
    {
      message:
        "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerenVilArbeideForVirksomhetenINorgeEtterOppdraget",
      path: ["arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget"],
    },
  )
  .refine(
    (data) => {
      if (data.arbeidstakerErstatterAnnenPerson) {
        return (
          data.forrigeArbeidstakerUtsendelseFradato &&
          data.forrigeArbeidstakerUtsendelseFradato !== ""
        );
      }
      return true;
    },
    {
      message: "utenlandsoppdragetSteg.fraDatoForForrigeArbeidstakerErPakrevd",
      path: ["forrigeArbeidstakerUtsendelseFradato"],
    },
  )
  .refine(
    (data) => {
      if (data.arbeidstakerErstatterAnnenPerson) {
        return (
          data.forrigeArbeidstakerUtsendelseTilDato &&
          data.forrigeArbeidstakerUtsendelseTilDato !== ""
        );
      }
      return true;
    },
    {
      message: "utenlandsoppdragetSteg.tilDatoForForrigeArbeidstakerErPakrevd",
      path: ["forrigeArbeidstakerUtsendelseTilDato"],
    },
  );

export { utenlandsoppdragSchema };
