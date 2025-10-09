import { z } from "zod";

const baseUtenlandsoppdragSchema = z.object({
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
  arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: z.boolean().nullish(),
  utenlandsoppholdetsBegrunnelse: z.string().nullish(),
  ansettelsesforholdBeskrivelse: z.string().nullish(),
  forrigeArbeidstakerUtsendelseFradato: z.string().nullish(),
  forrigeArbeidstakerUtsendelseTilDato: z.string().nullish(),
});

type BaseUtenlandsoppdragFormData = z.infer<typeof baseUtenlandsoppdragSchema>;

function validerArbeidstakerUtsendelseDatoer(
  data: BaseUtenlandsoppdragFormData,
) {
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
}

function validerForrigeArbeidstakerUtsendelseDatoer(
  data: BaseUtenlandsoppdragFormData,
) {
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
}

function validerUtenlandsoppholdetsBegrunnelsePakrevd(
  data: BaseUtenlandsoppdragFormData,
) {
  if (!data.arbeidsgiverHarOppdragILandet) {
    return (
      data.utenlandsoppholdetsBegrunnelse &&
      data.utenlandsoppholdetsBegrunnelse.trim() !== ""
    );
  }
  return true;
}

function validerAnsettelsesforholdBeskrivelsePakrevd(
  data: BaseUtenlandsoppdragFormData,
) {
  if (!data.arbeidstakerForblirAnsattIHelePerioden) {
    return (
      data.ansettelsesforholdBeskrivelse &&
      data.ansettelsesforholdBeskrivelse.trim() !== ""
    );
  }
  return true;
}

function validerJobbeINorgeEtterOppdragetPakrevd(
  data: BaseUtenlandsoppdragFormData,
) {
  if (data.arbeidstakerBleAnsattForUtenlandsoppdraget) {
    return (
      data.arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget !== undefined
    );
  }
  return true;
}

function validerForrigeArbeidstakerFraDatoPakrevd(
  data: BaseUtenlandsoppdragFormData,
) {
  if (data.arbeidstakerErstatterAnnenPerson) {
    return (
      data.forrigeArbeidstakerUtsendelseFradato &&
      data.forrigeArbeidstakerUtsendelseFradato !== ""
    );
  }
  return true;
}

function validerForrigeArbeidstakerTilDatoPakrevd(
  data: BaseUtenlandsoppdragFormData,
) {
  if (data.arbeidstakerErstatterAnnenPerson) {
    return (
      data.forrigeArbeidstakerUtsendelseTilDato &&
      data.forrigeArbeidstakerUtsendelseTilDato !== ""
    );
  }
  return true;
}

export const utenlandsoppdragSchema = baseUtenlandsoppdragSchema
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
  }))
  .refine(validerArbeidstakerUtsendelseDatoer, {
    message: "utenlandsoppdragetSteg.tilDatoKanIkkeVareForFraDato",
    path: ["arbeidstakerUtsendelseTilDato"],
  })
  .refine(validerForrigeArbeidstakerUtsendelseDatoer, {
    message: "utenlandsoppdragetSteg.tilDatoKanIkkeVareForFraDato",
    path: ["forrigeArbeidstakerUtsendelseTilDato"],
  })
  .refine(validerUtenlandsoppholdetsBegrunnelsePakrevd, {
    message:
      "utenlandsoppdragetSteg.begrunnelseErPakrevdNarArbeidsgiverIkkeHarOppdragILandet",
    path: ["utenlandsoppholdetsBegrunnelse"],
  })
  .refine(validerAnsettelsesforholdBeskrivelsePakrevd, {
    message: "utenlandsoppdragetSteg.beskrivelseAvAnsettelsesforholdErPakrevd",
    path: ["ansettelsesforholdBeskrivelse"],
  })
  .refine(validerJobbeINorgeEtterOppdragetPakrevd, {
    message:
      "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerenVilArbeideForVirksomhetenINorgeEtterOppdraget",
    path: ["arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget"],
  })
  .refine(validerForrigeArbeidstakerFraDatoPakrevd, {
    message: "utenlandsoppdragetSteg.fraDatoForForrigeArbeidstakerErPakrevd",
    path: ["forrigeArbeidstakerUtsendelseFradato"],
  })
  .refine(validerForrigeArbeidstakerTilDatoPakrevd, {
    message: "utenlandsoppdragetSteg.tilDatoForForrigeArbeidstakerErPakrevd",
    path: ["forrigeArbeidstakerUtsendelseTilDato"],
  });
