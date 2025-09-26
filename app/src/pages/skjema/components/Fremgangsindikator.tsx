import { FormProgress } from "@navikt/ds-react";

import { STEP_CONFIG } from "../arbeidsgiver/stepConfig.ts";

type FremgangsindikatorProps = {
  aktivtSteg: number;
};

export const Fremgangsindikator = ({ aktivtSteg }: FremgangsindikatorProps) => {
  return (
    <FormProgress
      activeStep={aktivtSteg}
      className="col-span-2"
      interactiveSteps={false}
      totalSteps={STEP_CONFIG.length}
    >
      {STEP_CONFIG.map((step) => (
        <FormProgress.Step key={step.key}>{step.title}</FormProgress.Step>
      ))}
    </FormProgress>
  );
};
