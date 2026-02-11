import { SeksjonOppsummering } from "~/components/oppsummering/SeksjonOppsummering.tsx";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import { SendInnSkjemaKnapp } from "~/pages/skjema/components/SendInnSkjemaKnapp.tsx";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { renderSeksjoner } from "~/pages/skjema/innsendt/dataMapping.ts";
import type { SkjemaDefinisjonDto } from "~/types/melosysSkjemaTypes.ts";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";

const oppsummeringStepKey = "oppsummering";

interface ArbeidsgiverOppsummeringStegProps {
  id: string;
}

export function ArbeidsgiverOppsummeringSteg({
  id,
}: ArbeidsgiverOppsummeringStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <ArbeidsgiverOppsummeringStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}

function ArbeidsgiverOppsummeringStegContent({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { definisjon } = useSkjemaDefinisjon();

  const seksjoner = renderSeksjoner(
    "arbeidsgiver",
    skjema.data,
    definisjon as unknown as SkjemaDefinisjonDto,
  );

  return (
    <SkjemaSteg
      config={{
        stepKey: oppsummeringStepKey,
        stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
      }}
      nesteKnapp={<SendInnSkjemaKnapp skjemaId={skjema.id} />}
    >
      {seksjoner.map(({ seksjonNavn, seksjon, data, stegKey }) => {
        const steg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
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
