import { z } from "zod";

const baseUtenlandsoppdragSchema = z.object({
  utsendelseLand: z
    .string({
      message:
        "utenlandsoppdragetSteg.duMaVelgeHvilketLandArbeidstakerenSendesTil",
    })
    .optional(),
  arbeidstakerUtsendelseFraDato: z
    .string({
      message: "utenlandsoppdragetSteg.fraDatoErPakrevd",
    })
    .optional(),
  arbeidstakerUtsendelseTilDato: z
    .string({
      message: "utenlandsoppdragetSteg.tilDatoErPakrevd",
    })
    .optional(),
  arbeidsgiverHarOppdragILandet: z
    .boolean({
      message: "utenlandsoppdragetSteg.duMaSvarePaOmDereHarOppdragILandet",
    })
    .optional(),
  arbeidstakerBleAnsattForUtenlandsoppdraget: z
    .boolean({
      message:
        "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerBleAnsattPaGrunnAvDetteUtenlandsoppdraget",
    })
    .optional(),
  arbeidstakerForblirAnsattIHelePerioden: z
    .boolean({
      message:
        "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerVilFortsattVareAnsattIHeleUtsendingsperioden",
    })
    .optional(),
  arbeidstakerErstatterAnnenPerson: z
    .boolean({
      message:
        "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerErstatterEnAnnenPerson",
    })
    .optional(),
  arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: z.boolean().optional(),
  utenlandsoppholdetsBegrunnelse: z.string().optional(),
  ansettelsesforholdBeskrivelse: z.string().optional(),
  forrigeArbeidstakerUtsendelseFradato: z.string().optional(),
  forrigeArbeidstakerUtsendelseTilDato: z.string().optional(),
});

type BaseUtenlandsoppdragFormData = z.infer<typeof baseUtenlandsoppdragSchema>;

function validerUtsendelseLandPakrevd(data: BaseUtenlandsoppdragFormData) {
  return (
    data.utsendelseLand !== undefined && data.utsendelseLand.trim().length > 0
  );
}

function validerArbeidstakerUtsendelseFraDatoPakrevd(
  data: BaseUtenlandsoppdragFormData,
) {
  return (
    data.arbeidstakerUtsendelseFraDato !== undefined &&
    data.arbeidstakerUtsendelseFraDato.trim().length > 0
  );
}

function validerArbeidstakerUtsendelseTilDatoPakrevd(
  data: BaseUtenlandsoppdragFormData,
) {
  return (
    data.arbeidstakerUtsendelseTilDato !== undefined &&
    data.arbeidstakerUtsendelseTilDato.trim().length > 0
  );
}

function validerArbeidsgiverHarOppdragILandetPakrevd(
  data: BaseUtenlandsoppdragFormData,
) {
  return data.arbeidsgiverHarOppdragILandet !== undefined;
}

function validerArbeidstakerBleAnsattForUtenlandsoppdragetPakrevd(
  data: BaseUtenlandsoppdragFormData,
) {
  return data.arbeidstakerBleAnsattForUtenlandsoppdraget !== undefined;
}

function validerArbeidstakerForblirAnsattIHelePerioden(
  data: BaseUtenlandsoppdragFormData,
) {
  return data.arbeidstakerForblirAnsattIHelePerioden !== undefined;
}

function validerArbeidstakerErstatterAnnenPersonPakrevd(
  data: BaseUtenlandsoppdragFormData,
) {
  return data.arbeidstakerErstatterAnnenPerson !== undefined;
}

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
  .refine(validerUtsendelseLandPakrevd, {
    message:
      "utenlandsoppdragetSteg.duMaVelgeHvilketLandArbeidstakerenSendesTil",
    path: ["utsendelseLand"],
  })
  .refine(validerArbeidstakerUtsendelseFraDatoPakrevd, {
    message: "utenlandsoppdragetSteg.fraDatoErPakrevd",
    path: ["arbeidstakerUtsendelseFraDato"],
  })
  .refine(validerArbeidstakerUtsendelseTilDatoPakrevd, {
    message: "utenlandsoppdragetSteg.tilDatoErPakrevd",
    path: ["arbeidstakerUtsendelseTilDato"],
  })
  .refine(validerArbeidsgiverHarOppdragILandetPakrevd, {
    message: "utenlandsoppdragetSteg.duMaSvarePaOmDereHarOppdragILandet",
    path: ["arbeidsgiverHarOppdragILandet"],
  })
  .refine(validerArbeidstakerBleAnsattForUtenlandsoppdragetPakrevd, {
    message:
      "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerBleAnsattPaGrunnAvDetteUtenlandsoppdraget",
    path: ["arbeidstakerBleAnsattForUtenlandsoppdraget"],
  })
  .refine(validerArbeidstakerForblirAnsattIHelePerioden, {
    message:
      "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerVilFortsattVareAnsattIHeleUtsendingsperioden",
    path: ["arbeidstakerForblirAnsattIHelePerioden"],
  })
  .refine(validerArbeidstakerErstatterAnnenPersonPakrevd, {
    message:
      "utenlandsoppdragetSteg.duMaSvarePaOmArbeidstakerErstatterEnAnnenPerson",
    path: ["arbeidstakerErstatterAnnenPerson"],
  })
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
