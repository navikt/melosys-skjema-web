import { zodResolver } from "@hookform/resolvers/zod";
import { BodyShort, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker.tsx";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

import {
  RadgiverfirmaFormData,
  radgiverfirmaSchema,
} from "./radgiverfirmaSchema.ts";

export function VelgRadgiverfirmaPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formMethods = useForm({
    resolver: zodResolver(radgiverfirmaSchema),
  });

  const velgRadgiverfirma = (data: RadgiverfirmaFormData): void => {
    void navigate({
      to: "/oversikt",
      search: {
        kontekst: Representasjonstype.RADGIVER,
        radgiverOrgnr: data.radgiverfirma.orgnr,
      },
    });
  };

  const handleAvbryt = (): void => {
    void navigate({ to: "/" });
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(velgRadgiverfirma)}>
        <VStack className="mt-8" gap="space-24">
          <Heading level="1" size="medium">
            {t("velgRadgiverfirma.tittel")}
          </Heading>

          <BodyShort>{t("velgRadgiverfirma.informasjon")}</BodyShort>

          <OrganisasjonSoker
            autoFocus
            formFieldName="radgiverfirma"
            label={t("velgRadgiverfirma.sokPaVirksomhet")}
          />

          <HStack className="mt-4" gap="space-16" justify="end">
            <Button
              onClick={handleAvbryt}
              size="medium"
              type="button"
              variant="secondary"
            >
              {t("felles.avbryt")}
            </Button>
            <Button size="medium" type="submit">
              {t("velgRadgiverfirma.ok")}
            </Button>
          </HStack>
        </VStack>
      </form>
    </FormProvider>
  );
}
