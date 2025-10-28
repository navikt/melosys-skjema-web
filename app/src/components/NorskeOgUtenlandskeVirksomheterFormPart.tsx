import { Detail, ErrorMessage, Label, VStack } from "@navikt/ds-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { NorskeVirksomheterFormPart } from "~/components/NorskeVirksomheterFormPart.tsx";
import { NorskeVirksomheterOppsummering } from "~/components/NorskeVirksomheterOppsummering.tsx";
import { UtenlandskeVirksomheterFormPart } from "~/components/UtenlandskeVirksomheterFormPart.tsx";
import { useTranslateError } from "~/utils/translation.ts";

interface NorskeOgUtenlandskeVirksomheterFormPartProps {
  fieldName: string;
  label?: string;
  description?: string;
}

export function NorskeOgUtenlandskeVirksomheterFormPart({
  fieldName,
  label,
  description,
}: NorskeOgUtenlandskeVirksomheterFormPartProps) {
  const {
    formState: { errors },
    watch,
    clearErrors,
  } = useFormContext();
  const translateError = useTranslateError();

  const error = errors[fieldName];
  const norskeVirksomheter = watch(`${fieldName}.norskeVirksomheter`);
  const utenlandskeVirksomheter = watch(`${fieldName}.utenlandskeVirksomheter`);

  useEffect(() => {
    const harVirksomheter =
      (norskeVirksomheter && norskeVirksomheter.length > 0) ||
      (utenlandskeVirksomheter && utenlandskeVirksomheter.length > 0);

    if (harVirksomheter) {
      clearErrors(fieldName);
    }
  }, [norskeVirksomheter, utenlandskeVirksomheter, fieldName, clearErrors]);
  return (
    <VStack className="mt-4" gap="space-8">
      {label && <Label>{label}</Label>}
      {description && <Detail>{description}</Detail>}

      <NorskeVirksomheterFormPart
        fieldName={`${fieldName}.norskeVirksomheter`}
      />

      <UtenlandskeVirksomheterFormPart
        fieldName={`${fieldName}.utenlandskeVirksomheter`}
      />

      {error && (
        <ErrorMessage className="mt-2">
          {translateError(error.message as string | undefined)}
        </ErrorMessage>
      )}
      <NorskeVirksomheterOppsummering virksomheter={norskeVirksomheter} />
    </VStack>
  );
}
