import { Box, Tag, TextField, VStack } from "@navikt/ds-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FjernKnapp } from "~/components/FjernKnapp.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { LeggTilKnapp } from "~/components/LeggTilKnapp.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useTranslateError } from "~/utils/translation.ts";

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
  const { t } = useTranslation();
  const translateError = useTranslateError();

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
            {t("utenlandskeVirksomheterFormPart.utenlandskVirksomhet")}
          </Tag>

          <VStack className="mt-4" gap="space-6">
            <TextField
              error={translateError(
                getFieldState(`${fieldName}.${index}.navn`).error?.message,
              )}
              label={t("utenlandskeVirksomheterFormPart.navnPaVirksomhet")}
              {...register(`${fieldName}.${index}.navn`)}
              size="small"
            />

            <TextField
              error={translateError(
                getFieldState(`${fieldName}.${index}.organisasjonsnummer`).error
                  ?.message,
              )}
              label={t(
                "utenlandskeVirksomheterFormPart.organisasjonsnummerEllerRegistreringsnummerValgfritt",
              )}
              {...register(`${fieldName}.${index}.organisasjonsnummer`)}
              size="small"
            />

            <TextField
              error={translateError(
                getFieldState(`${fieldName}.${index}.vegnavnOgHusnummer`).error
                  ?.message,
              )}
              label={t(
                "utenlandskeVirksomheterFormPart.vegnavnOgHusnummerEvtPostboks",
              )}
              {...register(`${fieldName}.${index}.vegnavnOgHusnummer`)}
              size="small"
            />

            <TextField
              error={translateError(
                getFieldState(`${fieldName}.${index}.bygning`).error?.message,
              )}
              label={t("utenlandskeVirksomheterFormPart.bygningValgfritt")}
              {...register(`${fieldName}.${index}.bygning`)}
              size="small"
            />

            <TextField
              error={translateError(
                getFieldState(`${fieldName}.${index}.postkode`).error?.message,
              )}
              label={t("utenlandskeVirksomheterFormPart.postkodeValgfritt")}
              style={{ maxWidth: "120px" }}
              {...register(`${fieldName}.${index}.postkode`)}
              size="small"
            />

            <TextField
              error={translateError(
                getFieldState(`${fieldName}.${index}.byStedsnavn`).error
                  ?.message,
              )}
              label={t("utenlandskeVirksomheterFormPart.byStednavnValgfritt")}
              {...register(`${fieldName}.${index}.byStedsnavn`)}
              size="small"
            />

            <TextField
              error={translateError(
                getFieldState(`${fieldName}.${index}.region`).error?.message,
              )}
              label={t("utenlandskeVirksomheterFormPart.regionValgfritt")}
              {...register(`${fieldName}.${index}.region`)}
              size="small"
            />

            <LandVelgerFormPart
              formFieldName={`${fieldName}.${index}.land`}
              label={t("utenlandskeVirksomheterFormPart.land")}
              size="small"
            />

            <RadioGroupJaNeiFormPart
              formFieldName={`${fieldName}.${index}.tilhorerSammeKonsern`}
              legend={t(
                "utenlandskeVirksomheterFormPart.tilhorerVirksomhetenSammeKonsernSomDenNorskeArbeidsgiveren",
              )}
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
        {t("utenlandskeVirksomheterFormPart.leggTilUtenlandskVirksomhet")}
      </LeggTilKnapp>
    </>
  );
}
