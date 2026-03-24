import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { Button, Heading, HGrid, VStack } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type { StegKey } from "~/constants/stegKeys.ts";
import {
  Fremgangsindikator,
  StegRekkefolgeItem,
} from "~/pages/skjema/components/Fremgangsindikator";
import { SkjemaHeader } from "~/pages/skjema/components/SkjemaHeader.tsx";
import { STEG_REKKEFOLGE } from "~/pages/skjema/stegRekkefølge.ts";
import type { UtsendtArbeidstakerSkjemaDto } from "~/types/melosysSkjemaTypes.ts";
import { toRepresentasjonskontekst } from "~/types/representasjon.ts";

import { AvbrytOgSlettKnapp } from "./AvbrytOgSlettKnapp.tsx";
import { LagreUtkastKnapp } from "./LagreUtkastKnapp.tsx";

interface StegConfig {
  stepKey: StegKey;
  skjema: UtsendtArbeidstakerSkjemaDto;
}

interface SkjemaStegProps {
  config: StegConfig;
  nesteKnapp: ReactNode;
  children?: ReactNode;
}

export function SkjemaSteg({ config, nesteKnapp, children }: SkjemaStegProps) {
  const { t } = useTranslation();
  const { skjema } = config;
  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];
  const representasjonskontekst = toRepresentasjonskontekst(skjema.metadata);

  const stepNumber = getStepNumber(config.stepKey, stegRekkefolge);
  const prevStep = getPreviousStep(config.stepKey, stegRekkefolge);

  // Get step title from config
  const stepInfo = stegRekkefolge.find((step) => step.key === config.stepKey);
  const title = stepInfo?.title
    ? t(stepInfo.title)
    : `Unknown Step: ${config.stepKey}`;

  return (
    <section>
      <SkjemaHeader />
      <Fremgangsindikator
        aktivtSteg={stepNumber}
        className="mt-4"
        stegRekkefolge={stegRekkefolge}
      />
      <Heading className="mt-8" level="1" size="large">
        {title}
      </Heading>
      {children}
      <HGrid
        className="mx-auto mt-8"
        columns={2}
        gap="space-4"
        maxWidth="fit-content"
      >
        <VStack gap="space-8">
          <Button
            as={Link}
            icon={<ArrowLeftIcon />}
            style={prevStep ? undefined : { visibility: "hidden" }}
            to={prevStep ? `../${prevStep.key}` : ""}
            variant="secondary"
          >
            {t("felles.forrigeSteg")}
          </Button>
          <LagreUtkastKnapp representasjonskontekst={representasjonskontekst} />
        </VStack>
        <VStack align="center" gap="space-8">
          <div className="w-full [&>button]:w-full">{nesteKnapp}</div>
          <AvbrytOgSlettKnapp
            representasjonskontekst={representasjonskontekst}
            skjemaId={skjema.id}
          />
        </VStack>
      </HGrid>
    </section>
  );
}

export function getStepNumber(
  key: StegKey,
  stegRekkefolge: StegRekkefolgeItem[],
): number {
  const index = stegRekkefolge.findIndex((step) => step.key === key);
  return index + 1;
}

export function getPreviousStep(
  key: StegKey,
  stegRekkefolge: StegRekkefolgeItem[],
): StegRekkefolgeItem | undefined {
  const currentIndex = stegRekkefolge.findIndex((step) => step.key === key);
  return currentIndex > 0 ? stegRekkefolge[currentIndex - 1] : undefined;
}

export function getNextStep(
  key: StegKey,
  stegRekkefolge: StegRekkefolgeItem[],
): StegRekkefolgeItem | undefined {
  const currentIndex = stegRekkefolge.findIndex((step) => step.key === key);
  return currentIndex !== -1 && currentIndex < stegRekkefolge.length - 1
    ? stegRekkefolge[currentIndex + 1]
    : undefined;
}

export type { StegConfig };
