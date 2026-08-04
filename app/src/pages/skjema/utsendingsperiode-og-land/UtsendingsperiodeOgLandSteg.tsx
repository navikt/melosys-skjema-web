import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, BodyShort, Button, Label } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { PeriodeFormPart } from "~/components/date/PeriodeFormPart.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { StegKey } from "~/constants/stegKeys.ts";
import { useInvalidateSkjemaQuery } from "~/hooks/useInvalidateSkjemaQuery.ts";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  getSkjemaQuery,
  postUtsendingsperiodeOgLand,
} from "~/httpClients/melsosysSkjemaApiClient.ts";
import { NesteStegKnapp } from "~/pages/skjema/components/NesteStegKnapp.tsx";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import type {
  UtsendingsperiodeOgLandDto,
  UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";
import { formatDato, parseIsoDato } from "~/utils/datoformat.ts";

import { SkjemaStegLoader } from "../components/SkjemaStegLoader.tsx";
import { getUtsendingsperiodeOgLand } from "../stegDataGetters.ts";
import { STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { utsendingsperiodeOgLandSchema } from "./utsendingsperiodeOgLandStegSchema.ts";

// Date range constants for assignment period selection
const YEARS_FORWARD_FROM_CURRENT = 100;

function UtsendingsperiodeOgLandStegContent({
  skjema,
}: {
  skjema: UtsendtArbeidstakerSkjemaDto;
}) {
  const stegRekkefolge = STEG_REKKEFOLGE[skjema.metadata.skjemadel];
  const stegData = getUtsendingsperiodeOgLand(skjema);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const invalidateSkjemaQuery = useInvalidateSkjemaQuery();
  const { getFelt } = useSkjemaDefinisjon();

  const utsendelseLandFelt = getFelt(
    "utsendingsperiodeOgLand",
    "utsendelseLand",
  );
  const utsendelsePeriodeFelt = getFelt(
    "utsendingsperiodeOgLand",
    "utsendelsePeriode",
  );

  const motpartensVerdier = skjema.motpartensUtsendingsperiodeOgLand;
  const erUendretFraMotpart =
    !!motpartensVerdier &&
    stegData?.utsendelseLand === motpartensVerdier.utsendelseLand &&
    stegData.utsendelsePeriode?.fraDato ===
      motpartensVerdier.utsendelsePeriode.fraDato &&
    stegData.utsendelsePeriode?.tilDato ===
      motpartensVerdier.utsendelsePeriode.tilDato;
  const [redigerer, setRedigerer] = useState(false);
  // Motpartens verdier vises som lesevisning til bruker aktivt velger å endre,
  // så ingen justerer dato eller land ved et uhell
  const visLesevisning = erUendretFraMotpart && !redigerer;

  const formMethods = useForm({
    resolver: zodResolver(utsendingsperiodeOgLandSchema),
    ...(stegData && { defaultValues: stegData }),
  });

  const { handleSubmit, watch } = formMethods;
  const formFraDato = watch("utsendelsePeriode.fraDato");
  const formTilDato = watch("utsendelsePeriode.tilDato");
  const formLand = watch("utsendelseLand");

  const landAvviker =
    !!motpartensVerdier &&
    !!formLand &&
    formLand !== motpartensVerdier.utsendelseLand;
  const periodeAvviker =
    !!motpartensVerdier &&
    !!formFraDato &&
    !!formTilDato &&
    (formFraDato !== motpartensVerdier.utsendelsePeriode.fraDato ||
      formTilDato !== motpartensVerdier.utsendelsePeriode.tilDato);

  const dateLimits = {
    // Dato norge ble EØS medlem
    fromDate: new Date(1995, 0, 1),
    toDate: new Date(
      new Date().getFullYear() + YEARS_FORWARD_FROM_CURRENT,
      11,
      31,
    ),
  };

  const registerUtsendingsperiodeOgLandMutation = useMutation({
    mutationFn: (data: UtsendingsperiodeOgLandDto) => {
      return postUtsendingsperiodeOgLand(skjema.id, data);
    },
    onSuccess: async () => {
      await invalidateSkjemaQuery(skjema.id);
      const nextStep = getNextStep(
        StegKey.UTSENDINGSPERIODE_OG_LAND,
        stegRekkefolge,
      );
      if (nextStep) {
        navigate({
          to: nextStep.route,
          params: { id: skjema.id },
        });
      }
    },
  });

  const onSubmit = (data: UtsendingsperiodeOgLandDto) => {
    registerUtsendingsperiodeOgLandMutation.mutate(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey: StegKey.UTSENDINGSPERIODE_OG_LAND,
            skjema,
          }}
          isSubmitError={registerUtsendingsperiodeOgLandMutation.isError}
          nesteKnapp={
            <NesteStegKnapp
              loading={registerUtsendingsperiodeOgLandMutation.isPending}
            />
          }
        >
          {motpartensVerdier && (
            <Alert className="mt-4" variant="info">
              {t("utsendingsperiodeOgLandSteg.preutfyltAvArbeidsgiver", {
                land: t(`land.${motpartensVerdier.utsendelseLand}`),
                fraDato: formatDato(
                  motpartensVerdier.utsendelsePeriode.fraDato,
                  i18n.language,
                ),
                tilDato: formatDato(
                  motpartensVerdier.utsendelsePeriode.tilDato,
                  i18n.language,
                ),
              })}
            </Alert>
          )}

          {visLesevisning && stegData ? (
            <div className="mt-6">
              <dl>
                <dt>
                  <Label as="span">{utsendelseLandFelt.label}</Label>
                </dt>
                <dd className="mb-4">
                  <BodyShort>{t(`land.${stegData.utsendelseLand}`)}</BodyShort>
                </dd>
                <dt>
                  <Label as="span">{utsendelsePeriodeFelt.label}</Label>
                </dt>
                <dd className="mb-4">
                  <BodyShort>
                    {formatDato(
                      stegData.utsendelsePeriode.fraDato,
                      i18n.language,
                    )}
                    –
                    {formatDato(
                      stegData.utsendelsePeriode.tilDato,
                      i18n.language,
                    )}
                  </BodyShort>
                </dd>
              </dl>
              <Button
                onClick={() => setRedigerer(true)}
                size="small"
                type="button"
                variant="secondary"
              >
                {t("utsendingsperiodeOgLandSteg.endreLandEllerPeriode")}
              </Button>
            </div>
          ) : (
            <>
              <LandVelgerFormPart
                autoFocus={redigerer}
                className="mt-4"
                formFieldName="utsendelseLand"
                label={utsendelseLandFelt.label}
              />
              {landAvviker && (
                <Alert className="mt-2" inline size="small" variant="info">
                  {t("utsendingsperiodeOgLandSteg.arbeidsgiverOppgaLand", {
                    land: t(`land.${motpartensVerdier.utsendelseLand}`),
                  })}
                </Alert>
              )}

              <PeriodeFormPart
                className="mt-6"
                defaultFraDato={
                  stegData?.utsendelsePeriode?.fraDato
                    ? parseIsoDato(stegData.utsendelsePeriode.fraDato)
                    : undefined
                }
                defaultTilDato={
                  stegData?.utsendelsePeriode?.tilDato
                    ? parseIsoDato(stegData.utsendelsePeriode.tilDato)
                    : undefined
                }
                defaultTilMåned={
                  formFraDato ? parseIsoDato(formFraDato) : undefined
                }
                formFieldName="utsendelsePeriode"
                label={utsendelsePeriodeFelt.label}
                tilDatoDescription={utsendelsePeriodeFelt.hjelpetekst}
                {...dateLimits}
              />
              {periodeAvviker && (
                <Alert className="mt-2" inline size="small" variant="info">
                  {t("utsendingsperiodeOgLandSteg.arbeidsgiverOppgaPeriode", {
                    fraDato: formatDato(
                      motpartensVerdier.utsendelsePeriode.fraDato,
                      i18n.language,
                    ),
                    tilDato: formatDato(
                      motpartensVerdier.utsendelsePeriode.tilDato,
                      i18n.language,
                    ),
                  })}
                </Alert>
              )}
            </>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}

export function UtsendingsperiodeOgLandSteg({ id }: { id: string }) {
  return (
    <SkjemaStegLoader id={id} skjemaQuery={getSkjemaQuery}>
      {(skjema) => <UtsendingsperiodeOgLandStegContent skjema={skjema} />}
    </SkjemaStegLoader>
  );
}
