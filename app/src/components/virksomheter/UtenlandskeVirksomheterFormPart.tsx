import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ExpansionCard,
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

// Midlertidig switch for å kunne vise frem to forskjellige alternativer av visning av valgte virksomheter
// Denne fjernes og vi lander på ett av alternativene før merging til main
const useTableView = true;

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: fieldName,
  });

  const typedFields = fields as Array<UtenlandskVirksomhetField>;

  const apneModal = () => {
    setIsModalOpen(true);
  };

  const lukkModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Label className="mt-4">Utenlandske virksomheter</Label>
      {
        // Denne conditionalen er kun midlertidig for å kunne demonstrere to alternative visninger
        useTableView ? (
          <Table size="small">
            {typedFields.map((field, index) => (
              <UtenlandskVirksomhetRow
                key={field.id}
                onRemove={() => remove(index)}
                onUpdate={(data) => update(index, data)}
                virksomhet={field}
              />
            ))}
          </Table>
        ) : (
          typedFields.map((field, index) => (
            <UtenlandskVirksomhet
              key={field.id}
              onRemove={() => remove(index)}
              onUpdate={(data) => update(index, data)}
              virksomhet={field}
            />
          ))
        )
      }
      <LeggTilKnapp onClick={apneModal}>
        {t("utenlandskeVirksomheterFormPart.leggTilUtenlandskVirksomhet")}
      </LeggTilKnapp>
      <Modal
        header={{
          heading: t(
            "utenlandskeVirksomheterFormPart.leggTilUtenlandskVirksomhet",
          ),
        }}
        onClose={lukkModal}
        open={isModalOpen}
        width="medium"
      >
        {isModalOpen && (
          <LeggTilEllerEndreUtenlandskVirksomhetModalContent
            onCancel={lukkModal}
            onSubmit={append}
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

interface UtenlandskVirksomhetProps {
  virksomhet: UtenlandskVirksomhetFormData;
  onRemove: () => void;
  onUpdate: (data: UtenlandskVirksomhetFormData) => void;
}

function UtenlandskVirksomhet({
  virksomhet,
  onRemove,
  onUpdate,
}: UtenlandskVirksomhetProps) {
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
        aria-label={`${t("felles.valgtVirksomhet")}: ${virksomhet.navn}`}
        size="small"
      >
        <ExpansionCard.Header>
          <ExpansionCard.Title size="small">
            {virksomhet.navn}
          </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <UtenlandskVirksomhetOppsummering virksomhet={virksomhet} />
        </ExpansionCard.Content>
        <EndreKnapp className="mt-1" onClick={apneModal} size="small" />
        <FjernKnapp className="mt-1" onClick={onRemove} size="small" />
      </ExpansionCard>

      <Modal
        header={{
          heading: t(
            "utenlandskeVirksomheterFormPart.endreUtenlandskVirksomhet",
          ),
        }}
        onClose={lukkModal}
        open={isModalOpen}
        width="medium"
      >
        {isModalOpen && (
          <LeggTilEllerEndreUtenlandskVirksomhetModalContent
            onCancel={lukkModal}
            onSubmit={onUpdate}
            virksomhet={virksomhet}
          />
        )}
      </Modal>
    </>
  );
}

function UtenlandskVirksomhetRow({
  virksomhet,
  onRemove,
  onUpdate,
}: UtenlandskVirksomhetProps) {
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
      <Table.ExpandableRow
        content={
          <div className="-my-4">
            <UtenlandskVirksomhetOppsummering virksomhet={virksomhet} />
          </div>
        }
      >
        <Table.HeaderCell>{virksomhet.navn}</Table.HeaderCell>
        <Table.DataCell>
          <EndreKnapp onClick={apneModal} size="small" />
          <FjernKnapp onClick={onRemove} size="small" />
        </Table.DataCell>
      </Table.ExpandableRow>
      <Modal
        header={{
          heading: t(
            "utenlandskeVirksomheterFormPart.endreUtenlandskVirksomhet",
          ),
        }}
        onClose={lukkModal}
        open={isModalOpen}
        width="medium"
      >
        {isModalOpen && (
          <LeggTilEllerEndreUtenlandskVirksomhetModalContent
            onCancel={lukkModal}
            onSubmit={onUpdate}
            virksomhet={virksomhet}
          />
        )}
      </Modal>
    </>
  );
}
