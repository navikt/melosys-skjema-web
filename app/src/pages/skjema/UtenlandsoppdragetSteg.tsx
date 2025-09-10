import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

import { Fremgangsindikator } from "~/pages/skjema/components/Fremgangsindikator";

export function UtenlandsoppdragetSteg() {
  return (
    <section>
      <Fremgangsindikator aktivtSteg={5} />
      <Heading className="mt-8" level="1" size="large">
        Utenlandsoppdraget
      </Heading>
      <div className="flex gap-4 justify-center mt-8">
        <Button
          as={Link}
          icon={<ArrowLeftIcon />}
          to="../arbeidsgiverens-virksomhet-i-norge"
          variant="secondary"
        >
          Forrige steg
        </Button>
        <Button
          as={Link}
          icon={<ArrowRightIcon />}
          iconPosition="right"
          to="../arbeidstakerens-lonn"
          type="submit"
          variant="primary"
        >
          Neste steg
        </Button>
      </div>
    </section>
  );
}
