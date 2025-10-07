/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
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

export interface SkatteforholdOgInntektRequest {
  erSkattepliktigTilNorgeIHeleutsendingsperioden: boolean;
  mottarPengestotteFraAnnetEosLandEllerSveits: boolean;
  landSomUtbetalerPengestotte?: string;
  pengestotteSomMottasFraAndreLandBelop?: string;
  pengestotteSomMottasFraAndreLandBeskrivelse?: string;
}

export interface ArbeidstakerRequest {
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

export interface VirksomhetRequest {
  erArbeidsgiverenOffentligVirksomhet: boolean;
  erArbeidsgiverenBemanningsEllerVikarbyraa: boolean;
  opprettholderArbeidsgivereVanligDrift: boolean;
}

export interface UtenlandsoppdragRequest {
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

export interface ArbeidstakerLonnRequest {
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: boolean;
  virksomheterSomUtbetalerLonnOgNaturalytelser?: VirksomheterSomUtbetalerLonnOgNaturalytelser;
}

export interface VirksomheterSomUtbetalerLonnOgNaturalytelser {
  norskeVirksomheter?: NorskVirksomhet[];
  utenlandskeVirksomheter?: UtenlandskVirksomhet[];
}

export interface ArbeidsgiverRequest {
  organisasjonsnummer: string;
  organisasjonNavn: string;
}

export interface OrganisasjonDto {
  orgnr: string;
  navn: string;
  organisasjonsform: string;
}
