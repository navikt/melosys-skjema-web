import { FormProgress } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { getStegRolle, StegRolleIkon } from "~/components/StegRolleIkon.tsx";
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
        const stepTitleWithRolleIkon = (
          <>
            {t(step.title)}
            {getStegRolle(step.key) ? (
              <span className="ml-2 inline-block align-middle">
                <StegRolleIkon size="1.5rem" stegKey={step.key} />
              </span>
            ) : null}
          </>
        ) as unknown as string;

        return (
          <FormProgress.Step href={step.key} key={step.key}>
            {stepTitleWithRolleIkon}
          </FormProgress.Step>
        );
      })}
    </FormProgress>
  );
};
