import { queryOptions } from "@tanstack/react-query";

import {
  ArbeidsgiverenDto,
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidsgiversSkjemaDto,
  ArbeidstakerenDto,
  ArbeidstakerensLonnDto,
  ArbeidstakersSkjemaDto,
  CreateArbeidsgiverSkjemaRequest,
  CreateArbeidstakerSkjemaRequest,
  FamiliemedlemmerDto,
  OrganisasjonDto,
  OrganisasjonMedJuridiskEnhet,
  SkatteforholdOgInntektDto,
  SubmitSkjemaRequest,
  TilleggsopplysningerDto,
  UtenlandsoppdragetDto,
} from "~/types/melosysSkjemaTypes.ts";

const API_PROXY_URL = "/api";

export function listAltinnTilganger() {
  return queryOptions({
    queryKey: ["ALTINNTILGANGER"],
    queryFn: fetchAltinnTilganger,
  });
}

async function fetchAltinnTilganger(): Promise<OrganisasjonDto[]> {
  const response = await fetch(`${API_PROXY_URL}/hentTilganger`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
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

export async function postArbeidstakeren(
  skjemaId: string,
  request: ArbeidstakerenDto,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/arbeidstakeren`,
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

export async function postSkatteforholdOgInntekt(
  skjemaId: string,
  request: SkatteforholdOgInntektDto,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/skatteforhold-og-inntekt`,
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

export async function postArbeidsgiveren(
  skjemaId: string,
  request: ArbeidsgiverenDto,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/arbeidsgiveren`,
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

export async function postArbeidsgiverensVirksomhetINorge(
  skjemaId: string,
  request: ArbeidsgiverensVirksomhetINorgeDto,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/arbeidsgiverens-virksomhet-i-norge`,
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

export async function postUtenlandsoppdraget(
  skjemaId: string,
  request: UtenlandsoppdragetDto,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/utenlandsoppdraget`,
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

export async function postArbeidstakerensLonn(
  skjemaId: string,
  request: ArbeidstakerensLonnDto,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidsgiver/${skjemaId}/arbeidstakerens-lonn`,
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

export async function postFamiliemedlemmer(
  skjemaId: string,
  request: FamiliemedlemmerDto,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/familiemedlemmer`,
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

export async function postTilleggsopplysninger(
  skjemaId: string,
  request: TilleggsopplysningerDto,
): Promise<void> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/arbeidstaker/${skjemaId}/tilleggsopplysninger`,
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

export const getOrganisasjonQuery = (orgnummer: string) =>
  queryOptions<OrganisasjonMedJuridiskEnhet>({
    queryKey: ["ereg", "organisasjon", orgnummer],
    queryFn: () => fetchOrganisasjon(orgnummer),
    staleTime: 60 * 60 * 1000,
    gcTime: 120 * 60 * 1000,
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
