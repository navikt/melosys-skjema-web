import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Modal, Table } from "@navikt/ds-react";
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
import { OrganisasjonSoker } from "~/components/OrganisasjonSoker.tsx";
import { OrganisasjonNameLookup } from "~/components/virksomheter/OrganisasjonNameLookup.tsx";
import { norskVirksomhetSchema } from "~/components/virksomheter/virksomheterSchema.ts";

const modalSchema = z
  .object({
    organisasjon: z
      .object({
        orgnr: z.string(),
        navn: z.string(),
      })
      .nullable()
      .default(null),
  })
  .refine((data) => data.organisasjon !== null, {
    message: "generellValidering.organisasjonsnummerErPakrevd",
    path: ["organisasjon"],
  });

type ModalFormData = z.input<typeof modalSchema>;

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

  const modalForm = useForm<ModalFormData>({
    resolver: zodResolver(modalSchema),
    defaultValues: { organisasjon: null },
  });

  const handleSubmit = modalForm.handleSubmit((data) => {
    onSubmit({ organisasjonsnummer: data.organisasjon!.orgnr });
    onCancel();
  });

  return (
    <FormProvider {...modalForm}>
      <Modal.Body>
        <OrganisasjonSoker
          formFieldName="organisasjon"
          initialOrgnr={virksomhet?.organisasjonsnummer}
          label={t("norskeVirksomheterFormPart.organisasjonsnummer")}
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
    <Table.Row>
      <Table.HeaderCell>
        <OrganisasjonNameLookup orgnummer={virksomhet.organisasjonsnummer} />
      </Table.HeaderCell>
      <Table.DataCell>
        <EndreKnapp onClick={onEdit} size="small" />
        <FjernKnapp onClick={onRemove} size="small" />
      </Table.DataCell>
    </Table.Row>
  );
}
