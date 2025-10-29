import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Modal, Table, TextField } from "@navikt/ds-react";
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
import { NorskVirksomhetOppsummering } from "~/components/virksomheter/NorskeVirksomheterOppsummering.tsx";
import { norskVirksomhetSchema } from "~/components/virksomheterSchema.ts";
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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: fieldName,
  });

  const apneAddModal = () => {
    setIsAddModalOpen(true);
  };

  const lukkAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <>
      <ValgteNorskeVirksomheter
        remove={remove}
        update={update}
        virksomheter={fields as Array<NorskVirksomhetField>}
      />
      <LeggTilKnapp onClick={apneAddModal}>
        {t("norskeVirksomheterFormPart.leggTilNorskVirksomhet")}
      </LeggTilKnapp>

      {/* Add Modal */}
      <Modal
        header={{
          heading: t("norskeVirksomheterFormPart.leggTilNorskVirksomhet"),
        }}
        onClose={lukkAddModal}
        open={isAddModalOpen}
        width="medium"
      >
        {isAddModalOpen && (
          <LeggTilEllerEndreNorskVirksomhetModalContent
            onCancel={lukkAddModal}
            onSubmit={append}
          />
        )}
      </Modal>
    </>
  );
}

type ValgteNorskeVirksomheterProps = {
  virksomheter: Array<NorskVirksomhetField>;
  update: (index: number, data: NorskVirksomhetFormData) => void;
  remove: (index: number) => void;
};

function ValgteNorskeVirksomheter({
  virksomheter,
  update,
  remove,
}: ValgteNorskeVirksomheterProps) {
  const { t } = useTranslation();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const lukkEditModal = () => {
    setEditingIndex(null);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
  };

  if (virksomheter.length === 0) {
    return null;
  }

  return (
    <>
      <Label>{t("norskeVirksomheterFormPart.norskeVirksomheter")}</Label>
      <Table size="small">
        <Table.Body>
          {virksomheter.map((virksomhet, index) => (
            <NorskVirksomhetRow
              key={virksomhet.id}
              onEdit={() => openEditModal(index)}
              onRemove={() => remove(index)}
              virksomhet={virksomhet}
            />
          ))}
        </Table.Body>
      </Table>
      <Modal
        header={{
          heading: t("norskeVirksomheterFormPart.endreNorskVirksomhet"),
        }}
        onClose={lukkEditModal}
        open={editingIndex !== null}
        width="medium"
      >
        {editingIndex !== null && (
          <LeggTilEllerEndreNorskVirksomhetModalContent
            onCancel={lukkEditModal}
            onSubmit={(data) => {
              update(editingIndex, data);
              lukkEditModal();
            }}
            virksomhet={virksomheter[editingIndex]}
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

interface NorskVirksomhetRowProps {
  virksomhet: NorskVirksomhetField;
  onRemove: () => void;
  onEdit: () => void;
}

function NorskVirksomhetRow({
  virksomhet,
  onRemove,
  onEdit,
}: NorskVirksomhetRowProps) {
  return (
    <Table.ExpandableRow
      content={
        <div className="-my-4">
          <NorskVirksomhetOppsummering virksomhet={virksomhet} />
        </div>
      }
    >
      <Table.HeaderCell>Gjør oppslag på orgnr AS</Table.HeaderCell>
      <Table.DataCell>
        <EndreKnapp onClick={onEdit} size="small" />
        <FjernKnapp onClick={onRemove} size="small" />
      </Table.DataCell>
    </Table.ExpandableRow>
  );
}
