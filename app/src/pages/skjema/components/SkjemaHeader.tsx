import { Bleed, Heading, Show, Stack, VStack } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { ApplicationPictogram } from "~/assets/ApplicationPictogram.tsx";

export function SkjemaHeader() {
  const { t } = useTranslation();
  return (
    <Bleed data-aksel-template="form-intropage-v2" marginInline={{ lg: "24" }}>
      <Stack
        align="center"
        direction={{ sm: "row-reverse", lg: "row" }}
        gap="6"
        justify={{ sm: "space-between", lg: "start" }}
        wrap={false}
      >
        <Show above="sm">
          <ApplicationPictogram />
        </Show>
        <VStack gap="1">
          <Heading level="1" size="xlarge">
            {t("soknadHeader.soknadForUtsendtArbeidstakerInnenEuEosOgSveits")}
          </Heading>
        </VStack>
      </Stack>
    </Bleed>
  );
}
