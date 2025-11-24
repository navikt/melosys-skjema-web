/**
 * Sorteringsfelter for innsendte søknader
 */
export type SorteringsFelt = "ARBEIDSGIVER" | "ARBEIDSTAKER" | "INNSENDT_DATO";

/**
 * Sorteringsretning
 */
export type Sorteringsretning = "ASC" | "DESC";

/**
 * Request for å hente innsendte søknader
 */
export interface HentInnsendteSoknaderRequest {
  /** Sidenummer (1-indeksert) */
  side: number;
  /** Antall resultater per side */
  antall: number;
  /** Fritekst-søk (søker i arbeidsgiver navn/orgnr, arbeidstaker navn) */
  sok?: string;
  /** Felt å sortere på */
  sortering?: SorteringsFelt;
  /** Sorteringsretning */
  retning?: Sorteringsretning;
  /** Representasjonstype for filtrering */
  representasjonstype: string;
  /** Rådgiverfirma orgnr (kun påkrevd for RADGIVER) */
  radgiverfirmaOrgnr?: string;
}

/**
 * En innsendt søknad i oversikten
 */
export interface InnsendtSoknadOversiktDto {
  id: string;
  arbeidsgiverNavn?: string;
  arbeidsgiverOrgnr?: string;
  arbeidstakerNavn?: string;
  arbeidstakerFnrMaskert?: string;
  innsendtDato: string;
  status: "UTKAST" | "SENDT" | "MOTTATT";
  harPdf: boolean;
}

/**
 * Response med paginert liste av innsendte søknader
 */
export interface InnsendteSoknaderResponse {
  soknader: InnsendtSoknadOversiktDto[];
  totaltAntall: number;
  side: number;
  antallPerSide: number;
}
