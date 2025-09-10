import { FormProgress } from "@navikt/ds-react";

type FremgangsindikatorProps = {
  aktivtSteg: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};
export const Fremgangsindikator = ({ aktivtSteg }: FremgangsindikatorProps) => {
  return (
    <FormProgress
      activeStep={aktivtSteg}
      className="col-span-2"
      interactiveSteps={false}
      totalSteps={8}
    >
      <FormProgress.Step>Veiledning</FormProgress.Step>
      <FormProgress.Step>Arbeidstakeren</FormProgress.Step>
      <FormProgress.Step>Arbeidsgiveren</FormProgress.Step>
      <FormProgress.Step>Arbeidsgiverens virksomhet i Norge</FormProgress.Step>
      <FormProgress.Step>Utenlandsoppdraget</FormProgress.Step>
      <FormProgress.Step>Arbeidstakerens lønn</FormProgress.Step>
      <FormProgress.Step>Du som fyller ut skjemaet</FormProgress.Step>
      <FormProgress.Step>Oppsummering</FormProgress.Step>
    </FormProgress>
  );
};
