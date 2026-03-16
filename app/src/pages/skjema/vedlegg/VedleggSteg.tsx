import type { FilesPartitioned } from "@navikt/ds-react";
import { FileUpload, VStack } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { StegKey } from "~/constants/stegKeys.ts";
import {
  getSkjemaQuery,
  hentVedlegg,
  lastOppVedlegg,
  slettVedlegg,
  VedleggDto,
  VedleggError,
  vedleggInnholdUrl,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";

export function VedleggSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => (
        <VedleggStegContent
          skjemaId={skjema.id}
          stegRekkefolge={STEG_REKKEFOLGE[skjema.metadata.skjemadel]}
        />
      )}
    </SkjemaStegLoader>
  );
}

interface VedleggItem {
  id: string;
  vedleggId?: string;
  fil: File;
  status: "uploading" | "idle" | "error";
  errorMessage?: string;
}

function VedleggStegContent({
  skjemaId,
  stegRekkefolge,
}: {
  skjemaId: string;
  stegRekkefolge: StegRekkefolgeItem[];
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [vedleggItems, setVedleggItems] = useState<VedleggItem[]>([]);
  const [eksisterendeVedlegg, setEksisterendeVedlegg] = useState<VedleggDto[]>(
    [],
  );

  useEffect(() => {
    hentVedlegg(skjemaId)
      .then(setEksisterendeVedlegg)
      .catch(() => {});
  }, [skjemaId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextStep = getNextStep(StegKey.VEDLEGG, stegRekkefolge);
    if (nextStep) {
      navigate({
        to: nextStep.route,
        params: { id: skjemaId },
      });
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof VedleggError) {
      if (error.errorCode === "VIRUS_FOUND") {
        return t("vedleggSteg.feilVirusFunnet");
      }
      if (error.status === 400) {
        return error.message;
      }
    }
    return t("vedleggSteg.feilUkjent");
  };

  const getRejectionMessage = (reasons: string[]): string => {
    if (reasons.includes("fileSize")) {
      return t("vedleggSteg.feilForStor");
    }
    return t("vedleggSteg.feilUgyldigFormat");
  };

  const handleSelect = (_files: unknown, partitioned: FilesPartitioned) => {
    const rejectedItems: VedleggItem[] = partitioned.rejected.map(
      ({ file, reasons }) => ({
        id: crypto.randomUUID(),
        fil: file,
        status: "error" as const,
        errorMessage: getRejectionMessage(reasons),
      }),
    );

    const acceptedItems: VedleggItem[] = partitioned.accepted.map((fil) => ({
      id: crypto.randomUUID(),
      fil,
      status: "uploading" as const,
    }));

    setVedleggItems((prev) => [...prev, ...rejectedItems, ...acceptedItems]);

    for (const item of acceptedItems) {
      lastOppVedlegg(skjemaId, item.fil)
        .then((response) => {
          setVedleggItems((prev) =>
            prev.map((v) =>
              v.id === item.id
                ? { ...v, vedleggId: response.id, status: "idle" as const }
                : v,
            ),
          );
        })
        .catch((error) => {
          setVedleggItems((prev) =>
            prev.map((v) =>
              v.id === item.id
                ? {
                    ...v,
                    status: "error" as const,
                    errorMessage: getErrorMessage(error),
                  }
                : v,
            ),
          );
        });
    }
  };

  const handleSlettNyItem = (itemId: string) => {
    const item = vedleggItems.find((v) => v.id === itemId);
    if (item?.vedleggId) {
      slettVedlegg(skjemaId, item.vedleggId).catch(() => {});
    }
    setVedleggItems((prev) => prev.filter((v) => v.id !== itemId));
  };

  const handleSlettEksisterende = (vedleggId: string) => {
    slettVedlegg(skjemaId, vedleggId)
      .then(() => {
        setEksisterendeVedlegg((prev) =>
          prev.filter((v) => v.id !== vedleggId),
        );
      })
      .catch(() => {});
  };

  const totalAntall = vedleggItems.length + eksisterendeVedlegg.length;

  return (
    <form onSubmit={handleSubmit}>
      <SkjemaSteg
        config={{
          stepKey: StegKey.VEDLEGG,
          stegRekkefolge,
        }}
        nesteKnapp={<NesteStegKnapp />}
      >
        <FileUpload.Dropzone
          accept=".pdf,.jpg,.jpeg,.png"
          className="mt-4"
          description={t("vedleggSteg.lastOppVedleggBeskrivelse")}
          fileLimit={{ max: 10, current: totalAntall }}
          label={t("vedleggSteg.lastOppVedlegg")}
          maxSizeInBytes={10_000_000}
          multiple
          onSelect={handleSelect}
        />

        {(eksisterendeVedlegg.length > 0 || vedleggItems.length > 0) && (
          <VStack className="mt-4" gap="space-2">
            {eksisterendeVedlegg.map((vedlegg) => (
              <FileUpload.Item
                button={{
                  action: "delete",
                  onClick: () => handleSlettEksisterende(vedlegg.id),
                }}
                file={{
                  name: vedlegg.filnavn,
                  size: vedlegg.filstorrelse,
                }}
                href={vedleggInnholdUrl(skjemaId, vedlegg.id)}
                key={vedlegg.id}
              />
            ))}

            {vedleggItems.map((item) => (
              <FileUpload.Item
                button={{
                  action: "delete",
                  onClick: () => handleSlettNyItem(item.id),
                }}
                error={item.status === "error" ? item.errorMessage : undefined}
                file={item.fil}
                href={
                  item.vedleggId
                    ? vedleggInnholdUrl(skjemaId, item.vedleggId)
                    : undefined
                }
                key={item.id}
                status={item.status === "uploading" ? "uploading" : undefined}
              />
            ))}
          </VStack>
        )}
      </SkjemaSteg>
    </form>
  );
}
