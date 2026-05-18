import { zodResolver } from "@hookform/resolvers/zod";
import type { FilesPartitioned } from "@navikt/ds-react";
import { FileUpload, VStack } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { StegKey } from "~/constants/stegKeys.ts";
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  hentVedlegg,
  lastOppVedlegg,
  postVedleggValg,
  slettVedlegg,
  VedleggDto,
  VedleggError,
  vedleggInnholdUrl,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import type {
  UtsendtArbeidstakerSkjemaDto,
  VedleggValgDto,
} from "~/types/melosysSkjemaTypes.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getVedleggValg } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { vedleggStegSchema } from "./vedleggStegSchema.ts";

type VedleggStegFormData = z.infer<typeof vedleggStegSchema>;

export function VedleggSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => <VedleggStegContent skjema={skjema} />}
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
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidstakerSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();
  const [vedleggItems, setVedleggItems] = useState<VedleggItem[]>([]);
  const [eksisterendeVedlegg, setEksisterendeVedlegg] = useState<VedleggDto[]>(
    [],
  );

  const harAnnenDokumentasjonFelt = getFelt(
    "vedleggArbeidstaker",
    "harAnnenDokumentasjon",
  );

  const stegData = getVedleggValg(skjema);

  const formMethods = useForm({
    resolver: zodResolver(vedleggStegSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const { handleSubmit, control } = formMethods;

  const harAnnenDokumentasjon = useWatch({
    control,
    name: "harAnnenDokumentasjon",
  });

  useEffect(() => {
    let cancelled = false;
    hentVedlegg(skjema.id)
      .then((vedlegg) => {
        if (!cancelled) setEksisterendeVedlegg(vedlegg);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [skjema.id]);

  const postVedleggValgMutation = useMutation({
    mutationFn: (data: VedleggStegFormData) => {
      return postVedleggValg(skjema.id, data as VedleggValgDto);
    },
    onSuccess: () => {
      invalidateArbeidstakerSkjemaQuery(skjema.id);
      const nextStep = getNextStep(StegKey.VEDLEGG, stegRekkefolge);
      if (nextStep) {
        navigate({
          to: nextStep.route,
          params: { id: skjema.id },
        });
      }
    },
    onError: () => {
      toast.error(t("felles.feil"));
    },
  });

  const onSubmit = (data: VedleggStegFormData) => {
    postVedleggValgMutation.mutate(data);
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
      lastOppVedlegg(skjema.id, item.fil)
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
      slettVedlegg(skjema.id, item.vedleggId).catch(() => {});
    }
    setVedleggItems((prev) => prev.filter((v) => v.id !== itemId));
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
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey: StegKey.VEDLEGG,
            skjema,
          }}
          nesteKnapp={
            <NesteStegKnapp loading={postVedleggValgMutation.isPending} />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harAnnenDokumentasjon"
            jaLabel={harAnnenDokumentasjonFelt.jaLabel}
            legend={harAnnenDokumentasjonFelt.label}
            neiLabel={harAnnenDokumentasjonFelt.neiLabel}
          />

          {harAnnenDokumentasjon && (
            <>
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
                      href={vedleggInnholdUrl(skjema.id, vedlegg.id)}
                      key={vedlegg.id}
                    />
                  ))}

                  {vedleggItems.map((item) => (
                    <FileUpload.Item
                      button={{
                        action: "delete",
                        onClick: () => handleSlettNyItem(item.id),
                      }}
                      error={
                        item.status === "error" ? item.errorMessage : undefined
                      }
                      file={item.fil}
                      href={
                        item.vedleggId
                          ? vedleggInnholdUrl(skjema.id, item.vedleggId)
                          : undefined
                      }
                      key={item.id}
                      status={
                        item.status === "uploading" ? "uploading" : undefined
                      }
                    />
                  ))}
                </VStack>
              )}
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
