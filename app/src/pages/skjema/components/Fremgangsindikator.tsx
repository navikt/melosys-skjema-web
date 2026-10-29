import { BodyShort, FormProgress, HStack, ProgressBar } from "@navikt/ds-react";
import { ComponentType, ReactNode, SVGProps } from "react";
import { useTranslation } from "react-i18next";

import type { StegKey } from "~/constants/stegKeys.ts";

export type { StegKey } from "~/constants/stegKeys.ts";

export interface StegRekkefolgeItem {
  key: StegKey;
  title: string;
  route: string;
  icon?: StegIkon;
}

export interface StegIkon {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  ariaLabel: string;
}

type FremgangsindikatorProperties = {
  aktivtSteg: number;
  stegRekkefolge: StegRekkefolgeItem[];
  className?: string;
  /**
  Viser bare aktivt steg, uten antall og «Vis alle steg», når de neste stegene ikke er kjent ennå
  */
  stegeneErUkjente?: boolean;
};

export const Fremgangsindikator = ({
  aktivtSteg,
  stegRekkefolge,
  className,
  stegeneErUkjente = false,
}: FremgangsindikatorProperties) => {
  const { t } = useTranslation();
  const klasser = className ? `col-span-2 ${className}` : "col-span-2";

  if (stegeneErUkjente) {
    return (
      <div className={klasser} data-testid="fremgangsindikator-ukjente-steg">
        <ProgressBar
          aria-hidden
          className="aksel-form-progress__bar"
          value={aktivtSteg}
          valueMax={stegRekkefolge.length}
        />
        <BodyShort as="span">
          {t("felles.stegNummer", { steg: aktivtSteg })}
        </BodyShort>
      </div>
    );
  }

  return (
    <FormProgress
      activeStep={aktivtSteg}
      className={klasser}
      interactiveSteps={true}
      totalSteps={stegRekkefolge.length}
    >
      {stegRekkefolge.map((step) => (
        <FremgangsindikatorSteg href={step.key} key={step.key}>
          {step.icon ? (
            <HStack as="span" align="center" gap="space-4">
              {t(step.title)}
              <step.icon.icon
                aria-label={t(step.icon.ariaLabel)}
                role="img"
                fontSize="1.5rem"
              />
            </HStack>
          ) : (
            t(step.title)
          )}
        </FremgangsindikatorSteg>
      ))}
    </FormProgress>
  );
};

type FremgangsindikatorStegProperties = Omit<
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
}: FremgangsindikatorStegProperties) {
  return <FormProgress.Step {...rest}>{children as string}</FormProgress.Step>;
}
