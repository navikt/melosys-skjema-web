import { FileUpload } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";

export const stepKey = "vedlegg";

function VedleggStegContent({ skjema }: ArbeidsgiverSkjemaProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextStep = getNextStep(stepKey, ARBEIDSGIVER_STEG_REKKEFOLGE);
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
          customNesteKnapp: {
            tekst: t("felles.lagreOgFortsett"),
            type: "submit",
          },
          stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
        }}
      >
        <FileUpload.Dropzone
          accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
          className="mt-4"
          description={t("tilleggsopplysningerSteg.lastOppVedleggBeskrivelse")}
          label={t("tilleggsopplysningerSteg.lastOppVedlegg")}
          maxSizeInBytes={10_000_000}
          multiple={true}
          onSelect={() => {}}
        />
      </SkjemaSteg>
    </form>
  );
}

interface VedleggStegProps {
  id: string;
}

export function VedleggSteg({ id }: VedleggStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <VedleggStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}
