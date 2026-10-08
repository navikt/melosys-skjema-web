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
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker.tsx";
import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import {
  getOrganisasjonMedJuridiskEnhetQuery,
  listAltinnTilganger,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { useGaTilSkjemaStart } from "~/pages/skjema/nySoknad.ts";
import {
  OrganisasjonDto,
  Representasjonstype,
} from "~/types/melosysSkjemaTypes.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidsgiverVelger } from "./ArbeidsgiverVelger.tsx";
import { ArbeidstakerVelger } from "./ArbeidstakerVelger.tsx";
import {
  SoknadStarterFormData,
  SoknadStarterOutput,
  soknadStarterSchema,
} from "./soknadStarterSchema.ts";

interface SoknadStarterProperties {
  representasjonskontekst: Representasjonskontekst;
}

interface SoknadStarterContentProperties {
  defaultData: SoknadStarterFormData;
  altinnArbeidsgivere: OrganisasjonDto[];
  initialArbeidsgiverOrgnr?: string;
}

/**
 * Søknadsstarter-komponent som lar brukeren velge arbeidsgiver og arbeidstaker
 * før søknad startes.
 *
 * Wrapper-komponent som henter brukerinfo og forbereder defaultValues
 * før SoknadStarterContent rendres.
 */
export function SoknadStarter({
  representasjonskontekst,
}: SoknadStarterProperties) {
  const { t } = useTranslation();

  const skalHenteArbeidsgivere =
    representasjonskontekst.representasjonstype ===
      Representasjonstype.RADGIVER ||
    representasjonskontekst.representasjonstype ===
      Representasjonstype.ARBEIDSGIVER;

  // Hent innlogget bruker for DEG_SELV-scenario
  const { data: userInfo, isLoading: isLoadingUserInfo } =
    useQuery(getUserInfo());

  // Hent Altinn-tilganger for RADGIVER/ARBEIDSGIVER
  const {
    data: arbeidsgivere,
    isLoading: isLoadingArbeidsgivere,
    isError: isErrorArbeidsgivere,
  } = useQuery({
    ...listAltinnTilganger(),
    enabled: skalHenteArbeidsgivere,
    retry: false,
  });

  // Slå opp rådgiverfirma-navn for RADGIVER-representasjonskontekst
  const { data: radgiverOrganisasjon, isLoading: isLoadingRadgiver } = useQuery(
    {
      ...getOrganisasjonMedJuridiskEnhetQuery(
        representasjonskontekst.radgiverOrgnr ?? "",
      ),
      enabled:
        representasjonskontekst.representasjonstype ===
          Representasjonstype.RADGIVER &&
        !!representasjonskontekst.radgiverOrgnr,
    },
  );

  // Vent på nødvendig data før vi rendrer skjemaet
  if (
    (isLoadingUserInfo &&
      representasjonskontekst.representasjonstype ===
        Representasjonstype.DEG_SELV) ||
    (isLoadingArbeidsgivere && skalHenteArbeidsgivere) ||
    (isLoadingRadgiver &&
      representasjonskontekst.representasjonstype ===
        Representasjonstype.RADGIVER)
  ) {
    return <Loader size="medium" title={t("felles.laster")} />;
  }

  // Feil mot Altinn uten cachede arbeidsgivere: vis feil i stedet for tom velger.
  if (
    skalHenteArbeidsgivere &&
    isErrorArbeidsgivere &&
    (arbeidsgivere?.length ?? 0) === 0
  ) {
    return (
      <Alert variant="error">
        {t("oversiktFelles.feilVedHentingAvArbeidsgivere")}
      </Alert>
    );
  }

  // Bygg radgiverfirma-objekt fra API-oppslag
  const radgiverfirma =
    radgiverOrganisasjon &&
    representasjonskontekst.representasjonstype ===
      Representasjonstype.RADGIVER &&
    representasjonskontekst.radgiverOrgnr
      ? {
          orgnr: radgiverOrganisasjon.juridiskEnhet.orgnr,
          navn: radgiverOrganisasjon.juridiskEnhet.navn ?? "",
        }
      : undefined;

  const defaultData: SoknadStarterFormData = {
    representasjonstype: representasjonskontekst.representasjonstype,
    radgiverfirma,
    // Setter default skalFylleUtForArbeidstaker:true for rådgiver, siden det er mest vanlig at de fyller ut på vegne av arbeidstaker.
    ...(representasjonskontekst.representasjonstype ===
      Representasjonstype.RADGIVER && {
      skalFylleUtForArbeidstaker: true,
    }),
    ...(representasjonskontekst.representasjonstype ===
      Representasjonstype.DEG_SELV &&
      userInfo && {
        arbeidstaker: { fnr: userInfo.userId, etternavn: userInfo.name },
      }),
  };

  return (
    <SoknadStarterContent
      altinnArbeidsgivere={arbeidsgivere ?? []}
      defaultData={defaultData}
      initialArbeidsgiverOrgnr={representasjonskontekst.arbeidsgiverOrgnr}
      key={`${representasjonskontekst.representasjonstype}-${representasjonskontekst.radgiverOrgnr ?? ""}-${representasjonskontekst.arbeidsgiverOrgnr ?? ""}`}
    />
  );
}

/**
 * Innholdskomponent for søknadsstarter med skjemalogikk.
 */
function SoknadStarterContent({
  defaultData,
  altinnArbeidsgivere,
  initialArbeidsgiverOrgnr,
}: SoknadStarterContentProperties) {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const gaTilSkjemaStart = useGaTilSkjemaStart();

  const formMethods = useForm({
    resolver: zodResolver(soknadStarterSchema),
    defaultValues: defaultData,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = formMethods;

  const representasjonstype = useWatch({
    control,
    name: "representasjonstype",
  });
  const forhandsvalgtArbeidsgiver =
    representasjonstype === Representasjonstype.ARBEIDSGIVER &&
    altinnArbeidsgivere.length === 1
      ? altinnArbeidsgivere[0]
      : undefined;

  if (forhandsvalgtArbeidsgiver) {
    setValue("arbeidsgiver", {
      orgnr: forhandsvalgtArbeidsgiver.orgnr,
      navn: forhandsvalgtArbeidsgiver.navn,
    });
  }

  function renderArbeidsgiverValg() {
    if (
      representasjonstype === Representasjonstype.DEG_SELV ||
      representasjonstype === Representasjonstype.ANNEN_PERSON
    ) {
      return (
        <OrganisasjonSoker
          formFieldName="arbeidsgiver"
          initialOrgnr={initialArbeidsgiverOrgnr}
          label={t("oversiktFelles.arbeidsgiverOrgnrLabel")}
        />
      );
    }

    return forhandsvalgtArbeidsgiver ? (
      <div>
        <BodyShort size={"medium"} weight="semibold">
          {forhandsvalgtArbeidsgiver.navn}
        </BodyShort>
        <BodyShort size="small">
          {t("oversiktFelles.orgnrLabel")} {forhandsvalgtArbeidsgiver.orgnr}
        </BodyShort>
      </div>
    ) : (
      <ArbeidsgiverVelger
        arbeidsgivere={altinnArbeidsgivere}
        formFieldName="arbeidsgiver"
      />
    );
  }

  const onSubmit = (data: SoknadStarterOutput) => {
    void gaTilSkjemaStart(data);
  };

  // Samle feilmeldinger for visning
  const valideringsfeil = [
    errors.arbeidsgiver?.message,
    errors.arbeidstaker?.message,
  ]
    .filter((message): message is string => Boolean(message))
    .map((message) => translateError(message) ?? "");

  return (
    <FormProvider {...formMethods}>
      <Box
        background="info-soft"
        borderColor="neutral-subtle"
        borderRadius="12"
        borderWidth="1"
        className="surface-action-subtle"
        padding="space-24"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap="space-24">
            <div>
              {representasjonstype === Representasjonstype.DEG_SELV ? (
                <>
                  <Heading level="2" size="medium" spacing>
                    {t("oversiktFelles.soknadStarterInfoTittelDegSelv")}
                  </Heading>
                  <BodyLong className="mb-2">
                    {t("oversiktFelles.soknadStarterInfoDegSelv")}
                  </BodyLong>
                </>
              ) : (
                <Heading level="2" size="medium" spacing>
                  {t(
                    representasjonstype === Representasjonstype.ANNEN_PERSON
                      ? "oversiktFelles.soknadStarterTittelAnnenPerson"
                      : "oversiktFelles.soknadStarterTittel",
                  )}
                </Heading>
              )}
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
              <Heading level="3" size="medium" spacing>
                {t(
                  representasjonstype === Representasjonstype.DEG_SELV
                    ? "oversiktFelles.soknadStarterTittelDegSelv"
                    : "oversiktFelles.arbeidsgiverTittel",
                )}
              </Heading>
              {renderArbeidsgiverValg()}
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
                  {valideringsfeil.map((feil) => (
                    <li key={feil}>{feil}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Button className="w-fit" type="submit" variant="primary">
              {t("oversiktFelles.gaTilSkjemaKnapp")}
            </Button>
          </VStack>
        </form>
      </Box>
    </FormProvider>
  );
}
