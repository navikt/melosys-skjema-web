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
  DineOpplysningerDto,
  FamiliemedlemmerDto,
  HentInnsendteSoknaderRequest,
  InnsendteSoknaderResponse,
  OpprettSoknadMedKontekstRequest,
  OpprettSoknadMedKontekstResponse,
  OrganisasjonDto,
  OrganisasjonMedJuridiskEnhet,
  PersonMedFullmaktDto,
  SkatteforholdOgInntektDto,
  SubmitSkjemaRequest,
  TilleggsopplysningerDto,
  UtenlandsoppdragetArbeidstakersDelDto,
  UtenlandsoppdragetDto,
  UtkastListeResponse,
  VerifiserPersonRequest,
  VerifiserPersonResponse,
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
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}/arbeidsgiver-view`,
    {
      method: "GET",
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
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/${skjemaId}/arbeidstaker-view`,
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

export async function opprettSoknadMedKontekst(
  kontekst: OpprettSoknadMedKontekstRequest,
): Promise<OpprettSoknadMedKontekstResponse> {
  const response = await fetch(
    `${API_PROXY_URL}/skjema/utsendt-arbeidstaker/opprett-med-kontekst`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(kontekst),
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
export const getUtkastQuery = (kontekst: OpprettSoknadMedKontekstRequest) =>
  queryOptions<UtkastListeResponse>({
    queryKey: [
      "utkast",
      kontekst.representasjonstype,
      kontekst.radgiverfirma?.orgnr,
    ],
    queryFn: () => fetchUtkast(kontekst),
    staleTime: 2 * 60 * 1000, // 2 minutter - utkast kan endres ofte
    gcTime: 5 * 60 * 1000, // 5 minutter
    retry: 1,
  });

async function fetchUtkast(
  kontekst: OpprettSoknadMedKontekstRequest,
): Promise<UtkastListeResponse> {
  const params = new URLSearchParams();
  params.append("representasjonstype", kontekst.representasjonstype);

  // For RADGIVER må vi sende med rådgiverfirmaets orgnr
  if (
    kontekst.representasjonstype === "RADGIVER" &&
    kontekst.radgiverfirma?.orgnr
  ) {
    params.append("radgiverfirmaOrgnr", kontekst.radgiverfirma.orgnr);
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
    staleTime: 5 * 60 * 1000, // 5 minutter - innsendte søknader endres sjelden
    gcTime: 5 * 60 * 1000, // 5 minutter
    retry: 1,
  });

async function fetchInnsendteSoknader(
  request: HentInnsendteSoknaderRequest,
): Promise<InnsendteSoknaderResponse> {
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
