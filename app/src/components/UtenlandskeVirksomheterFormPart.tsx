import { Box, Tag, TextField, VStack } from "@navikt/ds-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FjernKnapp } from "~/components/FjernKnapp.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { LeggTilKnapp } from "~/components/LeggTilKnapp.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";

// TODO: Denne gjøres på et senere tidspunkt om til en modal med eget schema for å validere input

interface UtenlandskeVirksomheterSectionProps {
  fieldName: string;
  clearErrorsFieldName?: string;
}

export function UtenlandskeVirksomheterFormPart({
  fieldName,
  clearErrorsFieldName,
}: UtenlandskeVirksomheterSectionProps) {
  const { control, register, getFieldState, clearErrors } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const leggTilUtenlandskVirksomhet = () => {
    append({
      navn: "",
      vegnavnOgHusnummer: "",
      land: "",
    });
    if (clearErrorsFieldName) {
      clearErrors(clearErrorsFieldName);
    }
  };

  const fjernUtenlandskVirksomhet = (index: number) => {
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
            Utenlandsk virksomhet
          </Tag>

          <VStack className="mt-4" gap="space-6">
            <TextField
              error={getFieldState(`${fieldName}.${index}.navn`).error?.message}
              label="Navn på virksomhet"
              {...register(`${fieldName}.${index}.navn`)}
              size="small"
            />

            <TextField
              error={
                getFieldState(`${fieldName}.${index}.organisasjonsnummer`).error
                  ?.message
              }
              label="Organisasjonsnummer eller registreringsnummer (valgfritt)"
              {...register(`${fieldName}.${index}.organisasjonsnummer`)}
              size="small"
            />

            <TextField
              error={
                getFieldState(`${fieldName}.${index}.vegnavnOgHusnummer`).error
                  ?.message
              }
              label="Vegnavn og husnummer, evt. postboks"
              {...register(`${fieldName}.${index}.vegnavnOgHusnummer`)}
              size="small"
            />

            <TextField
              error={
                getFieldState(`${fieldName}.${index}.bygning`).error?.message
              }
              label="Bygning (valgfritt)"
              {...register(`${fieldName}.${index}.bygning`)}
              size="small"
            />

            <TextField
              error={
                getFieldState(`${fieldName}.${index}.postkode`).error?.message
              }
              label="Postkode (valgfritt)"
              style={{ maxWidth: "120px" }}
              {...register(`${fieldName}.${index}.postkode`)}
              size="small"
            />

            <TextField
              error={
                getFieldState(`${fieldName}.${index}.byStedsnavn`).error
                  ?.message
              }
              label="By/stedsnavn (valgfritt)"
              {...register(`${fieldName}.${index}.byStedsnavn`)}
              size="small"
            />

            <TextField
              error={
                getFieldState(`${fieldName}.${index}.region`).error?.message
              }
              label="Region (valgfritt)"
              {...register(`${fieldName}.${index}.region`)}
              size="small"
            />

            <LandVelgerFormPart
              formFieldName={`${fieldName}.${index}.land`}
              label="Land"
              size="small"
            />

            <RadioGroupJaNeiFormPart
              formFieldName={`${fieldName}.${index}.tilhorerSammeKonsern`}
              legend="Tilhører virksomheten samme konsern som den norske arbeidsgiveren?"
              size="small"
            />
          </VStack>

          <FjernKnapp
            className="mt-4"
            onClick={() => fjernUtenlandskVirksomhet(index)}
            size="small"
          />
        </Box>
      ))}

      <LeggTilKnapp onClick={leggTilUtenlandskVirksomhet}>
        Legg til utenlandsk virksomhet
      </LeggTilKnapp>
    </>
  );
}
