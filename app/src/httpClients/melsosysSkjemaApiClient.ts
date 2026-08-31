import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { API_PROXY_URL } from "~/constants/api.ts";
import { StegKey } from "~/constants/stegKeys.ts";
import { alleToggleNavn } from "~/featuretoggle/toggleNavn.ts";
import {
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidssituasjonDto,
  ArbeidsstedIUtlandetDto,
  ArbeidstakerensLonnDto,
  FamiliemedlemmerDto,
  HentInnsendteSoknaderRequest,
  InnsendteSoknaderResponse,
  InnsendtSkjemaResponse,
  OpprettUtsendtArbeidstakerSoknadRequest,
  OpprettUtsendtArbeidstakerSoknadResponse,
  OrganisasjonDto,
  OrganisasjonMedJuridiskEnhetDto,
  PersonMedFullmaktDto,
  Representasjonstype,
  SimpleOrganisasjonDto,
  SkatteforholdOgInntektDto,
  SkjemaInnsendtKvittering,
  Sprak,
  TilleggsopplysningerDto,
  UtenlandsoppdragetDto,
  UtkastListeResponse,
  UtsendingsperiodeOgLandDto,
  UtsendtArbeidstakerSkjemaDto,
  VedleggDto,
  VedleggValgDto,
  VentendeMotpartSoknaderResponse,
  VerifiserPersonRequest,
  VerifiserPersonResponse,
} from "~/types/melosysSkjemaTypes.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";
import {
  organisasjonsnummerHarGyldigFormat,
  ValideringError,
} from "~/utils/valideringUtils.ts";

export const SKJEMA_DEFINISJON_VERSJON_HEADER = "X-Skjema-Definisjon-Versjon";
export const UTDATERT_UTKAST_STORAGE_KEY = "utdatert-utkast-reinitialisert";
const UTDATERT_SKJEMAVERSJON_ERROR = "SKJEMA_DEFINISJON_VERSJON_UTDATERT";

export class SkjemaApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errorCode?: string,
  ) {
    super(message);
    this.name = "SkjemaApiError";
  }
}

export class VedleggError extends SkjemaApiError {
  constructor(message: string, status: number, errorCode?: string) {
    super(message, status, errorCode);
    this.name = "VedleggError";
  }
}

async function kastApiFeil(
  response: Response,
  skjemaId: string,
  standardmelding: string,
  erVedlegg = false,
): Promise<never> {
  let body: Record<string, unknown> = {};
  try {
    body = await response.json();
  } catch {
    // Responsen kan mangle JSON ved tekniske feil.
  }
  const message = (body.message as string) || standardmelding;
  const errorCode = body.error as string | undefined;
  const error = erVedlegg
    ? new VedleggError(message, response.status, errorCode)
    : new SkjemaApiError(message, response.status, errorCode);

  if (errorCode === UTDATERT_SKJEMAVERSJON_ERROR && response.status === 409) {
    sessionStorage.setItem(UTDATERT_UTKAST_STORAGE_KEY, skjemaId);
    globalThis.location.reload();
  }
  throw error;
}

type StegData =
  | ArbeidsgiverensVirksomhetINorgeDto
  | UtenlandsoppdragetDto
  | ArbeidsstedIUtlandetDto
  | ArbeidstakerensLonnDto
  | TilleggsopplysningerDto
  | ArbeidssituasjonDto
  | UtsendingsperiodeOgLandDto
  | SkatteforholdOgInntektDto
  | FamiliemedlemmerDto
  | VedleggValgDto;

async function postStegData(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  stegNavn: StegKey,
  data: StegData,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}/${stegNavn}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [SKJEMA_DEFINISJON_VERSJON_HEADER]: skjemaDefinisjonVersjon,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    return kastApiFeil(response, skjemaId, "Kunne ikke lagre skjemasteget");
  }
}

export function listAltinnTilganger() {
  return queryOptions({
    queryKey: ["ALTINNTILGANGER"],
    queryFn: fetchAltinnTilganger,
    // Cache data siden Altinn-tilganger endres sjelden
    staleTime: 5 * 60 * 1000, // 5 minutter
    gcTime: 10 * 60 * 1000, // 10 minutter
  });
}

async function fetchAltinnTilganger(): Promise<OrganisasjonDto[]> {
  const response = await fetch(`${API_PROXY_URL}/hentTilganger`);

  if (!response.ok) {
    // Kast feil med mer kontekst for bedre feilhåndtering
    throw new Error(
      `Kunne ikke hente Altinn-tilganger: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export const getSkjemaQuery = (skjemaId: string) =>
  queryOptions<UtsendtArbeidstakerSkjemaDto>({
    queryKey: ["skjema", skjemaId],
    queryFn: () => fetchSkjema(skjemaId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

async function fetchSkjema(
  skjemaId: string,
): Promise<UtsendtArbeidstakerSkjemaDto> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function postArbeidssituasjon(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  request: ArbeidssituasjonDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    skjemaDefinisjonVersjon,
    StegKey.ARBEIDSSITUASJON,
    request,
  );
}

export async function postSkatteforholdOgInntekt(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  request: SkatteforholdOgInntektDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    skjemaDefinisjonVersjon,
    StegKey.SKATTEFORHOLD_OG_INNTEKT,
    request,
  );
}

export async function postArbeidsgiverensVirksomhetINorge(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  request: ArbeidsgiverensVirksomhetINorgeDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    skjemaDefinisjonVersjon,
    StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
    request,
  );
}

export async function postUtenlandsoppdraget(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  request: UtenlandsoppdragetDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    skjemaDefinisjonVersjon,
    StegKey.UTENLANDSOPPDRAGET,
    request,
  );
}

export async function postArbeidsstedIUtlandet(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  request: ArbeidsstedIUtlandetDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    skjemaDefinisjonVersjon,
    StegKey.ARBEIDSSTED_I_UTLANDET,
    request,
  );
}

export async function postArbeidstakerensLonn(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  request: ArbeidstakerensLonnDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    skjemaDefinisjonVersjon,
    StegKey.ARBEIDSTAKERENS_LONN,
    request,
  );
}

export async function postTilleggsopplysninger(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  request: TilleggsopplysningerDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    skjemaDefinisjonVersjon,
    StegKey.TILLEGGSOPPLYSNINGER,
    request,
  );
}

export async function postVedleggValg(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  request: VedleggValgDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    skjemaDefinisjonVersjon,
    StegKey.VEDLEGG,
    request,
  );
}

export async function sendInnSkjema(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  sprak: Sprak,
): Promise<SkjemaInnsendtKvittering> {
  const parameters = new URLSearchParams({ sprak });
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}/send-inn?${parameters.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [SKJEMA_DEFINISJON_VERSJON_HEADER]: skjemaDefinisjonVersjon,
      },
    },
  );

  if (!response.ok) {
    return kastApiFeil(response, skjemaId, "Kunne ikke sende inn skjemaet");
  }

  return response.json();
}

export async function fetchInnsendtKvittering(
  skjemaId: string,
): Promise<SkjemaInnsendtKvittering> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}/innsendt-kvittering`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const getInnsendtKvitteringQuery = (skjemaId: string) =>
  queryOptions<SkjemaInnsendtKvittering>({
    queryKey: ["innsendt-kvittering", skjemaId],
    queryFn: () => fetchInnsendtKvittering(skjemaId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export async function postUtsendingsperiodeOgLand(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  request: UtsendingsperiodeOgLandDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    skjemaDefinisjonVersjon,
    StegKey.UTSENDINGSPERIODE_OG_LAND,
    request,
  );
}

export async function postFamiliemedlemmer(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  request: FamiliemedlemmerDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    skjemaDefinisjonVersjon,
    StegKey.FAMILIEMEDLEMMER,
    request,
  );
}

export const getOrganisasjonMedJuridiskEnhetQuery = (orgnummer: string) =>
  queryOptions<OrganisasjonMedJuridiskEnhetDto>({
    queryKey: ["ereg", "organisasjon-med-juridisk-enhet", orgnummer],
    queryFn: () => fetchOrganisasjonMedJuridiskEnhet(orgnummer),
    staleTime: 60 * 60 * 1000,
    gcTime: 120 * 60 * 1000,
    retry: false,
  });

async function fetchOrganisasjonMedJuridiskEnhet(
  orgnummer: string,
): Promise<OrganisasjonMedJuridiskEnhetDto> {
  if (!organisasjonsnummerHarGyldigFormat(orgnummer)) {
    throw new ValideringError(`Ugyldig organisasjonsnummer: ${orgnummer}`);
  }

  const response = await fetch(
    `${API_PROXY_URL}/ereg/organisasjon-med-juridisk-enhet/${orgnummer}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const getOrganisasjonQueryOptions = (orgnummer: string) =>
  queryOptions<SimpleOrganisasjonDto>({
    queryKey: ["ereg", "organisasjon", orgnummer],
    queryFn: () => fetchOrganisasjon(orgnummer),
    staleTime: 60 * 60 * 1000,
    gcTime: 120 * 60 * 1000,
    retry: false,
  });

async function fetchOrganisasjon(
  orgnummer: string,
): Promise<SimpleOrganisasjonDto> {
  if (!organisasjonsnummerHarGyldigFormat(orgnummer)) {
    throw new ValideringError(`Ugyldig organisasjonsnummer: ${orgnummer}`);
  }

  const response = await fetch(
    `${API_PROXY_URL}/ereg/organisasjon/${orgnummer}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const getPersonerMedFullmaktQuery = () =>
  queryOptions<PersonMedFullmaktDto[]>({
    queryKey: ["representasjon", "personer"],
    queryFn: fetchPersonerMedFullmakt,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

async function fetchPersonerMedFullmakt(): Promise<PersonMedFullmaktDto[]> {
  const response = await fetch(`${API_PROXY_URL}/representasjon/personer`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Kunne ikke hente personer med fullmakt: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export async function verifiserPerson(
  request: VerifiserPersonRequest,
): Promise<VerifiserPersonResponse> {
  const response = await fetch(
    `${API_PROXY_URL}/arbeidstaker/verifiser-person`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    const error = new Error(
      `HTTP error! status: ${response.status}`,
    ) as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function opprettSoknad(
  request: OpprettUtsendtArbeidstakerSoknadRequest,
): Promise<OpprettUtsendtArbeidstakerSoknadResponse> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/opprett-med-kontekst`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Kunne ikke opprette søknad: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

// ============ Utkast ============

export async function slettUtkast(skjemaId: string): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

/**
 * Query for å hente utkast basert på representasjonskontekst.
 * Returnerer kun søknader med status UTKAST.
 *
 * Backend filtrerer basert på:
 * - DEG_SELV: Utkast for innlogget brukers eget fnr
 * - ARBEIDSGIVER: Alle utkast for organisasjoner brukeren har tilgang til i Altinn
 * - RADGIVER: Kun utkast for det spesifikke rådgiverfirmaet (krever radgiverfirmaOrgnr)
 * - ANNEN_PERSON: Alle utkast for personer brukeren har fullmakt for
 */
export const getUtkastQuery = (
  representasjonskontekst: Representasjonskontekst,
) =>
  queryOptions<UtkastListeResponse>({
    queryKey: [
      "utkast",
      representasjonskontekst.representasjonstype,
      representasjonskontekst.radgiverOrgnr,
    ],
    queryFn: () => fetchUtkast(representasjonskontekst),
    staleTime: 2 * 60 * 1000, // 2 minutter - utkast kan endres ofte
    gcTime: 5 * 60 * 1000, // 5 minutter
    retry: 1,
  });

async function fetchUtkast(
  representasjonskontekst: Representasjonskontekst,
): Promise<UtkastListeResponse> {
  const parameters = new URLSearchParams();
  parameters.append(
    "representasjonstype",
    representasjonskontekst.representasjonstype,
  );

  // For RADGIVER må vi sende med rådgiverfirmaets orgnr
  if (
    representasjonskontekst.representasjonstype ===
      Representasjonstype.RADGIVER &&
    representasjonskontekst.radgiverOrgnr
  ) {
    if (
      !organisasjonsnummerHarGyldigFormat(representasjonskontekst.radgiverOrgnr)
    ) {
      throw new ValideringError(
        `Ugyldig organisasjonsnummer: ${representasjonskontekst.radgiverOrgnr}`,
      );
    }
    parameters.append(
      "radgiverfirmaOrgnr",
      representasjonskontekst.radgiverOrgnr,
    );
  }

  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/utkast?${parameters.toString()}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ============ Innsendte søknader ============

/**
 * Query for å hente innsendte søknader basert på representasjonskontekst med paginering, søk og sortering.
 *
 * Backend filtrerer basert på:
 * - DEG_SELV: Søknader hvor innlogget bruker er arbeidstaker
 * - ARBEIDSGIVER: Søknader for organisasjoner brukeren har tilgang til i Altinn
 * - RADGIVER: Søknader for det spesifikke rådgiverfirmaet
 * - ANNEN_PERSON: Søknader for personer brukeren har fullmakt for
 *
 * VIKTIG: Bruker POST i stedet for GET for å unngå at søkeord logges i access logs.
 */
export const getInnsendteSoknaderQuery = (
  request: HentInnsendteSoknaderRequest,
) =>
  queryOptions<InnsendteSoknaderResponse>({
    queryKey: [
      "innsendte-soknader",
      request.representasjonstype,
      request.side,
      request.antall,
      request.sok,
      request.sortering,
      request.retning,
      request.radgiverfirmaOrgnr,
    ],
    queryFn: () => fetchInnsendteSoknader(request),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutter - innsendte søknader endres sjelden
    gcTime: 5 * 60 * 1000, // 5 minutter
    retry: 1,
  });

async function fetchInnsendteSoknader(
  request: HentInnsendteSoknaderRequest,
): Promise<InnsendteSoknaderResponse> {
  if (
    request.radgiverfirmaOrgnr &&
    !organisasjonsnummerHarGyldigFormat(request.radgiverfirmaOrgnr)
  ) {
    throw new ValideringError(
      `Ugyldig organisasjonsnummer: ${request.radgiverfirmaOrgnr}`,
    );
  }

  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/innsendte`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ============ Innsendt skjema (readonly-visning) ============

async function fetchInnsendtSkjema(
  skjemaId: string,
  sprak: Sprak,
): Promise<InnsendtSkjemaResponse> {
  const parameters = new URLSearchParams({ sprak });
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}/innsendt?${parameters.toString()}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const getInnsendtSkjemaQuery = (skjemaId: string, sprak: Sprak) =>
  queryOptions<InnsendtSkjemaResponse>({
    queryKey: ["innsendt-skjema", skjemaId, sprak],
    queryFn: () => fetchInnsendtSkjema(skjemaId, sprak),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// ============ Skjemadefinisjon ============

/**
 * Henter skjemadefinisjon fra backend.
 * Brukes primært for runtime-validering mot statisk kopi.
 * Returnerer unknown fordi vi sammenligner med statisk definisjon.
 */
export async function fetchSkjemaDefinisjon(
  type: string,
  sprak: Sprak,
): Promise<unknown> {
  const parameters = new URLSearchParams({ sprak });
  const response = await fetch(
    `${API_PROXY_URL}/skjema/definisjon/${type}?${parameters.toString()}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Kunne ikke hente skjemadefinisjon: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export const getSkjemaDefinisjonQuery = (type: string, sprak: Sprak) =>
  queryOptions<unknown>({
    queryKey: ["skjema-definisjon", type, sprak],
    queryFn: () => fetchSkjemaDefinisjon(type, sprak),
    staleTime: 60 * 60 * 1000, // 1 time - definisjoner endres sjelden
    gcTime: 120 * 60 * 1000, // 2 timer
  });

// ============ Vedlegg ============

export async function lastOppVedlegg(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  fil: File,
): Promise<VedleggDto> {
  const formData = new FormData();
  formData.append("fil", fil);

  const response = await fetch(`${API_PROXY_URL}/skjema/${skjemaId}/vedlegg`, {
    method: "POST",
    headers: {
      [SKJEMA_DEFINISJON_VERSJON_HEADER]: skjemaDefinisjonVersjon,
    },
    body: formData,
  });

  if (!response.ok) {
    return kastApiFeil(
      response,
      skjemaId,
      "Kunne ikke laste opp vedlegg",
      true,
    );
  }

  return response.json();
}

export async function hentVedlegg(skjemaId: string): Promise<VedleggDto[]> {
  const response = await fetch(`${API_PROXY_URL}/skjema/${skjemaId}/vedlegg`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function vedleggInnholdUrl(skjemaId: string, vedleggId: string): string {
  return `${API_PROXY_URL}/skjema/${skjemaId}/vedlegg/${vedleggId}/innhold`;
}

export async function slettVedlegg(
  skjemaId: string,
  skjemaDefinisjonVersjon: string,
  vedleggId: string,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/${skjemaId}/vedlegg/${vedleggId}`,
    {
      method: "DELETE",
      headers: {
        [SKJEMA_DEFINISJON_VERSJON_HEADER]: skjemaDefinisjonVersjon,
      },
    },
  );

  if (!response.ok) {
    return kastApiFeil(response, skjemaId, "Kunne ikke slette vedlegg", true);
  }
}

/**
 * Innsendte arbeidsgiver-deler som venter på at innlogget bruker sender inn sin
 * arbeidstaker-del. Tom liste når toggle `melosys.skjema.motpart-cta` er av i backend.
 */
export const VENTENDE_MOTPART_SOKNADER_QUERY_KEY = [
  "ventende-motpart-soknader",
] as const;

export const getVentendeMotpartSoknaderQuery = () =>
  queryOptions<VentendeMotpartSoknaderResponse>({
    queryKey: VENTENDE_MOTPART_SOKNADER_QUERY_KEY,
    queryFn: fetchVentendeMotpartSoknader,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

async function fetchVentendeMotpartSoknader(): Promise<VentendeMotpartSoknaderResponse> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/ventende-motpart-soknader`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Henter evaluert status for alle kjente feature toggles (se featuretoggle/toggleNavn.ts).
 * Toggles konsumeres via useFeatureToggle-hooken, ikke denne direkte.
 */
export const getFeatureTogglesQuery = () =>
  queryOptions<Record<string, boolean>>({
    queryKey: ["featuretoggles"],
    queryFn: fetchFeatureToggles,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

async function fetchFeatureToggles(): Promise<Record<string, boolean>> {
  const parameters = new URLSearchParams(
    alleToggleNavn.map((navn) => ["features", navn]),
  );

  const response = await fetch(`${API_PROXY_URL}/featuretoggle?${parameters}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export { type VedleggDto } from "~/types/melosysSkjemaTypes.ts";
