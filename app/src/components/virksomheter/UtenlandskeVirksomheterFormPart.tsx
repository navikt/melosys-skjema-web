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
  utenlandskVirksomhetMedAnsettelsesformSchema,
  utenlandskVirksomhetSchema,
} from "~/components/virksomheter/virksomheterSchema.ts";
import {
  Ansettelsesform,
  UtenlandskVirksomhet,
  UtenlandskVirksomhetMedAnsettelsesform,
} from "~/types/melosysSkjemaTypes";
import { useTranslateError } from "~/utils/translation.ts";

type UtenlandskVirksomhetField = (
  | UtenlandskVirksomhet
  | UtenlandskVirksomhetMedAnsettelsesform
) & { id: string };

interface UtenlandskeVirksomheterFormPartProps {
  fieldName: string;
  includeAnsettelsesform?: boolean;
}

export function UtenlandskeVirksomheterFormPart({
  fieldName,
  includeAnsettelsesform = false,
}: UtenlandskeVirksomheterFormPartProps) {
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
            includeAnsettelsesform={includeAnsettelsesform}
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
  update: (
    index: number,
    data: UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform,
  ) => void;
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

  const virksomhetSomRedigeres =
    editingIndex === null ? undefined : virksomheter[editingIndex];
  const includeAnsettelsesform =
    virksomhetSomRedigeres !== undefined &&
    "ansettelsesform" in virksomhetSomRedigeres;

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
            includeAnsettelsesform={includeAnsettelsesform}
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
  onSubmit: (
    data: UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform,
  ) => void;
  onCancel: () => void;
  virksomhet?: UtenlandskVirksomhet | UtenlandskVirksomhetMedAnsettelsesform;
  includeAnsettelsesform: boolean;
}

function LeggTilEllerEndreUtenlandskVirksomhetModalContent({
  onSubmit,
  onCancel,
  virksomhet,
  includeAnsettelsesform,
}: LeggTilEllerEndreUtenlandskVirksomhetModalContentProps) {
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const schema = includeAnsettelsesform
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

          {includeAnsettelsesform && (
            <Controller
              control={modalForm.control}
              name="ansettelsesform"
              render={({ field, fieldState }) => (
                <RadioGroup
                  error={translateError(fieldState.error?.message)}
                  legend={t("utenlandskeVirksomheterFormPart.ansettelsesform")}
                  onChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <Radio value={Ansettelsesform.ARBEIDSTAKER_ELLER_FRILANSER}>
                    {t(
                      "utenlandskeVirksomheterFormPart.arbeidstakerEllerFrilanser",
                    )}
                  </Radio>
                  <Radio value={Ansettelsesform.SELVSTENDIG_NAERINGSDRIVENDE}>
                    {t(
                      "utenlandskeVirksomheterFormPart.selvstendigNaeringsdrivende",
                    )}
                  </Radio>
                  <Radio value={Ansettelsesform.STATSANSATT}>
                    {t("utenlandskeVirksomheterFormPart.statsansatt")}
                  </Radio>
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
