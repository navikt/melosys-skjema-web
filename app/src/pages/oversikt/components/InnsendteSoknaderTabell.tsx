import { ExternalLinkIcon } from "@navikt/aksel-icons";
import {
  BodyShort,
  Box,
  Heading,
  HStack,
  Pagination,
  Search,
  Skeleton,
  Table,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { getInnsendteSoknaderQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  HentInnsendteSoknaderRequest,
  Representasjonstype,
  SorteringsFelt,
  Sorteringsretning,
} from "~/types/melosysSkjemaTypes.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";

interface InnsendteSoknaderTabellProps {
  representasjonskontekst: Representasjonskontekst;
}

const ANTALL_PER_SIDE = 5;

// Format dato
const formatDato = (dato: string) => {
  return new Date(dato).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Tabell over innsendte søknader med søk, sortering og paginering.
 */
export function InnsendteSoknaderTabell({
  representasjonskontekst,
}: InnsendteSoknaderTabellProps) {
  const { t } = useTranslation();

  // State management
  const [sokQuery, setSokQuery] = useState("");
  const [aktivtSok, setAktivtSok] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<
    { orderBy: SorteringsFelt; direction: Sorteringsretning } | undefined
  >();

  // Håndter søk når knapp trykkes eller Enter trykkes
  const handleSearch = useCallback(() => {
    setAktivtSok(sokQuery);
    setCurrentPage(1); // Reset til side 1 når søk utføres
  }, [sokQuery]);

  // Håndter nullstilling av søk
  const handleClear = useCallback(() => {
    setSokQuery("");
    setAktivtSok("");
    setCurrentPage(1);
  }, []);

  // Håndter Enter-tast
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch],
  );

  // Bygg request-objekt
  const request: HentInnsendteSoknaderRequest = {
    side: currentPage,
    antall: ANTALL_PER_SIDE,
    sok: aktivtSok || undefined,
    sortering: sort?.orderBy,
    retning: sort?.direction ?? undefined,
    representasjonstype: representasjonskontekst.representasjonstype,
    radgiverfirmaOrgnr: representasjonskontekst.radgiverOrgnr,
  };

  // Hent data
  const { data, isLoading, isError } = useQuery(
    getInnsendteSoknaderQuery(request),
  );

  // Håndter sortering
  const handleSortChange = useCallback((sortKey: string | undefined) => {
    if (!sortKey) return;

    const sorteringsFelt = sortKey.toUpperCase() as SorteringsFelt;

    setSort((prevSort) => ({
      orderBy: sorteringsFelt,
      direction:
        prevSort?.orderBy === sorteringsFelt &&
        prevSort.direction === Sorteringsretning.ASC
          ? Sorteringsretning.DESC
          : Sorteringsretning.ASC,
    }));
    setCurrentPage(1); // Reset til side 1 når sortering endres
  }, []);

  // Håndter sidebytte
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  // Loading state (kun ved første lasting, ikke ved søk med placeholderData)
  if (isLoading && !data) {
    return (
      <Box
        background="neutral-soft"
        borderRadius="2"
        borderWidth="1"
        padding="space-24"
      >
        <VStack gap="space-24">
          <Heading level="2" size="medium">
            {t("oversiktFelles.historikkTittel")}
          </Heading>
          <Skeleton height={300} variant="rectangle" width="100%" />
        </VStack>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box
        background="neutral-soft"
        borderRadius="2"
        borderWidth="1"
        padding="space-24"
      >
        <VStack gap="space-16">
          <Heading level="2" size="medium">
            {t("oversiktFelles.historikkTittel")}
          </Heading>
          <BodyShort>{t("oversiktFelles.historikkFeilmelding")}</BodyShort>
        </VStack>
      </Box>
    );
  }

  // Skjul kun hvis ingen søknader finnes og det ikke er et aktivt søk
  // Når det er et aktivt søk, vis tabellen med "ingen resultater"-melding
  if (!data || (data.totaltAntall === 0 && !aktivtSok)) {
    return null;
  }

  const totaltAntallSider = Math.ceil(data.totaltAntall / data.antallPerSide);

  const isDegSelv =
    representasjonskontekst.representasjonstype ===
    Representasjonstype.DEG_SELV;
  const isAnnenPerson =
    representasjonskontekst.representasjonstype ===
    Representasjonstype.ANNEN_PERSON;
  // DEG_SELV=4, ANNEN_PERSON=5, ARBEIDSGIVER/RADGIVER=6
  const antallKolonner = isDegSelv ? 4 : isAnnenPerson ? 5 : 6;

  return (
    <Box
      background="neutral-soft"
      borderRadius="2"
      borderWidth="1"
      padding="space-24"
    >
      <VStack gap="space-24">
        <Heading level="2" size="medium">
          {t("oversiktFelles.historikkTittel")}
        </Heading>

        <HStack justify="end">
          <HStack gap="space-8">
            <Search
              hideLabel
              label={t("oversiktFelles.historikkSokPlaceholder")}
              onChange={setSokQuery}
              onClear={handleClear}
              onKeyDown={handleKeyDown}
              onSearchClick={handleSearch}
              placeholder={t("oversiktFelles.historikkSokPlaceholder")}
              size="small"
              value={sokQuery}
              variant="secondary"
            />
          </HStack>
        </HStack>

        <div style={{ overflowX: "auto" }}>
          <Table
            onSortChange={handleSortChange}
            size="small"
            sort={
              sort
                ? {
                    orderBy: sort.orderBy.toLowerCase(),
                    direction:
                      sort.direction === Sorteringsretning.ASC
                        ? "ascending"
                        : "descending",
                  }
                : undefined
            }
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader sortKey="innsendt_dato" sortable>
                  {t("oversiktFelles.historikkKolonneInnsendt")}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {t("oversiktFelles.historikkKolonneRefnr")}
                </Table.ColumnHeader>
                <Table.ColumnHeader>
                  {t("oversiktFelles.historikkKolonneArbeidsgiver")}
                </Table.ColumnHeader>
                {!isDegSelv && !isAnnenPerson && (
                  <Table.ColumnHeader sortKey="arbeidstaker" sortable>
                    {t("oversiktFelles.historikkKolonneArbeidstaker")}
                  </Table.ColumnHeader>
                )}
                {!isDegSelv && (
                  <Table.ColumnHeader>
                    {t("oversiktFelles.historikkKolonneFodselsdato")}
                  </Table.ColumnHeader>
                )}
                <Table.ColumnHeader />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.soknader.length === 0 ? (
                <Table.Row>
                  <Table.DataCell colSpan={antallKolonner}>
                    <BodyShort className="text-center p-4">
                      {t("oversiktFelles.historikkIngenResultater")}
                    </BodyShort>
                  </Table.DataCell>
                </Table.Row>
              ) : (
                data.soknader.map((soknad) => (
                  <Table.Row key={soknad.id}>
                    <Table.DataCell>
                      {formatDato(soknad.innsendtDato)}
                    </Table.DataCell>
                    <Table.DataCell>{soknad.referanseId || "-"}</Table.DataCell>
                    <Table.DataCell>
                      {soknad.arbeidsgiverNavn || "-"}
                    </Table.DataCell>
                    {!isDegSelv && !isAnnenPerson && (
                      <Table.DataCell>
                        {soknad.arbeidstakerNavn || "-"}
                      </Table.DataCell>
                    )}
                    {!isDegSelv && (
                      <Table.DataCell>
                        {formatDato(soknad.arbeidstakerFodselsdato)}
                      </Table.DataCell>
                    )}
                    <Table.DataCell>
                      <Link
                        params={{ id: soknad.id }}
                        style={{ color: "var(--a-blue-500)" }}
                        to="/skjema/$id/innsendt"
                      >
                        <ExternalLinkIcon
                          fontSize="1.5rem"
                          title={t("oversiktFelles.historikkSeSkjema")}
                        />
                      </Link>
                    </Table.DataCell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>

        <HStack align="center" justify="space-between">
          <BodyShort className="text-text-subtle" size="small">
            {t("oversiktFelles.historikkAntallTreff", {
              antall: data.totaltAntall,
            })}
          </BodyShort>
          {totaltAntallSider > 1 && (
            <Pagination
              count={totaltAntallSider}
              onPageChange={handlePageChange}
              page={currentPage}
              prevNextTexts
              size="small"
            />
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
