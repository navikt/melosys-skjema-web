import { FunnelIcon, NotePencilDashIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  ExpansionCard,
  GuidePanel,
  Heading,
  HStack,
  Pagination,
  Search,
  Table,
  TextField,
  UNSAFE_Combobox,
  VStack,
} from "@navikt/ds-react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { KontekstBanner } from "~/components/KontekstBanner";
import { OrganisasjonSoker } from "~/components/OrganisasjonSoker";
import type { Organisasjon } from "~/types/representasjon";
import {
  getRepresentasjonKontekst,
  setRepresentasjonKontekst,
} from "~/utils/sessionStorage";

export const Route = createFileRoute("/oversikt")({
  component: OversiktRoute,
  beforeLoad: () => {
    const kontekst = getRepresentasjonKontekst();

    // Redirect til landingsside hvis ingen kontekst er valgt
    if (!kontekst) {
      throw redirect({ to: "/" });
    }

    // Redirect til velg rådgiverfirma hvis RADGIVER men ingen firma valgt
    if (kontekst.type === "RADGIVER" && !kontekst.radgiverfirma) {
      throw redirect({ to: "/representasjon/radgiverfirma" });
    }

    // Redirect til velg person hvis ANNEN_PERSON men ingen person valgt
    if (kontekst.type === "ANNEN_PERSON" && !kontekst.arbeidstaker) {
      throw redirect({ to: "/representasjon/annen-person" });
    }

    return {
      hideSiteTitle: true,
      kontekst,
    };
  },
});

function OversiktRoute() {
  const { t } = useTranslation();
  const { kontekst } = Route.useRouteContext();
  const [sokQuery, setSokQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<
    | {
        orderBy: string;
        direction: "ascending" | "descending";
      }
    | undefined
  >();

  // Burde ikke skje pga beforeLoad guard, men TypeScript vet ikke dette.
  if (!kontekst) return null;

  const handleArbeidsgiverValgt = (organisasjon: Organisasjon) => {
    setRepresentasjonKontekst({
      ...kontekst,
      arbeidsgiver: organisasjon,
    });
  };

  const getTittel = () => {
    switch (kontekst.type) {
      case "DEG_SELV": {
        return t("oversiktDegSelv.tittel");
      }
      case "ARBEIDSGIVER": {
        return t("oversiktArbeidsgiver.tittel");
      }
      case "RADGIVER": {
        return t("oversiktRadgiver.tittel");
      }
      case "ANNEN_PERSON": {
        return t("oversiktAnnenPerson.tittel");
      }
    }
  };

  const getInfoBullets = () => {
    switch (kontekst.type) {
      case "DEG_SELV": {
        return [
          t("oversiktDegSelv.infoBullet1"),
          t("oversiktDegSelv.infoBullet2"),
        ];
      }
      case "ARBEIDSGIVER": {
        return [
          t("oversiktArbeidsgiver.infoBullet1"),
          t("oversiktArbeidsgiver.infoBullet2"),
          t("oversiktArbeidsgiver.infoBullet3"),
          t("oversiktArbeidsgiver.infoBullet4"),
        ];
      }
      case "RADGIVER": {
        return [
          t("oversiktRadgiver.infoBullet1"),
          t("oversiktRadgiver.infoBullet2"),
          t("oversiktRadgiver.infoBullet3"),
          t("oversiktRadgiver.infoBullet4"),
        ];
      }
      case "ANNEN_PERSON": {
        return [
          t("oversiktAnnenPerson.infoBullet1"),
          t("oversiktAnnenPerson.infoBullet2"),
        ];
      }
    }
  };

  const skalSokeEtterArbeidsgiver = () => {
    return kontekst.type === "DEG_SELV" || kontekst.type === "ANNEN_PERSON";
  };

  const skalViseArbeidsgiverVelger = () => {
    return kontekst.type === "RADGIVER";
  };

  const arbeidsgiverErLast = () => {
    return kontekst.type === "ARBEIDSGIVER" && kontekst.arbeidsgiver;
  };

  // Mock data for tabellen (erstattes av faktiske data i senere oppgaver)
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
    <VStack gap="6">
      <KontekstBanner kontekst={kontekst} />

      {/* Informasjonsboks */}
      <GuidePanel poster>
        <Heading level="2" size="small" spacing>
          {getTittel()}
        </Heading>
        <ul className="list-disc pl-6 space-y-1">
          {getInfoBullets().map((bullet, index) => (
            <li key={index}>
              <BodyShort size="small">{bullet}</BodyShort>
            </li>
          ))}
        </ul>
      </GuidePanel>

      {/* Utkast-seksjon (placeholder for MELOSYS-7724) */}
      <ExpansionCard aria-label={t("oversiktFelles.utkastTittel")} size="small">
        <ExpansionCard.Header className="rounded-small">
          <HStack align="center" gap="2">
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
          <BodyShort>{t("oversiktFelles.utkastBeskrivelse")}</BodyShort>
        </ExpansionCard.Content>
      </ExpansionCard>

      {/* Søknadsstarter-boks */}
      <Box
        background={"surface-info-subtle"}
        borderColor="border-subtle"
        borderRadius="small"
        borderWidth="1"
        className={"surface-action-subtle"}
        padding="6"
      >
        <VStack gap="6">
          <div>
            <Heading level="2" size="medium" spacing>
              {t("oversiktFelles.soknadStarterTittel")}
            </Heading>
            <BodyLong spacing>
              {kontekst.type === "DEG_SELV"
                ? t("oversiktFelles.soknadStarterInfoDegSelv")
                : t("oversiktFelles.soknadStarterInfo")}
            </BodyLong>
            {kontekst.type !== "DEG_SELV" && (
              <VStack gap="4">
                <BodyShort>
                  {t("oversiktFelles.soknadStarterFullmaktInfo1")}
                </BodyShort>
                <BodyShort>
                  {t("oversiktFelles.soknadStarterFullmaktInfo2")}
                </BodyShort>
                <BodyShort>
                  {t("oversiktFelles.soknadStarterFullmaktInfo3")}
                </BodyShort>
              </VStack>
            )}
          </div>

          {/* Arbeidsgiver-seksjon */}
          <div>
            <Heading level="3" size="small" spacing>
              {t("oversiktFelles.arbeidsgiverTittel")}
            </Heading>

            {arbeidsgiverErLast() ? (
              <TextField
                label={t("oversiktFelles.arbeidsgiverTittel")}
                readOnly
                value={`${kontekst.arbeidsgiver!.navn}\nOrg.nr: ${kontekst.arbeidsgiver!.orgnr}`}
              />
            ) : (
              <Box
                borderColor="border-info"
                borderWidth="0 0 0 4"
                paddingInline="4"
              >
                {skalSokeEtterArbeidsgiver() ? (
                  <OrganisasjonSoker
                    label={t("velgRadgiverfirma.sokPaVirksomhet")}
                    onOrganisasjonValgt={handleArbeidsgiverValgt}
                  />
                ) : skalViseArbeidsgiverVelger() ? (
                  <div className="w-5/6">
                    <UNSAFE_Combobox
                      description={t("oversiktFelles.arbeidsgiverVelgerInfo")}
                      label={t("oversiktFelles.arbeidsgiverVelgerLabel")}
                      options={[]}
                    />
                  </div>
                ) : null}
              </Box>
            )}
          </div>

          {/* Arbeidstaker-seksjon - kun for ikke-DEG_SELV */}
          {kontekst.type !== "DEG_SELV" && (
            <div>
              <Heading className={"mt-4"} level="3" size="small" spacing>
                {t("oversiktFelles.arbeidstakerTittel")}
              </Heading>

              <Box
                borderColor="border-info"
                borderWidth="0 0 0 4"
                paddingInline="4"
              >
                <VStack gap="6">
                  {/* Med fullmakt */}
                  <div className="w-5/6">
                    <UNSAFE_Combobox
                      description={t(
                        "oversiktFelles.arbeidstakerMedFullmaktPlaceholder",
                      )}
                      label={t("oversiktFelles.arbeidstakerMedFullmaktLabel")}
                      options={[]}
                    />
                  </div>

                  {/* Uten fullmakt */}
                  <VStack gap="2">
                    <Heading level="4" size="xsmall">
                      {t("oversiktFelles.arbeidstakerUtenFullmaktTittel")}
                    </Heading>
                    <HStack align="end" gap="2" wrap={false}>
                      <TextField
                        label={t("oversiktFelles.arbeidstakerFnrLabel")}
                      />
                      <TextField
                        label={t("oversiktFelles.arbeidstakerEtternavnLabel")}
                      />
                      <Button variant="secondary">
                        {t("oversiktFelles.arbeidstakerSokKnapp")}
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            </div>
          )}

          {/* Gå til skjema-knapp */}
          <Button className="w-fit" variant="primary">
            {t("oversiktFelles.gaTilSkjemaKnapp")}
          </Button>
        </VStack>
      </Box>

      {/* Historikk-tabell */}
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
              className={"ml-2"}
              icon={<FunnelIcon aria-hidden />}
              size="small"
              variant={"tertiary"}
            ></Button>
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
            className={"ml-auto mr-auto"}
            count={4}
            onPageChange={setCurrentPage}
            page={currentPage}
            prevNextTexts
            size="small"
          />
        </VStack>
      </Box>
    </VStack>
  );
}
