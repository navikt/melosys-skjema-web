import { Box, Tag, TextField } from "@navikt/ds-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FjernKnapp } from "~/components/FjernKnapp.tsx";
import { LeggTilKnapp } from "~/components/LeggTilKnapp.tsx";

// TODO: Denne gjøres på et senere tidspunkt om til en modal med eget schema for å validere input

interface NorskeVirksomheterSectionProps {
  fieldName: string;
  clearErrorsFieldName?: string;
}

export function NorskeVirksomheterFormPart({
  fieldName,
  clearErrorsFieldName,
}: NorskeVirksomheterSectionProps) {
  const { control, register, getFieldState, clearErrors } = useFormContext();
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const leggTilNorskVirksomhet = () => {
    append({ organisasjonsnummer: "" });
    if (clearErrorsFieldName) {
      clearErrors(clearErrorsFieldName);
    }
  };

  const fjernNorskVirksomhet = (index: number) => {
    remove(index);
  };

  return (
    <>
      {fields.map((field, index) => (
        <Box
          background="surface-alt-3-subtle"
          borderRadius="medium"
          className="ml-4"
          key={field.id}
          padding="space-8"
          style={{
            borderLeft: "4px solid var(--a-border-subtle)",
          }}
        >
          <Tag size="small" variant="info">
            {t("norskeVirksomheterFormPart.norskVirksomhet")}
          </Tag>
          <TextField
            className="mt-2"
            error={
              getFieldState(`${fieldName}.${index}.organisasjonsnummer`).error
                ?.message
            }
            label={t("norskeVirksomheterFormPart.organisasjonsnummer")}
            style={{ maxWidth: "160px" }}
            {...register(`${fieldName}.${index}.organisasjonsnummer`)}
            size="small"
          />
          <FjernKnapp
            className="mt-2"
            onClick={() => fjernNorskVirksomhet(index)}
            size="small"
          />
        </Box>
      ))}

      <LeggTilKnapp onClick={leggTilNorskVirksomhet}>
        {t("norskeVirksomheterFormPart.leggTilNorskVirksomhet")}
      </LeggTilKnapp>
    </>
  );
}
