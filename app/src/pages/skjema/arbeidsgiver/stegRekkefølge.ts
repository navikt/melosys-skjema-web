import { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";

export const ARBEIDSGIVER_STEG_REKKEFOLGE: StegRekkefolgeItem[] = [
  {
    key: "veiledning",
    title: "Veiledning",
    route: "/skjema/arbeidsgiver/veiledning",
  },
  {
    key: "arbeidsgiveren",
    title: "Arbeidsgiveren",
    route: "/skjema/arbeidsgiver/arbeidsgiveren",
  },
  {
    key: "arbeidsgiverens-virksomhet-i-norge",
    title: "Arbeidsgiverens virksomhet i Norge",
    route: "/skjema/arbeidsgiver/arbeidsgiverens-virksomhet-i-norge",
  },
  {
    key: "utenlandsoppdraget",
    title: "Utenlandsoppdraget",
    route: "/skjema/arbeidsgiver/utenlandsoppdraget",
  },
  {
    key: "arbeidstakerens-lonn",
    title: "Arbeidstakerens lønn",
    route: "/skjema/arbeidsgiver/arbeidstakerens-lonn",
  },
  {
    key: "oppsummering",
    title: "Oppsummering",
    route: "/skjema/arbeidsgiver/oppsummering",
  },
];

export function getStepNumber(key: string): number {
  const index = ARBEIDSGIVER_STEG_REKKEFOLGE.findIndex(
    (step) => step.key === key,
  );
  return index + 1;
}

export function getPreviousStep(key: string): StegRekkefolgeItem | undefined {
  const currentIndex = ARBEIDSGIVER_STEG_REKKEFOLGE.findIndex(
    (step) => step.key === key,
  );
  return currentIndex > 0
    ? ARBEIDSGIVER_STEG_REKKEFOLGE[currentIndex - 1]
    : undefined;
}

export function getNextStep(key: string): StegRekkefolgeItem | undefined {
  const currentIndex = ARBEIDSGIVER_STEG_REKKEFOLGE.findIndex(
    (step) => step.key === key,
  );
  return currentIndex !== -1 &&
    currentIndex < ARBEIDSGIVER_STEG_REKKEFOLGE.length - 1
    ? ARBEIDSGIVER_STEG_REKKEFOLGE[currentIndex + 1]
    : undefined;
}

export function getRelativeRoute(
  key: string,
  direction: "prev" | "next",
): string | undefined {
  const targetStep =
    direction === "prev" ? getPreviousStep(key) : getNextStep(key);
  if (!targetStep) return undefined;

  // Convert absolute route to relative route (remove /skjema/ prefix and add ../)
  return `../${targetStep.key}`;
}
