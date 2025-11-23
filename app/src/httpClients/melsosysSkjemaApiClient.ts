import { queryOptions } from "@tanstack/react-query";

import {
  ArbeidsgiverenDto,
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidsgiversSkjemaDto,
  ArbeidssituasjonDto,
  ArbeidsstedIUtlandetDto,
  ArbeidstakerenDto,
  ArbeidstakerensLonnDto,
  ArbeidstakersSkjemaDto,
  CreateArbeidsgiverSkjemaRequest,
  CreateArbeidstakerSkjemaRequest,
  DineOpplysningerDto,
  FamiliemedlemmerDto,
  OrganisasjonDto,
  OrganisasjonMedJuridiskEnhet,
  SkatteforholdOgInntektDto,
  SubmitSkjemaRequest,
  TilleggsopplysningerDto,
  UtenlandsoppdragetArbeidstakersDelDto,
  UtenlandsoppdragetDto,
} from "~/types/melosysSkjemaTypes.ts";

const API_PROXY_URL = "/api";

type ArbeidsgiverStegData =
  | ArbeidsgiverenDto
  | ArbeidstakerenDto
  | ArbeidsgiverensVirksomhetINorgeDto
  | UtenlandsoppdragetDto
  | ArbeidsstedIUtlandetDto
  | ArbeidstakerensLonnDto
  | TilleggsopplysningerDto;

type ArbeidstakerStegData =
  | DineOpplysningerDto
  | ArbeidssituasjonDto
  | UtenlandsoppdragetArbeidstakersDelDto
  | SkatteforholdOgInntektDto
  | FamiliemedlemmerDto
  | TilleggsopplysningerDto;

async function postArbeidsgiverStegData(
  skjemaId: string,
  stegNavn: string,
  data: ArbeidsgiverStegData,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/${stegNavn}`,
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

async function postArbeidstakerStegData(
  skjemaId: string,
  stegNavn: string,
  data: ArbeidstakerStegData,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/${stegNavn}`,
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

export const getSkjemaAsArbeidsgiverQuery = (skjemaId: string) =>
  queryOptions<ArbeidsgiversSkjemaDto>({
    queryKey: ["skjema", skjemaId],
    queryFn: () => fetchSkjemaAsArbeidsgiver(skjemaId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

async function fetchSkjemaAsArbeidsgiver(
  skjemaId: string,
): Promise<ArbeidsgiversSkjemaDto> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function createArbeidstakerSkjema(
  request: CreateArbeidstakerSkjemaRequest,
): Promise<ArbeidstakersSkjemaDto> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidstaker`,
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

export async function createArbeidsgiverSkjema(
  request: CreateArbeidsgiverSkjemaRequest,
): Promise<ArbeidsgiversSkjemaDto> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidsgiver`,
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

export async function postDineOpplysninger(
  skjemaId: string,
  request: DineOpplysningerDto,
): Promise<void> {
  return postArbeidstakerStegData(skjemaId, "dine-opplysninger", request);
}

export async function postArbeidssituasjon(
  skjemaId: string,
  request: ArbeidssituasjonDto,
): Promise<void> {
  return postArbeidstakerStegData(skjemaId, "arbeidssituasjon", request);
}

export async function postSkatteforholdOgInntekt(
  skjemaId: string,
  request: SkatteforholdOgInntektDto,
): Promise<void> {
  return postArbeidstakerStegData(
    skjemaId,
    "skatteforhold-og-inntekt",
    request,
  );
}

export async function postArbeidsgiveren(
  skjemaId: string,
  request: ArbeidsgiverenDto,
): Promise<void> {
  return postArbeidsgiverStegData(skjemaId, "arbeidsgiveren", request);
}

export async function postArbeidstakeren(
  skjemaId: string,
  request: ArbeidstakerenDto,
): Promise<void> {
  return postArbeidsgiverStegData(skjemaId, "arbeidstakeren", request);
}

export async function postArbeidsgiverensVirksomhetINorge(
  skjemaId: string,
  request: ArbeidsgiverensVirksomhetINorgeDto,
): Promise<void> {
  return postArbeidsgiverStegData(
    skjemaId,
    "arbeidsgiverens-virksomhet-i-norge",
    request,
  );
}

export async function postUtenlandsoppdraget(
  skjemaId: string,
  request: UtenlandsoppdragetDto,
): Promise<void> {
  return postArbeidsgiverStegData(skjemaId, "utenlandsoppdraget", request);
}

export async function postArbeidsstedIUtlandet(
  skjemaId: string,
  request: ArbeidsstedIUtlandetDto,
): Promise<void> {
  return postArbeidsgiverStegData(skjemaId, "arbeidssted-i-utlandet", request);
}

export async function postArbeidstakerensLonn(
  skjemaId: string,
  request: ArbeidstakerensLonnDto,
): Promise<void> {
  return postArbeidsgiverStegData(skjemaId, "arbeidstakerens-lonn", request);
}

export async function postTilleggsopplysningerArbeidsgiver(
  skjemaId: string,
  request: TilleggsopplysningerDto,
): Promise<void> {
  return postArbeidsgiverStegData(skjemaId, "tilleggsopplysninger", request);
}

export async function submitSkjema(
  skjemaId: string,
  request: SubmitSkjemaRequest,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}/submit`,
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
}

export const getSkjemaAsArbeidstakerQuery = (skjemaId: string) =>
  queryOptions<ArbeidstakersSkjemaDto>({
    queryKey: ["arbeidstaker-skjema", skjemaId],
    queryFn: () => fetchSkjemaAsArbeidstaker(skjemaId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

async function fetchSkjemaAsArbeidstaker(
  skjemaId: string,
): Promise<ArbeidstakersSkjemaDto> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function postUtenlandsoppdragetArbeidstaker(
  skjemaId: string,
  request: UtenlandsoppdragetArbeidstakersDelDto,
): Promise<void> {
  return postArbeidstakerStegData(skjemaId, "utenlandsoppdraget", request);
}

export async function postFamiliemedlemmer(
  skjemaId: string,
  request: FamiliemedlemmerDto,
): Promise<void> {
  return postArbeidstakerStegData(skjemaId, "familiemedlemmer", request);
}

export async function postTilleggsopplysninger(
  skjemaId: string,
  request: TilleggsopplysningerDto,
): Promise<void> {
  return postArbeidstakerStegData(skjemaId, "tilleggsopplysninger", request);
}

export const getOrganisasjonQuery = (orgnummer: string) =>
  queryOptions<OrganisasjonMedJuridiskEnhet>({
    queryKey: ["ereg", "organisasjon", orgnummer],
    queryFn: () => fetchOrganisasjon(orgnummer),
    staleTime: 60 * 60 * 1000,
    gcTime: 120 * 60 * 1000,
    retry: false,
  });

async function fetchOrganisasjon(
  orgnummer: string,
): Promise<OrganisasjonMedJuridiskEnhet> {
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

// ============ PDL / Representasjon API ============

export interface PersonMedFullmaktDto {
  fnr: string;
  navn: string;
  fodselsdato: string;
}

export interface VerifiserPersonRequest {
  fodselsnummer: string;
  etternavn: string;
}

export interface VerifiserPersonResponse {
  navn: string;
  fodselsdato: string;
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

// ============ Opprett søknad med kontekst ============

export interface OpprettSoknadMedKontekstRequest {
  representasjonstype: string;
  radgiverfirma?: {
    orgnr: string;
    navn: string;
  };
  arbeidsgiver?: {
    orgnr: string;
    navn: string;
  };
  arbeidstaker?: {
    fnr: string;
    navn: string;
  };
  harFullmakt: boolean;
}

export interface OpprettSoknadMedKontekstResponse {
  id: string;
  status: "UTKAST" | "SENDT" | "MOTTATT";
}

export async function opprettSoknadMedKontekst(
  kontekst: OpprettSoknadMedKontekstRequest,
): Promise<OpprettSoknadMedKontekstResponse> {
  const response = await fetch(`${API_PROXY_URL}/skjema/opprett-med-kontekst`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(kontekst),
  });

  if (!response.ok) {
    throw new Error(
      `Kunne ikke opprette søknad: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
