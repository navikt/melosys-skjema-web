/**
 * Toggle-navn i teamets Unleash-instans. Må matche konstantene i melosys-skjema-api
 * (ToggleNavn.kt) eksakt — navnene sendes som query-parametre til /api/featuretoggle.
 */
export const MOTPART_CTA = "melosys.skjema.motpart-cta";
export const INNSENDT_SAMMENDRAG = "melosys.skjema.innsendt-sammendrag";
// MIDLERTIDIG MELOSYS-7694: fjernes når statsansattflyten er permanent. Se README.
export const STATSANSATT_FLYT = "melosys.skjema.statsansatt-flyt";

export const alleToggleNavn = [
  MOTPART_CTA,
  INNSENDT_SAMMENDRAG,
  STATSANSATT_FLYT,
] as const;
export type ToggleNavn = (typeof alleToggleNavn)[number];
