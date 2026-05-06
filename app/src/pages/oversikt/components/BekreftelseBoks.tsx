import { BodyLong, Box, Checkbox, Link, VStack } from "@navikt/ds-react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

import type { SoknadStarterFormData } from "./soknadStarterSchema.ts";

interface BekreftelseBoksProps {
  representasjonstype: Representasjonstype;
}

export function BekreftelseBoks({ representasjonstype }: BekreftelseBoksProps) {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext<SoknadStarterFormData>();

  const getInfoTekst = (): string | null => {
    switch (representasjonstype) {
      case Representasjonstype.DEG_SELV: {
        return null;
      }
      case Representasjonstype.ANNEN_PERSON: {
        return t("oversiktBekreftelse.annenPersonInfo");
      }
      case Representasjonstype.ARBEIDSGIVER:
      case Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT: {
        return t("oversiktBekreftelse.arbeidsgiverInfo");
      }
      case Representasjonstype.RADGIVER:
      case Representasjonstype.RADGIVER_MED_FULLMAKT: {
        return t("oversiktBekreftelse.radgiverInfo");
      }
    }
  };

  const infoTekst = getInfoTekst();

  return (
    <Box
      background="default"
      borderRadius="12"
      borderWidth="1"
      borderColor="neutral-subtle"
      padding="space-32"
    >
      <VStack gap="space-16">
        <VStack>
          <BodyLong>{t("oversiktBekreftelse.intro")}</BodyLong>
          <Link
            href={t("oversiktBekreftelse.linkUrl")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("oversiktBekreftelse.linkText")}
          </Link>
        </VStack>

        {infoTekst && <BodyLong>{infoTekst}</BodyLong>}

        <Controller
          name="bekreftelse"
          control={control}
          render={({ field }) => (
            <Checkbox
              size="small"
              checked={field.value ?? false}
              error={!!errors.bekreftelse?.message}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.checked)}
            >
              {t("oversiktBekreftelse.bekreftAtVilSvareRiktig")}
            </Checkbox>
          )}
        />
      </VStack>
    </Box>
  );
}
