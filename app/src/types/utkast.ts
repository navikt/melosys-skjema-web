/**
 * Typer for utkastoversikt (påbegynte søknader).
 */

export interface UtkastOversiktDto {
  /** Skjema ID */
  id: string;
  /** Arbeidsgiver navn (nullable) */
  arbeidsgiverNavn: string | null;
  /** Arbeidsgiver organisasjonsnummer (nullable) */
  arbeidsgiverOrgnr: string | null;
  /** Arbeidstaker navn (nullable) */
  arbeidstakerNavn: string | null;
  /** Maskert fødselsnummer (f.eks. "010190*****") */
  arbeidstakerFnrMaskert: string | null;
  /** Opprettet tidspunkt (ISO 8601) */
  opprettetDato: string;
  /** Sist endret tidspunkt (ISO 8601) */
  sistEndretDato: string;
  /** Status (alltid UTKAST for denne listen) */
  status: "UTKAST" | "SENDT" | "MOTTATT";
}

export interface UtkastListeResponse {
  /** Liste over utkast */
  utkast: UtkastOversiktDto[];
  /** Antall utkast */
  antall: number;
}
