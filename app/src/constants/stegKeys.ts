export const StegKey = {
  ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE: "arbeidsgiverens-virksomhet-i-norge",
  UTENLANDSOPPDRAGET: "utenlandsoppdraget",
  ARBEIDSSTED_I_UTLANDET: "arbeidssted-i-utlandet",
  ARBEIDSTAKERENS_LONN: "arbeidstakerens-lonn",
  TILLEGGSOPPLYSNINGER: "tilleggsopplysninger",
  VEDLEGG: "vedlegg",
  OPPSUMMERING: "oppsummering",
  ARBEIDSSITUASJON: "arbeidssituasjon",
  SKATTEFORHOLD_OG_INNTEKT: "skatteforhold-og-inntekt",
  FAMILIEMEDLEMMER: "familiemedlemmer",
  UTSENDINGSPERIODE_OG_LAND: "utsendingsperiode-og-land",
} as const;

export type StegKey = (typeof StegKey)[keyof typeof StegKey];
