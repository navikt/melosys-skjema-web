import { BodyShort, HStack, Label, VStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { getSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

interface PartProps {
  tittel: string;
  navn: string;
  id: string;
}

function Part({ tittel, navn, id }: PartProps) {
  return (
    <VStack gap="space-4">
      <Label as="span" size="small">
        {tittel}
      </Label>
      <BodyShort>{`${navn} (${id})`}</BodyShort>
    </VStack>
  );
}

export function SkjemaParterHeader({ skjemaId }: { skjemaId: string }) {
  const { t } = useTranslation();
  const { data: skjema } = useQuery(getSkjemaQuery(skjemaId));

  if (!skjema) {
    return null;
  }

  const { metadata } = skjema;
  const visArbeidstaker =
    metadata.representasjonstype !== Representasjonstype.DEG_SELV;

  return (
    <HStack gap="space-128" paddingBlock="space-16" wrap>
      <Part
        tittel={t("skjemaParterHeader.arbeidsgiver")}
        navn={metadata.arbeidsgiverNavn}
        id={metadata.juridiskEnhetOrgnr}
      />
      {visArbeidstaker && (
        <Part
          tittel={t("skjemaParterHeader.arbeidstaker")}
          navn={metadata.arbeidstakerNavn}
          id={skjema.fnr}
        />
      )}
    </HStack>
  );
}
