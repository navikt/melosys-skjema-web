import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Label,
  Modal,
  Radio,
  RadioGroup,
  Table,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { EndreKnapp } from "~/components/EndreKnapp.tsx";
import { FjernKnapp } from "~/components/FjernKnapp.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { LeggTilKnapp } from "~/components/LeggTilKnapp.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { UtenlandskVirksomhetOppsummering } from "~/components/virksomheter/UtenlandskeVirksomheterOppsummering.tsx";
import {
  useFeltLabel,
  type VirksomhetElementDefinisjon,
} from "~/components/virksomheter/virksomhetDefinisjon.ts";
import {
  utenlandskVirksomhetMedAnsettelsesformSchema,
  utenlandskVirksomhetSchema,
} from "~/components/virksomheter/virksomheterSchema.ts";
import {
  UtenlandskVirksomhet,
  UtenlandskVirksomhetMedAnsettelsesform,
} from "~/types/melosysSkjemaTypes";
import { useTranslateError } from "~/utils/translation.ts";

type UtenlandskVirksomhetField = (
  UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform
) & { id: string };

interface UtenlandskeVirksomheterFormPartProperties {
  fieldName: string;
  definisjon: VirksomhetElementDefinisjon;
}

export function UtenlandskeVirksomheterFormPart({
  fieldName,
  definisjon,
}: UtenlandskeVirksomheterFormPartProperties) {
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
        definisjon={definisjon}
        remove={remove}
        update={update}
        virksomheter={fields as Array<UtenlandskVirksomhetField>}
      />
      <LeggTilKnapp onClick={apneAddModal}>
        {t("utenlandskeVirksomheterFormPart.leggTilUtenlandskVirksomhet")}
      </LeggTilKnapp>

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
            definisjon={definisjon}
            onCancel={lukkAddModal}
            onSubmit={append}
          />
        )}
      </Modal>
    </>
  );
}

type ValgteUtenlandskeVirksomheterProperties = {
  definisjon: VirksomhetElementDefinisjon;
  virksomheter: Array<UtenlandskVirksomhetField>;
  update: (
    index: number,
    data: UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform,
  ) => void;
  remove: (index: number) => void;
};

function ValgteUtenlandskeVirksomheter({
  definisjon,
  virksomheter,
  update,
  remove,
}: ValgteUtenlandskeVirksomheterProperties) {
  const { t } = useTranslation();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (virksomheter.length === 0) {
    return null;
  }

  const lukkEditModal = () => {
    setEditingIndex(null);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
  };

  return (
    <>
      <Label className="mt-2">
        {t("utenlandskeVirksomheterFormPart.utenlandskeVirksomheter")}
      </Label>
      <Table size="small">
        <Table.Body>
          {virksomheter.map((virksomhet, index) => (
            <UtenlandskVirksomhetRow
              definisjon={definisjon}
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
            definisjon={definisjon}
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

interface LeggTilEllerEndreUtenlandskVirksomhetModalContentProperties {
  onSubmit: (
    data: UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform,
  ) => void;
  onCancel: () => void;
  virksomhet?: UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform;
  definisjon: VirksomhetElementDefinisjon;
}

function LeggTilEllerEndreUtenlandskVirksomhetModalContent({
  onSubmit,
  onCancel,
  virksomhet,
  definisjon,
}: LeggTilEllerEndreUtenlandskVirksomhetModalContentProperties) {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const feltLabel = useFeltLabel();
  const ansettelsesformDefinisjon = definisjon.ansettelsesform;

  const schema = ansettelsesformDefinisjon
    ? utenlandskVirksomhetMedAnsettelsesformSchema
    : utenlandskVirksomhetSchema;

  type FormData = UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform;

  const modalForm = useForm<FormData>({
    resolver: zodResolver(schema),
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
      <Modal.Body
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <VStack gap="space-6">
          <TextField
            error={translateError(modalForm.formState.errors.navn?.message)}
            label={feltLabel(definisjon.navn)}
            {...modalForm.register("navn")}
          />

          <TextField
            error={translateError(
              modalForm.formState.errors.organisasjonsnummer?.message,
            )}
            label={feltLabel(
              definisjon.organisasjonsnummerEllerRegistreringsnummer,
            )}
            {...modalForm.register("organisasjonsnummer")}
          />

          <TextField
            error={translateError(
              modalForm.formState.errors.vegnavnOgHusnummer?.message,
            )}
            label={feltLabel(definisjon.vegnavnOgHusnummer)}
            {...modalForm.register("vegnavnOgHusnummer")}
          />

          <TextField
            error={translateError(modalForm.formState.errors.bygning?.message)}
            label={feltLabel(definisjon.bygning)}
            {...modalForm.register("bygning")}
          />

          <TextField
            error={translateError(modalForm.formState.errors.postkode?.message)}
            label={feltLabel(definisjon.postkode)}
            style={{ maxWidth: "120px" }}
            {...modalForm.register("postkode")}
          />

          <TextField
            error={translateError(
              modalForm.formState.errors.byStedsnavn?.message,
            )}
            label={feltLabel(definisjon.byStedsnavn)}
            {...modalForm.register("byStedsnavn")}
          />

          <TextField
            error={translateError(modalForm.formState.errors.region?.message)}
            label={feltLabel(definisjon.region)}
            {...modalForm.register("region")}
          />

          <LandVelgerFormPart
            formFieldName="land"
            label={feltLabel(definisjon.land)}
          />

          <RadioGroupJaNeiFormPart
            formFieldName="tilhorerSammeKonsern"
            legend={feltLabel(definisjon.tilhorerSammeKonsern)}
          />

          {ansettelsesformDefinisjon && (
            <Controller
              control={modalForm.control}
              name="ansettelsesform"
              render={({ field, fieldState }) => (
                <RadioGroup
                  error={translateError(fieldState.error?.message)}
                  legend={feltLabel(ansettelsesformDefinisjon)}
                  onChange={field.onChange}
                  value={field.value ?? ""}
                >
                  {ansettelsesformDefinisjon.alternativer.map((alternativ) => (
                    <Radio key={alternativ.verdi} value={alternativ.verdi}>
                      {alternativ.label}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            />
          )}
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

interface UtenlandskVirksomhetRowProperties {
  definisjon: VirksomhetElementDefinisjon;
  virksomhet: UtenlandskVirksomhetField;
  onRemove: () => void;
  onEdit: () => void;
}

function UtenlandskVirksomhetRow({
  definisjon,
  virksomhet,
  onRemove,
  onEdit,
}: UtenlandskVirksomhetRowProperties) {
  return (
    <Table.ExpandableRow
      content={
        <div className="-my-4">
          <UtenlandskVirksomhetOppsummering
            definisjon={definisjon}
            virksomhet={virksomhet}
          />
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
