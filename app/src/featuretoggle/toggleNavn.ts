/**
 * Toggle-navn i teamets Unleash-instans. Må matche konstantene i melosys-skjema-api
 * (ToggleNavn.kt) eksakt — navnene sendes som query-parametre til /api/featuretoggle.
 */
export const MOTPART_CTA = "melosys.skjema.motpart-cta";
export const INNSENDT_SAMMENDRAG = "melosys.skjema.innsendt-sammendrag";

export const alleToggleNavn = [MOTPART_CTA, INNSENDT_SAMMENDRAG] as const;
export type ToggleNavn = (typeof alleToggleNavn)[number];
