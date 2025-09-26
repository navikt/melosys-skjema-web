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

export function getStepNumber(
  key: string,
  stegRekkefolge: StegRekkefolgeItem[],
): number {
  const index = stegRekkefolge.findIndex((step) => step.key === key);
  return index + 1;
}

export function getPreviousStep(
  key: string,
  stegRekkefolge: StegRekkefolgeItem[],
): StegRekkefolgeItem | undefined {
  const currentIndex = stegRekkefolge.findIndex((step) => step.key === key);
  return currentIndex > 0 ? stegRekkefolge[currentIndex - 1] : undefined;
}

export function getNextStep(
  key: string,
  stegRekkefolge: StegRekkefolgeItem[],
): StegRekkefolgeItem | undefined {
  const currentIndex = stegRekkefolge.findIndex((step) => step.key === key);
  return currentIndex !== -1 && currentIndex < stegRekkefolge.length - 1
    ? stegRekkefolge[currentIndex + 1]
    : undefined;
}

export function getRelativeRoute(
  key: string,
  direction: "prev" | "next",
  stegRekkefolge: StegRekkefolgeItem[],
): string | undefined {
  const targetStep =
    direction === "prev"
      ? getPreviousStep(key, stegRekkefolge)
      : getNextStep(key, stegRekkefolge);
  if (!targetStep) return undefined;

  // Convert absolute route to relative route (remove /skjema/ prefix and add ../)
  return `../${targetStep.key}`;
}
