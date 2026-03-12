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
import { StegKey } from "~/constants/stegKeys.ts";
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postFamiliemedlemmer,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import type { StegRekkefolgeItem } from "~/pages/skjema/components/Fremgangsindikator.tsx";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import {
  Familiemedlem,
  FamiliemedlemmerDto,
  Skjemadel,
} from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getFamiliemedlemmer } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import {
  familiemedlemmerSchema,
  familiemedlemSchema,
} from "./familiemedlemmerStegSchema.ts";

type FamiliemedlemFormData = z.infer<typeof familiemedlemSchema>;
type FamiliemedlemField = Familiemedlem & { id: string };
type FamiliemedlemmerFormData = z.infer<typeof familiemedlemmerSchema>;

function FamiliemedlemmerStegContent({
  skjemaId,
  stegData,
  stegRekkefolge,
}: {
  skjemaId: string;
  stegData?: FamiliemedlemmerDto;
  stegRekkefolge: StegRekkefolgeItem[];
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const invalidateArbeidstakerSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();
  const skalHaMedFelt = getFelt(
    "familiemedlemmer",
    "skalHaMedFamiliemedlemmer",
  );

  const formMethods = useForm({
    resolver: zodResolver(familiemedlemmerSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const { handleSubmit, control } = formMethods;
  const skalHaMedFamiliemedlemmer = useWatch({
    control,
    name: "skalHaMedFamiliemedlemmer",
  });

  const postFamiliemedlemmerMutation = useMutation({
    mutationFn: (data: FamiliemedlemmerFormData) => {
      return postFamiliemedlemmer(skjemaId, data as FamiliemedlemmerDto);
    },
    onSuccess: () => {
      invalidateArbeidstakerSkjemaQuery(skjemaId);
      const nextStep = getNextStep(StegKey.FAMILIEMEDLEMMER, stegRekkefolge);
      if (nextStep) {
        navigate({
          to: nextStep.route,
          params: { id: skjemaId },
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
            stepKey: StegKey.FAMILIEMEDLEMMER,
            stegRekkefolge: stegRekkefolge,
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
  const { getSeksjon } = useSkjemaDefinisjon();
  const familiemedlemmerListeFelt =
    getSeksjon("familiemedlemmer").felter.familiemedlemmer;

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
  const { getSeksjon } = useSkjemaDefinisjon();
  const familiemedlemmerListeFelt =
    getSeksjon("familiemedlemmer").felter.familiemedlemmer;

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
  const { getSeksjon } = useSkjemaDefinisjon();
  const elementDef =
    getSeksjon("familiemedlemmer").felter.familiemedlemmer.elementDefinisjon;

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
  const { getSeksjon } = useSkjemaDefinisjon();
  const elementDef =
    getSeksjon("familiemedlemmer").felter.familiemedlemmer.elementDefinisjon;

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
      {fields.map((field) => (
        <FormSummary.Answer key={field.label}>
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

export function FamiliemedlemmerSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader
      allowedSkjemadeler={[
        Skjemadel.ARBEIDSTAKERS_DEL,
        Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
      ]}
      id={id}
      skjemaQuery={getSkjemaQuery}
    >
      {(skjema) => {
        const { skjemadel } = skjema.metadata;
        return (
          <FamiliemedlemmerStegContent
            skjemaId={skjema.id}
            stegData={getFamiliemedlemmer(skjema)}
            stegRekkefolge={STEG_REKKEFOLGE[skjemadel]}
          />
        );
      }}
    </SkjemaStegLoader>
  );
}
