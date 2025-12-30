/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

type UtilRequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export interface Organisasjon {
  organisasjonsnummer: string;
  type: string;
  navn?: Navn;
}

export interface OpprettSoknadMedKontekstRequest {
  representasjonstype:
    | "DEG_SELV"
    | "ARBEIDSGIVER"
    | "RADGIVER"
    | "ANNEN_PERSON";
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
  status: "UTKAST" | "SENDT";
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
  sortering?: "ARBEIDSGIVER" | "ARBEIDSTAKER" | "INNSENDT_DATO" | "STATUS";
  retning?: "ASC" | "DESC";
  representasjonstype:
    | "DEG_SELV"
    | "ARBEIDSGIVER"
    | "RADGIVER"
    | "ANNEN_PERSON";
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
  status: "UTKAST" | "SENDT";
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
  utsendelsesLand: string;
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
  status: "UTKAST" | "SENDT";
  data: ArbeidstakersSkjemaDataDto;
}

export interface FamiliemedlemmerDto {
  sokerForBarnUnder18SomSkalVaereMed: boolean;
  harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad: boolean;
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
  utsendelseLand: string;
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
  status: "UTKAST" | "SENDT";
  data: ArbeidsgiversSkjemaDataDto;
}

export interface ArbeidsstedIUtlandetDto {
  arbeidsstedType: "PA_LAND" | "OFFSHORE" | "PA_SKIP" | "OM_BORD_PA_FLY";
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
  typeInnretning:
    | "PLATTFORM_ELLER_ANNEN_FAST_INNRETNING"
    | "BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING";
  sokkelLand: string;
}

export interface OmBordPaFlyDto {
  hjemmebaseLand: string;
  hjemmebaseNavn: string;
  erVanligHjemmebase: boolean;
  vanligHjemmebaseLand?: string;
  vanligHjemmebaseNavn?: string;
}

export interface PaLandDto {
  fastEllerVekslendeArbeidssted: "FAST" | "VEKSLENDE";
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
  seilerI: "INTERNASJONALT_FARVANN" | "TERRITORIALFARVANN";
  flaggland?: string;
  territorialfarvannLand?: string;
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
  representasjonstype:
    | "DEG_SELV"
    | "ARBEIDSGIVER"
    | "RADGIVER"
    | "ANNEN_PERSON";
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
  status: "UTKAST" | "SENDT";
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
  "organisasjonsnummer" | "type"
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
  "organisasjonsnummer" | "type"
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
  "organisasjonsnummer" | "type"
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
