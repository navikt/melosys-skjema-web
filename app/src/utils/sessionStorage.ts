import type { OrganisasjonDto } from "~/types/apiTypes";

export function getValgtRolle(): OrganisasjonDto | undefined {
  const organisasjonData = sessionStorage.getItem("valgtRolle");

  return organisasjonData
    ? (JSON.parse(organisasjonData) as OrganisasjonDto)
    : undefined;
}

export function setValgtRolle(organisasjon: OrganisasjonDto): void {
  sessionStorage.setItem("valgtRolle", JSON.stringify(organisasjon));
}
