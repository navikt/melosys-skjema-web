import { FunnelIcon } from "@navikt/aksel-icons";
import {
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  Pagination,
  Search,
  Table,
  VStack,
} from "@navikt/ds-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { RepresentasjonskontekstDto } from "~/types/representasjon";

interface InnsendteSoknaderTabellProps {
  kontekst: RepresentasjonskontekstDto;
}

/**
 * Tabell over innsendte søknader med søk, sortering og paginering.
 *
 * TODO: MELOSYS-7729 vil implementere:
 * - Henting av innsendte søknader fra backend basert på kontekst
 * - Funksjonell søk og filtrering
 * - Real-time sortering
 * - Backend-paginering
 * - Ekspandert innhold med søknadsdetaljer
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function InnsendteSoknaderTabell(_props: InnsendteSoknaderTabellProps) {
  const { t } = useTranslation();
  const [sokQuery, setSokQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<
    | {
        orderBy: string;
        direction: "ascending" | "descending";
      }
    | undefined
  >();

  // Mock data for layout purposes
  const mockData = [
    {
      virksomhet: "Falsk Fabrikk",
      arbeidstaker: "Feit Huskestue",
      fnr: "191289 56437",
    },
    {
      virksomhet: "Falsk Fabrikk",
      arbeidstaker: "Kullsvidd Svin",
      fnr: "010199 300482",
    },
    {
      virksomhet: "Falsk Fabrikk",
      arbeidstaker: "Leif Leifsen",
      fnr: "270155 35424",
    },
  ];

  return (
    <Box
      background="surface-subtle"
      borderRadius="small"
      borderWidth="1"
      padding="6"
    >
      <VStack gap="6">
        <Heading level="2" size="medium">
          {t("oversiktFelles.historikkTittel")}
        </Heading>

        <HStack justify="end">
          <HStack gap="2">
            <Search
              hideLabel
              label={t("oversiktFelles.historikkSokPlaceholder")}
              onChange={setSokQuery}
              placeholder={t("oversiktFelles.historikkSokPlaceholder")}
              size="small"
              value={sokQuery}
              variant="secondary"
            />
          </HStack>
          <Button
            className="ml-2"
            icon={<FunnelIcon aria-hidden />}
            size="small"
            variant="tertiary"
          />
        </HStack>

        <Table
          onSortChange={(sortKey) => {
            if (sortKey) {
              setSort((prevSort) => ({
                orderBy: sortKey,
                direction:
                  prevSort?.orderBy === sortKey &&
                  prevSort.direction === "ascending"
                    ? "descending"
                    : "ascending",
              }));
            }
          }}
          size="small"
          sort={sort}
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader sortKey="virksomhet" sortable>
                {t("oversiktFelles.historikkKolonneVirksomhet")}
              </Table.ColumnHeader>
              <Table.ColumnHeader sortKey="arbeidstaker" sortable>
                {t("oversiktFelles.historikkKolonneArbeidstaker")}
              </Table.ColumnHeader>
              <Table.ColumnHeader sortKey="fnr" sortable>
                {t("oversiktFelles.historikkKolonneFnr")}
              </Table.ColumnHeader>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {mockData.map((row, index) => (
              <Table.ExpandableRow
                content={
                  <div className="p-4">
                    <BodyShort>
                      Ekspandert innhold for {row.arbeidstaker}
                    </BodyShort>
                  </div>
                }
                key={index}
                togglePlacement="right"
              >
                <Table.DataCell>{row.virksomhet}</Table.DataCell>
                <Table.DataCell>{row.arbeidstaker}</Table.DataCell>
                <Table.DataCell>{row.fnr}</Table.DataCell>
              </Table.ExpandableRow>
            ))}
          </Table.Body>
        </Table>

        <Pagination
          className="ml-auto mr-auto"
          count={4}
          onPageChange={setCurrentPage}
          page={currentPage}
          prevNextTexts
          size="small"
        />
      </VStack>
    </Box>
  );
}
