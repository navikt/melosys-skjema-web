import { BodyShort, FormSummary, Link as DsLink } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  hentVedlegg,
  VedleggDto,
  vedleggInnholdUrl,
} from "~/httpClients/melsosysSkjemaApiClient.ts";

interface VedleggOppsummeringProps {
  skjemaId: string;
  editHref?: string;
}

export function VedleggOppsummering({
  skjemaId,
  editHref,
}: VedleggOppsummeringProps) {
  const { t } = useTranslation();
  const [vedlegg, setVedlegg] = useState<VedleggDto[]>([]);

  useEffect(() => {
    hentVedlegg(skjemaId)
      .then(setVedlegg)
      .catch(() => {});
  }, [skjemaId]);

  return (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="3">
          {t("vedleggSteg.tittel")}
        </FormSummary.Heading>
      </FormSummary.Header>
      <FormSummary.Answers>
        {vedlegg.length === 0 ? (
          <FormSummary.Answer>
            <BodyShort>{t("vedleggSteg.ingenVedleggLastetOpp")}</BodyShort>
          </FormSummary.Answer>
        ) : (
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
          ))
        )}
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
