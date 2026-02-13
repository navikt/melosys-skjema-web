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

type UtilRequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export enum Sprak {
  Nb = "nb",
  En = "en",
}

export enum TypeInnretning {
  PLATTFORM_ELLER_ANNEN_FAST_INNRETNING = "PLATTFORM_ELLER_ANNEN_FAST_INNRETNING",
  BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING = "BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING",
}

export enum FastEllerVekslendeArbeidssted {
  FAST = "FAST",
  VEKSLENDE = "VEKSLENDE",
}

export enum Farvann {
  INTERNASJONALT_FARVANN = "INTERNASJONALT_FARVANN",
  TERRITORIALFARVANN = "TERRITORIALFARVANN",
}

export enum ArbeidsstedType {
  PA_LAND = "PA_LAND",
  OFFSHORE = "OFFSHORE",
  PA_SKIP = "PA_SKIP",
  OM_BORD_PA_FLY = "OM_BORD_PA_FLY",
}

export enum Ansettelsesform {
  ARBEIDSTAKER_ELLER_FRILANSER = "ARBEIDSTAKER_ELLER_FRILANSER",
  SELVSTENDIG_NAERINGSDRIVENDE = "SELVSTENDIG_NAERINGSDRIVENDE",
  STATSANSATT = "STATSANSATT",
}

export enum SkjemaType {
  UTSENDT_ARBEIDSTAKER = "UTSENDT_ARBEIDSTAKER",
}

export enum LandKode {
  AT = "AT",
  AX = "AX",
  BE = "BE",
  BG = "BG",
  CH = "CH",
  CY = "CY",
  CZ = "CZ",
  DE = "DE",
  DK = "DK",
  EE = "EE",
  ES = "ES",
  FI = "FI",
  FO = "FO",
  FR = "FR",
  GB = "GB",
  GL = "GL",
  GR = "GR",
  HR = "HR",
  HU = "HU",
  IE = "IE",
  IS = "IS",
  IT = "IT",
  LI = "LI",
  LT = "LT",
  LU = "LU",
  LV = "LV",
  MT = "MT",
  NL = "NL",
  PL = "PL",
  PT = "PT",
  RO = "RO",
  SE = "SE",
  SI = "SI",
  SJ = "SJ",
  SK = "SK",
}

export enum Sorteringsretning {
  ASC = "ASC",
  DESC = "DESC",
}

export enum SorteringsFelt {
  ARBEIDSGIVER = "ARBEIDSGIVER",
  ARBEIDSTAKER = "ARBEIDSTAKER",
  INNSENDT_DATO = "INNSENDT_DATO",
  STATUS = "STATUS",
}

export enum Skjemadel {
  ARBEIDSTAKERS_DEL = "ARBEIDSTAKERS_DEL",
  ARBEIDSGIVERS_DEL = "ARBEIDSGIVERS_DEL",
}

export enum Representasjonstype {
  DEG_SELV = "DEG_SELV",
  ARBEIDSGIVER = "ARBEIDSGIVER",
  ARBEIDSGIVER_MED_FULLMAKT = "ARBEIDSGIVER_MED_FULLMAKT",
  RADGIVER = "RADGIVER",
  RADGIVER_MED_FULLMAKT = "RADGIVER_MED_FULLMAKT",
  ANNEN_PERSON = "ANNEN_PERSON",
}

export enum SkjemaStatus {
  UTKAST = "UTKAST",
  SENDT = "SENDT",
}

export interface FeltDefinisjonDto {
  hjelpetekst?: string;
  pakrevd: boolean;
  label: string;
  type: string;
}

export interface SkjemaInnsendtKvittering {
  /** @format uuid */
  skjemaId: string;
  referanseId: string;
  status: SkjemaStatus;
}

export interface OpprettSoknadMedKontekstRequest {
  representasjonstype: Representasjonstype;
  skjemadel: Skjemadel;
  radgiverfirma?: SimpleOrganisasjonDto;
  arbeidsgiver: SimpleOrganisasjonDto;
  arbeidstaker: PersonDto;
}

export interface PersonDto {
  /** @minLength 1 */
  fnr: string;
  etternavn?: string;
}

export interface SimpleOrganisasjonDto {
  /** @minLength 1 */
  orgnr: string;
  /** @minLength 1 */
  navn: string;
}

export interface OpprettSoknadMedKontekstResponse {
  /** @format uuid */
  id: string;
  status: SkjemaStatus;
}

export interface HentInnsendteSoknaderRequest {
  /**
   * @format int32
   * @min 1
   */
  side: number;
  /**
   * @format int32
   * @min 1
   * @max 100
   */
  antall: number;
  sok?: string;
  sortering?: SorteringsFelt;
  retning?: Sorteringsretning;
  representasjonstype: Representasjonstype;
  radgiverfirmaOrgnr?: string;
}

export interface InnsendtSoknadOversiktDto {
  /** @format uuid */
  id: string;
  referanseId?: string;
  arbeidsgiverNavn?: string;
  arbeidsgiverOrgnr: string;
  arbeidstakerNavn?: string;
  arbeidstakerFnrMaskert?: string;
  /** @format date */
  arbeidstakerFodselsdato: string;
  /** @format date-time */
  innsendtDato: string;
  status: SkjemaStatus;
  harPdf: boolean;
}

export interface InnsendteSoknaderResponse {
  soknader: InnsendtSoknadOversiktDto[];
  /** @format int32 */
  totaltAntall: number;
  /** @format int32 */
  side: number;
  /** @format int32 */
  antallPerSide: number;
}

export interface PeriodeDto {
  /** @format date */
  fraDato: string;
  /** @format date */
  tilDato: string;
}

export interface UtenlandsoppdragetArbeidstakersDelDto {
  utsendelsesLand: LandKode;
  utsendelsePeriode: PeriodeDto;
}

export type AnnenPersonMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "arbeidsgiverNavn"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "metadatatype"
> & {
  fullmektigFnr: string;
};

export type ArbeidsgiverMedFullmaktMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "arbeidsgiverNavn"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "metadatatype"
> & {
  fullmektigFnr: string;
};

export type ArbeidsgiverMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "arbeidsgiverNavn"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "metadatatype"
>;

export type DegSelvMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "arbeidsgiverNavn"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "metadatatype"
>;

export type RadgiverMedFullmaktMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "arbeidsgiverNavn"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "metadatatype"
> & {
  fullmektigFnr: string;
  radgiverfirma: RadgiverfirmaInfo;
};

export type RadgiverMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "arbeidsgiverNavn"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "metadatatype"
> & {
  radgiverfirma: RadgiverfirmaInfo;
};

export interface RadgiverfirmaInfo {
  orgnr: string;
  navn: string;
}

export interface UtsendtArbeidstakerMetadata {
  representasjonstype: Representasjonstype;
  arbeidsgiverNavn: string;
  juridiskEnhetOrgnr: string;
  /** @format uuid */
  kobletSkjemaId?: string;
  skjemadel: Skjemadel;
  /** @format uuid */
  erstatterSkjemaId?: string;
  metadatatype: string;
}

export interface UtsendtArbeidstakerSkjemaData {
  type: string;
}

export interface UtsendtArbeidstakerSkjemaDto {
  /** @format uuid */
  id: string;
  status: SkjemaStatus;
  type: SkjemaType;
  fnr: string;
  orgnr: string;
  metadata:
    | AnnenPersonMetadata
    | ArbeidsgiverMedFullmaktMetadata
    | ArbeidsgiverMetadata
    | DegSelvMetadata
    | RadgiverMedFullmaktMetadata
    | RadgiverMetadata;
  data: UtsendtArbeidstakerSkjemaData;
}

export interface TilleggsopplysningerDto {
  harFlereOpplysningerTilSoknaden: boolean;
  tilleggsopplysningerTilSoknad?: string;
}

export interface SkatteforholdOgInntektDto {
  erSkattepliktigTilNorgeIHeleutsendingsperioden: boolean;
  mottarPengestotteFraAnnetEosLandEllerSveits: boolean;
  landSomUtbetalerPengestotte?: string;
  pengestotteSomMottasFraAndreLandBelop?: string;
  pengestotteSomMottasFraAndreLandBeskrivelse?: string;
}

export interface Familiemedlem {
  fornavn: string;
  etternavn: string;
  harNorskFodselsnummerEllerDnummer: boolean;
  fodselsnummer?: string;
  /** @format date */
  fodselsdato?: string;
}

export interface FamiliemedlemmerDto {
  skalHaMedFamiliemedlemmer: boolean;
  familiemedlemmer: Familiemedlem[];
}

export interface ArbeidssituasjonDto {
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: boolean;
  aktivitetIMaanedenFoerUtsendingen?: string;
  skalJobbeForFlereVirksomheter: boolean;
  virksomheterArbeidstakerJobberForIutsendelsesPeriode?: NorskeOgUtenlandskeVirksomheterMedAnsettelsesform;
}

export interface NorskVirksomhet {
  /** @minLength 1 */
  organisasjonsnummer: string;
}

export interface NorskeOgUtenlandskeVirksomheterMedAnsettelsesform {
  norskeVirksomheter?: NorskVirksomhet[];
  utenlandskeVirksomheter?: UtenlandskVirksomhetMedAnsettelsesform[];
}

export interface UtenlandskVirksomhetMedAnsettelsesform {
  navn: string;
  organisasjonsnummer?: string;
  vegnavnOgHusnummer: string;
  bygning?: string;
  postkode?: string;
  byStedsnavn?: string;
  region?: string;
  land: string;
  tilhorerSammeKonsern: boolean;
  ansettelsesform: Ansettelsesform;
}

export interface UtenlandsoppdragetDto {
  utsendelseLand: LandKode;
  arbeidstakerUtsendelsePeriode: PeriodeDto;
  arbeidsgiverHarOppdragILandet: boolean;
  arbeidstakerBleAnsattForUtenlandsoppdraget: boolean;
  arbeidstakerForblirAnsattIHelePerioden: boolean;
  arbeidstakerErstatterAnnenPerson: boolean;
  arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget?: boolean;
  utenlandsoppholdetsBegrunnelse?: string;
  ansettelsesforholdBeskrivelse?: string;
  forrigeArbeidstakerUtsendelsePeriode?: PeriodeDto;
}

export interface ArbeidstakerensLonnDto {
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: boolean;
  virksomheterSomUtbetalerLonnOgNaturalytelser?: NorskeOgUtenlandskeVirksomheter;
}

export interface NorskeOgUtenlandskeVirksomheter {
  norskeVirksomheter?: NorskVirksomhet[];
  utenlandskeVirksomheter?: UtenlandskVirksomhet[];
}

export interface UtenlandskVirksomhet {
  navn: string;
  organisasjonsnummer?: string;
  vegnavnOgHusnummer: string;
  bygning?: string;
  postkode?: string;
  byStedsnavn?: string;
  region?: string;
  land: string;
  tilhorerSammeKonsern: boolean;
}

export interface ArbeidsstedIUtlandetDto {
  arbeidsstedType: ArbeidsstedType;
  paLand?: PaLandDto;
  offshore?: OffshoreDto;
  paSkip?: PaSkipDto;
  omBordPaFly?: OmBordPaFlyDto;
}

export interface OffshoreDto {
  navnPaVirksomhet: string;
  navnPaInnretning: string;
  typeInnretning: TypeInnretning;
  sokkelLand: LandKode;
}

export interface OmBordPaFlyDto {
  navnPaVirksomhet: string;
  hjemmebaseLand: LandKode;
  hjemmebaseNavn: string;
  erVanligHjemmebase: boolean;
  vanligHjemmebaseLand?: LandKode;
  vanligHjemmebaseNavn?: string;
}

export interface PaLandDto {
  navnPaVirksomhet: string;
  fastEllerVekslendeArbeidssted: FastEllerVekslendeArbeidssted;
  fastArbeidssted?: PaLandFastArbeidsstedDto;
  beskrivelseVekslende?: string;
  erHjemmekontor: boolean;
}

export interface PaLandFastArbeidsstedDto {
  vegadresse: string;
  nummer: string;
  postkode: string;
  bySted: string;
}

export interface PaSkipDto {
  navnPaVirksomhet: string;
  navnPaSkip: string;
  yrketTilArbeidstaker: string;
  seilerI: Farvann;
  flaggland?: LandKode;
  territorialfarvannLand?: LandKode;
}

export interface ArbeidsgiverensVirksomhetINorgeDto {
  erArbeidsgiverenOffentligVirksomhet: boolean;
  erArbeidsgiverenBemanningsEllerVikarbyraa?: boolean;
  opprettholderArbeidsgiverenVanligDrift?: boolean;
}

export interface VerifiserPersonRequest {
  /** @minLength 1 */
  fodselsnummer: string;
  /** @minLength 1 */
  etternavn: string;
}

export interface VerifiserPersonResponse {
  navn: string;
  /** @format date */
  fodselsdato: string;
}

export interface UtsendtArbeidstakerM2MSkjemaData {
  skjemaer: UtsendtArbeidstakerSkjemaDto[];
  referanseId: string;
}

export interface AlternativDefinisjonDto {
  verdi: string;
  label: string;
  beskrivelse?: string;
}

export type BooleanFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "pakrevd" | "label"
> & {
  jaLabel: string;
  neiLabel: string;
};

export type CountrySelectFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "pakrevd" | "label"
>;

export type DateFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "pakrevd" | "label"
>;

/** Innsendt søknad med skjemadefinisjon for korrekt visning */
export interface InnsendtSkjemaResponse {
  /**
   * Skjema-ID
   * @format uuid
   */
  skjemaId: string;
  /**
   * Referansenummer
   * @example "MEL-AB12CD"
   */
  referanseId: string;
  /**
   * Tidspunkt for innsending
   * @format date-time
   */
  innsendtDato: string;
  /**
   * Språk som ble brukt ved innsending
   * @example "nb"
   */
  innsendtSprak: Sprak;
  /**
   * Versjon av skjemadefinisjon som ble brukt
   * @example 1
   */
  skjemaDefinisjonVersjon: string;
  /** Arbeidstakers del av søknaden */
  arbeidstakerData?: UtsendtArbeidstakerArbeidstakersSkjemaDataDto;
  /** Arbeidsgivers del av søknaden */
  arbeidsgiverData?: UtsendtArbeidstakerArbeidsgiversSkjemaDataDto;
  /** Skjemadefinisjon for visning (basert på lagret versjon) */
  definisjon: SkjemaDefinisjonDto;
}

export type ListeFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "pakrevd" | "label"
> & {
  leggTilLabel: string;
  fjernLabel: string;
  tomListeMelding?: string;
  elementDefinisjon: Record<
    string,
    | BooleanFeltDefinisjon
    | CountrySelectFeltDefinisjon
    | DateFeltDefinisjon
    | ListeFeltDefinisjon
    | PeriodeFeltDefinisjon
    | SelectFeltDefinisjon
    | TextFeltDefinisjon
    | TextareaFeltDefinisjon
  >;
};

export type PeriodeFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "pakrevd" | "label"
> & {
  fraDatoLabel: string;
  tilDatoLabel: string;
};

export interface SeksjonDefinisjonDto {
  tittel: string;
  beskrivelse?: string;
  felter: Record<
    string,
    | BooleanFeltDefinisjon
    | CountrySelectFeltDefinisjon
    | DateFeltDefinisjon
    | ListeFeltDefinisjon
    | PeriodeFeltDefinisjon
    | SelectFeltDefinisjon
    | TextFeltDefinisjon
    | TextareaFeltDefinisjon
  >;
}

export type SelectFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "pakrevd" | "label"
> & {
  alternativer: AlternativDefinisjonDto[];
};

export interface SkjemaDefinisjonDto {
  type: string;
  versjon: string;
  seksjoner: Record<string, SeksjonDefinisjonDto>;
}

export type TextFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "pakrevd" | "label"
>;

export type TextareaFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "pakrevd" | "label"
> & {
  /** @format int32 */
  maxLength?: number;
};

export interface UtsendtArbeidstakerArbeidsgiversSkjemaDataDto {
  type: string;
  arbeidsgiverensVirksomhetINorge?: ArbeidsgiverensVirksomhetINorgeDto;
  utenlandsoppdraget?: UtenlandsoppdragetDto;
  arbeidstakerensLonn?: ArbeidstakerensLonnDto;
  arbeidsstedIUtlandet?: ArbeidsstedIUtlandetDto;
  tilleggsopplysninger?: TilleggsopplysningerDto;
}

export interface UtsendtArbeidstakerArbeidstakersSkjemaDataDto {
  type: string;
  utenlandsoppdraget?: UtenlandsoppdragetArbeidstakersDelDto;
  arbeidssituasjon?: ArbeidssituasjonDto;
  skatteforholdOgInntekt?: SkatteforholdOgInntektDto;
  familiemedlemmer?: FamiliemedlemmerDto;
  tilleggsopplysninger?: TilleggsopplysningerDto;
}

export interface UtkastListeResponse {
  utkast: UtkastOversiktDto[];
  /** @format int32 */
  antall: number;
}

export interface UtkastOversiktDto {
  /** @format uuid */
  id: string;
  arbeidsgiverNavn?: string;
  arbeidsgiverOrgnr?: string;
  arbeidstakerNavn?: string;
  arbeidstakerFnrMaskert?: string;
  /** @format date-time */
  opprettetDato: string;
  /** @format date-time */
  sistEndretDato: string;
  status: SkjemaStatus;
}

/** Informasjon om aktiv versjon for en skjematype */
export interface AktivVersjonResponse {
  /**
   * Skjematype
   * @example "A1"
   */
  type: SkjemaType;
  /**
   * Aktiv versjon
   * @example 1
   */
  aktivVersjon: string;
}

/** Liste over støttede skjematyper */
export interface StottedeTyperResponse {
  /**
   * Støttede skjematyper
   * @uniqueItems true
   * @example ["A1"]
   */
  typer: SkjemaType[];
}

export interface Fullmakt {
  fullmaktsgiver: string;
  fullmektig: string;
  leserettigheter: string[];
  skriverettigheter: string[];
}

export interface PersonMedFullmaktDto {
  fnr: string;
  navn: string;
  /** @format date */
  fodselsdato: string;
}

export interface OrganisasjonDto {
  orgnr: string;
  navn: string;
  organisasjonsform: string;
}

export interface ArbeidsgiverensVirksomhetINorgeTranslation {
  offentligVirksomhetSkalIkkeOppgiBemanningsbyraa: string;
  offentligVirksomhetSkalIkkeOppgiVanligDrift: string;
  maaOppgiOmBemanningsbyraa: string;
  maaOppgiOmVanligDrift: string;
}

export interface ArbeidssituasjonTranslation {
  maaOppgiAktivitetFoerUtsending: string;
  maaOppgiMinstEnVirksomhet: string;
}

export interface ArbeidsstedIUtlandetTranslation {
  maaOppgiArbeidsstedPaLand: string;
  maaOppgiOffshoreArbeidssted: string;
  maaOppgiArbeidsstedPaSkip: string;
  maaOppgiArbeidsstedOmBordPaFly: string;
}

export interface ArbeidstakerensLonnTranslation {
  virksomheterSkalIkkeOppgis: string;
  maaOppgiVirksomheter: string;
}

export interface ErrorMessageTranslation {
  arbeidsgiverensVirksomhetINorgeTranslation: ArbeidsgiverensVirksomhetINorgeTranslation;
  arbeidssituasjonTranslation: ArbeidssituasjonTranslation;
  arbeidsstedIUtlandetTranslation: ArbeidsstedIUtlandetTranslation;
  omBordPaFlyTranslation: OmBordPaFlyTranslation;
  paLandTranslation: PaLandTranslation;
  paSkipTranslation: PaSkipTranslation;
  arbeidstakerensLonnTranslation: ArbeidstakerensLonnTranslation;
  periodeTranslation: PeriodeTranslation;
  skatteforholdOgInntektTranslation: SkatteforholdOgInntektTranslation;
  tilleggsopplysningerTranslation: TilleggsopplysningerTranslation;
  utenlandsoppdragetTranslation: UtenlandsoppdragetTranslation;
  utenlandsoppdragetArbeidstakerTranslation: UtenlandsoppdragetArbeidstakerTranslation;
  familiemedlemmerTranslation: FamiliemedlemmerTranslation;
  fellesTranslation: FellesTranslation;
}

export interface ErrorMessageTranslations {
  no: ErrorMessageTranslation;
  en: ErrorMessageTranslation;
}

export interface FamiliemedlemmerTranslation {
  familiemedlemmerMaaVaereTomNarSkalHaMedFamiliemedlemmerErFalse: string;
  fornavnMaaOppgis: string;
  etternavnMaaOppgis: string;
  fodselsnummerMaaOppgis: string;
  fodselsdatoMaaOppgis: string;
}

export interface FellesTranslation {
  organisasjonsnummerHarUgyldigFormat: string;
  organisasjonsnummerFinnesIkke: string;
  ugyldigFodselsellerDNummer: string;
}

export interface OmBordPaFlyTranslation {
  vanligHjemmebaseLandSkalIkkeOppgis: string;
  vanligHjemmebaseNavnSkalIkkeOppgis: string;
  maaOppgiVanligHjemmebaseLand: string;
  maaOppgiVanligHjemmebaseNavn: string;
}

export interface PaLandTranslation {
  maaOppgiFastArbeidssted: string;
  beskrivelseVekslendeSkalIkkeOppgis: string;
  fastArbeidsstedSkalIkkeOppgis: string;
  maaOppgiBeskrivelseVekslende: string;
}

export interface PaSkipTranslation {
  duMaOppgiFlaggland: string;
  territorialfarvannLandSkalIkkeOppgis: string;
  duMaOppgiTerritorialfarvannLand: string;
  flagglandSkalIkkeOppgis: string;
}

export interface PeriodeTranslation {
  fraDatoMaaVaereFoerTilDato: string;
}

export interface SkatteforholdOgInntektTranslation {
  maaOppgiLandSomUtbetalerPengestotte: string;
  maaOppgiBelopPengestotte: string;
  maaOppgiBeskrivelsePengestotte: string;
}

export interface TilleggsopplysningerTranslation {
  maaOppgiTilleggsopplysninger: string;
  tilleggsopplysningerSkalIkkeOppgis: string;
}

export interface UtenlandsoppdragetArbeidstakerTranslation {
  duMaOppgiUtsendelsesland: string;
}

export interface UtenlandsoppdragetTranslation {
  duMaOppgiBegrunnelse: string;
  duMaOppgiOmArbeidstakerVilJobbeEtterOppdraget: string;
  duMaOppgiBeskrivelseAvAnsettelsesforhold: string;
  duMaOppgiForrigeArbeidstakerUtsendelsePeriode: string;
}

export interface OrganisasjonMedJuridiskEnhetDto {
  organisasjon: SimpleOrganisasjonDto;
  juridiskEnhet: SimpleOrganisasjonDto;
}

// Type aliases for e2e-tester - wrapper-typer rundt skjema-data
export interface ArbeidsgiversSkjemaDto {
  id: string;
  orgnr: string;
  status: SkjemaStatus;
  data: UtsendtArbeidstakerArbeidsgiversSkjemaDataDto;
}

export interface ArbeidstakersSkjemaDto {
  id: string;
  fnr: string;
  status: SkjemaStatus;
  data: UtsendtArbeidstakerArbeidstakersSkjemaDataDto;
}
