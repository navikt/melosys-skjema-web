import { Detail, ErrorMessage, Label, VStack } from "@navikt/ds-react";
import { useFormContext, useWatch } from "react-hook-form";

import { NorskeVirksomheterFormPart } from "~/components/virksomheter/NorskeVirksomheterFormPart.tsx";
import { UtenlandskeVirksomheterFormPart } from "~/components/virksomheter/UtenlandskeVirksomheterFormPart.tsx";
import { useTranslateError } from "~/utils/translation.ts";

interface NorskeOgUtenlandskeVirksomheterFormPartProps {
  fieldName: string;
  label?: string;
  description?: string;
  includeAnsettelsesform?: boolean;
}

export function NorskeOgUtenlandskeVirksomheterFormPart({
  fieldName,
  label,
  description,
  includeAnsettelsesform = false,
}: NorskeOgUtenlandskeVirksomheterFormPartProps) {
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
      {label && <Label>{label}</Label>}
      {description && <Detail>{description}</Detail>}

      <NorskeVirksomheterFormPart
        fieldName={`${fieldName}.norskeVirksomheter`}
      />

      <UtenlandskeVirksomheterFormPart
        fieldName={`${fieldName}.utenlandskeVirksomheter`}
        includeAnsettelsesform={includeAnsettelsesform}
      />

      {shouldShowError && (
        <ErrorMessage className="mt-2">
          {translateError(error.message as string | undefined)}
        </ErrorMessage>
      )}
    </VStack>
  );
}
