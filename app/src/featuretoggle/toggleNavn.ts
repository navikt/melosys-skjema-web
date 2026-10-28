/**
 * Toggle-navn i teamets Unleash-instans. Må matche konstantene i melosys-skjema-api
 * (ToggleNavn.kt) eksakt — navnene sendes som query-parametre til /api/featuretoggle.
 */
export const INNSENDT_SAMMENDRAG = "melosys.skjema.innsendt-sammendrag";

export const alleToggleNavn = [INNSENDT_SAMMENDRAG] as const;
export type ToggleNavn = (typeof alleToggleNavn)[number];
