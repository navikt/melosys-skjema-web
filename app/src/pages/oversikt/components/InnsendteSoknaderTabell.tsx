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
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { getInnsendteSoknaderQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  HentInnsendteSoknaderRequest,
  OpprettSoknadMedKontekstRequest,
  Representasjonstype,
  SorteringsFelt,
  Sorteringsretning,
} from "~/types/melosysSkjemaTypes.ts";

interface InnsendteSoknaderTabellProps {
  kontekst: OpprettSoknadMedKontekstRequest;
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
  kontekst,
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
    representasjonstype: kontekst.representasjonstype,
    radgiverfirmaOrgnr: kontekst.radgiverfirma?.orgnr,
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

  // Skjul hvis 0 resultater (etter loading)
  if (!isLoading && (!data || data.totaltAntall === 0)) {
    return null;
  }

  // Loading state
  if (isLoading) {
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

  // Sikre at data finnes
  if (!data) {
    return null;
  }

  const totaltAntallSider = Math.ceil(data.totaltAntall / data.antallPerSide);

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
              onKeyDown={handleKeyDown}
              onSearchClick={handleSearch}
              placeholder={t("oversiktFelles.historikkSokPlaceholder")}
              size="small"
              value={sokQuery}
              variant="secondary"
            />
          </HStack>
        </HStack>

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
              {kontekst.representasjonstype ===
              Representasjonstype.ANNEN_PERSON ? (
                <>
                  <Table.ColumnHeader sortKey="innsendt_dato" sortable>
                    {t("oversiktFelles.historikkKolonneInnsendt")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>
                    {t("oversiktFelles.historikkKolonneRefnr")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader sortKey="arbeidstaker" sortable>
                    {t("felles.navn")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>
                    {t("oversiktFelles.historikkKolonneFnr")}
                  </Table.ColumnHeader>
                </>
              ) : (
                <>
                  <Table.ColumnHeader sortKey="arbeidsgiver" sortable>
                    {t("oversiktFelles.historikkKolonneVirksomhet")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader sortKey="arbeidstaker" sortable>
                    {t("oversiktFelles.historikkKolonneArbeidstaker")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>
                    {t("oversiktFelles.historikkKolonneFnr")}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader sortKey="innsendt_dato" sortable>
                    {t("oversiktFelles.historikkKolonneInnsendt")}
                  </Table.ColumnHeader>
                </>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.soknader.length === 0 ? (
              <Table.Row>
                <Table.DataCell colSpan={4}>
                  <BodyShort className="text-center p-4">
                    {t("oversiktFelles.historikkIngenResultater")}
                  </BodyShort>
                </Table.DataCell>
              </Table.Row>
            ) : kontekst.representasjonstype ===
              Representasjonstype.ANNEN_PERSON ? (
              data.soknader.map((soknad) => (
                <Table.Row key={soknad.id}>
                  <Table.DataCell>
                    {formatDato(soknad.innsendtDato)}
                  </Table.DataCell>
                  <Table.DataCell>{soknad.referanseId || "-"}</Table.DataCell>
                  <Table.DataCell>
                    {soknad.arbeidstakerNavn || "-"}
                  </Table.DataCell>
                  <Table.DataCell>
                    {soknad.arbeidstakerFnrMaskert || "-"}
                  </Table.DataCell>
                </Table.Row>
              ))
            ) : (
              data.soknader.map((soknad) => (
                <Table.Row key={soknad.id}>
                  <Table.DataCell>
                    {soknad.arbeidsgiverNavn && soknad.arbeidsgiverOrgnr
                      ? `${soknad.arbeidsgiverNavn} (${soknad.arbeidsgiverOrgnr})`
                      : soknad.arbeidsgiverNavn ||
                        soknad.arbeidsgiverOrgnr ||
                        "-"}
                  </Table.DataCell>
                  <Table.DataCell>
                    {soknad.arbeidstakerNavn || "-"}
                  </Table.DataCell>
                  <Table.DataCell>
                    {soknad.arbeidstakerFnrMaskert || "-"}
                  </Table.DataCell>
                  <Table.DataCell>
                    {formatDato(soknad.innsendtDato)}
                  </Table.DataCell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>

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
