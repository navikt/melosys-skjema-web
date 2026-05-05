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

export enum TypeInnretning {
  PLATTFORM_ELLER_ANNEN_FAST_INNRETNING = "PLATTFORM_ELLER_ANNEN_FAST_INNRETNING",
  BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING = "BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING",
}

export enum Skjemadel {
  ARBEIDSTAKERS_DEL = "ARBEIDSTAKERS_DEL",
  ARBEIDSGIVERS_DEL = "ARBEIDSGIVERS_DEL",
  ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL = "ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL",
}

export enum SkjemaType {
  UTSENDT_ARBEIDSTAKER = "UTSENDT_ARBEIDSTAKER",
}

export enum SkjemaStatus {
  UTKAST = "UTKAST",
  SENDT = "SENDT",
  SLETTET = "SLETTET",
}

export enum Representasjonstype {
  DEG_SELV = "DEG_SELV",
  ARBEIDSGIVER = "ARBEIDSGIVER",
  ARBEIDSGIVER_MED_FULLMAKT = "ARBEIDSGIVER_MED_FULLMAKT",
  RADGIVER = "RADGIVER",
  RADGIVER_MED_FULLMAKT = "RADGIVER_MED_FULLMAKT",
  ANNEN_PERSON = "ANNEN_PERSON",
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
  NO = "NO",
  PL = "PL",
  PT = "PT",
  RO = "RO",
  SE = "SE",
  SI = "SI",
  SJ = "SJ",
  SK = "SK",
}

export enum VedleggFiltype {
  PDF = "PDF",
  JPEG = "JPEG",
  PNG = "PNG",
}

export interface FeltDefinisjonDto {
  hjelpetekst?: string;
  pakrevd: boolean;
  label: string;
  type: string;
}

export interface VedleggDto {
  /** @format uuid */
  id: string;
  filnavn: string;
  filtype: VedleggFiltype;
  /** @format int64 */
  filstorrelse: number;
  /** @format date-time */
  opprettetDato: string;
}

export interface PeriodeDto {
  /** @format date */
  fraDato: string;
  /** @format date */
  tilDato: string;
}

export interface UtsendingsperiodeOgLandDto {
  utsendelseLand: LandKode;
  utsendelsePeriode: PeriodeDto;
}

export type AnnenPersonMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "skjemadel"
  | "juridiskEnhetOrgnr"
  | "arbeidsgiverNavn"
  | "metadatatype"
> & {
  fullmektigFnr: string;
};

export type ArbeidsgiverMedFullmaktMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "skjemadel"
  | "juridiskEnhetOrgnr"
  | "arbeidsgiverNavn"
  | "metadatatype"
> & {
  fullmektigFnr: string;
};

export type ArbeidsgiverMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "skjemadel"
  | "juridiskEnhetOrgnr"
  | "arbeidsgiverNavn"
  | "metadatatype"
>;

export interface ArbeidsgiverensVirksomhetINorgeDto {
  erArbeidsgiverenOffentligVirksomhet: boolean;
  erArbeidsgiverenBemanningsEllerVikarbyraa?: boolean;
  opprettholderArbeidsgiverenVanligDrift?: boolean;
}

export interface ArbeidsgiversData {
  arbeidsgiverensVirksomhetINorge?: ArbeidsgiverensVirksomhetINorgeDto;
  utenlandsoppdraget?: UtenlandsoppdragetDto;
  arbeidstakerensLonn?: ArbeidstakerensLonnDto;
  arbeidsstedIUtlandet?: ArbeidsstedIUtlandetDto;
}

export interface ArbeidssituasjonDto {
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: boolean;
  aktivitetIMaanedenFoerUtsendingen?: string;
  skalJobbeForFlereVirksomheter: boolean;
  virksomheterArbeidstakerJobberForIutsendelsesPeriode?: NorskeOgUtenlandskeVirksomheterMedAnsettelsesform;
}

export interface ArbeidsstedIUtlandetDto {
  arbeidsstedType: ArbeidsstedType;
  paLand?: PaLandDto;
  offshore?: OffshoreDto;
  paSkip?: PaSkipDto;
  omBordPaFly?: OmBordPaFlyDto;
}

export interface ArbeidstakerensLonnDto {
  arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: boolean;
  virksomheterSomUtbetalerLonnOgNaturalytelser?: NorskeOgUtenlandskeVirksomheter;
}

export interface ArbeidstakersData {
  arbeidssituasjon?: ArbeidssituasjonDto;
  skatteforholdOgInntekt?: SkatteforholdOgInntektDto;
  familiemedlemmer?: FamiliemedlemmerDto;
}

export type DegSelvMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "skjemadel"
  | "juridiskEnhetOrgnr"
  | "arbeidsgiverNavn"
  | "metadatatype"
>;

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

export interface NorskVirksomhet {
  /** @minLength 1 */
  organisasjonsnummer: string;
}

export interface NorskeOgUtenlandskeVirksomheter {
  norskeVirksomheter?: NorskVirksomhet[];
  utenlandskeVirksomheter?: UtenlandskVirksomhet[];
}

export interface NorskeOgUtenlandskeVirksomheterMedAnsettelsesform {
  norskeVirksomheter?: NorskVirksomhet[];
  utenlandskeVirksomheter?: UtenlandskVirksomhetMedAnsettelsesform[];
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

export type RadgiverMedFullmaktMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "skjemadel"
  | "juridiskEnhetOrgnr"
  | "arbeidsgiverNavn"
  | "metadatatype"
> & {
  fullmektigFnr: string;
  radgiverfirma: RadgiverfirmaInfo;
};

export type RadgiverMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "skjemadel"
  | "juridiskEnhetOrgnr"
  | "arbeidsgiverNavn"
  | "metadatatype"
> & {
  radgiverfirma: RadgiverfirmaInfo;
};

export interface RadgiverfirmaInfo {
  orgnr: string;
  navn: string;
}

export interface SkatteforholdOgInntektDto {
  erSkattepliktigTilNorgeIHeleutsendingsperioden: boolean;
  mottarPengestotteFraAnnetEosLandEllerSveits: boolean;
  landSomUtbetalerPengestotte?: string;
  pengestotteSomMottasFraAndreLandBelop?: string;
  pengestotteSomMottasFraAndreLandBeskrivelse?: string;
  arbeidsinntektFraNorskEllerUtenlandskVirksomhet?: Record<string, boolean>;
  hvilkeTyperInntektHarDu?: Record<string, boolean>;
  inntekterFraUtenlandskVirksomhet?: string;
  inntekterFraEgenVirksomhet?: string;
}

export interface TilleggsopplysningerDto {
  harFlereOpplysningerTilSoknaden: boolean;
  tilleggsopplysningerTilSoknad?: string;
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
  arbeidsgiverHarOppdragILandet: boolean;
  arbeidstakerBleAnsattForUtenlandsoppdraget: boolean;
  arbeidstakerForblirAnsattIHelePerioden: boolean;
  arbeidstakerErstatterAnnenPerson: boolean;
  arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget?: boolean;
  utenlandsoppholdetsBegrunnelse?: string;
  ansettelsesforholdBeskrivelse?: string;
  forrigeArbeidstakerUtsendelsePeriode?: PeriodeDto;
}

export type UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto =
  UtilRequiredKeys<UtsendtArbeidstakerSkjemaData, "type"> & {
    arbeidsgiversData: ArbeidsgiversData;
    arbeidstakersData: ArbeidstakersData;
  };

export type UtsendtArbeidstakerArbeidsgiversSkjemaDataDto = UtilRequiredKeys<
  UtsendtArbeidstakerSkjemaData,
  "type"
> & {
  arbeidsgiverensVirksomhetINorge?: ArbeidsgiverensVirksomhetINorgeDto;
  utenlandsoppdraget?: UtenlandsoppdragetDto;
  arbeidstakerensLonn?: ArbeidstakerensLonnDto;
  arbeidsstedIUtlandet?: ArbeidsstedIUtlandetDto;
};

export type UtsendtArbeidstakerArbeidstakersSkjemaDataDto = UtilRequiredKeys<
  UtsendtArbeidstakerSkjemaData,
  "type"
> & {
  arbeidssituasjon?: ArbeidssituasjonDto;
  skatteforholdOgInntekt?: SkatteforholdOgInntektDto;
  familiemedlemmer?: FamiliemedlemmerDto;
};

export interface UtsendtArbeidstakerMetadata {
  representasjonstype: Representasjonstype;
  /** @format uuid */
  erstatterSkjemaId?: string;
  skjemadel: Skjemadel;
  juridiskEnhetOrgnr: string;
  arbeidsgiverNavn: string;
  /** @format uuid */
  kobletSkjemaId?: string;
  metadatatype: string;
}

export interface UtsendtArbeidstakerSkjemaData {
  utsendingsperiodeOgLand?: UtsendingsperiodeOgLandDto;
  tilleggsopplysninger?: TilleggsopplysningerDto;
  type: string;
}

export interface UtsendtArbeidstakerSkjemaDto {
  /** @format uuid */
  id: string;
  status: SkjemaStatus;
  type: SkjemaType;
  fnr: string;
  orgnr: string;
  /** @format date-time */
  opprettetDato: string;
  /** @format date-time */
  endretDato: string;
  metadata:
    | AnnenPersonMetadata
    | ArbeidsgiverMedFullmaktMetadata
    | ArbeidsgiverMetadata
    | DegSelvMetadata
    | RadgiverMedFullmaktMetadata
    | RadgiverMetadata;
  data:
    | UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto
    | UtsendtArbeidstakerArbeidsgiversSkjemaDataDto
    | UtsendtArbeidstakerArbeidstakersSkjemaDataDto;
}

export interface SkjemaInnsendtKvittering {
  /** @format uuid */
  skjemaId: string;
  referanseId: string;
  status: SkjemaStatus;
}

export interface OpprettUtsendtArbeidstakerSoknadRequest {
  representasjonstype: Representasjonstype;
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

export interface OpprettUtsendtArbeidstakerSoknadResponse {
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
  fullmaktAktiv?: boolean;
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

export interface UtsendtArbeidstakerSkjemaM2MDto {
  skjema: UtsendtArbeidstakerSkjemaDto;
  kobletSkjema?: UtsendtArbeidstakerSkjemaDto;
  tidligereInnsendteSkjema: UtsendtArbeidstakerSkjemaDto[];
  referanseId: string;
  /** @format date-time */
  innsendtTidspunkt: string;
  innsenderFnr: string;
  vedlegg: VedleggDto[];
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
   * @example "AB12CD"
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
   * @example "1"
   */
  skjemaDefinisjonVersjon: string;
  /** Skjemadata (polymorfisk — bruk 'type'-feltet for å avgjøre variant) */
  skjemaData:
    | UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto
    | UtsendtArbeidstakerArbeidsgiversSkjemaDataDto
    | UtsendtArbeidstakerArbeidstakersSkjemaDataDto;
  /** Skjemadefinisjon for visning (basert på lagret versjon) */
  definisjon: SkjemaDefinisjonDto;
  /** Indikerer om fullmakt er aktiv. null=ikke relevant, true=aktiv, false=tapt (arbeidstaker-data strippet). */
  fullmaktAktiv?: boolean;
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

export type CheckboxGroupFeltDefinisjon = UtilRequiredKeys<
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
   * @example "1"
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
  utsendingsperiodeOgLandTranslation: UtsendingsperiodeOgLandTranslation;
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
  feltErPaakrevd: string;
}

export interface OmBordPaFlyTranslation {
  vanligHjemmebaseLandSkalIkkeOppgis: string;
  vanligHjemmebaseNavnSkalIkkeOppgis: string;
  maaOppgiVanligHjemmebaseLand: string;
  maaOppgiVanligHjemmebaseNavn: string;
}

export interface PaLandTranslation {
  maaOppgiFastArbeidssted: string;
  fastArbeidsstedSkalIkkeOppgis: string;
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
  ugyldigBelopFormat: string;
  maaVelgeMinsteEnArbeidsinntektKilde: string;
  maaVelgeMinsteEnInntektType: string;
  maaOppgiInntekterFraUtenlandskVirksomhet: string;
  maaOppgiInntekterFraEgenVirksomhet: string;
  inntekterFraUtenlandskVirksomhetSkalIkkeOppgis: string;
  inntekterFraEgenVirksomhetSkalIkkeOppgis: string;
  kannIkkeHaLonnNarKunNorskVirksomhet: string;
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

export interface UtsendingsperiodeOgLandTranslation {
  norgeErIkkeGyldigSomUtsendelsesland: string;
}

export interface OrganisasjonMedJuridiskEnhetDto {
  organisasjon: SimpleOrganisasjonDto;
  juridiskEnhet: SimpleOrganisasjonDto;
}
