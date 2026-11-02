import { Detail, ErrorMessage, Label, VStack } from "@navikt/ds-react";
import { useFormContext, useWatch } from "react-hook-form";

import { NorskeVirksomheterFormPart } from "~/components/virksomheter/NorskeVirksomheterFormPart.tsx";
import { UtenlandskeVirksomheterFormPart } from "~/components/virksomheter/UtenlandskeVirksomheterFormPart.tsx";
import type { VirksomhetListeDefinisjon } from "~/components/virksomheter/virksomhetDefinisjon.ts";
import { useTranslateError } from "~/utils/translation.ts";

interface NorskeOgUtenlandskeVirksomheterFormPartProperties {
  fieldName: string;
  definisjon: VirksomhetListeDefinisjon;
}

export function NorskeOgUtenlandskeVirksomheterFormPart({
  fieldName,
  definisjon,
}: NorskeOgUtenlandskeVirksomheterFormPartProperties) {
  const {
    formState: { errors },
  } = useFormContext();
  const translateError = useTranslateError();

  const error = errors[fieldName];
  const norskeVirksomheter = useWatch({
    name: `${fieldName}.norskeVirksomheter`,
  });
  const utenlandskeVirksomheter = useWatch({
    name: `${fieldName}.utenlandskeVirksomheter`,
  });

  // Beregn om det er virksomheter - hvis det er det, skal vi ikke vise erroren
  // selv om den teknisk eksisterer i form state
  const harVirksomheter =
    (norskeVirksomheter && norskeVirksomheter.length > 0) ||
    (utenlandskeVirksomheter && utenlandskeVirksomheter.length > 0);

  // Bare vis error hvis det faktisk ikke er noen virksomheter
  const shouldShowError = error && !harVirksomheter;
  return (
    <VStack className="mt-4" gap="space-4">
      <Label>{definisjon.label}</Label>
      {definisjon.hjelpetekst && <Detail>{definisjon.hjelpetekst}</Detail>}

      <NorskeVirksomheterFormPart
        fieldName={`${fieldName}.norskeVirksomheter`}
        organisasjonsnummerLabel={
          definisjon.elementDefinisjon.organisasjonsnummer.label
        }
      />

      <UtenlandskeVirksomheterFormPart
        definisjon={definisjon.elementDefinisjon}
        fieldName={`${fieldName}.utenlandskeVirksomheter`}
      />

      {shouldShowError && (
        <ErrorMessage className="mt-2">
          {translateError(error.message as string | undefined)}
        </ErrorMessage>
      )}
    </VStack>
  );
}
