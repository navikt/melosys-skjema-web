import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormSummary,
  InlineMessage,
  Label,
  Modal,
  Table,
  TextField,
} from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { DatePickerFormPart } from "~/components/date/DatePickerFormPart.tsx";
import { EndreKnapp } from "~/components/EndreKnapp.tsx";
import { FjernKnapp } from "~/components/FjernKnapp.tsx";
import { LeggTilKnapp } from "~/components/LeggTilKnapp.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { getFelt, SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";
import { useInvalidateArbeidstakersSkjemaQuery } from "~/hooks/useInvalidateArbeidstakersSkjemaQuery.ts";
import { postFamiliemedlemmer } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  ArbeidstakersSkjemaDto,
  Familiemedlem,
  FamiliemedlemmerDto,
} from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidstakerStegLoader } from "../components/ArbeidstakerStegLoader.tsx";
import {
  familiemedlemmerSchema,
  familiemedlemSchema,
} from "./familiemedlemmerStegSchema.ts";

// Hent felt-definisjoner fra backend (statisk kopi)
const skalHaMedFelt = getFelt("familiemedlemmer", "skalHaMedFamiliemedlemmer");
// Hent familiemedlemmer-feltet direkte for tilgang til leggTilLabel
const familiemedlemmerListeFelt =
  SKJEMA_DEFINISJON_A1.seksjoner.familiemedlemmer.felter.familiemedlemmer;
// Hent elementDefinisjon for familiemedlem-feltene
const elementDef = familiemedlemmerListeFelt.elementDefinisjon;

export const stepKey = "familiemedlemmer";

type FamiliemedlemFormData = z.infer<typeof familiemedlemSchema>;
type FamiliemedlemField = Familiemedlem & { id: string };
type FamiliemedlemmerFormData = z.infer<typeof familiemedlemmerSchema>;

interface FamiliemedlemmerStegContentProps {
  skjema: ArbeidstakersSkjemaDto;
}

function FamiliemedlemmerStegContent({
  skjema,
}: FamiliemedlemmerStegContentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidstakerSkjemaQuery =
    useInvalidateArbeidstakersSkjemaQuery();

  const lagretSkjemadataForSteg = skjema.data?.familiemedlemmer;

  const formMethods = useForm({
    resolver: zodResolver(familiemedlemmerSchema),
    ...(lagretSkjemadataForSteg && { defaultValues: lagretSkjemadataForSteg }),
  });

  const { handleSubmit, control } = formMethods;
  const skalHaMedFamiliemedlemmer = useWatch({
    control,
    name: "skalHaMedFamiliemedlemmer",
  });

  const postFamiliemedlemmerMutation = useMutation({
    mutationFn: (data: FamiliemedlemmerFormData) => {
      return postFamiliemedlemmer(skjema.id, data as FamiliemedlemmerDto);
    },
    onSuccess: () => {
      invalidateArbeidstakerSkjemaQuery(skjema.id);
      const nextStep = getNextStep(stepKey, ARBEIDSTAKER_STEG_REKKEFOLGE);
      if (nextStep) {
        navigate({
          to: nextStep.route,
          params: { id: skjema.id },
        });
      }
    },
    onError: () => {
      toast.error(t("felles.feil"));
    },
  });

  const onSubmit = (data: FamiliemedlemmerFormData) => {
    postFamiliemedlemmerMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
          }}
          nesteKnapp={
            <NesteStegKnapp loading={postFamiliemedlemmerMutation.isPending} />
          }
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            description={skalHaMedFelt.hjelpetekst}
            formFieldName="skalHaMedFamiliemedlemmer"
            legend={skalHaMedFelt.label}
          />

          {skalHaMedFamiliemedlemmer && (
            <>
              <InlineMessage className="mt-4" status="info">
                {t("familiemedlemmerSteg.informasjonOmEgenSoknad")}
              </InlineMessage>
              <FamiliemedlemmerListe />
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

function FamiliemedlemmerListe() {
  const { control } = useFormContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "familiemedlemmer",
  });

  const apneAddModal = () => {
    setIsAddModalOpen(true);
  };

  const lukkAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="mt-4">
      <ValgteFamiliemedlemmer
        familiemedlemmer={fields as Array<FamiliemedlemField>}
        remove={remove}
        update={update}
      />
      <LeggTilKnapp className="mt-2" onClick={apneAddModal}>
        {familiemedlemmerListeFelt.leggTilLabel}
      </LeggTilKnapp>

      <Modal
        header={{
          heading: familiemedlemmerListeFelt.leggTilLabel,
        }}
        onClose={lukkAddModal}
        open={isAddModalOpen}
        width="medium"
      >
        {isAddModalOpen && (
          <LeggTilEllerEndreFamiliemedlemModalContent
            onCancel={lukkAddModal}
            onSubmit={(data) => {
              append(data);
              lukkAddModal();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

interface ValgteFamiliemedlemmerProps {
  familiemedlemmer: Array<FamiliemedlemField>;
  update: (index: number, data: Familiemedlem) => void;
  remove: (index: number) => void;
}

function ValgteFamiliemedlemmer({
  familiemedlemmer,
  update,
  remove,
}: ValgteFamiliemedlemmerProps) {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const lukkEditModal = () => {
    setEditingIndex(null);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
  };

  if (familiemedlemmer.length === 0) {
    return null;
  }

  return (
    <>
      <Label>{familiemedlemmerListeFelt.label}</Label>
      <Table className="max-w-md" size="small">
        <Table.Body>
          {familiemedlemmer.map((familiemedlem, index) => (
            <FamiliemedlemRow
              familiemedlem={familiemedlem}
              key={familiemedlem.id}
              onEdit={() => openEditModal(index)}
              onRemove={() => remove(index)}
            />
          ))}
        </Table.Body>
      </Table>
      <Modal
        header={{
          heading: t("familiemedlemmerSteg.endreFamiliemedlem"),
        }}
        onClose={lukkEditModal}
        open={editingIndex !== null}
        width="medium"
      >
        {editingIndex !== null && (
          <LeggTilEllerEndreFamiliemedlemModalContent
            familiemedlem={familiemedlemmer[editingIndex]}
            onCancel={lukkEditModal}
            onSubmit={(data) => {
              update(editingIndex, data);
              lukkEditModal();
            }}
          />
        )}
      </Modal>
    </>
  );
}

interface LeggTilEllerEndreFamiliemedlemModalContentProps {
  onSubmit: (data: Familiemedlem) => void;
  onCancel: () => void;
  familiemedlem?: Familiemedlem;
}

function LeggTilEllerEndreFamiliemedlemModalContent({
  onSubmit,
  onCancel,
  familiemedlem,
}: LeggTilEllerEndreFamiliemedlemModalContentProps) {
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const modalForm = useForm<FamiliemedlemFormData>({
    resolver: zodResolver(familiemedlemSchema),
    ...(familiemedlem && { defaultValues: familiemedlem }),
  });

  const harNorskFodselsnummerEllerDnummer = useWatch({
    control: modalForm.control,
    name: "harNorskFodselsnummerEllerDnummer",
  });

  const handleSubmit = modalForm.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <FormProvider {...modalForm}>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <TextField
            {...modalForm.register("fornavn")}
            error={translateError(modalForm.formState.errors.fornavn?.message)}
            label={elementDef.fornavn.label}
          />
          <TextField
            {...modalForm.register("etternavn")}
            error={translateError(
              modalForm.formState.errors.etternavn?.message,
            )}
            label={elementDef.etternavn.label}
          />
          <RadioGroupJaNeiFormPart
            formFieldName="harNorskFodselsnummerEllerDnummer"
            legend={elementDef.harNorskFodselsnummerEllerDnummer.label}
          />
          {harNorskFodselsnummerEllerDnummer === false && (
            <DatePickerFormPart
              formFieldName="fodselsdato"
              label={elementDef.fodselsdato.label}
            />
          )}
          {harNorskFodselsnummerEllerDnummer && (
            <TextField
              {...modalForm.register("fodselsnummer")}
              error={translateError(
                modalForm.formState.errors.fodselsnummer?.message,
              )}
              label={elementDef.fodselsnummer.label}
            />
          )}
        </div>
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

interface FamiliemedlemRowProps {
  familiemedlem: FamiliemedlemField;
  onRemove: () => void;
  onEdit: () => void;
}

function FamiliemedlemOppsummering({
  familiemedlem,
}: {
  familiemedlem: FamiliemedlemField;
}) {
  const fields = [
    {
      label: elementDef.fornavn.label,
      value: familiemedlem.fornavn,
    },
    {
      label: elementDef.etternavn.label,
      value: familiemedlem.etternavn,
    },
    {
      label: familiemedlem.harNorskFodselsnummerEllerDnummer
        ? elementDef.fodselsnummer.label
        : elementDef.fodselsdato.label,
      value: familiemedlem.harNorskFodselsnummerEllerDnummer
        ? familiemedlem.fodselsnummer
        : familiemedlem.fodselsdato,
    },
  ];

  return (
    <FormSummary.Answers>
      {fields.map((field, index) => (
        <FormSummary.Answer key={index}>
          <FormSummary.Label>{field.label}</FormSummary.Label>
          <FormSummary.Value>{field.value}</FormSummary.Value>
        </FormSummary.Answer>
      ))}
    </FormSummary.Answers>
  );
}

function FamiliemedlemRow({
  familiemedlem,
  onRemove,
  onEdit,
}: FamiliemedlemRowProps) {
  return (
    <Table.ExpandableRow
      content={
        <div className="-my-4">
          <FamiliemedlemOppsummering familiemedlem={familiemedlem} />
        </div>
      }
    >
      <Table.HeaderCell>
        {familiemedlem.fornavn} {familiemedlem.etternavn}
      </Table.HeaderCell>
      <Table.DataCell style={{ width: "1px", whiteSpace: "nowrap" }}>
        <EndreKnapp onClick={onEdit} size="small" />
        <FjernKnapp onClick={onRemove} size="small" />
      </Table.DataCell>
    </Table.ExpandableRow>
  );
}

interface FamiliemedlemmerStegProps {
  id: string;
}

export function FamiliemedlemmerSteg({ id }: FamiliemedlemmerStegProps) {
  return (
    <ArbeidstakerStegLoader id={id}>
      {(skjema) => <FamiliemedlemmerStegContent skjema={skjema} />}
    </ArbeidstakerStegLoader>
  );
}
