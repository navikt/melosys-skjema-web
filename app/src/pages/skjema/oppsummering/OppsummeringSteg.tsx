import { Alert, ErrorSummary } from "@navikt/ds-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ArbeidstakerOgArbeidsgiverOppsummering } from "~/components/oppsummering/ArbeidstakerOgArbeidsgiverOppsummering.tsx";
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
import type { StegMedFeil } from "../stegDataGetters.ts";
import { finnManglendeSteg } from "../stegDataGetters.ts";
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
  const [valideringsfeil, setValideringsfeil] = useState<StegMedFeil[]>([]);
  const [harInnsendingFeil, setHarInnsendingFeil] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const seksjoner = resolveSeksjoner(data, definisjon as SkjemaDefinisjonDto);

  const erKombinertSkjema = isArbeidsgiverOgArbeidstakersDel(data);
  const harFeil = valideringsfeil.length > 0 || harInnsendingFeil;

  useEffect(() => {
    if (harFeil) {
      errorRef.current?.scrollIntoView({ behavior: "auto" });
      errorRef.current?.focus();
    }
  }, [harFeil]);

  const kanSendeInn = () => {
    const stegMedFeil = finnManglendeSteg(skjema, stegRekkefolge, skjema.id);

    setValideringsfeil(stegMedFeil);
    setHarInnsendingFeil(false);

    return stegMedFeil.length === 0;
  };

  return (
    <SkjemaSteg
      config={{
        stepKey: StegKey.OPPSUMMERING,
        skjema,
      }}
      nesteKnapp={
        <SendInnSkjemaKnapp
          skjemaId={skjema.id}
          onBeforeSubmit={kanSendeInn}
          onSubmitError={() => setHarInnsendingFeil(true)}
        />
      }
    >
      <ArbeidstakerOgArbeidsgiverOppsummering skjema={skjema} />
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
              icon={steg?.icon}
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
        harAnnenDokumentasjon={skjema.data.vedlegg?.harAnnenDokumentasjon}
        skjemaId={skjema.id}
      />
      {harFeil && (
        <div ref={errorRef} className="mt-4" tabIndex={-1}>
          {valideringsfeil.length > 0 ? (
            <ErrorSummary heading={t("felles.stegManglerUtfylling")}>
              {valideringsfeil.map((steg) => (
                <ErrorSummary.Item key={steg.href} href={steg.href}>
                  {t(steg.title)}
                </ErrorSummary.Item>
              ))}
            </ErrorSummary>
          ) : (
            <Alert variant="error">{t("felles.feilVedInnsending")}</Alert>
          )}
        </div>
      )}
    </SkjemaSteg>
  );
}
