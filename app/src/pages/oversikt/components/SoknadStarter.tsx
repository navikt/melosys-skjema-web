import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  BodyLong,
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

import { getUserInfo, UserInfo } from "~/httpClients/dekoratorenClient.ts";
import { opprettSoknadMedKontekst } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  OpprettSoknadMedKontekstRequest,
  Representasjonstype,
  Skjemadel,
} from "~/types/melosysSkjemaTypes.ts";
import { RepresentasjonsKontekst } from "~/utils/sessionStorage.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidsgiverVelger } from "./ArbeidsgiverVelger.tsx";
import { ArbeidstakerVelger } from "./ArbeidstakerVelger.tsx";
import {
  SoknadStarterFormData,
  soknadStarterSchema,
} from "./soknadStarterSchema.ts";

interface SoknadStarterProps {
  kontekst: RepresentasjonsKontekst;
}

interface SoknadStarterContentProps {
  kontekst: RepresentasjonsKontekst;
  userInfo?: UserInfo;
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

  // Hent innlogget bruker for DEG_SELV-scenario
  const { data: userInfo, isLoading: isLoadingUserInfo } =
    useQuery(getUserInfo());

  // For DEG_SELV, vent på userInfo før vi rendrer skjemaet
  if (
    kontekst.representasjonstype === Representasjonstype.DEG_SELV &&
    isLoadingUserInfo
  ) {
    return <Loader size="medium" title={t("felles.laster")} />;
  }

  return <SoknadStarterContent kontekst={kontekst} userInfo={userInfo} />;
}

/**
 * Innholdskomponent for søknadsstarter med skjemalogikk.
 */
function SoknadStarterContent({
  kontekst,
  userInfo,
}: SoknadStarterContentProps) {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const navigate = useNavigate();

  // Beregn defaultValues basert på kontekst og userInfo (kun for DEG_SELV)
  const lagretSkjemadata =
    kontekst.representasjonstype === Representasjonstype.DEG_SELV && userInfo
      ? ({
          harFullmakt: false,
          arbeidstaker: { fnr: userInfo.userId, etternavn: userInfo.name },
        } as SoknadStarterFormData)
      : undefined;

  const formMethods = useForm({
    resolver: zodResolver(soknadStarterSchema),
    ...(lagretSkjemadata && { defaultValues: lagretSkjemadata }),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const opprettSoknadMutation = useMutation({
    mutationFn: opprettSoknadMedKontekst,
    onSuccess: (data) => {
      void navigate({
        to: "/skjema/$id",
        params: { id: data.id },
      });
    },
  });

  const onSubmit = (data: SoknadStarterFormData) => {
    // Bestem representasjonstype basert på harFullmakt
    let finalRepresentasjonstype: Representasjonstype =
      kontekst.representasjonstype;
    if (data.harFullmakt) {
      if (kontekst.representasjonstype === Representasjonstype.ARBEIDSGIVER) {
        finalRepresentasjonstype =
          Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT;
      } else if (
        kontekst.representasjonstype === Representasjonstype.RADGIVER
      ) {
        finalRepresentasjonstype = Representasjonstype.RADGIVER_MED_FULLMAKT;
      }
    }

    // Bestem skjemadel basert på representasjonstype
    const skjemadel = [
      Representasjonstype.RADGIVER,
      Representasjonstype.ARBEIDSGIVER,
    ].includes(kontekst.representasjonstype)
      ? Skjemadel.ARBEIDSGIVERS_DEL
      : Skjemadel.ARBEIDSTAKERS_DEL;

    const request: OpprettSoknadMedKontekstRequest = {
      representasjonstype: finalRepresentasjonstype,
      radgiverfirma: kontekst.radgiverfirma,
      arbeidsgiver: data.arbeidsgiver!,
      arbeidstaker: data.arbeidstaker!,
      skjemadel,
    };

    opprettSoknadMutation.mutate(request);
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
                {kontekst.representasjonstype === Representasjonstype.DEG_SELV
                  ? t("oversiktFelles.soknadStarterTittelDegSelv")
                  : kontekst.representasjonstype ===
                      Representasjonstype.ANNEN_PERSON
                    ? t("oversiktFelles.soknadStarterTittelAnnenPerson")
                    : t("oversiktFelles.soknadStarterTittel")}
              </Heading>
              {kontekst.representasjonstype ===
                Representasjonstype.ANNEN_PERSON && (
                <BodyLong spacing>
                  {t("oversiktFelles.soknadStarterInfoAnnenPerson")}
                </BodyLong>
              )}
              {(kontekst.representasjonstype === Representasjonstype.RADGIVER ||
                kontekst.representasjonstype ===
                  Representasjonstype.ARBEIDSGIVER) && (
                <BodyLong spacing>
                  {t("oversiktFelles.soknadStarterInfo")}
                </BodyLong>
              )}
            </div>

            {/* For ANNEN_PERSON: Person først, så arbeidsgiver */}
            {kontekst.representasjonstype ===
              Representasjonstype.ANNEN_PERSON && (
              <div>
                <ArbeidstakerVelger erAnnenPerson visKunMedFullmakt />
              </div>
            )}

            <div>
              <ArbeidsgiverVelger kontekst={kontekst} />
            </div>

            {/* For RADGIVER og ARBEIDSGIVER: Arbeidstaker etter arbeidsgiver */}
            {(kontekst.representasjonstype === Representasjonstype.RADGIVER ||
              kontekst.representasjonstype ===
                Representasjonstype.ARBEIDSGIVER) && (
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
