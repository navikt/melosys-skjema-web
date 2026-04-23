import {
  BodyLong,
  BodyShort,
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
      background="neutral-soft"
      borderRadius="2"
      borderWidth="1"
      borderColor="info"
      padding="space-24"
      style={{
        borderLeft: "4px solid var(--a-blue-500)",
      }}
    >
      <VStack gap="space-24">
        <div>
          <BodyLong spacing>
            {t(
              "oversiktFelles.bekreftelserInfo",
              "Det er viktig at du gir oss riktige opplysninger slik at vi kan behandle saken din.",
            )}
          </BodyLong>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            {t(
              "oversiktFelles.bekreftelserLenke",
              "Les mer om viktigheten av å gi riktige opplysninger.",
            )}
          </Link>
        </div>

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
              checked={field.value ?? false}
              error={!!errors.bekreftelse?.message}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.target.checked)}
            >
              <BodyShort size="small">{t(bekreftelseCheckboxTextId)}</BodyShort>
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
