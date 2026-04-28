import { BriefcaseIcon, PersonRectangleIcon } from "@navikt/aksel-icons";

import { StegKey } from "~/constants/stegKeys.ts";

type StegRolle = "arbeidsgiver" | "arbeidstaker";

const STEG_ROLLE: Partial<Record<StegKey, StegRolle>> = {
  [StegKey.ARBEIDSGIVERENS_VIRKSOMHET_I_NORGE]: "arbeidsgiver",
  [StegKey.UTENLANDSOPPDRAGET]: "arbeidsgiver",
  [StegKey.ARBEIDSSTED_I_UTLANDET]: "arbeidsgiver",
  [StegKey.ARBEIDSTAKERENS_LONN]: "arbeidsgiver",
  [StegKey.ARBEIDSSITUASJON]: "arbeidstaker",
  [StegKey.SKATTEFORHOLD_OG_INNTEKT]: "arbeidstaker",
  [StegKey.FAMILIEMEDLEMMER]: "arbeidstaker",
};

export function getStegRolle(stegKey: StegKey): StegRolle | undefined {
  return STEG_ROLLE[stegKey];
}

export function StegRolleIkon({
  stegKey,
  size,
}: {
  stegKey: StegKey;
  size?: string;
}) {
  const rolle = getStegRolle(stegKey);

  if (!rolle) {
    return null;
  }

  const Icon = rolle === "arbeidsgiver" ? BriefcaseIcon : PersonRectangleIcon;

  return <Icon aria-hidden="true" fontSize={size ?? "1.25rem"} />;
}
