import type { OrganisasjonDto } from "~/types/melosysSkjemaTypes.ts";
import type { RepresentasjonskontekstDto } from "~/types/representasjon.ts";

export function getValgtRolle(): OrganisasjonDto | undefined {
  try {
    const organisasjonData = sessionStorage.getItem("valgtRolle");

    if (!organisasjonData) {
      return undefined;
    }

    return JSON.parse(organisasjonData) as OrganisasjonDto;
  } catch {
    // Clear corrupted data
    sessionStorage.removeItem("valgtRolle");
    return undefined;
  }
}

export function setValgtRolle(organisasjon: OrganisasjonDto): void {
  try {
    sessionStorage.setItem("valgtRolle", JSON.stringify(organisasjon));
  } catch {
    // Silently fail - sessionStorage might be full or disabled
  }
}

// Representasjonskontekst-håndtering
const REPRESENTASJON_KEY = "representasjonKontekst";

export function getRepresentasjonKontekst():
  | RepresentasjonskontekstDto
  | undefined {
  try {
    const kontekstData = sessionStorage.getItem(REPRESENTASJON_KEY);

    if (!kontekstData) {
      return undefined;
    }

    return JSON.parse(kontekstData) as RepresentasjonskontekstDto;
  } catch {
    // Clear corrupted data
    sessionStorage.removeItem(REPRESENTASJON_KEY);
    return undefined;
  }
}

export function setRepresentasjonKontekst(
  kontekst: RepresentasjonskontekstDto,
): void {
  try {
    sessionStorage.setItem(REPRESENTASJON_KEY, JSON.stringify(kontekst));
  } catch {
    // Silently fail - sessionStorage might be full or disabled
  }
}

export function clearRepresentasjonKontekst(): void {
  try {
    sessionStorage.removeItem(REPRESENTASJON_KEY);
  } catch {
    // Silently fail - sessionStorage might be disabled
  }
}
