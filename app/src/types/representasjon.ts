/**
 * Representasjonstyper tilgjengelig for brukeren
 */
export type RepresentasjonsType =
  | "DEG_SELV"
  | "ARBEIDSGIVER"
  | "RADGIVER"
  | "ANNEN_PERSON";

/**
 * Organisasjonsinformasjon
 */
export interface Organisasjon {
  /** Organisasjonsnummer */
  orgnr: string;
  /** Organisasjonsnavn */
  navn: string;
}

/**
 * Personinformasjon
 */
export interface Person {
  /**
   * Fødselsnummer
   * VIKTIG: Skal maskeres når det vises til brukere
   * Bruk maskFnr utility-funksjonen for visning
   */
  fnr: string;
  /** Fullt navn på personen */
  navn: string;
  /** Etternavn (kun nødvendig for PDL-verifisering uten fullmakt) */
  etternavn?: string;
  /** Fødselsdato i ISO-format (valgfritt) */
  fodselsdato?: string;
}

/**
 * Representasjonskontekst som holder styr på hvem brukeren handler på vegne av
 * Lagres i sessionStorage for å persistere på tvers av siderefresh
 */
export interface RepresentasjonskontekstDto {
  /** Typen representasjon som er valgt */
  type: RepresentasjonsType;
  /** Rådgiverfirma (kun for RADGIVER-type) */
  radgiverfirma?: Organisasjon;
  /** Arbeidsgiverorganisasjon (for ARBEIDSGIVER-type) */
  arbeidsgiver?: Organisasjon;
  /** Arbeidstaker som representeres */
  arbeidstaker?: Person;
  /** Om brukeren har fullmakt */
  harFullmakt: boolean;
  /** Personen som har fått fullmakt */
  fullmektig?: Person;
}
