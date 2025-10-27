import { zodResolver } from "@hookform/resolvers/zod";
import {
  BodyShort,
  Box,
  Button,
  Label,
  Modal,
  Tag,
  TextField,
} from "@navikt/ds-react";
import { useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FjernKnapp } from "~/components/FjernKnapp.tsx";
import { LeggTilKnapp } from "~/components/LeggTilKnapp.tsx";
import { norskVirksomhetSchema } from "~/components/virksomheterSchema";
import { useTranslateError } from "~/utils/translation.ts";

type NorskVirksomhetFormData = z.infer<typeof norskVirksomhetSchema>;
type NorskVirksomhetField = NorskVirksomhetFormData & { id: string };

interface NorskeVirksomheterFormPartProps {
  fieldName: string;
}

export function NorskeVirksomheterFormPart({
  fieldName,
}: NorskeVirksomheterFormPartProps) {
  const { control } = useFormContext();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { fields, remove, append } = useFieldArray({
    control,
    name: fieldName,
  });

  const typedFields = fields as Array<NorskVirksomhetField>;

  const apneModal = () => {
    setIsModalOpen(true);
  };

  const lukkModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {typedFields.map((field, index) => (
        <NorskVirksomhet
          key={field.id}
          onRemove={() => remove(index)}
          virksomhetField={field}
        />
      ))}

      <LeggTilKnapp onClick={apneModal}>
        {t("norskeVirksomheterFormPart.leggTilNorskVirksomhet")}
      </LeggTilKnapp>

      <Modal
        header={{
          heading: t("norskeVirksomheterFormPart.leggTilNorskVirksomhet"),
        }}
        onClose={lukkModal}
        open={isModalOpen}
        width="medium"
      >
        {isModalOpen && (
          <LeggTilNorskVirksomhetModalContent
            append={append}
            onCancel={lukkModal}
          />
        )}
      </Modal>
    </>
  );
}

interface LeggTilNorskVirksomhetModalContentProps {
  append: (data: NorskVirksomhetFormData) => void;
  onCancel: () => void;
}

function LeggTilNorskVirksomhetModalContent({
  append,
  onCancel,
}: LeggTilNorskVirksomhetModalContentProps) {
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const modalForm = useForm<NorskVirksomhetFormData>({
    resolver: zodResolver(norskVirksomhetSchema),
    defaultValues: {
      organisasjonsnummer: "",
    },
  });

  const handleSubmit = modalForm.handleSubmit((data) => {
    append(data);
    onCancel();
  });

  return (
    <FormProvider {...modalForm}>
      <Modal.Body>
        <TextField
          error={translateError(
            modalForm.formState.errors.organisasjonsnummer?.message,
          )}
          label={t("norskeVirksomheterFormPart.organisasjonsnummer")}
          maxLength={9}
          {...modalForm.register("organisasjonsnummer")}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit} type="button">
          {t("norskeVirksomheterFormPart.leggTilNorskVirksomhet")}
        </Button>
        <Button onClick={onCancel} type="button" variant="secondary">
          {t("generellValidering.avbryt")}
        </Button>
      </Modal.Footer>
    </FormProvider>
  );
}

interface NorskVirksomhetProps {
  virksomhetField: NorskVirksomhetField;
  onRemove: () => void;
}

function NorskVirksomhet({ virksomhetField, onRemove }: NorskVirksomhetProps) {
  const { t } = useTranslation();

  return (
    <Box
      background="surface-alt-3-subtle"
      borderRadius="medium"
      className="ml-4"
      padding="space-8"
      style={{
        borderLeft: "4px solid var(--a-border-subtle)",
      }}
    >
      <Tag size="small" variant="info">
        {t("norskeVirksomheterFormPart.norskVirksomhet")}
      </Tag>
      <div className="mt-2">
        <Label size="small">
          {t("norskeVirksomheterFormPart.organisasjonsnummer")}
        </Label>
        <BodyShort size="small">
          {virksomhetField.organisasjonsnummer}
        </BodyShort>
      </div>
      <FjernKnapp className="mt-2" onClick={onRemove} size="small" />
    </Box>
  );
}
