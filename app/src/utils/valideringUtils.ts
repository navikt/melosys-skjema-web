import { idnr } from "@navikt/fnrvalidator";

export class ValideringError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function erGyldigFnrEllerDnr(value: string): boolean {
  const validationResult = idnr(value);

  return (
    validationResult.status === "valid" &&
    ["fnr", "dnr", "tnr"].includes(validationResult.type)
  );
}

// https://www.brreg.no/om-oss/registrene-vare/om-enhetsregisteret/organisasjonsnummeret/
const MOD11_VEKTER = [3, 2, 7, 6, 5, 4, 3, 2];

export function organisasjonsnummerHarGyldigFormat(orgnr: string): boolean {
  if (!/^\d{9}$/.test(orgnr)) return false;

  const siffer = [...orgnr].map(Number);
  const sum = MOD11_VEKTER.reduce(
    (acc, vekt, i) => acc + (siffer[i] ?? 0) * vekt,
    0,
  );
  const rest = sum % 11;
  const kontrollsiffer = 11 - rest;

  if (kontrollsiffer === 10) return false;

  return (kontrollsiffer === 11 ? 0 : kontrollsiffer) === siffer[8];
}
