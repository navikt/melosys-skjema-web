import { ChevronRightIcon, NotePencilDashIcon } from "@navikt/aksel-icons";
import {
  BodyShort,
  Box,
  ExpansionCard,
  Heading,
  HStack,
  Skeleton,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { getUtkastQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  OpprettSoknadMedKontekstRequest,
  Representasjonstype,
} from "~/types/melosysSkjemaTypes.ts";

interface UtkastListeProps {
  kontekst: OpprettSoknadMedKontekstRequest;
}

const formatDato = (dato: string) => {
  return new Date(dato).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Utkast/påbegynte søknader komponent.
 * Viser liste over påbegynte søknader basert på kontekst.
 * Skjules hvis det ikke finnes noen utkast.
 */
export function UtkastListe({ kontekst }: UtkastListeProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery(getUtkastQuery(kontekst));

  // Skjul komponenten hvis det er 0 utkast (etter at data er lastet)
  if (!isLoading && (!data || data.antall === 0)) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <ExpansionCard aria-label={t("oversiktFelles.utkastTittel")} size="small">
        <ExpansionCard.Header className="rounded-small">
          <HStack align="center" gap="space-8">
            <NotePencilDashIcon
              aria-hidden
              className="text-surface-action"
              fontSize="2rem"
            />
            <Heading level="3" size="small">
              {t("oversiktFelles.utkastTittel")}
            </Heading>
          </HStack>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <Skeleton height={100} variant="rectangle" width="100%" />
        </ExpansionCard.Content>
      </ExpansionCard>
    );
  }

  // Error state - vis likevel komponenten men med feilmelding
  if (isError) {
    return (
      <ExpansionCard aria-label={t("oversiktFelles.utkastTittel")} size="small">
        <ExpansionCard.Header className="rounded-small">
          <HStack align="center" gap="space-8">
            <NotePencilDashIcon
              aria-hidden
              className="text-surface-action"
              fontSize="2rem"
            />
            <Heading level="3" size="small">
              {t("oversiktFelles.utkastTittel")}
            </Heading>
          </HStack>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <BodyShort>{t("oversiktFelles.utkastFeilmelding")}</BodyShort>
        </ExpansionCard.Content>
      </ExpansionCard>
    );
  }

  // Sikre at data finnes før vi bruker den
  if (!data) {
    return null;
  }

  const utkast = data.utkast;

  return (
    <ExpansionCard
      aria-label={`${t("oversiktFelles.utkastTittel")} (${data.antall})`}
      size="small"
    >
      <ExpansionCard.Header className="rounded-small">
        <HStack align="center" gap="space-8">
          <NotePencilDashIcon
            aria-hidden
            className="text-surface-action"
            fontSize="2rem"
          />
          <Heading level="3" size="small">
            {t("oversiktFelles.utkastTittel")} ({data.antall})
          </Heading>
        </HStack>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VStack gap="space-12">
          <BodyShort>{t("oversiktFelles.utkastBeskrivelse")}</BodyShort>

          <VStack as="ul" className="list-none p-0" gap="space-8">
            {utkast.map((item) => (
              <li key={item.id}>
                <Box
                  borderRadius="4"
                  className="hover:bg-surface-action-subtle-hover border border-border-subtle transition-colors cursor-pointer"
                  onClick={() =>
                    navigate({ to: "/skjema/$id", params: { id: item.id } })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate({ to: "/skjema/$id", params: { id: item.id } });
                    }
                  }}
                  padding="space-16"
                  role="button"
                  tabIndex={0}
                >
                  <HStack align="center" gap="space-16" justify="space-between">
                    <VStack className="flex-1" gap="space-8">
                      {kontekst.representasjonstype !==
                        Representasjonstype.DEG_SELV && (
                        <div>
                          <BodyShort className="text-text-subtle" size="small">
                            {t("oversiktFelles.utkastArbeidsgiver")}
                          </BodyShort>
                          <BodyShort weight="semibold">
                            {item.arbeidsgiverNavn && item.arbeidsgiverOrgnr
                              ? `${item.arbeidsgiverNavn} (${item.arbeidsgiverOrgnr})`
                              : item.arbeidsgiverNavn ||
                                item.arbeidsgiverOrgnr ||
                                "-"}
                          </BodyShort>
                        </div>
                      )}
                      <div>
                        <BodyShort className="text-text-subtle" size="small">
                          {t("oversiktFelles.utkastArbeidstaker")}
                        </BodyShort>
                        <BodyShort weight="semibold">
                          {item.arbeidstakerFnrMaskert || "-"}
                        </BodyShort>
                      </div>
                      <HStack gap="space-16">
                        <div>
                          <BodyShort className="text-text-subtle" size="small">
                            {t("oversiktFelles.utkastOpprettet")}
                          </BodyShort>
                          <BodyShort size="small">
                            {formatDato(item.opprettetDato)}
                          </BodyShort>
                        </div>
                        <div>
                          <BodyShort className="text-text-subtle" size="small">
                            {t("oversiktFelles.utkastSistEndret")}
                          </BodyShort>
                          <BodyShort size="small">
                            {formatDato(item.sistEndretDato)}
                          </BodyShort>
                        </div>
                      </HStack>
                    </VStack>
                    <ChevronRightIcon
                      aria-hidden
                      className="text-text-subtle"
                      fontSize="1.5rem"
                    />
                  </HStack>
                </Box>
              </li>
            ))}
          </VStack>
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
