import { ArrowLeftIcon, PaperplaneIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

import { Fremgangsindikator } from "~/pages/skjema/components/Fremgangsindikator";

export function OppsummeringSteg() {
  return (
    <section>
      <Fremgangsindikator aktivtSteg={8} />
      <Heading className="mt-8" level="1" size="large">
        Oppsummering
      </Heading>
      <div className="flex gap-4 justify-center mt-8">
        <Button
          as={Link}
          icon={<ArrowLeftIcon />}
          to="../du-som-fyller-ut-skjemaet"
          variant="secondary"
        >
          Forrige steg
        </Button>
        <Button
          icon={<PaperplaneIcon />}
          iconPosition="right"
          type="submit"
          variant="primary"
        >
          Send søknad
        </Button>
      </div>
    </section>
  );
}
