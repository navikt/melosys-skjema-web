import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

import { Fremgangsindikator } from "~/pages/skjema/components/Fremgangsindikator";

export function VeiledningSteg() {
  return (
    <section>
      <Fremgangsindikator aktivtSteg={1} />
      <Heading level="1" size="large" className="mt-8">Veiledning</Heading>
      <div className="flex gap-4 justify-center mt-8">
        <Button
          as={Link}
          icon={<ArrowRightIcon />}
          iconPosition="right"
          to="../arbeidstakeren"
          type="submit"
          variant="primary"
        >
          Neste steg
        </Button>
      </div>
    </section>
  );
}
