import { FormProgress } from "@navikt/ds-react";

export interface StegRekkefolgeItem {
  key: string;
  title: string;
  route: string;
}

type FremgangsindikatorProps = {
  aktivtSteg: number;
  stegRekkefolge: StegRekkefolgeItem[];
};

export const Fremgangsindikator = ({
  aktivtSteg,
  stegRekkefolge,
}: FremgangsindikatorProps) => {
  return (
    <FormProgress
      activeStep={aktivtSteg}
      className="col-span-2"
      interactiveSteps={false}
      totalSteps={stegRekkefolge.length}
    >
      {stegRekkefolge.map((step) => (
        <FormProgress.Step key={step.key}>{step.title}</FormProgress.Step>
      ))}
    </FormProgress>
  );
};
