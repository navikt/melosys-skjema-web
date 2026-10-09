import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { Button, Heading, LinkCard, VStack } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

/**
nav.no sin mellomside med valget mellom digital innsending og papir.
*/
export const VALG_DIGITAL_ELLER_PAPIR_URL =
  "https://www.nav.no/start/arbeidsgiver/bekreftelse-utsendt-arbeidstaker-eos";

export function VelgSituasjonPage() {
  const { t } = useTranslation();

  return (
    <VStack gap="space-24">
      <Heading className="mt-4" level="1" size="large">
        {t("velgSituasjon.tittel")}
      </Heading>

      <VStack gap="space-16">
        <LinkCard arrowPosition="center">
          <LinkCard.Title as="h2">
            <LinkCard.Anchor asChild>
              <Link to="/representasjon">
                {t("velgSituasjon.utsendtTittel")}
              </Link>
            </LinkCard.Anchor>
          </LinkCard.Title>
          <LinkCard.Description>
            {t("velgSituasjon.utsendtBeskrivelse")}
          </LinkCard.Description>
        </LinkCard>

        <LinkCard arrowPosition="center">
          <LinkCard.Title as="h2">
            <LinkCard.Anchor href={t("velgSituasjon.oppholdLenke")}>
              {t("velgSituasjon.oppholdTittel")}
            </LinkCard.Anchor>
          </LinkCard.Title>
          <LinkCard.Description>
            {t("velgSituasjon.oppholdBeskrivelse")}
          </LinkCard.Description>
        </LinkCard>
      </VStack>

      <div>
        <Button
          as="a"
          href={VALG_DIGITAL_ELLER_PAPIR_URL}
          icon={<ArrowLeftIcon aria-hidden />}
          variant="secondary"
        >
          {t("velgSituasjon.gaTilbake")}
        </Button>
      </div>
    </VStack>
  );
}
