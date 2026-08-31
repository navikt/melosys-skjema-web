export enum OffentligArbeidsgiverKilde {
  BRUKERSVAR = "BRUKERSVAR",
  ENHETSREGISTERET = "ENHETSREGISTERET",
}

export interface SkjemaVersjonsprofil {
  definisjonsversjon: "1" | "2";
  offentligArbeidsgiverKilde: OffentligArbeidsgiverKilde;
}

const SKJEMA_VERSJONSPROFILER: Record<string, SkjemaVersjonsprofil> = {
  "1": {
    definisjonsversjon: "1",
    offentligArbeidsgiverKilde: OffentligArbeidsgiverKilde.BRUKERSVAR,
  },
  "2": {
    definisjonsversjon: "2",
    offentligArbeidsgiverKilde: OffentligArbeidsgiverKilde.ENHETSREGISTERET,
  },
};

export const getSkjemaVersjonsprofil = (
  versjon: string,
): SkjemaVersjonsprofil => {
  const profil = SKJEMA_VERSJONSPROFILER[versjon];
  if (!profil) {
    throw new Error(`Ukjent skjemadefinisjonsversjon: ${versjon}`);
  }
  return profil;
};
