import { ArrowRightIcon } from "@navikt/aksel-icons";
import {
  Accordion,
  BodyLong,
  Box,
  Button,
  Checkbox,
  GuidePanel,
  Heading,
  Link,
  List,
  Page,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";

interface SkjemaVeiledningProps {
  onStartSoknad: () => void;
}

export function SkjemaVeiledning({ onStartSoknad }: SkjemaVeiledningProps) {
  const { t } = useTranslation();

  const userInfo = useQuery(getUserInfo());

  return (
    <Page>
      <Page.Block gutters width="text">
        <VStack as="main" gap="space-32">
          <GuidePanel poster>
            <Heading level="2" size="medium" spacing>
              {t("skjemaVeiledning.hei")}, {userInfo.data?.name}
            </Heading>
            <BodyLong spacing>
              {t("skjemaVeiledning.guidePanelTekst1")}
            </BodyLong>
            <BodyLong>{t("skjemaVeiledning.guidePanelTekst2")}</BodyLong>
          </GuidePanel>
          <div>
            <Heading level="2" size="large" spacing>
              {t("skjemaVeiledning.forDuSoker")}
            </Heading>
            <BodyLong spacing>
              {t("skjemaVeiledning.denneSeksjonenBrukesTil")}
            </BodyLong>
            <List>
              <List.Item>
                {t("skjemaVeiledning.oppgaverBrukerenMaHaGjort")}{" "}
                <i>{t("skjemaVeiledning.duMaHaMeldtDegSomArbeidssøker")}</i>
              </List.Item>
              <List.Item>
                {t("skjemaVeiledning.dokumentasjonBrukerenKanBliBedtOm")}{" "}
                <i>
                  {t("skjemaVeiledning.noenAvOpplysningeneViBeOmDokumentation")}
                </i>
              </List.Item>
              <List.Item>
                {t("skjemaVeiledning.automatiskLagring")}{" "}
                <i>{t("skjemaVeiledning.viLagrerSvarene")}</i>
              </List.Item>
              <List.Item>
                {t("skjemaVeiledning.antallStegOgEstimertTidsbruk")}{" "}
                <i>{t("skjemaVeiledning.detErXXStegISoknaden")}</i>
              </List.Item>
              <List.Item>
                {t("skjemaVeiledning.soknadsfrist")}{" "}
                <i>{t("skjemaVeiledning.huskAtDuMaSokeOmXX")}</i>
              </List.Item>
              <List.Item>
                {t("skjemaVeiledning.saksbehandlingstiderOgInfo")}{" "}
                <i>{t("skjemaVeiledning.viBrukerCaXXUker")}</i>
              </List.Item>
            </List>
            <BodyLong>
              {t("skjemaVeiledning.forAnnenUtfyllendeInformasjon")}{" "}
              <Link href="https://www.nav.no/dagpenger#sok">
                {t("skjemaVeiledning.detteEksempeletForDagpenger")}
              </Link>
              .
            </BodyLong>
          </div>
          <div>
            <Accordion>
              <Accordion.Item>
                <Accordion.Header>
                  {t("skjemaVeiledning.informasjonViHenterOmDeg")}
                </Accordion.Header>
                <Accordion.Content>
                  <BodyLong>
                    {t("skjemaVeiledning.herSkalDetStaInformasjonOmHvorVi")}
                  </BodyLong>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>
                  {t("skjemaVeiledning.hvordanViBehandlerPersonopplysninger")}
                </Accordion.Header>
                <Accordion.Content>
                  <BodyLong>
                    {t("skjemaVeiledning.herSkalDetStaInformasjonOmHvordanVi")}
                  </BodyLong>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>
                  {t("skjemaVeiledning.automatiskSaksbehandling")}
                </Accordion.Header>
                <Accordion.Content>
                  <BodyLong>
                    {t(
                      "skjemaVeiledning.herSkalDetStaInformasjonOmHvaAutomatisk",
                    )}
                  </BodyLong>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>
                  {t("skjemaVeiledning.viLagrerSvarUnderveis")}
                </Accordion.Header>
                <Accordion.Content>
                  <BodyLong>
                    {t(
                      "skjemaVeiledning.herSkalDetStaInformasjonOmHvordanDenne",
                    )}
                  </BodyLong>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
          <div>
            <BodyLong>
              {t("skjemaVeiledning.detErViktigAtDuGirOss")}{" "}
              <Link href="https://www.nav.no/endringer">
                {t("skjemaVeiledning.lesMerOmViktigheten")}
              </Link>
            </BodyLong>
            <Box paddingBlock="space-16 space-32">
              <Checkbox>{t("skjemaVeiledning.jegBekrefter")}</Checkbox>
            </Box>
            <Button
              icon={<ArrowRightIcon aria-hidden />}
              iconPosition="right"
              onClick={onStartSoknad}
              variant="primary"
            >
              {t("felles.startSoknad")}
            </Button>
          </div>
        </VStack>
      </Page.Block>
    </Page>
  );
}
