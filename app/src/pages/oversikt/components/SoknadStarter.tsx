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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker.tsx";
import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import {
  getOrganisasjonMedJuridiskEnhetQuery,
  listAltinnTilganger,
  opprettSoknad,
  VENTENDE_MOTPART_SOKNADER_QUERY_KEY,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  OpprettetVia,
  OrganisasjonDto,
  Representasjonstype,
} from "~/types/melosysSkjemaTypes.ts";
import type { Representasjonskontekst } from "~/types/representasjon.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { ArbeidsgiverVelger } from "./ArbeidsgiverVelger.tsx";
import { ArbeidstakerVelger } from "./ArbeidstakerVelger.tsx";
import { BekreftelseBoks } from "./BekreftelseBoks.tsx";
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
  autoFocusArbeidsgiver?: boolean;
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
    bekreftelse: false,
    opprettetVia:
      representasjonskontekst.representasjonstype ===
      Representasjonstype.DEG_SELV
        ? representasjonskontekst.opprettetVia
        : undefined,
    prefyllFraSkjemaId:
      representasjonskontekst.representasjonstype ===
      Representasjonstype.DEG_SELV
        ? representasjonskontekst.prefyllFraSkjemaId
        : undefined,
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
      autoFocusArbeidsgiver={!!representasjonskontekst.opprettetVia}
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
  autoFocusArbeidsgiver = false,
}: SoknadStarterContentProperties) {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!autoFocusArbeidsgiver) {
      return;
    }

    const foretrekkerRedusertBevegelse = globalThis.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    boxRef.current?.scrollIntoView({
      behavior: foretrekkerRedusertBevegelse ? "auto" : "smooth",
      block: "start",
    });
  }, [autoFocusArbeidsgiver]);

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
          autoFocus={autoFocusArbeidsgiver}
          formFieldName="arbeidsgiver"
          initialOrgnr={initialArbeidsgiverOrgnr}
          label={t("oversiktFelles.arbeidsgiverOrgnrLabel")}
        />
      );
    }

    if (forhandsvalgtArbeidsgiver) {
      return (
        <div>
          <BodyShort size={"medium"} weight="semibold">
            {forhandsvalgtArbeidsgiver.navn}
          </BodyShort>
          <BodyShort size="small">
            {t("oversiktFelles.orgnrLabel")} {forhandsvalgtArbeidsgiver.orgnr}
          </BodyShort>
        </div>
      );
    }

    return (
      <ArbeidsgiverVelger
        arbeidsgivere={altinnArbeidsgivere}
        formFieldName="arbeidsgiver"
      />
    );
  }

  // Samme oppslag som OrganisasjonSoker gjør for prefill-orgnr (cache-treff),
  // siden skjemaverdien holder juridisk enhet-orgnr, ikke det prefylte orgnr.
  const { data: initialOrganisasjon } = useQuery({
    ...getOrganisasjonMedJuridiskEnhetQuery(initialArbeidsgiverOrgnr ?? ""),
    enabled: !!initialArbeidsgiverOrgnr,
  });

  const opprettSoknadMutation = useMutation({
    mutationFn: opprettSoknad,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["utkast"] });
      void queryClient.invalidateQueries({
        queryKey: VENTENDE_MOTPART_SOKNADER_QUERY_KEY,
      });
      void navigate({
        to: "/skjema/$id",
        params: { id: data.id },
      });
    },
  });

  const onSubmit = (data: SoknadStarterOutput) => {
    // CTA-taggen og prefyll gjelder kun søknaden CTA-en pekte på — velger
    // brukeren en annen arbeidsgiver enn den forhåndsutfylte, regnes
    // opprettelsen som ordinær og forhåndsutfylles ikke fra motpartens del.
    const isArbeidsgiverUendret =
      data.arbeidsgiver.orgnr === initialOrganisasjon?.juridiskEnhet.orgnr;
    opprettSoknadMutation.mutate({
      ...data,
      opprettetVia: isArbeidsgiverUendret
        ? data.opprettetVia
        : OpprettetVia.ORDINAER,
      prefyllFraSkjemaId: isArbeidsgiverUendret
        ? data.prefyllFraSkjemaId
        : undefined,
    });
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
  if (errors.bekreftelse?.message) {
    valideringsfeil.push(
      translateError(errors.bekreftelse.message as string) ?? "",
    );
  }

  return (
    <FormProvider {...formMethods}>
      <Box
        background="info-soft"
        ref={boxRef}
        borderColor="neutral-subtle"
        borderRadius="12"
        borderWidth="1"
        className="surface-action-subtle"
        padding="space-24"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap="space-24">
            <div>
              <Heading level="2" size="medium" spacing>
                {t(
                  representasjonstype === Representasjonstype.DEG_SELV
                    ? "oversiktFelles.soknadStarterTittelDegSelv"
                    : representasjonstype === Representasjonstype.ANNEN_PERSON
                      ? "oversiktFelles.soknadStarterTittelAnnenPerson"
                      : "oversiktFelles.soknadStarterTittel",
                )}
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
              {renderArbeidsgiverValg()}
            </div>

            {/* For RADGIVER og ARBEIDSGIVER: Arbeidstaker etter arbeidsgiver */}
            {(representasjonstype === Representasjonstype.RADGIVER ||
              representasjonstype === Representasjonstype.ARBEIDSGIVER) && (
              <div>
                <ArbeidstakerVelger />
              </div>
            )}

            <BekreftelseBoks representasjonstype={representasjonstype} />

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
