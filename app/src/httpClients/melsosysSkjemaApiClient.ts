import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { StegKey } from "~/constants/stegKeys.ts";
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
  TilleggsopplysningerDto,
  UtenlandsoppdragetDto,
  UtkastListeResponse,
  UtsendingsperiodeOgLandDto,
  UtsendtArbeidstakerSkjemaDto,
  VedleggDto,
  VerifiserPersonRequest,
  VerifiserPersonResponse,
} from "~/types/melosysSkjemaTypes.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";
import {
  organisasjonsnummerHarGyldigFormat,
  ValideringError,
} from "~/utils/valideringUtils.ts";

const API_PROXY_URL = "/api";

type StegData =
  | ArbeidsgiverensVirksomhetINorgeDto
  | UtenlandsoppdragetDto
  | ArbeidsstedIUtlandetDto
  | ArbeidstakerensLonnDto
  | TilleggsopplysningerDto
  | ArbeidssituasjonDto
  | UtsendingsperiodeOgLandDto
  | SkatteforholdOgInntektDto
  | FamiliemedlemmerDto;

async function postStegData(
  skjemaId: string,
  stegNavn: StegKey,
  data: StegData,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}/${stegNavn}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
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
  request: ArbeidssituasjonDto,
): Promise<void> {
  return postStegData(skjemaId, StegKey.ARBEIDSSITUASJON, request);
}

export async function postSkatteforholdOgInntekt(
  skjemaId: string,
  request: SkatteforholdOgInntektDto,
): Promise<void> {
  return postStegData(skjemaId, StegKey.SKATTEFORHOLD_OG_INNTEKT, request);
}

export async function postArbeidsgiverensVirksomhetINorge(
  skjemaId: string,
  request: ArbeidsgiverensVirksomhetINorgeDto,
): Promise<void> {
  return postStegData(
    skjemaId,
    StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE,
    request,
  );
}

export async function postUtenlandsoppdraget(
  skjemaId: string,
  request: UtenlandsoppdragetDto,
): Promise<void> {
  return postStegData(skjemaId, StegKey.UTENLANDSOPPDRAGET, request);
}

export async function postArbeidsstedIUtlandet(
  skjemaId: string,
  request: ArbeidsstedIUtlandetDto,
): Promise<void> {
  return postStegData(skjemaId, StegKey.ARBEIDSSTED_I_UTLANDET, request);
}

export async function postArbeidstakerensLonn(
  skjemaId: string,
  request: ArbeidstakerensLonnDto,
): Promise<void> {
  return postStegData(skjemaId, StegKey.ARBEIDSTAKERENS_LONN, request);
}

export async function postTilleggsopplysninger(
  skjemaId: string,
  request: TilleggsopplysningerDto,
): Promise<void> {
  return postStegData(skjemaId, StegKey.TILLEGGSOPPLYSNINGER, request);
}

export async function sendInnSkjema(
  skjemaId: string,
): Promise<SkjemaInnsendtKvittering> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}/send-inn`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
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
  request: UtsendingsperiodeOgLandDto,
): Promise<void> {
  return postStegData(skjemaId, StegKey.UTSENDINGSPERIODE_OG_LAND, request);
}

export async function postFamiliemedlemmer(
  skjemaId: string,
  request: FamiliemedlemmerDto,
): Promise<void> {
  return postStegData(skjemaId, StegKey.FAMILIEMEDLEMMER, request);
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
  const params = new URLSearchParams();
  params.append(
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
    params.append("radgiverfirmaOrgnr", representasjonskontekst.radgiverOrgnr);
  }

  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/utkast?${params.toString()}`,
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
  sprak: string = "nb",
): Promise<InnsendtSkjemaResponse> {
  const params = new URLSearchParams({ sprak });
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}/innsendt?${params.toString()}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const getInnsendtSkjemaQuery = (
  skjemaId: string,
  sprak: string = "nb",
) =>
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
  sprak: string = "nb",
): Promise<unknown> {
  const params = new URLSearchParams({ sprak });
  const response = await fetch(
    `${API_PROXY_URL}/skjema/definisjon/${type}?${params.toString()}`,
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

export const getSkjemaDefinisjonQuery = (type: string, sprak: string = "nb") =>
  queryOptions<unknown>({
    queryKey: ["skjema-definisjon", type, sprak],
    queryFn: () => fetchSkjemaDefinisjon(type, sprak),
    staleTime: 60 * 60 * 1000, // 1 time - definisjoner endres sjelden
    gcTime: 120 * 60 * 1000, // 2 timer
  });

// ============ Vedlegg ============

export class VedleggError extends Error {
  status: number;
  errorCode?: string;

  constructor(message: string, status: number, errorCode?: string) {
    super(message);
    this.name = "VedleggError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

export async function lastOppVedlegg(
  skjemaId: string,
  fil: File,
): Promise<VedleggDto> {
  const formData = new FormData();
  formData.append("fil", fil);

  const response = await fetch(`${API_PROXY_URL}/skjema/${skjemaId}/vedlegg`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new VedleggError(
      body.message || "Kunne ikke laste opp vedlegg",
      response.status,
      body.error,
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
  vedleggId: string,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/${skjemaId}/vedlegg/${vedleggId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export { type VedleggDto } from "~/types/melosysSkjemaTypes.ts";
