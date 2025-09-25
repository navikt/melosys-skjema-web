import { BodyLong, Heading, Page, VStack } from "@navikt/ds-react";

export function ArbeidstakerSkjema() {
  return (
    <Page>
      <Page.Block gutters width="text">
        <VStack as="main" gap="8">
          <Heading level="1" size="xlarge" spacing>
            Arbeidstaker skjema
          </Heading>
          <BodyLong>
            Dette er et åpent lerret for arbeidstaker-skjemaet.
          </BodyLong>
        </VStack>
      </Page.Block>
    </Page>
  );
}
