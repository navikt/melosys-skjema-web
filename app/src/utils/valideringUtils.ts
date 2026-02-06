import { idnr } from "@navikt/fnrvalidator";

export function erGyldigFnrEllerDnr(value: string): boolean {
  const validationResult = idnr(value);

  return (
    validationResult.status === "valid" &&
    ["fnr", "dnr", "tnr"].includes(validationResult.type)
  );
}
