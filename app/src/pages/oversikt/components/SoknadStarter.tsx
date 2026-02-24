import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  Loader,
  VStack,
} from "@navikt/ds-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker.tsx";
import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import {
  listAltinnTilganger,
  opprettSoknadMedKontekst,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";
import { RepresentasjonsKontekst } from "~/utils/sessionStorage.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidsgiverVelger } from "./ArbeidsgiverVelger.tsx";
import { ArbeidstakerVelger } from "./ArbeidstakerVelger.tsx";
import {
  SoknadStarterFormData,
  SoknadStarterOutput,
  soknadStarterSchema,
} from "./soknadStarterSchema.ts";

interface SoknadStarterProps {
  kontekst: RepresentasjonsKontekst;
}

interface SoknadStarterContentProps {
  defaultData: SoknadStarterFormData;
}

/**
 * Søknadsstarter-komponent som lar brukeren velge arbeidsgiver og arbeidstaker
 * før søknad startes.
 *
 * Wrapper-komponent som henter brukerinfo og forbereder defaultValues
 * før SoknadStarterContent rendres.
 */
export function SoknadStarter({ kontekst }: SoknadStarterProps) {
  const { t } = useTranslation();

  const skalHenteArbeidsgivere =
    kontekst.representasjonstype === Representasjonstype.RADGIVER ||
    kontekst.representasjonstype === Representasjonstype.ARBEIDSGIVER;

  // Hent innlogget bruker for DEG_SELV-scenario
  const { data: userInfo, isLoading: isLoadingUserInfo } =
    useQuery(getUserInfo());

  // Hent Altinn-tilganger for RADGIVER/ARBEIDSGIVER
  const { data: arbeidsgivere, isLoading: isLoadingArbeidsgivere } = useQuery({
    ...listAltinnTilganger(),
    enabled: skalHenteArbeidsgivere,
    retry: false,
  });

  // Vent på nødvendig data før vi rendrer skjemaet
  if (
    (kontekst.representasjonstype === Representasjonstype.DEG_SELV &&
      isLoadingUserInfo) ||
    (skalHenteArbeidsgivere && isLoadingArbeidsgivere)
  ) {
    return <Loader size="medium" title={t("felles.laster")} />;
  }

  // Bygg defaultData med representasjonstype og radgiverfirma
  const enesteAltinnArbeidsgiver =
    kontekst.representasjonstype === Representasjonstype.ARBEIDSGIVER &&
    arbeidsgivere?.length === 1
      ? arbeidsgivere[0]
      : undefined;

  const defaultData: SoknadStarterFormData = {
    representasjonstype: kontekst.representasjonstype,
    radgiverfirma: kontekst.radgiverfirma,
    // Setter default skalFylleUtForArbeidstaker:true for rådgiver, siden det er mest vanlig at de fyller ut på vegne av arbeidstaker.
    ...(kontekst.representasjonstype === Representasjonstype.RADGIVER && {
      skalFylleUtForArbeidstaker: true,
    }),
    ...(kontekst.representasjonstype === Representasjonstype.DEG_SELV &&
      userInfo && {
        arbeidstaker: { fnr: userInfo.userId, etternavn: userInfo.name },
      }),
    ...(enesteAltinnArbeidsgiver && {
      arbeidsgiver: {
        orgnr: enesteAltinnArbeidsgiver.orgnr,
        navn: enesteAltinnArbeidsgiver.navn,
      },
    }),
  };

  return <SoknadStarterContent defaultData={defaultData} />;
}

/**
 * Innholdskomponent for søknadsstarter med skjemalogikk.
 */
function SoknadStarterContent({ defaultData }: SoknadStarterContentProps) {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const navigate = useNavigate();

  const formMethods = useForm({
    resolver: zodResolver(soknadStarterSchema),
    defaultValues: defaultData,
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = formMethods;

  const representasjonstype = watch("representasjonstype");
  const forhandsvalgtArbeidsgiver =
    representasjonstype === Representasjonstype.ARBEIDSGIVER
      ? defaultData.arbeidsgiver
      : undefined;

  const opprettSoknadMutation = useMutation({
    mutationFn: opprettSoknadMedKontekst,
    onSuccess: (data) => {
      void navigate({
        to: "/skjema/$id",
        params: { id: data.id },
      });
    },
  });

  // onSubmit er nå triviell - data er allerede OpprettSoknadMedKontekstRequest
  const onSubmit = (data: SoknadStarterOutput) => {
    opprettSoknadMutation.mutate(data);
  };

  // Samle feilmeldinger for visning
  const valideringsfeil: string[] = [];
  if (errors.arbeidsgiver?.message) {
    valideringsfeil.push(
      translateError(errors.arbeidsgiver.message as string) ?? "",
    );
  }
  if (errors.arbeidstaker?.message) {
    valideringsfeil.push(
      translateError(errors.arbeidstaker.message as string) ?? "",
    );
  }

  return (
    <FormProvider {...formMethods}>
      <Box
        background="info-soft"
        borderColor="neutral-subtle"
        borderRadius="2"
        borderWidth="1"
        className="surface-action-subtle"
        padding="space-24"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap="space-24">
            <div>
              <Heading level="2" size="medium" spacing>
                {representasjonstype === Representasjonstype.DEG_SELV
                  ? t("oversiktFelles.soknadStarterTittelDegSelv")
                  : representasjonstype === Representasjonstype.ANNEN_PERSON
                    ? t("oversiktFelles.soknadStarterTittelAnnenPerson")
                    : t("oversiktFelles.soknadStarterTittel")}
              </Heading>
              {representasjonstype === Representasjonstype.ANNEN_PERSON && (
                <BodyLong spacing>
                  {t("oversiktFelles.soknadStarterInfoAnnenPerson")}
                </BodyLong>
              )}
              {(representasjonstype === Representasjonstype.RADGIVER ||
                representasjonstype === Representasjonstype.ARBEIDSGIVER) && (
                <BodyLong spacing>
                  {t("oversiktFelles.soknadStarterInfo")}
                </BodyLong>
              )}
            </div>

            {/* For ANNEN_PERSON: Person først, så arbeidsgiver */}
            {representasjonstype === Representasjonstype.ANNEN_PERSON && (
              <div>
                <ArbeidstakerVelger erAnnenPerson visKunMedFullmakt />
              </div>
            )}

            <div>
              {representasjonstype !== Representasjonstype.DEG_SELV && (
                <Heading level="3" size="medium" spacing>
                  {t("oversiktFelles.arbeidsgiverTittel")}
                </Heading>
              )}
              {representasjonstype === Representasjonstype.DEG_SELV ||
              representasjonstype === Representasjonstype.ANNEN_PERSON ? (
                <OrganisasjonSoker
                  formFieldName="arbeidsgiver"
                  label={t("oversiktFelles.arbeidsgiverOrgnrLabel")}
                />
              ) : forhandsvalgtArbeidsgiver ? (
                <div>
                  <BodyShort size={"medium"} weight="semibold">
                    {forhandsvalgtArbeidsgiver.navn}
                  </BodyShort>
                  <BodyShort size="small">
                    Org.nr: {forhandsvalgtArbeidsgiver.orgnr}
                  </BodyShort>
                </div>
              ) : (
                <ArbeidsgiverVelger formFieldName="arbeidsgiver" />
              )}
            </div>

            {/* For RADGIVER og ARBEIDSGIVER: Arbeidstaker etter arbeidsgiver */}
            {(representasjonstype === Representasjonstype.RADGIVER ||
              representasjonstype === Representasjonstype.ARBEIDSGIVER) && (
              <div>
                <ArbeidstakerVelger />
              </div>
            )}

            {valideringsfeil.length > 0 && (
              <Alert variant="error">
                <Heading level="3" size="small" spacing>
                  {t("oversiktFelles.valideringFeilTittel")}
                </Heading>
                <ul className="list-disc pl-5">
                  {valideringsfeil.map((feil, index) => (
                    <li key={index}>{feil}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {opprettSoknadMutation.isError && (
              <Alert variant="error">
                {t("oversiktFelles.feilVedOpprettelse")}
              </Alert>
            )}

            <Button
              className="w-fit"
              loading={opprettSoknadMutation.isPending}
              type="submit"
              variant="primary"
            >
              {t("oversiktFelles.gaTilSkjemaKnapp")}
            </Button>
          </VStack>
        </form>
      </Box>
    </FormProvider>
  );
}
