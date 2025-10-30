import { PaperplaneIcon } from "@navikt/aksel-icons";
import { useTranslation } from "react-i18next";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";

import { stepKey as arbeidstakerenStepKey } from "./ArbeidstakerenSteg.tsx";
import { ArbeidstakerenStegOppsummering } from "./ArbeidstakerenStegOppsummering.tsx";
import { ArbeidstakerStegLoader } from "./components/ArbeidstakerStegLoader.tsx";
import { stepKey as familiemedlemmerStepKey } from "./FamiliemedlemmerSteg.tsx";
import { FamiliemedlemmerStegOppsummering } from "./FamiliemedlemmerStegOppsummering.tsx";
import { stepKey as skatteforholdOgInntektStepKey } from "./SkatteforholdOgInntektSteg.tsx";
import { SkatteforholdOgInntektStegOppsummering } from "./SkatteforholdOgInntektStegOppsummering.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";
import { stepKey as tilleggsopplysningerStepKey } from "./TilleggsopplysningerSteg.tsx";
import { TilleggsopplysningerStegOppsummering } from "./TilleggsopplysningerStegOppsummering.tsx";
import { ArbeidstakerSkjemaProps } from "./types.ts";

const oppsummeringStepKey = "oppsummering";

interface ArbeidstakerOppsummeringStegProps {
  id: string;
}

export function ArbeidstakerOppsummeringSteg({
  id,
}: ArbeidstakerOppsummeringStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <ArbeidstakerOppsummeringStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}

function ArbeidstakerOppsummeringStegContent({
  skjema,
}: ArbeidstakerSkjemaProps) {
  const { t } = useTranslation();

  const renderStepSummary = (stepKey: string) => {
    switch (stepKey) {
      case arbeidstakerenStepKey: {
        return <ArbeidstakerenStegOppsummering key={stepKey} skjema={skjema} />;
      }
      case skatteforholdOgInntektStepKey: {
        return (
          <SkatteforholdOgInntektStegOppsummering
            key={stepKey}
            skjema={skjema}
          />
        );
      }
      case familiemedlemmerStepKey: {
        return (
          <FamiliemedlemmerStegOppsummering key={stepKey} skjema={skjema} />
        );
      }
      case tilleggsopplysningerStepKey: {
        return (
          <TilleggsopplysningerStegOppsummering key={stepKey} skjema={skjema} />
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <SkjemaSteg
      config={{
        stepKey: oppsummeringStepKey,
        stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
        customNesteKnapp: {
          tekst: t("felles.sendSoknad"),
          ikon: <PaperplaneIcon />,
          type: "submit",
        },
      }}
    >
      {ARBEIDSTAKER_STEG_REKKEFOLGE.filter(
        (steg) => steg.key !== oppsummeringStepKey,
      ).map((steg) => renderStepSummary(steg.key))}
    </SkjemaSteg>
  );
}
