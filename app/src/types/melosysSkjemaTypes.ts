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
  type: string;
  organisasjonsnummer: string;
  navn?: Navn;
}

export interface CreateArbeidstakerSkjemaRequest {
  fnr: string;
}

export interface ArbeidstakerenDto {
  harNorskFodselsnummer: boolean;
  fodselsnummer?: string;
  fornavn?: string;
  etternavn?: string;
  /** @format date */
  fodselsdato?: string;
  harVaertEllerSkalVaereILonnetArbeidFoerUtsending: boolean;
  aktivitetIMaanedenFoerUtsendingen?: string;
  skalJobbeForFlereVirksomheter: boolean;
  virksomheterArbeidstakerJobberForIutsendelsesPeriode?: NorskeOgUtenlandskeVirksomheter;
}

export interface ArbeidstakersSkjemaDataDto {
  arbeidstakeren?: ArbeidstakerenDto;
  skatteforholdOgInntekt?: SkatteforholdOgInntektDto;
  familiemedlemmer?: FamiliemedlemmerDto;
  tilleggsopplysninger?: TilleggsopplysningerDto;
}

export interface ArbeidstakersSkjemaDto {
  /** @format uuid */
  id: string;
  fnr: string;
  status: "UTKAST" | "SENDT" | "MOTTATT";
  data: ArbeidstakersSkjemaDataDto;
}

export interface FamiliemedlemmerDto {
  sokerForBarnUnder18SomSkalVaereMed: boolean;
  harEktefellePartnerSamboerEllerBarnOver18SomSenderEgenSoknad: boolean;
}

export interface NorskVirksomhet {
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

export interface CreateArbeidsgiverSkjemaRequest {
  orgnr: string;
}

export interface ArbeidsgiverenDto {
  organisasjonsnummer: string;
  organisasjonNavn: string;
}

export interface ArbeidsgiverensVirksomhetINorgeDto {
  erArbeidsgiverenOffentligVirksomhet: boolean;
  erArbeidsgiverenBemanningsEllerVikarbyraa?: boolean;
  opprettholderArbeidsgiverenVanligDrift?: boolean;
}

export interface ArbeidsgiversSkjemaDataDto {
  arbeidsgiveren?: ArbeidsgiverenDto;
  arbeidstakeren?: ArbeidstakerenArbeidsgiversDelDto;
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
  status: "UTKAST" | "SENDT" | "MOTTATT";
  data: ArbeidsgiversSkjemaDataDto;
}

export interface ArbeidsstedIUtlandetDto {
  arbeidsstedType: "PA_LAND" | "OFFSHORE" | "PA_SKIP" | "OM_BORD_PA_FLY";
  paLand?: PaLandDto;
  offshore?: OffshoreDto;
  paSkip?: PaSkipDto;
  omBordPaFly?: OmBordPaFlyDto;
}

export interface ArbeidstakerenArbeidsgiversDelDto {
  fodselsnummer: string;
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

export interface OrganisasjonDto {
  orgnr: string;
  navn: string;
  organisasjonsform: string;
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

export interface JuridiskEnhet {
  organisasjonsnummer: string;
  navn?: Navn;
  type: string;
  organisasjonDetaljer?: OrganisasjonDetaljer;
  juridiskEnhetDetaljer?: JuridiskEnhetDetaljer;
}

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

export interface OrganisasjonMedJuridiskEnhet {
  organisasjon: JuridiskEnhet | Organisasjonsledd | Virksomhet;
  juridiskEnhet: JuridiskEnhet;
}

export type Organisasjonsledd = UtilRequiredKeys<
  Organisasjon,
  "type" | "organisasjonsnummer"
> & {
  organisasjonDetaljer?: OrganisasjonDetaljer;
  organisasjonsleddDetaljer?: OrganisasjonsleddDetaljer;
  driverVirksomheter?: DriverVirksomhet[];
  inngaarIJuridiskEnheter?: InngaarIJuridiskEnhet[];
  organisasjonsleddUnder?: BestaarAvOrganisasjonsledd[];
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
