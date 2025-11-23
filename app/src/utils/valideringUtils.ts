import type {
  Organisasjon,
  Person,
  RepresentasjonskontekstDto,
} from "~/types/representasjon";

export interface SoknadValideringsresultat {
  gyldig: boolean;
  manglerArbeidsgiver: boolean;
  manglerArbeidstaker: boolean;
}

/**
 * Validerer om nødvendig data er tilstede for å starte en søknad
 * basert på representasjonskontekst.
 *
 * @param kontekst - Representasjonskonteksten
 * @param arbeidsgiver - Valgt arbeidsgiver (valgfritt)
 * @param arbeidstaker - Valgt arbeidstaker (valgfritt)
 * @returns Valideringsresultat med info om hva som mangler
 */
export function validerSoknadKontekst(
  kontekst: RepresentasjonskontekstDto,
  arbeidsgiver?: Organisasjon,
  arbeidstaker?: Person,
): SoknadValideringsresultat {
  // Valider arbeidsgiver (kun for ARBEIDSGIVER og RADGIVER)
  const manglerArbeidsgiver =
    (kontekst.type === "ARBEIDSGIVER" || kontekst.type === "RADGIVER") &&
    !arbeidsgiver;

  // Valider arbeidstaker (ikke for DEG_SELV)
  const manglerArbeidstaker = kontekst.type !== "DEG_SELV" && !arbeidstaker;

  return {
    gyldig: !manglerArbeidsgiver && !manglerArbeidstaker,
    manglerArbeidsgiver,
    manglerArbeidstaker,
  };
}
