import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ExpansionCard,
  Label,
  Modal,
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

import { EndreKnapp } from "~/components/EndreKnapp.tsx";
import { FjernKnapp } from "~/components/FjernKnapp.tsx";
import { LeggTilKnapp } from "~/components/LeggTilKnapp.tsx";
import { NorskVirksomhetOppsummering } from "~/components/NorskeVirksomheterOppsummering.tsx";
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

  const { fields, append, remove, update } = useFieldArray({
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
      <Label className="mt-4">Norske virksomheter</Label>
      {typedFields.map((field, index) => (
        <NorskVirksomhet
          key={field.id}
          onRemove={() => remove(index)}
          onUpdate={(data) => update(index, data)}
          virksomhet={field}
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
          <LeggTilEllerEndreNorskVirksomhetModalContent
            onCancel={lukkModal}
            onSubmit={append}
          />
        )}
      </Modal>
    </>
  );
}

interface LeggTilEllerEndreNorskVirksomhetModalContentProps {
  onSubmit: (data: NorskVirksomhetFormData) => void;
  onCancel: () => void;
  virksomhet?: NorskVirksomhetFormData;
}

function LeggTilEllerEndreNorskVirksomhetModalContent({
  onSubmit,
  onCancel,
  virksomhet,
}: LeggTilEllerEndreNorskVirksomhetModalContentProps) {
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const modalForm = useForm<NorskVirksomhetFormData>({
    resolver: zodResolver(norskVirksomhetSchema),
    defaultValues: { ...virksomhet },
  });

  const handleSubmit = modalForm.handleSubmit((data) => {
    onSubmit(data);
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
          {t("felles.lagre")}
        </Button>
        <Button onClick={onCancel} type="button" variant="secondary">
          {t("felles.avbryt")}
        </Button>
      </Modal.Footer>
    </FormProvider>
  );
}

interface NorskVirksomhetProps {
  virksomhet: NorskVirksomhetFormData;
  onRemove: () => void;
  onUpdate: (data: NorskVirksomhetFormData) => void;
}

function NorskVirksomhet({
  virksomhet,
  onRemove,
  onUpdate,
}: NorskVirksomhetProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apneModal = () => {
    setIsModalOpen(true);
  };

  const lukkModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ExpansionCard
        aria-label={`${t("felles.valgtVirksomhet")}: Gjør oppslag på orgnr AS`}
        size="small"
      >
        <ExpansionCard.Header>
          <ExpansionCard.Title size="small">
            Gjør Oppslag På Orgnr AS
          </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <NorskVirksomhetOppsummering virksomhet={virksomhet} />
        </ExpansionCard.Content>
        <EndreKnapp className="mt-1" onClick={apneModal} size="small" />
        <FjernKnapp className="mt-1" onClick={onRemove} size="small" />
      </ExpansionCard>

      <Modal
        header={{
          heading: t("norskeVirksomheterFormPart.endreNorskVirksomhet"),
        }}
        onClose={lukkModal}
        open={isModalOpen}
        width="medium"
      >
        {isModalOpen && (
          <LeggTilEllerEndreNorskVirksomhetModalContent
            onCancel={lukkModal}
            onSubmit={onUpdate}
            virksomhet={virksomhet}
          />
        )}
      </Modal>
    </>
  );
}
