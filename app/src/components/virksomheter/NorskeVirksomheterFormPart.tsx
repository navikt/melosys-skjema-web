import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ExpansionCard,
  Label,
  Modal,
  Table,
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
import { NorskVirksomhetOppsummering } from "~/components/virksomheter/NorskeVirksomheterOppsummering.tsx";
import { norskVirksomhetSchema } from "~/components/virksomheterSchema.ts";
import { useTranslateError } from "~/utils/translation.ts";

type NorskVirksomhetFormData = z.infer<typeof norskVirksomhetSchema>;
type NorskVirksomhetField = NorskVirksomhetFormData & { id: string };

interface NorskeVirksomheterFormPartProps {
  fieldName: string;
  useTableView?: boolean;
}

export function NorskeVirksomheterFormPart({
  fieldName,
  useTableView,
}: NorskeVirksomheterFormPartProps) {
  const { control } = useFormContext();
  const { t } = useTranslation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: fieldName,
  });

  const typedFields = fields as Array<NorskVirksomhetField>;

  const apneAddModal = () => {
    setIsAddModalOpen(true);
  };

  const lukkAddModal = () => {
    setIsAddModalOpen(false);
  };

  const apneEditModal = (index: number) => {
    setEditingIndex(index);
  };

  const lukkEditModal = () => {
    setEditingIndex(null);
  };

  return (
    <>
      {fields.length > 0 && <Label>Norske virksomheter</Label>}
      {
        // Denne conditionalen er kun midlertidig for å kunne demonstrere to alternative visninger
        useTableView ? (
          <Table size="small">
            <Table.Body>
              {typedFields.map((field, index) => (
                <NorskVirksomhetRow
                  key={field.id}
                  onEdit={() => apneEditModal(index)}
                  onRemove={() => remove(index)}
                  virksomhet={field}
                />
              ))}
            </Table.Body>
          </Table>
        ) : (
          typedFields.map((field, index) => (
            <NorskVirksomhet
              key={field.id}
              onRemove={() => remove(index)}
              onUpdate={(data) => update(index, data)}
              virksomhet={field}
            />
          ))
        )
      }
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

      {/* Edit Modal */}
      {editingIndex !== null && (
        <Modal
          header={{
            heading: t("norskeVirksomheterFormPart.endreNorskVirksomhet"),
          }}
          onClose={lukkEditModal}
          open={true}
          width="medium"
        >
          <LeggTilEllerEndreNorskVirksomhetModalContent
            onCancel={lukkEditModal}
            onSubmit={(data) => {
              update(editingIndex, data);
              lukkEditModal();
            }}
            virksomhet={typedFields[editingIndex]}
          />
        </Modal>
      )}
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

interface NorskVirksomhetRowProps {
  virksomhet: NorskVirksomhetFormData;
  onRemove: () => void;
  onEdit: () => void;
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
