import { FormProgress } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

export interface StegRekkefolgeItem {
  key: string;
  title: string;
  route: string;
}

type FremgangsindikatorProps = {
  aktivtSteg: number;
  stegRekkefolge: StegRekkefolgeItem[];
  className?: string;
};

export const Fremgangsindikator = ({
  aktivtSteg,
  stegRekkefolge,
  className,
}: FremgangsindikatorProps) => {
  const { t } = useTranslation();
  return (
    <FormProgress
      activeStep={aktivtSteg}
      className={className ? `col-span-2 ${className}` : "col-span-2"}
      interactiveSteps={false}
      totalSteps={stegRekkefolge.length}
    >
      {stegRekkefolge.map((step) => (
        <FormProgress.Step key={step.key}>{t(step.title)}</FormProgress.Step>
      ))}
    </FormProgress>
  );
};
