import { FormProgress } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { StegRolleIkon } from "~/components/StegRolleIkon.tsx";
import type { StegKey } from "~/constants/stegKeys.ts";

export type { StegKey } from "~/constants/stegKeys.ts";

export interface StegRekkefolgeItem {
  key: StegKey;
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
      interactiveSteps={true}
      totalSteps={stegRekkefolge.length}
    >
      {stegRekkefolge.map((step) => {
        // ds-react typer children som string, selv om Step støtter React-noder i runtime.
        const stepTitle = (
          <span className="inline-flex items-center gap-2">
            <span>{t(step.title)}</span>
            <StegRolleIkon size="1.5rem" stegKey={step.key} />
          </span>
        ) as unknown as string;

        return (
          <FormProgress.Step href={step.key} key={step.key}>
            {stepTitle}
          </FormProgress.Step>
        );
      })}
    </FormProgress>
  );
};
