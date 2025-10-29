import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Label,
  Modal,
  Table,
  TextField,
  VStack,
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
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { LeggTilKnapp } from "~/components/LeggTilKnapp.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { UtenlandskVirksomhetOppsummering } from "~/components/virksomheter/UtenlandskeVirksomheterOppsummering.tsx";
import { utenlandskVirksomhetSchema } from "~/components/virksomheterSchema.ts";
import { useTranslateError } from "~/utils/translation.ts";

type UtenlandskVirksomhetFormData = z.infer<typeof utenlandskVirksomhetSchema>;
type UtenlandskVirksomhetField = UtenlandskVirksomhetFormData & { id: string };

interface UtenlandskeVirksomheterSectionProps {
  fieldName: string;
  className?: string;
}

export function UtenlandskeVirksomheterFormPart({
  fieldName,
}: UtenlandskeVirksomheterSectionProps) {
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
      <ValgteUtenlandskeVirksomheter
        remove={remove}
        update={update}
        virksomheter={fields as Array<UtenlandskVirksomhetField>}
      />
      <LeggTilKnapp onClick={apneAddModal}>
        {t("utenlandskeVirksomheterFormPart.leggTilUtenlandskVirksomhet")}
      </LeggTilKnapp>

      {/* Add Modal */}
      <Modal
        header={{
          heading: t(
            "utenlandskeVirksomheterFormPart.leggTilUtenlandskVirksomhet",
          ),
        }}
        onClose={lukkAddModal}
        open={isAddModalOpen}
        width="medium"
      >
        {isAddModalOpen && (
          <LeggTilEllerEndreUtenlandskVirksomhetModalContent
            onCancel={lukkAddModal}
            onSubmit={append}
          />
        )}
      </Modal>
    </>
  );
}

type ValgteUtenlandskeVirksomheterProps = {
  virksomheter: Array<UtenlandskVirksomhetField>;
  update: (index: number, data: UtenlandskVirksomhetFormData) => void;
  remove: (index: number) => void;
};

function ValgteUtenlandskeVirksomheter({
  virksomheter,
  update,
  remove,
}: ValgteUtenlandskeVirksomheterProps) {
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
      <Label className="mt-2">
        {t("utenlandskeVirksomheterFormPart.utenlandskeVirksomheter")}
      </Label>
      <Table size="small">
        <Table.Body>
          {virksomheter.map((virksomhet, index) => (
            <UtenlandskVirksomhetRow
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
          heading: t(
            "utenlandskeVirksomheterFormPart.endreUtenlandskVirksomhet",
          ),
        }}
        onClose={lukkEditModal}
        open={editingIndex !== null}
        width="medium"
      >
        {editingIndex !== null && (
          <LeggTilEllerEndreUtenlandskVirksomhetModalContent
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

interface LeggTilEllerEndreUtenlandskVirksomhetModalContentProps {
  onSubmit: (data: UtenlandskVirksomhetFormData) => void;
  onCancel: () => void;
  virksomhet?: UtenlandskVirksomhetFormData;
}

function LeggTilEllerEndreUtenlandskVirksomhetModalContent({
  onSubmit,
  onCancel,
  virksomhet,
}: LeggTilEllerEndreUtenlandskVirksomhetModalContentProps) {
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const modalForm = useForm<UtenlandskVirksomhetFormData>({
    resolver: zodResolver(utenlandskVirksomhetSchema),
    defaultValues: {
      ...virksomhet,
    },
  });

  const handleSubmit = modalForm.handleSubmit((data) => {
    onSubmit(data);
    onCancel();
  });

  return (
    <FormProvider {...modalForm}>
      <Modal.Body>
        <VStack gap="space-6">
          <TextField
            error={translateError(modalForm.formState.errors.navn?.message)}
            label={t("utenlandskeVirksomheterFormPart.navnPaVirksomhet")}
            {...modalForm.register("navn")}
          />

          <TextField
            error={translateError(
              modalForm.formState.errors.organisasjonsnummer?.message,
            )}
            label={t(
              "utenlandskeVirksomheterFormPart.organisasjonsnummerEllerRegistreringsnummerValgfritt",
            )}
            {...modalForm.register("organisasjonsnummer")}
          />

          <TextField
            error={translateError(
              modalForm.formState.errors.vegnavnOgHusnummer?.message,
            )}
            label={t(
              "utenlandskeVirksomheterFormPart.vegnavnOgHusnummerEvtPostboks",
            )}
            {...modalForm.register("vegnavnOgHusnummer")}
          />

          <TextField
            error={translateError(modalForm.formState.errors.bygning?.message)}
            label={t("utenlandskeVirksomheterFormPart.bygningValgfritt")}
            {...modalForm.register("bygning")}
          />

          <TextField
            error={translateError(modalForm.formState.errors.postkode?.message)}
            label={t("utenlandskeVirksomheterFormPart.postkodeValgfritt")}
            style={{ maxWidth: "120px" }}
            {...modalForm.register("postkode")}
          />

          <TextField
            error={translateError(
              modalForm.formState.errors.byStedsnavn?.message,
            )}
            label={t("utenlandskeVirksomheterFormPart.byStednavnValgfritt")}
            {...modalForm.register("byStedsnavn")}
          />

          <TextField
            error={translateError(modalForm.formState.errors.region?.message)}
            label={t("utenlandskeVirksomheterFormPart.regionValgfritt")}
            {...modalForm.register("region")}
          />

          <LandVelgerFormPart
            formFieldName="land"
            label={t("utenlandskeVirksomheterFormPart.land")}
          />

          <RadioGroupJaNeiFormPart
            formFieldName="tilhorerSammeKonsern"
            legend={t(
              "utenlandskeVirksomheterFormPart.tilhorerVirksomhetenSammeKonsernSomDenNorskeArbeidsgiveren",
            )}
          />
        </VStack>
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

interface UtenlandskVirksomhetRowProps {
  virksomhet: UtenlandskVirksomhetField;
  onRemove: () => void;
  onEdit: () => void;
}

function UtenlandskVirksomhetRow({
  virksomhet,
  onRemove,
  onEdit,
}: UtenlandskVirksomhetRowProps) {
  return (
    <Table.ExpandableRow
      content={
        <div className="-my-4">
          <UtenlandskVirksomhetOppsummering virksomhet={virksomhet} />
        </div>
      }
    >
      <Table.HeaderCell>{virksomhet.navn}</Table.HeaderCell>
      <Table.DataCell>
        <EndreKnapp onClick={onEdit} size="small" />
        <FjernKnapp onClick={onRemove} size="small" />
      </Table.DataCell>
    </Table.ExpandableRow>
  );
}
