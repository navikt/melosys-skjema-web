import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { DatePickerFormPart } from "~/components/DatePickerFormPart.tsx";
import { LandVelgerFormPart } from "~/components/LandVelgerFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { getNextStep } from "~/pages/skjema/components/SkjemaSteg.tsx";
import { useTranslateError } from "~/utils/translation.ts";

import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "./stegRekkefølge.ts";
import { utenlandsoppdragSchema } from "./utenlandsoppdragetStegSchema.ts";

const stepKey = "utenlandsoppdraget";

// Date range constants for assignment period selection
const YEARS_BACK_FROM_CURRENT = 1;
const YEARS_FORWARD_FROM_CURRENT = 5;

type UtenlandsoppdragFormData = z.infer<typeof utenlandsoppdragSchema>;

export function UtenlandsoppdragetSteg() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const formMethods = useForm<UtenlandsoppdragFormData>({
    resolver: zodResolver(utenlandsoppdragSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = formMethods;

  const dateLimits = {
    fromDate: new Date(
      new Date().getFullYear() - YEARS_BACK_FROM_CURRENT,
      0,
      1,
    ),
    toDate: new Date(
      new Date().getFullYear() + YEARS_FORWARD_FROM_CURRENT,
      11,
      31,
    ),
  };

  const arbeidstakerErstatterAnnenPerson = watch(
    "arbeidstakerErstatterAnnenPerson",
  );
  const arbeidsgiverHarOppdragILandet = watch("arbeidsgiverHarOppdragILandet");
  const arbeidstakerForblirAnsattIHelePerioden = watch(
    "arbeidstakerForblirAnsattIHelePerioden",
  );
  const arbeidstakerBleAnsattForUtenlandsoppdraget = watch(
    "arbeidstakerBleAnsattForUtenlandsoppdraget",
  );

  const onSubmit = (data: UtenlandsoppdragFormData) => {
    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey, ARBEIDSGIVER_STEG_REKKEFOLGE);
    if (nextStep) {
      navigate({ to: nextStep.route });
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SkjemaSteg
          config={{
            stepKey,
            stegRekkefolge: ARBEIDSGIVER_STEG_REKKEFOLGE,
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
            },
          }}
        >
          <LandVelgerFormPart
            className="mt-4"
            formFieldName="utsendelseLand"
            label={t(
              "utenlandsoppdragetSteg.hvilketLandSendesArbeidstakerenTil",
            )}
          />

          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold">
              {t("utenlandsoppdragetSteg.utsendingsperiode")}
            </h3>

            <DatePickerFormPart
              className="mt-4"
              formFieldName="arbeidstakerUtsendelseFraDato"
              label={t("utenlandsoppdragetSteg.fraDato")}
              {...dateLimits}
            />

            <DatePickerFormPart
              className="mt-4"
              description="Oppgi omtrentlig dato hvis du ikke vet nøyaktig dato."
              formFieldName="arbeidstakerUtsendelseTilDato"
              label={t("utenlandsoppdragetSteg.tilDato")}
              {...dateLimits}
            />
          </div>

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidsgiverHarOppdragILandet"
            legend={t(
              "utenlandsoppdragetSteg.harDuSomArbeidsgiverOppdragILandetArbeidstakerSkalSendesUtTil",
            )}
          />

          {arbeidsgiverHarOppdragILandet === false && (
            <Textarea
              className="mt-6"
              error={translateError(
                errors.utenlandsoppholdetsBegrunnelse?.message,
              )}
              label={t(
                "utenlandsoppdragetSteg.hvorforSkalArbeidstakerenArbeideIUtlandet",
              )}
              {...register("utenlandsoppholdetsBegrunnelse")}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerBleAnsattForUtenlandsoppdraget"
            legend={t(
              "utenlandsoppdragetSteg.bleArbeidstakerAnsattPaGrunnAvDetteUtenlandsoppdraget",
            )}
          />

          {arbeidstakerBleAnsattForUtenlandsoppdraget === true && (
            <RadioGroupJaNeiFormPart
              className="mt-6"
              formFieldName="arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget"
              legend={t(
                "utenlandsoppdragetSteg.vilArbeidstakerenArbeideForVirksomhetenINorgeEtterUtenlandsoppdraget",
              )}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerForblirAnsattIHelePerioden"
            legend={t(
              "utenlandsoppdragetSteg.vilArbeidstakerFortsattVareAnsattHostDereIHeleUtsendingsperioden",
            )}
          />

          {arbeidstakerForblirAnsattIHelePerioden === false && (
            <Textarea
              className="mt-6"
              error={translateError(
                errors.ansettelsesforholdBeskrivelse?.message,
              )}
              label={t(
                "utenlandsoppdragetSteg.beskrivArbeidstakerensAnsettelsesforholdIUtsendingsperioden",
              )}
              {...register("ansettelsesforholdBeskrivelse")}
            />
          )}

          <RadioGroupJaNeiFormPart
            className="mt-6"
            formFieldName="arbeidstakerErstatterAnnenPerson"
            legend={t(
              "utenlandsoppdragetSteg.erstatterArbeidstakerEnAnnenPersonSomVarSendtUtForAGjoreDetSammeArbeidet",
            )}
          />

          {arbeidstakerErstatterAnnenPerson && (
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-semibold">
                Forrige arbeidstakers utsendelse
              </h3>

              <DatePickerFormPart
                className="mt-4"
                formFieldName="forrigeArbeidstakerUtsendelseFradato"
                label="Fra dato"
                {...dateLimits}
              />

              <DatePickerFormPart
                className="mt-4"
                formFieldName="forrigeArbeidstakerUtsendelseTilDato"
                label="Til dato"
                {...dateLimits}
              />
            </div>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
