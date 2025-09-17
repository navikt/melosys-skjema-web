export interface StepInfo {
  key: string;
  title: string;
  route: string;
}

export const STEP_CONFIG: StepInfo[] = [
  {
    key: "veiledning",
    title: "Veiledning",
    route: "/skjema/veiledning",
  },
  {
    key: "arbeidsgiveren",
    title: "Arbeidsgiveren",
    route: "/skjema/arbeidsgiveren",
  },
  {
    key: "arbeidsgiverens-virksomhet-i-norge",
    title: "Arbeidsgiverens virksomhet i Norge",
    route: "/skjema/arbeidsgiverens-virksomhet-i-norge",
  },
  {
    key: "utenlandsoppdraget",
    title: "Utenlandsoppdraget",
    route: "/skjema/utenlandsoppdraget",
  },
  {
    key: "arbeidstakeren",
    title: "Arbeidstakeren",
    route: "/skjema/arbeidstakeren",
  },
  {
    key: "arbeidstakerens-lonn",
    title: "Arbeidstakerens lønn",
    route: "/skjema/arbeidstakerens-lonn",
  },
  {
    key: "du-som-fyller-ut-skjemaet",
    title: "Du som fyller ut skjemaet",
    route: "/skjema/du-som-fyller-ut-skjemaet",
  },
  {
    key: "oppsummering",
    title: "Oppsummering",
    route: "/skjema/oppsummering",
  },
];

export function getStepNumber(key: string): number {
  const index = STEP_CONFIG.findIndex((step) => step.key === key);
  return index + 1;
}

export function getPreviousStep(key: string): StepInfo | undefined {
  const currentIndex = STEP_CONFIG.findIndex((step) => step.key === key);
  return currentIndex > 0 ? STEP_CONFIG[currentIndex - 1] : undefined;
}

export function getNextStep(key: string): StepInfo | undefined {
  const currentIndex = STEP_CONFIG.findIndex((step) => step.key === key);
  return currentIndex !== -1 && currentIndex < STEP_CONFIG.length - 1
    ? STEP_CONFIG[currentIndex + 1]
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
