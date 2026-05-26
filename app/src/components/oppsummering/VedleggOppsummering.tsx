import {
  Alert,
  BodyShort,
  FormSummary,
  Link as DsLink,
} from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  hentVedlegg,
  VedleggDto,
  vedleggInnholdUrl,
} from "~/httpClients/melsosysSkjemaApiClient.ts";

interface VedleggOppsummeringProps {
  skjemaId: string;
  harAnnenDokumentasjon?: boolean;
  editHref?: string;
}

export function VedleggOppsummering({
  skjemaId,
  harAnnenDokumentasjon,
  editHref,
}: VedleggOppsummeringProps) {
  const { t } = useTranslation();
  const { getFelt } = useSkjemaDefinisjon();
  const [vedlegg, setVedlegg] = useState<VedleggDto[]>([]);
  const [hentVedleggFeil, setHentVedleggFeil] = useState(false);

  const harAnnenDokumentasjonFelt = getFelt(
    "vedleggArbeidstaker",
    "harAnnenDokumentasjon",
  );

  useEffect(() => {
    // Eksplisitt Nei skjuler vedlegg. Ja eller udefinert (legacy-skjemaer fra
    // før vedlegg-spørsmålet) henter og viser eventuelle filer.
    if (harAnnenDokumentasjon === false) return;
    let cancelled = false;
    hentVedlegg(skjemaId)
      .then((v) => {
        if (!cancelled) setVedlegg(v);
      })
      .catch(() => {
        if (!cancelled) setHentVedleggFeil(true);
      });
    return () => {
      cancelled = true;
    };
  }, [skjemaId, harAnnenDokumentasjon]);

  const svarLabel =
    harAnnenDokumentasjon === undefined
      ? undefined
      : harAnnenDokumentasjon
        ? harAnnenDokumentasjonFelt.jaLabel
        : harAnnenDokumentasjonFelt.neiLabel;

  return (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="3">
          {t("vedleggSteg.tittel")}
        </FormSummary.Heading>
      </FormSummary.Header>
      <FormSummary.Answers>
        {hentVedleggFeil && (
          <FormSummary.Answer>
            <Alert size="small" variant="error">
              {t("vedleggSteg.feilVedHentingAvVedlegg")}
            </Alert>
          </FormSummary.Answer>
        )}
        {svarLabel !== undefined && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {harAnnenDokumentasjonFelt.label}
            </FormSummary.Label>
            <FormSummary.Value>{svarLabel}</FormSummary.Value>
          </FormSummary.Answer>
        )}
        {harAnnenDokumentasjon === true && vedlegg.length === 0 && (
          <FormSummary.Answer>
            <BodyShort>{t("vedleggSteg.ingenVedleggLastetOpp")}</BodyShort>
          </FormSummary.Answer>
        )}
        {harAnnenDokumentasjon !== false &&
          vedlegg.map((v) => (
            <FormSummary.Answer key={v.id}>
              <FormSummary.Label>
                <DsLink
                  href={vedleggInnholdUrl(skjemaId, v.id)}
                  target="_blank"
                >
                  {v.filnavn}
                </DsLink>
              </FormSummary.Label>
              <FormSummary.Value>
                {v.filtype} — {formatFilstorrelse(v.filstorrelse)}
              </FormSummary.Value>
            </FormSummary.Answer>
          ))}
      </FormSummary.Answers>
      {editHref && (
        <FormSummary.Footer>
          <FormSummary.EditLink href={editHref}>
            {t("felles.endreSvar")}
          </FormSummary.EditLink>
        </FormSummary.Footer>
      )}
    </FormSummary>
  );
}

function formatFilstorrelse(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
