import { Detail, ErrorMessage, Label, VStack } from "@navikt/ds-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { NorskeVirksomheterFormPart } from "~/components/virksomheter/NorskeVirksomheterFormPart.tsx";
import { UtenlandskeVirksomheterFormPart } from "~/components/virksomheter/UtenlandskeVirksomheterFormPart.tsx";
import { useTranslateError } from "~/utils/translation.ts";

// Midlertidig switch for å kunne vise frem to forskjellige alternativer av visning av valgte virksomheter
// Denne fjernes og vi lander på ett av alternativene før merging til main
const useTableView = true;

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
    <VStack className="mt-4" gap="space-4">
      {label && <Label>{label}</Label>}
      {description && <Detail>{description}</Detail>}

      <NorskeVirksomheterFormPart
        fieldName={`${fieldName}.norskeVirksomheter`}
        useTableView={useTableView}
      />

      <UtenlandskeVirksomheterFormPart
        fieldName={`${fieldName}.utenlandskeVirksomheter`}
        useTableView={useTableView}
      />

      {error && (
        <ErrorMessage className="mt-2">
          {translateError(error.message as string | undefined)}
        </ErrorMessage>
      )}
    </VStack>
  );
}
