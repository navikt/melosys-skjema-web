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
  Nn = "nn",
  En = "en",
}

export enum FeltFormat {
  BELOP = "BELOP",
}

export enum InnsendingStatus {
  MOTTATT = "MOTTATT",
  UNDER_BEHANDLING = "UNDER_BEHANDLING",
  FERDIG = "FERDIG",
  KAFKA_FEILET = "KAFKA_FEILET",
}

export enum MotpartStatus {
  HAR_SENDT = "HAR_SENDT",
  VENTER = "VENTER",
  IKKE_RELEVANT = "IKKE_RELEVANT",
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

export enum OpprettetVia {
  MOTPART_CTA = "MOTPART_CTA",
  ORDINAER = "ORDINAER",
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
}

export enum Representasjonstype {
  DEG_SELV = "DEG_SELV",
  ARBEIDSGIVER = "ARBEIDSGIVER",
  ARBEIDSGIVER_MED_FULLMAKT = "ARBEIDSGIVER_MED_FULLMAKT",
  RADGIVER = "RADGIVER",
  RADGIVER_MED_FULLMAKT = "RADGIVER_MED_FULLMAKT",
  ANNEN_PERSON = "ANNEN_PERSON",
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

export enum InntektType {
  LOENN = "LOENN",
  INNTEKT_FRA_EGEN_VIRKSOMHET = "INNTEKT_FRA_EGEN_VIRKSOMHET",
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

export enum ArbeidsinntektKilde {
  NORSK_VIRKSOMHET = "NORSK_VIRKSOMHET",
  UTENLANDSK_VIRKSOMHET = "UTENLANDSK_VIRKSOMHET",
}

export enum Ansettelsesform {
  ARBEIDSTAKER_ELLER_FRILANSER = "ARBEIDSTAKER_ELLER_FRILANSER",
  SELVSTENDIG_NAERINGSDRIVENDE = "SELVSTENDIG_NAERINGSDRIVENDE",
  STATSANSATT = "STATSANSATT",
}

export enum VedleggFiltype {
  PDF = "PDF",
  JPEG = "JPEG",
  PNG = "PNG",
}

export enum Saksstatus {
  MOTTATT = "MOTTATT",
  AVSLUTTET = "AVSLUTTET",
}

export interface FeltDefinisjonDto {
  label: string;
  hjelpetekst?: string;
  pakrevd: boolean;
  type: string;
}

export interface OppdaterSaksstatusRequest {
  saksnummer: string;
  saksstatus: Saksstatus;
}

export interface BulkOppdaterSaksstatusRequest {
  /**
   * @maxItems 1000
   * @minItems 0
   */
  oppdateringer: SaksstatusOppdatering[];
}

export interface SaksstatusOppdatering {
  /** @format uuid */
  skjemaId: string;
  saksnummer: string;
  saksstatus: Saksstatus;
}

export interface BulkOppdaterSaksstatusResultat {
  /** @format int32 */
  antallOppdatert: number;
  ukjenteSkjemaIder: string[];
  konfliktSkjemaIder: string[];
}

export interface RegistrerSaksnummerRequest {
  saksnummer: string;
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

export interface VedleggValgDto {
  harAnnenDokumentasjon: boolean;
}

export type AnnenPersonMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "arbeidsgiverNavn"
  | "arbeidstakerNavn"
  | "metadatatype"
> & {
  fullmektigFnr: string;
  /** @format uuid */
  kobletSkjemaId?: string;
  /** @format uuid */
  erstatterSkjemaId?: string;
};

export type ArbeidsgiverMedFullmaktMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "arbeidsgiverNavn"
  | "arbeidstakerNavn"
  | "metadatatype"
> & {
  fullmektigFnr: string;
  /** @format uuid */
  kobletSkjemaId?: string;
  /** @format uuid */
  erstatterSkjemaId?: string;
};

export type ArbeidsgiverMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "arbeidsgiverNavn"
  | "arbeidstakerNavn"
  | "metadatatype"
> & {
  /** @format uuid */
  kobletSkjemaId?: string;
  /** @format uuid */
  erstatterSkjemaId?: string;
};

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
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "arbeidsgiverNavn"
  | "arbeidstakerNavn"
  | "metadatatype"
> & {
  /** @format uuid */
  kobletSkjemaId?: string;
  /** @format uuid */
  erstatterSkjemaId?: string;
};

export interface FamiliemedlemmerDto {
  skalHaMedFamiliemedlemmer: boolean;
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

export interface PeriodeDto {
  /** @format date */
  fraDato: string;
  /** @format date */
  tilDato: string;
}

export type RadgiverMedFullmaktMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "arbeidsgiverNavn"
  | "arbeidstakerNavn"
  | "metadatatype"
> & {
  fullmektigFnr: string;
  /** @format uuid */
  kobletSkjemaId?: string;
  /** @format uuid */
  erstatterSkjemaId?: string;
  radgiverfirma: RadgiverfirmaInfo;
};

export type RadgiverMetadata = UtilRequiredKeys<
  UtsendtArbeidstakerMetadata,
  | "representasjonstype"
  | "juridiskEnhetOrgnr"
  | "skjemadel"
  | "arbeidsgiverNavn"
  | "arbeidstakerNavn"
  | "metadatatype"
> & {
  /** @format uuid */
  kobletSkjemaId?: string;
  /** @format uuid */
  erstatterSkjemaId?: string;
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
  /** @uniqueItems true */
  inntektFraNorskEllerUtenlandskVirksomhet?: ArbeidsinntektKilde[];
  /** @uniqueItems true */
  hvilkeTyperInntektHarDu?: InntektType[];
  inntekt?: string;
  inntektFraEgenVirksomhet?: string;
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

export interface UtsendingsperiodeOgLandDto {
  utsendelseLand: LandKode;
  utsendelsePeriode: PeriodeDto;
}

export type UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto =
  UtilRequiredKeys<UtsendtArbeidstakerSkjemaData, "type"> & {
    arbeidsgiversData: ArbeidsgiversData;
    arbeidstakersData: ArbeidstakersData;
    utsendingsperiodeOgLand?: UtsendingsperiodeOgLandDto;
    tilleggsopplysninger?: TilleggsopplysningerDto;
    vedlegg?: VedleggValgDto;
  };

export type UtsendtArbeidstakerArbeidsgiversSkjemaDataDto = UtilRequiredKeys<
  UtsendtArbeidstakerSkjemaData,
  "type"
> & {
  arbeidsgiverensVirksomhetINorge?: ArbeidsgiverensVirksomhetINorgeDto;
  utenlandsoppdraget?: UtenlandsoppdragetDto;
  arbeidstakerensLonn?: ArbeidstakerensLonnDto;
  arbeidsstedIUtlandet?: ArbeidsstedIUtlandetDto;
  utsendingsperiodeOgLand?: UtsendingsperiodeOgLandDto;
  tilleggsopplysninger?: TilleggsopplysningerDto;
  vedlegg?: VedleggValgDto;
};

export type UtsendtArbeidstakerArbeidstakersSkjemaDataDto = UtilRequiredKeys<
  UtsendtArbeidstakerSkjemaData,
  "type"
> & {
  utsendingsperiodeOgLand?: UtsendingsperiodeOgLandDto;
  arbeidssituasjon?: ArbeidssituasjonDto;
  skatteforholdOgInntekt?: SkatteforholdOgInntektDto;
  familiemedlemmer?: FamiliemedlemmerDto;
  tilleggsopplysninger?: TilleggsopplysningerDto;
  vedlegg?: VedleggValgDto;
};

export interface UtsendtArbeidstakerMetadata {
  representasjonstype: Representasjonstype;
  juridiskEnhetOrgnr: string;
  /** @format uuid */
  erstatterSkjemaId?: string;
  skjemadel: Skjemadel;
  arbeidsgiverNavn: string;
  /** @format uuid */
  kobletSkjemaId?: string;
  arbeidstakerNavn: string;
  metadatatype: string;
}

export interface UtsendtArbeidstakerSkjemaData {
  utsendingsperiodeOgLand?: UtsendingsperiodeOgLandDto;
  tilleggsopplysninger?: TilleggsopplysningerDto;
  vedlegg?: VedleggValgDto;
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
  motpartensUtsendingsperiodeOgLand?: UtsendingsperiodeOgLandDto;
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
  opprettetVia: OpprettetVia;
  /** @format uuid */
  prefyllFraSkjemaId?: string;
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
  saksnummer?: string;
  saksstatus?: Saksstatus;
  motpartStatus: MotpartStatus;
  skjemadel: Skjemadel;
  arbeidsgiverNavn?: string;
  arbeidsgiverOrgnr: string;
  arbeidstakerNavn: string;
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

export interface ResendVarslerRequestDto {
  ekskluderteSaksnumre: string[];
}

export interface ResendVarslerResultatDto {
  dryRun: boolean;
  /** @format int32 */
  antallSendt: number;
  saksnumre: string[];
  /** @format int32 */
  antallEkskludert: number;
  ekskluderte: string[];
  ikkeFunnetEkskluderte: string[];
}

export interface InnsendingAdminDto {
  /** @format uuid */
  innsendingId: string;
  /** @format uuid */
  skjemaId: string;
  referanseId: string;
  status: InnsendingStatus;
  skjemaStatus: SkjemaStatus;
  orgnr: string;
  /** @format int32 */
  antallForsok: number;
  feilmelding?: string;
  /** @format date-time */
  sisteForsoekTidspunkt?: string;
  /** @format date-time */
  opprettetDato: string;
  saksnummer?: string;
  saksstatus?: Saksstatus;
  /** @format date-time */
  saksstatusOppdatert?: string;
}

export interface RetryResultatDto {
  /** @format int32 */
  antallForsoekt: number;
  /** @format int32 */
  antallFeilet: number;
}

export interface UtsendtArbeidstakerSkjemaM2MDto {
  skjema: UtsendtArbeidstakerSkjemaDto;
  kobletSkjema?: UtsendtArbeidstakerSkjemaDto;
  tidligereInnsendteSkjema: UtsendtArbeidstakerSkjemaDto[];
  referanseId: string;
  /** @format date-time */
  innsendtTidspunkt: string;
  innsenderFnr: string;
  dokumentTittel: string;
  vedlegg: VedleggDto[];
}

export interface AlternativDefinisjonDto {
  verdi: string;
  label: string;
  beskrivelse?: string;
}

export type BooleanFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "label" | "pakrevd"
> & {
  hjelpetekst?: string;
  jaLabel: string;
  neiLabel: string;
};

export type CheckboxGruppeFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "label" | "pakrevd"
> & {
  hjelpetekst?: string;
  alternativer: AlternativDefinisjonDto[];
};

export type CountrySelectFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "label" | "pakrevd"
> & {
  hjelpetekst?: string;
};

export type DateFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "label" | "pakrevd"
> & {
  hjelpetekst?: string;
};

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
   * Dokumenttittel for visning
   * @example "Bekreftelse fra arbeidsgiver på utsending til annet EØS-land eller Sveits"
   */
  dokumentTittel: string;
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
  /**
   * Melosys-saksnummer, null hvis ikke mottatt fra melosys-api ennå
   * @example "MEL-123456"
   */
  saksnummer?: string;
  saksstatus?: Saksstatus;
}

export type ListeFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "label" | "pakrevd"
> & {
  hjelpetekst?: string;
  leggTilLabel: string;
  fjernLabel: string;
  tomListeMelding?: string;
  elementDefinisjon: Record<
    string,
    | BooleanFeltDefinisjon
    | CheckboxGruppeFeltDefinisjon
    | CountrySelectFeltDefinisjon
    | DateFeltDefinisjon
    | ListeFeltDefinisjon
    | PeriodeFeltDefinisjon
    | SelectFeltDefinisjon
    | TextFeltDefinisjon
    | TextareaFeltDefinisjon
  >;
  itemTypeLabels?: Record<string, string>;
};

export type PeriodeFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "label" | "pakrevd"
> & {
  hjelpetekst?: string;
  fraDatoLabel: string;
  tilDatoLabel: string;
};

export interface SeksjonDefinisjonDto {
  tittel: string;
  beskrivelse?: string;
  felter: Record<
    string,
    | BooleanFeltDefinisjon
    | CheckboxGruppeFeltDefinisjon
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
  "label" | "pakrevd"
> & {
  hjelpetekst?: string;
  alternativer: AlternativDefinisjonDto[];
};

export interface SkjemaDefinisjonDto {
  type: string;
  versjon: string;
  seksjoner: Record<string, SeksjonDefinisjonDto>;
}

export type TextFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "label" | "pakrevd"
> & {
  hjelpetekst?: string;
  format?: FeltFormat;
};

export type TextareaFeltDefinisjon = UtilRequiredKeys<
  FeltDefinisjonDto,
  "label" | "pakrevd"
> & {
  hjelpetekst?: string;
  /** @format int32 */
  maxLength?: number;
};

export interface VentendeMotpartSoknadDto {
  /** @format uuid */
  skjemaId: string;
  arbeidsgiverNavn: string;
  arbeidsgiverOrgnr: string;
  utsendingsperiode?: PeriodeDto;
  utsendelseLand?: LandKode;
  /** @format date-time */
  innsendtDato: string;
}

export interface VentendeMotpartSoknaderResponse {
  soknader: VentendeMotpartSoknadDto[];
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
  arbeidstakerNavn: string;
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
  fellesTranslation: FellesTranslation;
}

export interface ErrorMessageTranslations {
  no: ErrorMessageTranslation;
  en: ErrorMessageTranslation;
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
  duMaOppgiEtGyldigBelopSomErStorreEnn0: string;
  maaVelgeMinstEnInntektKilde: string;
  maaVelgeMinstEnInntektType: string;
  maaOppgiInntekt: string;
  maaOppgiInntektFraEgenVirksomhet: string;
  inntektSkalIkkeOppgis: string;
  inntektFraEgenVirksomhetSkalIkkeOppgis: string;
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

export interface AdminStatistikkDto {
  skjemaPerStatus: Record<string, number>;
  innsendingPerStatus: Record<string, number>;
  /** @format int64 */
  antallFeiledeInnsendinger: number;
}

export interface BrukStatistikkDto {
  /** @format date-time */
  tidspunkt: string;
  /** @format date */
  periodeFraOgMed?: string;
  /** @format date */
  periodeTilOgMed?: string;
  utkast: UtkastStatistikkDto;
  /** @format int64 */
  totaltInnsendt: number;
  /** @format int64 */
  innsendtSisteDoegn: number;
  /** @format int64 */
  innsendtSiste7Dager: number;
  /** @format int64 */
  innsendtSiste30Dager: number;
  innsendtPerSkjemadel: Record<string, number>;
  innsendtPerFlyt: Record<string, number>;
  innsendtPerSprak: Record<string, number>;
  saksdekning: SaksdekningDto;
  saksstatusFordeling: SaksstatusFordelingDto;
  motpartCta: MotpartCtaStatistikkDto;
  /** @format int64 */
  antallUnikePersoner: number;
  /** @format int64 */
  antallUnikeVirksomheter: number;
  /** @format int64 */
  antallUnikeJuridiskeEnheter: number;
  topplisteVirksomheter: VirksomhetStatistikkDto[];
}

export interface DelStatusDto {
  /** @format int64 */
  totalt: number;
  /** @format int64 */
  antallErstattedeVersjoner: number;
  /** @format int64 */
  medMotpart: number;
  /** @format int64 */
  medMotpartAktivSak: number;
  /** @format int64 */
  medMotpartAvsluttetSak: number;
  /** @format int64 */
  dekketAvKomplettSkjema: number;
  /** @format int64 */
  dekketAvKomplettSkjemaAktivSak: number;
  /** @format int64 */
  dekketAvKomplettSkjemaAvsluttetSak: number;
  /** @format int64 */
  venterMotpartHarUtkast: number;
  /** @format int64 */
  venterIngenMotpart: number;
  /** @format int64 */
  venterMotpartHarUtkastAktivSak: number;
  /** @format int64 */
  venterMotpartHarUtkastAvsluttetSak: number;
  /** @format int64 */
  venterIngenMotpartAktivSak: number;
  /** @format int64 */
  venterIngenMotpartAvsluttetSak: number;
}

export interface DobbeltinnsendingDto {
  /** @format int32 */
  antallInnsendinger: number;
  saksnumre: string[];
}

export interface MotpartCtaStatistikkDto {
  /** @format int64 */
  antallUtkastViaCta: number;
  /** @format int64 */
  antallInnsendtViaCta: number;
}

export interface SaksdekningDto {
  /** @format int64 */
  antallKomplette: number;
  /** @format int64 */
  antallErstattedeKomplette: number;
  /** @format int64 */
  antallSakerMedBeggeDeler: number;
  /** @format int64 */
  antallSakerMedKomplett: number;
  /** @format int64 */
  antallSakerMedMatchendeSeparateDeler: number;
  /** @format int64 */
  antallSakerMedBaadeKomplettOgSeparate: number;
  arbeidstakerDeler: DelStatusDto;
  arbeidsgiverDeler: DelStatusDto;
  /** @format int64 */
  antallMuligeDobbeltinnsendinger: number;
  muligeDobbeltinnsendinger: DobbeltinnsendingDto[];
  /** @format int64 */
  antallSakerMedFlereVersjoner: number;
  /** @format int64 */
  antallVentendeMedAvsluttetSak: number;
  /** @format int64 */
  parInitiertAvArbeidsgiver: number;
  /** @format int64 */
  parInitiertAvArbeidstaker: number;
  /** @format int64 */
  parUavhengigStartet: number;
  komplettPerFlyt: Record<string, number>;
  /** @format int64 */
  antallDelerUtenPeriode: number;
}

export interface SaksstatusFordelingDto {
  /** @format int64 */
  mottatt: number;
  /** @format int64 */
  avsluttet: number;
  /** @format int64 */
  ukjent: number;
}

export interface UtkastStatistikkDto {
  /** @format int64 */
  antall: number;
  /** @format int64 */
  under1Dag: number;
  /** @format int64 */
  mellom1Og7Dager: number;
  /** @format int64 */
  mellom7Og30Dager: number;
  /** @format int64 */
  over30Dager: number;
  /** @format date-time */
  eldsteOpprettetDato?: string;
  perSkjemadel: Record<string, number>;
}

export interface VirksomhetStatistikkDto {
  /** @format int64 */
  antallInnsendinger: number;
  /** @format int64 */
  antallUnikeInnsendere: number;
  /** @format int64 */
  antallArbeidstakerDel: number;
  /** @format int64 */
  antallArbeidsgiverDel: number;
  /** @format int64 */
  antallKomplett: number;
  /** @format int64 */
  antallSakerMedBeggeDeler: number;
  /** @format int64 */
  antallMottatt: number;
  /** @format int64 */
  antallAvsluttet: number;
  /** @format int64 */
  antallUkjent: number;
}

export interface VirksomhetSaksnumreDto {
  /** @format int32 */
  rang: number;
  /** @format int64 */
  antallInnsendinger: number;
  saksnumre: string[];
}

export interface SaksstatusEksportDto {
  /** @format date-time */
  tidspunkt: string;
  /** @format int32 */
  antall: number;
  rader: SaksstatusEksportRadDto[];
}

export interface SaksstatusEksportRadDto {
  /** @format uuid */
  skjemaId: string;
  referanseId: string;
  saksnummer?: string;
  saksstatus?: Saksstatus;
  /** @format date-time */
  saksstatusOppdatert?: string;
}

export interface AntallDto {
  /** @format int64 */
  antall: number;
}
