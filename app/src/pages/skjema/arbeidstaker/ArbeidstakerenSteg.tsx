import { zodResolver } from "@hookform/resolvers/zod";
import { Select, TextField, VStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { DatePickerFormPart } from "~/components/DatePickerFormPart.tsx";
import { NorskeVirksomheterFormPart } from "~/components/NorskeVirksomheterFormPart.tsx";
import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { UtenlandskeVirksomheterFormPart } from "~/components/UtenlandskeVirksomheterFormPart.tsx";
import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import { ARBEIDSTAKER_STEG_REKKEFOLGE } from "~/pages/skjema/arbeidstaker/stegRekkefølge.ts";
import {
  getNextStep,
  SkjemaSteg,
} from "~/pages/skjema/components/SkjemaSteg.tsx";
import { useTranslateError } from "~/utils/translation.ts";

import {
  AKTIVITET_OPTIONS,
  arbeidstakerSchema,
} from "./arbeidstakerenStegSchema.ts";

const stepKey = "arbeidstakeren";

export function ArbeidstakerenSteg() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const userInfo = useQuery(getUserInfo()).data;

  const innloggetBrukerHarNorskFodselsnummer = userInfo?.userId
    ? /^\d{11}$/.test(userInfo.userId)
    : false;

  type ArbeidstakerFormData = z.infer<typeof arbeidstakerSchema>;

  const formMethods = useForm<ArbeidstakerFormData>({
    resolver: zodResolver(arbeidstakerSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = formMethods;

  const harNorskFodselsnummer =
    watch("harNorskFodselsnummer") || innloggetBrukerHarNorskFodselsnummer;
  const harVaertEllerSkalVaereILonnetArbeidFoerUtsending = watch(
    "harVaertEllerSkalVaereILonnetArbeidFoerUtsending",
  );
  const skalJobbeForFlereVirksomheter = watch("skalJobbeForFlereVirksomheter");

  const onSubmit = (data: ArbeidstakerFormData) => {
    // Fjerner console.log når vi har endepunkt å sende data til
    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    const nextStep = getNextStep(stepKey, ARBEIDSTAKER_STEG_REKKEFOLGE);
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
            customNesteKnapp: {
              tekst: t("felles.lagreOgFortsett"),
              type: "submit",
            },
            stegRekkefolge: ARBEIDSTAKER_STEG_REKKEFOLGE,
          }}
        >
          <RadioGroupJaNeiFormPart
            className="mt-4"
            disabled={innloggetBrukerHarNorskFodselsnummer}
            formFieldName="harNorskFodselsnummer"
            legend={t(
              "arbeidstakerenSteg.harArbeidstakerenNorskFodselsnummerEllerDNummer",
            )}
            lockedValue={innloggetBrukerHarNorskFodselsnummer}
          />

          {harNorskFodselsnummer && (
            <TextField
              className="mt-4"
              error={translateError(errors.fodselsnummer?.message)}
              label={t(
                "arbeidstakerenSteg.arbeidstakerensFodselsnummerEllerDNummer",
              )}
              size="medium"
              style={{ maxWidth: "160px" }}
              {...register("fodselsnummer")}
              disabled={innloggetBrukerHarNorskFodselsnummer}
              value={userInfo?.userId}
            />
          )}

          {harNorskFodselsnummer === false && (
            <>
              <TextField
                className="mt-4 max-w-md"
                error={translateError(errors.fornavn?.message)}
                label={t("arbeidstakerenSteg.arbeidstakerensFornavn")}
                {...register("fornavn")}
              />

              <TextField
                className="mt-4 max-w-md"
                error={translateError(errors.etternavn?.message)}
                label={t("arbeidstakerenSteg.arbeidstakerensEtternavn")}
                {...register("etternavn")}
              />

              <DatePickerFormPart
                className="mt-4"
                formFieldName="fodselsdato"
                label={t("arbeidstakerenSteg.arbeidstakerensFodselsdato")}
              />
            </>
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="harVaertEllerSkalVaereILonnetArbeidFoerUtsending"
            legend={t(
              "arbeidstakerenSteg.harDuVaertEllerSkalVaereILonnetArbeidINorgeIMinst1ManedRettForUtsendingen",
            )}
          />

          {harVaertEllerSkalVaereILonnetArbeidFoerUtsending === false && (
            <Select
              className="mt-4"
              error={translateError(
                errors.aktivitetIMaanedenFoerUtsendingen?.message,
              )}
              label={t("arbeidstakerenSteg.aktivitet")}
              style={{ width: "fit-content" }}
              {...register("aktivitetIMaanedenFoerUtsendingen")}
            >
              <option value="">{t("arbeidstakerenSteg.velgAktivitet")}</option>
              {AKTIVITET_OPTIONS.map((aktivitetOption) => (
                <option
                  key={aktivitetOption.value}
                  value={aktivitetOption.value}
                >
                  {t(aktivitetOption.labelKey)}
                </option>
              ))}
            </Select>
          )}

          <RadioGroupJaNeiFormPart
            className="mt-4"
            formFieldName="skalJobbeForFlereVirksomheter"
            legend={t(
              "arbeidstakerenSteg.skalDuJobbeForFlereVirksomheterIPerioden",
            )}
          />

          {skalJobbeForFlereVirksomheter === true && (
            <VStack className="mt-4" style={{ gap: "var(--a-spacing-4)" }}>
              <NorskeVirksomheterFormPart fieldName="norskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode" />

              <UtenlandskeVirksomheterFormPart fieldName="utenlandskeVirksomheterArbeidstakerJobberForIutsendelsesPeriode" />
            </VStack>
          )}
        </SkjemaSteg>
      </form>
    </FormProvider>
  );
}
