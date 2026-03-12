import { FormProgress, HStack } from "@navikt/ds-react";
import { ComponentType, ReactNode, SVGProps } from "react";
import { useTranslation } from "react-i18next";

import type { StegKey } from "~/constants/stegKeys.ts";

export type { StegKey } from "~/constants/stegKeys.ts";

export interface StegRekkefolgeItem {
  key: StegKey;
  title: string;
  route: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
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
      {stegRekkefolge.map((step) => (
        <FremgangsindikatorSteg href={step.key} key={step.key}>
          {step.icon ? (
            <HStack align="center" gap="space-2">
              <step.icon aria-hidden fontSize="1.25rem" />
              {t(step.title)}
            </HStack>
          ) : (
            t(step.title)
          )}
        </FremgangsindikatorSteg>
      ))}
    </FormProgress>
  );
};

type FremgangsindikatorStegProps = Omit<
  React.ComponentProps<typeof FormProgress.Step>,
  "children"
> & { children: ReactNode };

/**
 * Wrapper rundt FormProgress.Step som aksepterer ReactNode som children.
 *
 * FormProgress.Step krever children: string, men vi trenger å kunne
 * rendre ikoner i tillegg til tekst.
 */
function FremgangsindikatorSteg({
  children,
  ...rest
}: FremgangsindikatorStegProps) {
  return <FormProgress.Step {...rest}>{children as string}</FormProgress.Step>;
}
