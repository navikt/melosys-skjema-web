import {
  BodyLong,
  BodyShort,
  Box,
  Checkbox,
  Link,
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

  const bekreftelseTekst = getBekreftelseBoksContentText(representasjonstype);

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
        {/* Infotekst-seksjon */}
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
              <BodyShort size="small">{bekreftelseTekst}</BodyShort>
            </Checkbox>
          )}
        />
      </VStack>
    </Box>
  );
}

function getBekreftelseBoksContentText(
  representasjonstype: Representasjonstype,
): string {
  switch (representasjonstype) {
    case Representasjonstype.DEG_SELV:
    case Representasjonstype.ARBEIDSGIVER: {
      return "Jeg bekrefter at jeg vil svare så riktig som jeg kan";
    }

    case Representasjonstype.ANNEN_PERSON: {
      return "Jeg bekrefter at jeg vil svare så riktig som jeg kan";
    }

    case Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT: {
      return "Jeg bekrefter at jeg vil svare så riktig som jeg kan";
    }

    case Representasjonstype.RADGIVER: {
      return "Jeg bekrefter at jeg vil svare så riktig som jeg kan";
    }

    default: {
      return "Jeg bekrefter at jeg vil svare så riktig som jeg kan";
    }
  }
}
