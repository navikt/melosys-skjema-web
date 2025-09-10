import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

import { Fremgangsindikator } from "~/pages/skjema/components/Fremgangsindikator";

export function ArbeidstakerensLonnSteg() {
  return (
    <section>
      <Fremgangsindikator aktivtSteg={6} />
      <Heading level="1" size="large" className="mt-8">Arbeidstakerens lønn</Heading>
      <div className="flex gap-4 justify-center mt-8">
        <Button
          as={Link}
          icon={<ArrowLeftIcon />}
          to="../utenlandsoppdraget"
          variant="secondary"
        >
          Forrige steg
        </Button>
        <Button
          as={Link}
          icon={<ArrowRightIcon />}
          iconPosition="right"
          to="../du-som-fyller-ut-skjemaet"
          type="submit"
          variant="primary"
        >
          Neste steg
        </Button>
      </div>
    </section>
  );
}
