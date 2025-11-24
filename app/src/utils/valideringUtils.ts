import {
  OpprettSoknadMedKontekstRequest,
  PersonDto,
  SimpleOrganisasjonDto,
} from "~/types/melosysSkjemaTypes.ts";

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
  kontekst: OpprettSoknadMedKontekstRequest,
  arbeidsgiver?: SimpleOrganisasjonDto,
  arbeidstaker?: PersonDto,
): SoknadValideringsresultat {
  // Arbeidsgiver er påkrevd for alle representasjonstyper
  const manglerArbeidsgiver = !arbeidsgiver;

  // Arbeidstaker er påkrevd for alle unntatt DEG_SELV (settes automatisk)
  const manglerArbeidstaker =
    kontekst.representasjonstype !== "DEG_SELV" && !arbeidstaker;

  return {
    gyldig: !manglerArbeidsgiver && !manglerArbeidstaker,
    manglerArbeidsgiver,
    manglerArbeidstaker,
  };
}
