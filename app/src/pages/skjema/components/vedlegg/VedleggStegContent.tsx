import { FileUpload } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

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

export function VedleggStegContent({
  skjema,
  stegRekkefolge,
}: VedleggStegProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
          className="mt-4"
          description={t("vedleggSteg.lastOppVedleggBeskrivelse")}
          label={t("vedleggSteg.lastOppVedlegg")}
          maxSizeInBytes={10_000_000}
          multiple={true}
          onSelect={() => {}}
        />
      </SkjemaSteg>
    </form>
  );
}
