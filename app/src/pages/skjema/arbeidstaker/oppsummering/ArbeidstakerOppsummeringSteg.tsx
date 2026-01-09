import { SendInnSkjemaKnapp } from "~/pages/skjema/components/SendInnSkjemaKnapp.tsx";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { TilleggsopplysningerStegOppsummering } from "~/pages/skjema/components/tilleggsopplysninger/TilleggsopplysningerStegOppsummering.tsx";

import { stepKey as arbeidssituasjonStepKey } from "../arbeidssituasjon/ArbeidssituasjonSteg.tsx";
import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import { stepKey as familiemedlemmerStepKey } from "../familiemedlemmer/FamiliemedlemmerSteg.tsx";
import { stepKey as skatteforholdOgInntektStepKey } from "../skatteforhold-og-inntekt/SkatteforholdOgInntektSteg.tsx";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { stepKey as tilleggsopplysningerStepKey } from "../tilleggsopplysninger/TilleggsopplysningerSteg.tsx";
import { ArbeidstakerSkjemaProps } from "../types.ts";
import { stepKey as utenlandsoppdragetStepKey } from "../utenlandsoppdraget/UtenlandsoppdragetSteg.tsx";
import { ArbeidssituasjonStegOppsummering } from "./ArbeidssituasjonStegOppsummering.tsx";
import { FamiliemedlemmerStegOppsummering } from "./FamiliemedlemmerStegOppsummering.tsx";
import { SkatteforholdOgInntektStegOppsummering } from "./SkatteforholdOgInntektStegOppsummering.tsx";
import { UtenlandsoppdragetStegOppsummering } from "./UtenlandsoppdragetStegOppsummering.tsx";

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
  const renderStepSummary = (stepKey: string) => {
    switch (stepKey) {
      case arbeidssituasjonStepKey: {
        return (
          <ArbeidssituasjonStegOppsummering key={stepKey} skjema={skjema} />
        );
      }
      case utenlandsoppdragetStepKey: {
        return (
          <UtenlandsoppdragetStegOppsummering key={stepKey} skjema={skjema} />
        );
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
          <TilleggsopplysningerStegOppsummering
            key={stepKey}
            skjema={skjema}
            stegRekkefolge={ARBEIDSTAKER_STEG_REKKEFOLGE}
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
        stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
      }}
      nesteKnapp={<SendInnSkjemaKnapp skjemaId={skjema.id} />}
    >
      {ARBEIDSTAKER_STEG_REKKEFOLGE.filter(
        (steg) => steg.key !== oppsummeringStepKey,
      ).map((steg) => renderStepSummary(steg.key))}
    </SkjemaSteg>
  );
}
