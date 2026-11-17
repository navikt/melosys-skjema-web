import { zodResolver } from "@hookform/resolvers/zod";
import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  Loader,
  LocalAlert,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker.tsx";
import { ARBEIDSFORHOLD_AAREG } from "~/featuretoggle/toggleNavn.ts";
import { useFeatureToggle } from "~/featuretoggle/useFeatureToggle.ts";
import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import {
  getArbeidsgivereIAaregQuery,
  getFeatureTogglesQuery,
  getOrganisasjonMedJuridiskEnhetQuery,
  listAltinnTilganger,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { useGaTilSkjemaStart } from "~/pages/skjema/nySoknad.ts";
import {
  OrganisasjonDto,
  Representasjonstype,
  SimpleOrganisasjonDto,
} from "~/types/melosysSkjemaTypes.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidsforholdVelger } from "./ArbeidsforholdVelger.tsx";
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
  /**
  Arbeidsgivere fra Aa-registeret (DEG_SELV), undefined når togglen er av.
  */
  aaregArbeidsgivere?: SimpleOrganisasjonDto[];
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

  const erDegSelv =
    representasjonskontekst.representasjonstype ===
    Representasjonstype.DEG_SELV;

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

  const { isLoading: isLoadingToggles } = useQuery(getFeatureTogglesQuery());
  const arbeidsforholdAaregAktivert =
    useFeatureToggle(ARBEIDSFORHOLD_AAREG) ?? false;
  const skalHenteAaregArbeidsgivere = erDegSelv && arbeidsforholdAaregAktivert;

  // Hent arbeidsgivere fra Aa-registeret for DEG_SELV
  const {
    data: aaregArbeidsgivere,
    isLoading: isLoadingAaregArbeidsgivere,
    isError: isErrorAaregArbeidsgivere,
  } = useQuery({
    ...getArbeidsgivereIAaregQuery(),
    enabled: skalHenteAaregArbeidsgivere,
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
    (erDegSelv &&
      (isLoadingUserInfo || isLoadingToggles || isLoadingAaregArbeidsgivere)) ||
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
      <LocalAlert status="error">
        <LocalAlert.Header>
          <LocalAlert.Title as="div">
            {t("oversiktFelles.feilVedHentingAvArbeidsgivere")}
          </LocalAlert.Title>
        </LocalAlert.Header>
      </LocalAlert>
    );
  }

  // Aa-registeret brukes også senere i søknaden, så brukeren kan ikke starte uten oppslaget.
  if (skalHenteAaregArbeidsgivere && isErrorAaregArbeidsgivere) {
    return (
      <LocalAlert status="error">
        <LocalAlert.Header>
          <LocalAlert.Title as="div">
            {t("oversiktFelles.feilVedHentingAvArbeidsforhold")}
          </LocalAlert.Title>
        </LocalAlert.Header>
      </LocalAlert>
    );
  }

  const arbeidsgivereFraAareg = skalHenteAaregArbeidsgivere
    ? aaregArbeidsgivere
    : undefined;
  const initialAaregArbeidsgiver = arbeidsgivereFraAareg?.find(
    (org) => org.orgnr === representasjonskontekst.arbeidsgiverOrgnr,
  );

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
    ...(erDegSelv &&
      userInfo && {
        arbeidstaker: { fnr: userInfo.userId, etternavn: userInfo.name },
      }),
    ...(initialAaregArbeidsgiver && {
      arbeidsgiver: {
        orgnr: initialAaregArbeidsgiver.orgnr,
        navn: initialAaregArbeidsgiver.navn,
      },
    }),
  };

  return (
    <SoknadStarterContent
      aaregArbeidsgivere={arbeidsgivereFraAareg}
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
  aaregArbeidsgivere,
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
      aaregArbeidsgivere &&
      aaregArbeidsgivere.length > 0 &&
      representasjonstype === Representasjonstype.DEG_SELV
    ) {
      return (
        <ArbeidsforholdVelger
          arbeidsgivere={aaregArbeidsgivere}
          formFieldName="arbeidsgiver"
          initialOrgnr={initialArbeidsgiverOrgnr}
        />
      );
    }

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
                  <BodyLong className="mb-2 whitespace-pre-line">
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
              <LocalAlert status="error">
                <LocalAlert.Header>
                  <LocalAlert.Title as="h3">
                    {t("oversiktFelles.valideringFeilTittel")}
                  </LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                  <ul className="list-disc pl-5">
                    {valideringsfeil.map((feil) => (
                      <li key={feil}>{feil}</li>
                    ))}
                  </ul>
                </LocalAlert.Content>
              </LocalAlert>
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
