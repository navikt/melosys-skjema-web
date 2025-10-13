import { queryOptions } from "@tanstack/react-query";

import {
  ArbeidsgiverenDto,
  ArbeidsgiverensVirksomhetINorgeDto,
  ArbeidsgiversSkjemaDto,
  ArbeidstakerenDto,
  ArbeidstakerensLonnDto,
  CreateArbeidsgiverSkjemaRequest,
  CreateArbeidstakerSkjemaRequest,
  OrganisasjonDto,
  SkatteforholdOgInntektDto,
  SubmitSkjemaRequest,
  UtenlandsoppdragetDto,
} from "~/types/melosysSkjemaTypes.ts";

const API_PROXY_URL = "/api";

// Har bare denne som en fallback inntil jeg starter på arbeidstakers del
export interface SkjemaResponse {
  id: string;
  // Add other fields as returned by the API
}

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

// ========== SCHEMA API FUNCTIONS ==========
export const getSkjemaAsArbeidsgiverQuery = (skjemaId: string) =>
  queryOptions<ArbeidsgiversSkjemaDto>({
    queryKey: ["skjema", skjemaId],
    queryFn: () => fetchSkjemaAsArbeidsgiver(skjemaId),
    staleTime: 0,
    gcTime: 0,
  });

// Get Skjema by ID
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

// 1. Create Skjema for Arbeidstaker
export async function createArbeidstakerSkjema(
  request: CreateArbeidstakerSkjemaRequest,
): Promise<SkjemaResponse> {
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

// 2. Create Skjema for Arbeidsgiver
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

// 3. Register Arbeidstaker Information
export async function registerArbeidstakerInfo(
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

// 4. Register Skatteforhold og Inntekt
export async function registerSkatteforholdOgInntekt(
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

// 5. Register Arbeidsgiver Information
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

// 6. Register Virksomhet Information
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

// 7. Register Utenlandsoppdrag Information
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

// 8. Register Arbeidstaker Lønn Information
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

// 9. Submit Skjema
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
