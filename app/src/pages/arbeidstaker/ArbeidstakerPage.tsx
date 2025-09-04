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

export function ArbeidstakerPage() {
  return (
    <Page>
      <Page.Block gutters width="text">
        <VStack as="main" gap="8">
          <GuidePanel poster>
            <Heading level="2" size="medium" spacing>
              Hei, [Navn Navnesen]!
            </Heading>
            <BodyLong spacing>
              Seksjonen GuidePanel brukes til en kort, overordnet veiledning til
              søkeren. Seksjonen henter inn søkerens navn, og gir en komprimert
              forklaring av pengestøtten, tiltaket eller hjelpemiddelet. Denne
              teksten hentes fra ingressen til produktsiden på nav.no.
            </BodyLong>
            <BodyLong>
              Avslutt teksten i seksjonen med en lenke til produktsiden på
              nav.no som åpnes i en ny fane.
            </BodyLong>
          </GuidePanel>
          <div>
            <Heading level="2" size="large" spacing>
              Før du søker
            </Heading>
            <BodyLong spacing>
              Denne seksjonen brukes til å gi søkerne informasjon de vil ha stor
              nytte av før de går i gang med søknaden. Eksempler på nyttig
              informasjon:
            </BodyLong>
            <List>
              <List.Item>
                Oppgaver brukeren må ha gjort før de søker.{" "}
                <i>
                  Du må ha meldt deg som arbeidssøker før du kan søke om
                  dagpenger.
                </i>
              </List.Item>
              <List.Item>
                Dokumentasjon brukeren kan bli bedt om.{" "}
                <i>
                  Noen av opplysningene du gir underveis vil du bli bedt om å
                  dokumentere. Du vil trenge xx og xx for å fullføre denne
                  søknaden.
                </i>
              </List.Item>
              <List.Item>
                Automatisk lagring.{" "}
                <i>
                  Vi lagrer svarene dine (xx timer) mens du fyller ut, så du kan
                  ta pauser underveis.
                </i>
              </List.Item>
              <List.Item>
                Antall steg og estimert tidsbruk.{" "}
                <i>
                  Det er XX steg i søknaden, og du kan regne med å bruke ca. XX
                  minutter.
                </i>
              </List.Item>
              <List.Item>
                Søknadsfrister. <i>Husk at du må søke om xx innen xx dager.</i>
              </List.Item>
              <List.Item>
                Saksbehandlingstider og info om gyldighet, krav osv.{" "}
                <i>
                  Vi bruker ca. xx uker på å behandle søknaden din. Husk at du
                  må sende meldekort xx ofte selv om du ikke har fått svar på
                  søknaden din om dagpenger ennå.
                </i>
              </List.Item>
            </List>
            <BodyLong>
              For annen, utfyllende informasjon om søknaden bør du lenke direkte
              til søknadskapittelet i produktsiden, som{" "}
              <Link href="https://www.nav.no/dagpenger#sok">
                dette eksempelet for dagpenger
              </Link>
              .
            </BodyLong>
          </div>
          <div>
            <Accordion>
              <Accordion.Item>
                <Accordion.Header>
                  Informasjon vi henter om deg
                </Accordion.Header>
                <Accordion.Content>
                  <BodyLong>
                    Her skal det så informasjon om hvor vi vil hente
                    opplysninger om søkeren og hva slags opplysninger vi henter.
                  </BodyLong>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>
                  Hvordan vi behandler personopplysninger
                </Accordion.Header>
                <Accordion.Content>
                  <BodyLong>
                    Her skal det stå informasjon om hvordan vi behandler
                    personopplysningene til søkeren.
                  </BodyLong>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Automatisk saksbehandling</Accordion.Header>
                <Accordion.Content>
                  <BodyLong>
                    Her skal det stå informasjon om hva automatisk behandling
                    er, hva det betyr for søkeren og informasjon om søkerens
                    rettigheter ved automatisk avslag.
                  </BodyLong>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Vi lagrer svar underveis</Accordion.Header>
                <Accordion.Content>
                  <BodyLong>
                    Her skal det stå informasjon om hvordan denne søknaden
                    mellomlagrer informasjonen til søkeren og hvor lenge
                    informasjonen lagres. Vi skal informere om mellomlagring ved
                    både automatisk lagring og ved samtykke til lagring med
                    lagre-knapp.
                  </BodyLong>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
          <div>
            <BodyLong>
              Det er viktig at du gir oss riktige opplysninger slik at vi kan
              behandle saken din.{" "}
              <Link href="https://www.nav.no/endringer">
                Les mer om viktigheten av å gi riktige opplysninger.
              </Link>
            </BodyLong>
            <Box paddingBlock="4 8">
              <Checkbox>
                Jeg bekrefter at jeg vil svare så riktig som jeg kan.
              </Checkbox>
            </Box>
            <Button
              icon={<ArrowRightIcon aria-hidden />}
              iconPosition="right"
              variant="primary"
            >
              Start søknad
            </Button>
          </div>
        </VStack>
      </Page.Block>
      <Env
        languages={[
          { locale: "nb", url: "https://www.nav.no" },
          { locale: "en", url: "https://www.nav.no/en" },
        ]}
      />
    </Page>
  );
}

const MILJO_URL = "https://www.nav.no/dekoratoren";

function Env({ languages }: { languages?: { locale: string; url: string }[] }) {
  return (
    <div
      data-src={`${MILJO_URL}/env?context=privatperson&simple=true${
        languages
          ? `&availableLanguages=[${languages
              .map((language) => JSON.stringify(language))
              .join(",")}]`
          : ""
      }`}
      id="decorator-env"
    />
  );
}
