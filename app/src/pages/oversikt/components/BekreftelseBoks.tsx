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

  const getBekreftelseBoksBulletpointTexts = (): string[] => {
    switch (representasjonstype) {
      case Representasjonstype.DEG_SELV: {
        return [];
      }
      case Representasjonstype.ANNEN_PERSON: {
        return [
          t("oversiktBekreftelse.bekreftAtVilSvareRiktig"),
          t("oversiktBekreftelse.annenPersonInfoBullet2"),
        ];
      }

      case Representasjonstype.ARBEIDSGIVER:
      case Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT: {
        return [
          t("oversiktBekreftelse.bekreftAtVilSvareRiktig"),
          t("oversiktBekreftelse.arbeidsgiverInfoBullet2"),
        ];
      }

      case Representasjonstype.RADGIVER:
      case Representasjonstype.RADGIVER_MED_FULLMAKT: {
        return [
          t("oversiktBekreftelse.bekreftAtVilSvareRiktig"),
          t("oversiktBekreftelse.radgiverInfoBullet2"),
        ];
      }
    }
  };

  const bekreftelseBoksBulletpointTexts = getBekreftelseBoksBulletpointTexts();

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

        {bekreftelseBoksBulletpointTexts.length > 0 && (
          <ul className="list-disc pl-6 space-y-1">
            {bekreftelseBoksBulletpointTexts.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        )}

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
