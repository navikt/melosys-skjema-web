import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";

import { Fremgangsindikator } from "~/pages/skjema/components/Fremgangsindikator";

interface StegConfig {
  stegNummer: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  tittel: string;
  forrigeRoute?: string;
  nesteRoute?: string;
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
  return (
    <section>
      <Fremgangsindikator aktivtSteg={config.stegNummer} />
      <Heading className="mt-8" level="1" size="large">
        {config.tittel}
      </Heading>
      {children}
      <div className="flex gap-4 justify-center mt-8">
        {config.forrigeRoute && (
          <Button
            as={Link}
            icon={<ArrowLeftIcon />}
            to={config.forrigeRoute}
            variant="secondary"
          >
            Forrige steg
          </Button>
        )}
        {config.nesteRoute && !config.customNesteKnapp && (
          <Button
            as={Link}
            icon={<ArrowRightIcon />}
            iconPosition="right"
            to={config.nesteRoute}
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
