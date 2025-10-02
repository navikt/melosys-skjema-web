import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import {
  Fremgangsindikator,
  StegRekkefolgeItem,
} from "~/pages/skjema/components/Fremgangsindikator";

interface StegConfig {
  stepKey: string;
  stegRekkefolge: StegRekkefolgeItem[];
  customNesteKnapp?: {
    tekst: string;
    ikon?: ReactNode;
    type?: "button" | "submit";
  };
}

interface SkjemaStegProps {
  config: StegConfig;
  children?: ReactNode;
}

export function SkjemaSteg({ config, children }: SkjemaStegProps) {
  const { t } = useTranslation();
  const stepNumber = getStepNumber(config.stepKey, config.stegRekkefolge);
  const prevRoute = getRelativeRoute(
    config.stepKey,
    "prev",
    config.stegRekkefolge,
  );
  const nextRoute = getRelativeRoute(
    config.stepKey,
    "next",
    config.stegRekkefolge,
  );

  // Get step title from config
  const stepInfo = config.stegRekkefolge.find(
    (step) => step.key === config.stepKey,
  );
  const title = stepInfo?.title
    ? t(stepInfo.title)
    : `Unknown Step: ${config.stepKey}`;

  return (
    <section>
      <Fremgangsindikator
        aktivtSteg={stepNumber}
        stegRekkefolge={config.stegRekkefolge}
      />
      <Heading className="mt-8" level="1" size="large">
        {title}
      </Heading>
      {children}
      <div className="flex gap-4 justify-center mt-8">
        {prevRoute && (
          <Button
            as={Link}
            icon={<ArrowLeftIcon />}
            to={prevRoute}
            variant="secondary"
          >
            {t("felles.forrigeSteg")}
          </Button>
        )}
        {nextRoute && !config.customNesteKnapp && (
          <Button
            as={Link}
            icon={<ArrowRightIcon />}
            iconPosition="right"
            to={nextRoute}
            variant="primary"
          >
            {t("felles.nesteSteg")}
          </Button>
        )}
        {config.customNesteKnapp && (
          <Button
            icon={config.customNesteKnapp.ikon || <ArrowRightIcon />}
            iconPosition="right"
            type={config.customNesteKnapp.type}
            variant="primary"
          >
            {config.customNesteKnapp.tekst}
          </Button>
        )}
      </div>
    </section>
  );
}

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

function getRelativeRoute(
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

export type { StegConfig };
