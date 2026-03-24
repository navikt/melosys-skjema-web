import { Alert } from "@navikt/ds-react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { resolveSeksjoner } from "~/components/oppsummering/dataMapping.ts";
import { SeksjonOppsummering } from "~/components/oppsummering/SeksjonOppsummering.tsx";
import { VedleggOppsummering } from "~/components/oppsummering/VedleggOppsummering.tsx";
import { StegKey } from "~/constants/stegKeys.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import { getSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { SendInnSkjemaKnapp } from "~/pages/skjema/components/SendInnSkjemaKnapp.tsx";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";
import type {
  SkjemaDefinisjonDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { isArbeidsgiverOgArbeidstakersDel } from "../types.ts";

export function OppsummeringSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => <OppsummeringStegContent skjema={skjema} />}
    </SkjemaStegLoader>
  );
}

function OppsummeringStegContent({
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];
  const data = skjema.data;
  const { t } = useTranslation();
  const { definisjon } = useSkjemaDefinisjon();

  const seksjoner = resolveSeksjoner(data, definisjon as SkjemaDefinisjonDto);

  const erKombinertSkjema = isArbeidsgiverOgArbeidstakersDel(data);

  return (
    <SkjemaSteg
      config={{
        stepKey: StegKey.OPPSUMMERING,
        stegRekkefolge: stegRekkefolge,
      }}
      nesteKnapp={<SendInnSkjemaKnapp skjemaId={skjema.id} />}
    >
      {seksjoner.map(({ seksjonNavn, seksjon, data, stegKey }) => {
        const steg = stegRekkefolge.find((s) => s.key === stegKey);
        const editHref = steg?.route.replace("$id", skjema.id) ?? "";
        return (
          <Fragment key={seksjonNavn}>
            {erKombinertSkjema && stegKey === StegKey.ARBEIDSSITUASJON && (
              <Alert className="mt-8" variant="info">
                {t("oppsummeringSteg.svarPaVegneAvArbeidstaker")}
              </Alert>
            )}
            <SeksjonOppsummering
              data={data}
              editHref={editHref}
              seksjon={seksjon}
            />
          </Fragment>
        );
      })}
      <VedleggOppsummering
        editHref={
          stegRekkefolge
            .find((s) => s.key === StegKey.VEDLEGG)
            ?.route.replace("$id", skjema.id) ?? ""
        }
        skjemaId={skjema.id}
      />
    </SkjemaSteg>
  );
}
