import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

import { Fremgangsindikator } from "~/pages/skjema/components/Fremgangsindikator";

export function ArbeidsgiverensVirksomhetINorgeSteg() {
  return (
    <section>
      <Fremgangsindikator aktivtSteg={4} />
      <Heading className="mt-8" level="1" size="large">
        Arbeidsgiverens virksomhet i Norge
      </Heading>
      <div className="flex gap-4 justify-center mt-8">
        <Button
          as={Link}
          icon={<ArrowLeftIcon />}
          to="../arbeidsgiveren"
          variant="secondary"
        >
          Forrige steg
        </Button>
        <Button
          as={Link}
          icon={<ArrowRightIcon />}
          iconPosition="right"
          to="../utenlandsoppdraget"
          type="submit"
          variant="primary"
        >
          Neste steg
        </Button>
      </div>
    </section>
  );
}
