import type { FilesPartitioned } from "@navikt/ds-react";
import { FileUpload, VStack } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  hentVedlegg,
  lastOppVedlegg,
  slettVedlegg,
  VedleggError,
  VedleggResponse,
} from "~/httpClients/melsosysSkjemaApiClient.ts";

import { ArbeidsgiverSkjemaProps } from "../../arbeidsgiver/types.ts";
import { ArbeidstakerSkjemaProps } from "../../arbeidstaker/types.ts";
import { StegRekkefolgeItem } from "../Fremgangsindikator.tsx";
import { NesteStegKnapp } from "../NesteStegKnapp.tsx";
import { getNextStep, SkjemaSteg } from "../SkjemaSteg.tsx";

export const stepKey = "vedlegg";

type SkjemaProps = ArbeidsgiverSkjemaProps | ArbeidstakerSkjemaProps;

interface VedleggStegProps {
  skjema: SkjemaProps["skjema"];
  stegRekkefolge: StegRekkefolgeItem[];
}

interface VedleggItem {
  vedleggId?: string;
  fil: File;
  status: "uploading" | "idle" | "error";
  errorMessage?: string;
}

export function VedleggStegContent({
  skjema,
  stegRekkefolge,
}: VedleggStegProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [vedleggItems, setVedleggItems] = useState<VedleggItem[]>([]);
  const [eksisterendeVedlegg, setEksisterendeVedlegg] = useState<
    VedleggResponse[]
  >([]);

  useEffect(() => {
    hentVedlegg(skjema.id)
      .then(setEksisterendeVedlegg)
      .catch(() => {});
  }, [skjema.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextStep = getNextStep(stepKey, stegRekkefolge);
    if (nextStep) {
      navigate({
        to: nextStep.route,
        params: { id: skjema.id },
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
        fil: file,
        status: "error" as const,
        errorMessage: getRejectionMessage(reasons),
      }),
    );

    const acceptedItems: VedleggItem[] = partitioned.accepted.map((fil) => ({
      fil,
      status: "uploading" as const,
    }));

    setVedleggItems((prev) => [...prev, ...rejectedItems, ...acceptedItems]);

    for (const fil of partitioned.accepted) {
      lastOppVedlegg(skjema.id, fil)
        .then((response) => {
          setVedleggItems((prev) =>
            prev.map((item) =>
              item.fil === fil
                ? { ...item, vedleggId: response.id, status: "idle" as const }
                : item,
            ),
          );
        })
        .catch((error) => {
          setVedleggItems((prev) =>
            prev.map((item) =>
              item.fil === fil
                ? {
                    ...item,
                    status: "error" as const,
                    errorMessage: getErrorMessage(error),
                  }
                : item,
            ),
          );
        });
    }
  };

  const handleSlettNyItem = (fil: File) => {
    const item = vedleggItems.find((v) => v.fil === fil);
    if (item?.vedleggId) {
      slettVedlegg(skjema.id, item.vedleggId).catch(() => {});
    }
    setVedleggItems((prev) => prev.filter((v) => v.fil !== fil));
  };

  const handleSlettEksisterende = (vedleggId: string) => {
    slettVedlegg(skjema.id, vedleggId)
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
          stepKey,
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
                file={
                  new File([], vedlegg.filnavn, {
                    type:
                      vedlegg.filtype === "PDF"
                        ? "application/pdf"
                        : `image/${vedlegg.filtype.toLowerCase()}`,
                  })
                }
                key={vedlegg.id}
              />
            ))}

            {vedleggItems.map((item, index) => (
              <FileUpload.Item
                button={{
                  action: "delete",
                  onClick: () => handleSlettNyItem(item.fil),
                }}
                error={item.status === "error" ? item.errorMessage : undefined}
                file={item.fil}
                key={`new-${index}`}
                status={item.status === "uploading" ? "uploading" : undefined}
              />
            ))}
          </VStack>
        )}
      </SkjemaSteg>
    </form>
  );
}
