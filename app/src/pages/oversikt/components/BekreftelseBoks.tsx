import {
  BodyLong,
  Box,
  Checkbox,
  Link,
  List,
  VStack,
} from "@navikt/ds-react";
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

  const bekreftelseBoksBulletpointTextIds =
    getBekreftelseBoksBulletpointTextIds(representasjonstype);
  const bekreftelseCheckboxTextId =
    getBekreftelseCheckboxTextId(representasjonstype);

  return (
    <Box
      background="default"
      borderRadius="12"
      borderWidth="1"
      borderColor="neutral-subtle"
      padding="space-32"
    >
      <VStack gap="space-16">
        <VStack gap="space-8">
          <BodyLong>{t("oversiktBekreftelse.intro")}</BodyLong>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            {t("oversiktBekreftelse.linkText")}
          </Link>
        </VStack>

        {bekreftelseBoksBulletpointTextIds.length > 0 && (
          <List>
            {bekreftelseBoksBulletpointTextIds.map((key) => (
              <List.Item key={key}>{t(key)}</List.Item>
            ))}
          </List>
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
              {t(bekreftelseCheckboxTextId)}
            </Checkbox>
          )}
        />
      </VStack>
    </Box>
  );
}

function getBekreftelseBoksBulletpointTextIds(
  representasjonstype: Representasjonstype,
): string[] {
  switch (representasjonstype) {
    case Representasjonstype.DEG_SELV: {
      return [];
    }
    case Representasjonstype.ANNEN_PERSON: {
      return [
        "oversiktBekreftelse.bekreftAtVilSvareRiktig",
        "oversiktBekreftelse.annenPersonInfoBullet2",
      ];
    }

    case Representasjonstype.ARBEIDSGIVER:
    case Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT: {
      return [
        "oversiktBekreftelse.bekreftAtVilSvareRiktig",
        "oversiktBekreftelse.arbeidsgiverInfoBullet2",
      ];
    }

    case Representasjonstype.RADGIVER:
    case Representasjonstype.RADGIVER_MED_FULLMAKT: {
      return [
        "oversiktBekreftelse.bekreftAtVilSvareRiktig",
        "oversiktBekreftelse.radgiverInfoBullet2",
      ];
    }
  }
}

function getBekreftelseCheckboxTextId(
  representasjonstype: Representasjonstype,
): string {
  switch (representasjonstype) {
    case Representasjonstype.DEG_SELV: {
      return "oversiktBekreftelse.bekreftAtVilSvareRiktig";
    }
    default: {
      return "oversiktBekreftelse.bekreftAtLestOgForstatt";
    }
  }
}
