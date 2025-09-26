import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";

import { Fremgangsindikator } from "~/pages/skjema/components/Fremgangsindikator";

import {
  ARBEIDSGIVER_STEG_REKKEFOLGE,
  getRelativeRoute,
  getStepNumber,
} from "../arbeidsgiver/stegRekkefølge.ts";

interface StegConfig {
  stepKey: string;
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
  const stepNumber = getStepNumber(config.stepKey);
  const prevRoute = getRelativeRoute(config.stepKey, "prev");
  const nextRoute = getRelativeRoute(config.stepKey, "next");

  // Get step title from config
  const stepInfo = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (step) => step.key === config.stepKey,
  );
  const title = stepInfo?.title || `Unknown Step: ${config.stepKey}`;

  return (
    <section>
      <Fremgangsindikator
        aktivtSteg={stepNumber}
        stegRekkefolge={ARBEIDSGIVER_STEG_REKKEFOLGE}
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
            Forrige steg
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
            Neste steg
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

export type { StegConfig };
