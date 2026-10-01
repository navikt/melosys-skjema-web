import { BodyShort, HStack, Label, VStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { getSkjemaQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

interface PartProperties {
  tittel: string;
  navn: string;
  id: string;
}

function Part({ tittel, navn, id }: PartProperties) {
  return (
    <VStack gap="space-4" className="flex-1 basis-50 min-w-0">
      <Label as="span" size="small">
        {tittel}
      </Label>
      <BodyShort>{`${navn} (${id})`}</BodyShort>
    </VStack>
  );
}

interface SkjemaParterProperties {
  representasjonstype: Representasjonstype;
  arbeidsgiver: { navn: string; orgnr: string };
  arbeidstaker: { navn: string; fnr: string };
}

/**
Arbeidsgiver og (unntatt for DEG_SELV) arbeidstaker øverst i skjemaet.
*/
export function SkjemaParter({
  representasjonstype,
  arbeidsgiver,
  arbeidstaker,
}: SkjemaParterProperties) {
  const { t } = useTranslation();

  return (
    <HStack gap="space-24" paddingBlock="space-16" wrap>
      <Part
        tittel={t("skjemaParterHeader.arbeidsgiver")}
        navn={arbeidsgiver.navn}
        id={arbeidsgiver.orgnr}
      />
      {representasjonstype !== Representasjonstype.DEG_SELV && (
        <Part
          tittel={t("skjemaParterHeader.arbeidstaker")}
          navn={arbeidstaker.navn}
          id={arbeidstaker.fnr}
        />
      )}
    </HStack>
  );
}

export function SkjemaParterHeader({ skjemaId }: { skjemaId: string }) {
  const { data: skjema } = useQuery(getSkjemaQuery(skjemaId));

  if (!skjema) {
    return null;
  }

  const { metadata } = skjema;
  return (
    <SkjemaParter
      arbeidsgiver={{
        navn: metadata.arbeidsgiverNavn,
        orgnr: metadata.juridiskEnhetOrgnr,
      }}
      arbeidstaker={{ navn: metadata.arbeidstakerNavn, fnr: skjema.fnr }}
      representasjonstype={metadata.representasjonstype}
    />
  );
}
