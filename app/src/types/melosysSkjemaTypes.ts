/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

type UtilRequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

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

export enum Representasjonstype {
  DEG_SELV = "DEG_SELV",
  ARBEIDSGIVER = "ARBEIDSGIVER",
  RADGIVER = "RADGIVER",
  ANNEN_PERSON = "ANNEN_PERSON",
}

export enum SkjemaStatus {
  UTKAST = "UTKAST",
  SENDT = "SENDT",
}

export interface Organisasjon {
  type: string;
  navn?: Navn;
  organisasjonsnummer: string;
}

export interface SkjemaInnsendtKvittering {
  /** @format uuid */
  skjemaId: string;
  referanseId: string;
  status: SkjemaStatus;
}

export interface OpprettSoknadMedKontekstRequest {
  representasjonstype: Representasjonstype;
  radgiverfirma?: SimpleOrganisasjonDto;
  arbeidsgiver?: SimpleOrganisasjonDto;
  arbeidstaker?: PersonDto;
  harFullmakt: boolean;
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
  arbeidsgiverOrgnr?: string;
  arbeidstakerNavn?: string;
  arbeidstakerFnrMaskert?: string;
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

export interface ArbeidssituasjonDto {
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: boolean;
  aktivitetIMaanedenFoerUtsendingen?: string;
  skalJobbeForFlereVirksomheter: boolean;
  virksomheterArbeidstakerJobberForIutsendelsesPeriode?: NorskeOgUtenlandskeVirksomheter;
}

export interface ArbeidstakersSkjemaDataDto {
  utenlandsoppdraget?: UtenlandsoppdragetArbeidstakersDelDto;
  arbeidssituasjon?: ArbeidssituasjonDto;
  skatteforholdOgInntekt?: SkatteforholdOgInntektDto;
  familiemedlemmer?: FamiliemedlemmerDto;
  tilleggsopplysninger?: TilleggsopplysningerDto;
}

export interface ArbeidstakersSkjemaDto {
  /** @format uuid */
  id: string;
  fnr: string;
  status: SkjemaStatus;
  data: ArbeidstakersSkjemaDataDto;
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

export interface NorskVirksomhet {
  /** @minLength 1 */
  organisasjonsnummer: string;
}

export interface NorskeOgUtenlandskeVirksomheter {
  norskeVirksomheter?: NorskVirksomhet[];
  utenlandskeVirksomheter?: UtenlandskVirksomhet[];
}

export interface SkatteforholdOgInntektDto {
  erSkattepliktigTilNorgeIHeleutsendingsperioden: boolean;
  mottarPengestotteFraAnnetEosLandEllerSveits: boolean;
  landSomUtbetalerPengestotte?: string;
  pengestotteSomMottasFraAndreLandBelop?: string;
  pengestotteSomMottasFraAndreLandBeskrivelse?: string;
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

export interface ArbeidsgiverensVirksomhetINorgeDto {
  erArbeidsgiverenOffentligVirksomhet: boolean;
  erArbeidsgiverenBemanningsEllerVikarbyraa?: boolean;
  opprettholderArbeidsgiverenVanligDrift?: boolean;
}

export interface ArbeidsgiversSkjemaDataDto {
  arbeidsgiverensVirksomhetINorge?: ArbeidsgiverensVirksomhetINorgeDto;
  utenlandsoppdraget?: UtenlandsoppdragetDto;
  arbeidstakerensLonn?: ArbeidstakerensLonnDto;
  arbeidsstedIUtlandet?: ArbeidsstedIUtlandetDto;
  tilleggsopplysninger?: TilleggsopplysningerDto;
}

export interface ArbeidsgiversSkjemaDto {
  /** @format uuid */
  id: string;
  orgnr: string;
  status: SkjemaStatus;
  data: ArbeidsgiversSkjemaDataDto;
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

export interface OffshoreDto {
  navnPaInnretning: string;
  typeInnretning: TypeInnretning;
  sokkelLand: LandKode;
}

export interface OmBordPaFlyDto {
  hjemmebaseLand: LandKode;
  hjemmebaseNavn: string;
  erVanligHjemmebase: boolean;
  vanligHjemmebaseLand?: LandKode;
  vanligHjemmebaseNavn?: string;
}

export interface PaLandDto {
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
  navnPaSkip: string;
  yrketTilArbeidstaker: string;
  seilerI: Farvann;
  flaggland?: LandKode;
  territorialfarvannLand?: LandKode;
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

export interface RadgiverfirmaInfo {
  orgnr: string;
  navn: string;
}

export interface UtsendtArbeidstakerMetadata {
  representasjonstype: Representasjonstype;
  harFullmakt: boolean;
  radgiverfirma?: RadgiverfirmaInfo;
  arbeidsgiverNavn?: string;
  fullmektigFnr?: string;
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

export interface Adresse {
  adresselinje1?: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postnummer?: string;
  poststed?: string;
  landkode?: string;
  kommunenummer?: string;
}

export interface BestaarAvOrganisasjonsledd {
  organisasjonsledd?: Organisasjonsledd;
  bruksperiode?: Bruksperiode;
  gyldighetsperiode?: Gyldighetsperiode;
}

export interface Bruksperiode {
  fom?: string;
  tom?: string;
}

export interface DriverVirksomhet {
  organisasjonsnummer?: string;
  navn?: Navn;
  bruksperiode?: Bruksperiode;
  gyldighetsperiode?: Gyldighetsperiode;
}

export interface Enhetstype {
  enhetstype?: string;
}

export interface Gyldighetsperiode {
  /** @format date */
  fom?: string;
  /** @format date */
  tom?: string;
}

export interface InngaarIJuridiskEnhet {
  organisasjonsnummer?: string;
  navn?: Navn;
  bruksperiode?: Bruksperiode;
  gyldighetsperiode?: Gyldighetsperiode;
}

export type JuridiskEnhet = UtilRequiredKeys<
  Organisasjon,
  "type" | "organisasjonsnummer"
> & {
  organisasjonDetaljer?: OrganisasjonDetaljer;
  juridiskEnhetDetaljer?: JuridiskEnhetDetaljer;
};

export interface JuridiskEnhetDetaljer {
  enhetstype?: string;
  harAnsatte?: boolean;
  sektorkode?: string;
}

export interface Naering {
  naeringskode?: string;
  hjelpeenhet?: boolean;
}

export interface Navn {
  sammensattnavn?: string;
  navnelinje1?: string;
  navnelinje2?: string;
  navnelinje3?: string;
  navnelinje4?: string;
  navnelinje5?: string;
}

export interface OrganisasjonDetaljer {
  registreringsdato?: string;
  /** @format date */
  stiftelsesdato?: string;
  /** @format date */
  opphoersdato?: string;
  enhetstyper?: Enhetstype[];
  navn?: Navn[];
  naeringer?: Naering[];
  forretningsadresser?: Adresse[];
  postadresser?: Adresse[];
}

export type Organisasjonsledd = UtilRequiredKeys<
  Organisasjon,
  "type" | "organisasjonsnummer"
> & {
  organisasjonDetaljer?: OrganisasjonDetaljer;
  organisasjonsleddDetaljer?: OrganisasjonsleddDetaljer;
  driverVirksomheter?: DriverVirksomhet[];
  inngaarIJuridiskEnheter?: InngaarIJuridiskEnhet[];
  organisasjonsleddOver?: BestaarAvOrganisasjonsledd[];
};

export interface OrganisasjonsleddDetaljer {
  enhetstype?: string;
  sektorkode?: string;
}

export type Virksomhet = UtilRequiredKeys<
  Organisasjon,
  "type" | "organisasjonsnummer"
> & {
  organisasjonDetaljer?: OrganisasjonDetaljer;
  virksomhetDetaljer?: VirksomhetDetaljer;
  bestaarAvOrganisasjonsledd?: BestaarAvOrganisasjonsledd[];
  inngaarIJuridiskEnheter?: InngaarIJuridiskEnhet[];
};

export interface VirksomhetDetaljer {
  enhetstype?: string;
  ubemannetVirksomhet?: boolean;
  /** @format date */
  oppstartsdato?: string;
  /** @format date */
  nedleggelsesdato?: string;
}

export interface OrganisasjonMedJuridiskEnhet {
  organisasjon: JuridiskEnhet | Organisasjonsledd | Virksomhet;
  juridiskEnhet: JuridiskEnhet;
}
