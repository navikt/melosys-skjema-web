import { PaperplaneIcon } from "@navikt/aksel-icons";
import { useTranslation } from "react-i18next";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { TilleggsopplysningerStegOppsummering } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegOppsummering.tsx";

import { stepKey as arbeidsgiverensVirksomhetINorgeStepKey } from "../arbeidsgiverens-virksomhet-i-norge/ArbeidsgiverensVirksomhetINorgeSteg.tsx";
import { stepKey as arbeidsstedIUtlandetStepKey } from "../arbeidssted-i-utlandet/ArbeidsstedIUtlandetSteg.tsx";
import { stepKey as arbeidstakerensLonnStepKey } from "../arbeidstakerens-lonn/ArbeidstakerensLonnSteg.tsx";
import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { stepKey as tilleggsopplysningerStepKey } from "../tilleggsopplysninger/TilleggsopplysningerSteg.tsx";
import { ArbeidsgiverSkjemaProps } from "../types.ts";
import { stepKey as utenlandsoppdragetStepKey } from "../utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";
import { ArbeidsgiverensVirksomhetINorgeStegOppsummering } from "./ArbeidsgiverensVirksomhetINorgeStegOppsummering.tsx";
import { ArbeidsstedIUtlandetStegOppsummering } from "./ArbeidsstedIUtlandetStegOppsummering.tsx";
import { ArbeidstakerensLonnStegOppsummering } from "./ArbeidstakerensLonnStegOppsummering.tsx";
import { UtenlandsoppdragetStegOppsummering } from "./UtenlandsoppdragetStegOppsummering.tsx";

const oppsummeringStepKey = "oppsummering";

interface ArbeidsgiverOppsummeringStegProps {
  id: string;
}

export function ArbeidsgiverOppsummeringSteg({
  id,
}: ArbeidsgiverOppsummeringStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => <ArbeidsgiverOppsummeringStegContent skjema={skjema} />}
    </ArbeidsgiverStegLoader>
  );
}

function ArbeidsgiverOppsummeringStegContent({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const renderStepSummary = (stepKey: string) => {
    switch (stepKey) {
      case arbeidsgiverensVirksomhetINorgeStepKey: {
        return (
          <ArbeidsgiverensVirksomhetINorgeStegOppsummering
            key={stepKey}
            skjema={skjema}
          />
        );
      }
      case utenlandsoppdragetStepKey: {
        return (
          <UtenlandsoppdragetStegOppsummering key={stepKey} skjema={skjema} />
        );
      }
      case arbeidsstedIUtlandetStepKey: {
        return (
          <ArbeidsstedIUtlandetStegOppsummering key={stepKey} skjema={skjema} />
        );
      }
      case arbeidstakerensLonnStepKey: {
        return (
          <ArbeidstakerensLonnStegOppsummering key={stepKey} skjema={skjema} />
        );
      }
      case tilleggsopplysningerStepKey: {
        return (
          <TilleggsopplysningerStegOppsummering
            key={stepKey}
            skjema={skjema}
            stegRekkefolge={ARBEIDSGIVER_STEG_REKKEFOLGE}
          />
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
        stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
        customNesteKnapp: {
          tekst: t("felles.sendSoknad"),
          ikon: <PaperplaneIcon />,
          type: "submit",
        },
      }}
    >
      {ARBEIDSGIVER_STEG_REKKEFOLGE.filter(
        (steg) => steg.key !== oppsummeringStepKey,
      ).map((steg) => renderStepSummary(steg.key))}
    </SkjemaSteg>
  );
}
