/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateArbeidstakerSkjemaRequest {
  fnr: string;
}

export interface SkatteforholdOgInntektDto {
  erSkattepliktigTilNorgeIHeleutsendingsperioden: boolean;
  mottarPengestotteFraAnnetEosLandEllerSveits: boolean;
  landSomUtbetalerPengestotte?: string;
  pengestotteSomMottasFraAndreLandBelop?: string;
  pengestotteSomMottasFraAndreLandBeskrivelse?: string;
}

export interface ArbeidstakerenDto {
  harNorskFodselsnummer: boolean;
  fodselsnummer?: string;
  fornavn?: string;
  etternavn?: string;
  /** @format date */
  fodselsdato?: string;
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: boolean;
  aktivitetIMaanedenFoerUtsendingen: string;
  skalJobbeForFlereVirksomheter: boolean;
  norskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode?: NorskVirksomhet[];
  utenlandskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode?: UtenlandskVirksomhet[];
}

export interface NorskVirksomhet {
  organisasjonsnummer: string;
}

export interface UtenlandskVirksomhet {
  navn: string;
  organisasjonsnummer: string;
  vegnavnOgHusnummer: string;
  bygning?: string;
  postkode: string;
  byStedsnavn: string;
  region: string;
  land: string;
  tilhorerSammeKonsern: boolean;
}

export interface CreateArbeidsgiverSkjemaRequest {
  orgnr: string;
}

export interface UtenlandsoppdragetDto {
  utsendelseLand: string;
  /** @format date */
  arbeidstakerUtsendelseFraDato: string;
  /** @format date */
  arbeidstakerUtsendelseTilDato: string;
  arbeidsgiverHarOppdragILandet: boolean;
  arbeidstakerBleAnsattForUtenlandsoppdraget: boolean;
  arbeidstakerForblirAnsattIHelePerioden: boolean;
  arbeidstakerErstatterAnnenPerson: boolean;
  arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget?: boolean;
  utenlandsoppholdetsBegrunnelse?: string;
  ansettelsesforholdBeskrivelse?: string;
  /** @format date */
  forrigeArbeidstakerUtsendelseFradato?: string;
  /** @format date */
  forrigeArbeidstakerUtsendelseTilDato?: string;
}

export interface SubmitSkjemaRequest {
  bekreftetRiktighet: boolean;
  /** @format date-time */
  submittedAt: string;
}

export interface ArbeidstakerensLonnDto {
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: boolean;
  virksomheterSomUtbetalerLonnOgNaturalytelser?: VirksomheterSomUtbetalerLonnOgNaturalytelser;
}

export interface VirksomheterSomUtbetalerLonnOgNaturalytelser {
  norskeVirksomheter?: NorskVirksomhet[];
  utenlandskeVirksomheter?: UtenlandskVirksomhet[];
}

export interface ArbeidsgiverensVirksomhetINorgeDto {
  erArbeidsgiverenOffentligVirksomhet: boolean;
  erArbeidsgiverenBemanningsEllerVikarbyraa: boolean;
  opprettholderArbeidsgivereVanligDrift: boolean;
}

export interface ArbeidsgiverenDto {
  organisasjonsnummer: string;
  organisasjonNavn: string;
}

export interface ArbeidsgiversSkjemaDataDto {
  arbeidsgiveren?: ArbeidsgiverenDto;
  arbeidsgiverensVirksomhetINorge?: ArbeidsgiverensVirksomhetINorgeDto;
  utenlandsoppdraget?: UtenlandsoppdragetDto;
  arbeidstakerensLonn?: ArbeidstakerensLonnDto;
}

export interface ArbeidsgiversSkjemaDto {
  /** @format uuid */
  id: string;
  orgnr: string;
  status: "UTKAST" | "SENDT" | "MOTTATT";
  data: ArbeidsgiversSkjemaDataDto;
}

export interface OrganisasjonDto {
  orgnr: string;
  navn: string;
  organisasjonsform: string;
}
