import { resolveSeksjoner } from "~/components/oppsummering/dataMapping.ts";
import { SeksjonOppsummering } from "~/components/oppsummering/SeksjonOppsummering.tsx";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import { SendInnSkjemaKnapp } from "~/pages/skjema/components/SendInnSkjemaKnapp.tsx";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";
import type { SkjemaDefinisjonDto } from "~/types/melosysSkjemaTypes.ts";

import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidstakerSkjemaProps } from "../types.ts";

const oppsummeringStepKey = "oppsummering";

interface ArbeidstakerOppsummeringStegProps {
  id: string;
}

export function ArbeidstakerOppsummeringSteg({
  id,
}: ArbeidstakerOppsummeringStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <ArbeidstakerOppsummeringStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}

function ArbeidstakerOppsummeringStegContent({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { definisjon } = useSkjemaDefinisjon();

  const seksjoner = resolveSeksjoner(
    skjema.data,
    definisjon as unknown as SkjemaDefinisjonDto,
  );

  return (
    <SkjemaSteg
      config={{
        stepKey: oppsummeringStepKey,
        stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
      }}
      nesteKnapp={<SendInnSkjemaKnapp skjemaId={skjema.id} />}
    >
      {seksjoner.map(({ seksjonNavn, seksjon, data, stegKey }) => {
        const steg = ARBEIDSTAKER_STEG_REKKEFOLGE.find(
          (s) => s.key === stegKey,
        );
        const editHref = steg?.route.replace("$id", skjema.id) ?? "";
        return (
          <SeksjonOppsummering
            data={data}
            editHref={editHref}
            key={seksjonNavn}
            seksjon={seksjon}
          />
        );
      })}
    </SkjemaSteg>
  );
}
