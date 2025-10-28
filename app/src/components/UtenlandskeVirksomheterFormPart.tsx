import { zodResolver } from "@hookform/resolvers/zod";
import {
  BodyShort,
  Box,
  Button,
  Label,
  Modal,
  Tag,
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
import { utenlandskVirksomhetSchema } from "~/components/virksomheterSchema";
import { useTranslateError } from "~/utils/translation.ts";

type UtenlandskVirksomhetFormData = z.infer<typeof utenlandskVirksomhetSchema>;
type UtenlandskVirksomhetField = UtenlandskVirksomhetFormData & { id: string };

interface UtenlandskeVirksomheterSectionProps {
  fieldName: string;
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
      {typedFields.map((field, index) => (
        <UtenlandskVirksomhet
          key={field.id}
          onRemove={() => remove(index)}
          onUpdate={(data) => update(index, data)}
          virksomhet={field}
        />
      ))}
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
    defaultValues: virksomhet || {
      navn: "",
      organisasjonsnummer: "",
      vegnavnOgHusnummer: "",
      bygning: "",
      postkode: "",
      byStedsnavn: "",
      region: "",
      land: "",
      tilhorerSammeKonsern: undefined,
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
      <Box
        background="surface-alt-3-subtle"
        borderRadius="medium"
        className="ml-4"
        padding="space-8"
        style={{
          borderLeft: "4px solid var(--a-border-subtle)",
        }}
      >
        <Tag size="small" variant="info">
          {t("utenlandskeVirksomheterFormPart.utenlandskVirksomhet")}
        </Tag>
        <div className="mt-2">
          <Label size="small">
            {t("utenlandskeVirksomheterFormPart.navnPaVirksomhet")}
          </Label>
          <BodyShort size="small">{virksomhet.navn}</BodyShort>
        </div>
        {virksomhet.organisasjonsnummer && (
          <div className="mt-2">
            <Label size="small">
              {t(
                "utenlandskeVirksomheterFormPart.organisasjonsnummerEllerRegistreringsnummerValgfritt",
              )}
            </Label>
            <BodyShort size="small">{virksomhet.organisasjonsnummer}</BodyShort>
          </div>
        )}
        <div className="mt-2">
          <Label size="small">
            {t("utenlandskeVirksomheterFormPart.vegnavnOgHusnummerEvtPostboks")}
          </Label>
          <BodyShort size="small">{virksomhet.vegnavnOgHusnummer}</BodyShort>
        </div>
        {virksomhet.bygning && (
          <div className="mt-2">
            <Label size="small">
              {t("utenlandskeVirksomheterFormPart.bygningValgfritt")}
            </Label>
            <BodyShort size="small">{virksomhet.bygning}</BodyShort>
          </div>
        )}
        {virksomhet.postkode && (
          <div className="mt-2">
            <Label size="small">
              {t("utenlandskeVirksomheterFormPart.postkodeValgfritt")}
            </Label>
            <BodyShort size="small">{virksomhet.postkode}</BodyShort>
          </div>
        )}
        {virksomhet.byStedsnavn && (
          <div className="mt-2">
            <Label size="small">
              {t("utenlandskeVirksomheterFormPart.byStednavnValgfritt")}
            </Label>
            <BodyShort size="small">{virksomhet.byStedsnavn}</BodyShort>
          </div>
        )}
        {virksomhet.region && (
          <div className="mt-2">
            <Label size="small">
              {t("utenlandskeVirksomheterFormPart.regionValgfritt")}
            </Label>
            <BodyShort size="small">{virksomhet.region}</BodyShort>
          </div>
        )}
        <div className="mt-2">
          <Label size="small">
            {t("utenlandskeVirksomheterFormPart.land")}
          </Label>
          <BodyShort size="small">{virksomhet.land}</BodyShort>
        </div>
        <div className="mt-2">
          <Label size="small">
            {t(
              "utenlandskeVirksomheterFormPart.tilhorerVirksomhetenSammeKonsernSomDenNorskeArbeidsgiveren",
            )}
          </Label>
          <BodyShort size="small">
            {virksomhet.tilhorerSammeKonsern ? t("felles.ja") : t("felles.nei")}
          </BodyShort>
        </div>
        <EndreKnapp className="mt-2" onClick={apneModal} size="small" />
        <FjernKnapp className="mt-2" onClick={onRemove} size="small" />
      </Box>

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
