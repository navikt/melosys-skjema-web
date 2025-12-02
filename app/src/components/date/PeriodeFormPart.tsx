import { ErrorMessage, UseDatepickerOptions } from "@navikt/ds-react";
import { get, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DatePickerFormPart } from "./DatePickerFormPart.tsx";

/**
 * Props for PeriodeFormPart-komponenten
 */
type PeriodeFormPartProps = {
  /**
   * Skjemafeltnavn for periodeobjektet. Må være en nøstet sti som peker til et periodeobjekt
   * som inneholder fraDato og tilDato felter.
   * @example "utsendelsePeriode" (vil aksessere utsendelsePeriode.fraDato og utsendelsePeriode.tilDato)
   */
  formFieldName: string;
  /**
   * Valgfri overskrift som vises over datovelgerne.
   * Rendres som et h3-element når oppgitt.
   */
  label?: string;
  /**
   * Egendefinert label for "fra dato"-feltet.
   * Faller tilbake til oversettelsesnøkkel "periode.fraDato" hvis ikke oppgitt.
   */
  fraDatoLabel?: string;
  /**
   * Egendefinert label for "til dato"-feltet.
   * Faller tilbake til oversettelsesnøkkel "periode.tilDato" hvis ikke oppgitt.
   */
  tilDatoLabel?: string;
  /**
   * Valgfri beskrivelsestekst som vises under "til dato"-feltet.
   */
  tilDatoDescription?: string;
  /**
   * CSS-klassenavn for container-div.
   */
  className?: string;
  /**
   * Standard valgt dato for "fra dato"-feltet.
   */
  defaultFraDato?: Date;
  /**
   * Standard valgt dato for "til dato"-feltet.
   */
  defaultTilDato?: Date;
} & Omit<UseDatepickerOptions, "onDateChange" | "defaultSelected">;

/**
 * En gjenbrukbar skjemakomponent for datoperiode-input med integrert validering.
 *
 * Denne komponenten wrapper to DatePickerFormPart-komponenter for å tilby en konsekvent
 * datoperiode-velger på tvers av applikasjonen. Den er designet for å fungere med periodeSchema
 * Zod-schema for validering.
 *
 * ## Feilhåndtering
 * Komponenten håndterer to typer valideringsfeil:
 * 1. **Periode-objektfeil**: Når hele periodeobjektet er undefined/ugyldig
 *    - Detekteres ved å sjekke om feilmeldingen inneholder "undefined" eller er lik "periode.datoErPakrevd"
 *    - Vises på individuelle datofelt kun hvis feltet er tomt
 * 2. **Feltspesifikke feil**: Feil fra periodeSchema-validering (f.eks. "tilDatoMaVareEtterFraDato")
 *    - Vises under begge datovelgerne
 *
 * @example
 * <PeriodeFormPart
 *   formFieldName="utsendelsePeriode"
 *   label={t("utenlandsoppdragetSteg.utsendingsperiode")}
 *   defaultFraDato={eksisterendeData?.fraDato ? new Date(eksisterendeData.fraDato) : undefined}
 *   defaultTilDato={eksisterendeData?.tilDato ? new Date(eksisterendeData.tilDato) : undefined}
 * />
 */
export function PeriodeFormPart({
  formFieldName,
  label,
  fraDatoLabel,
  tilDatoLabel,
  tilDatoDescription,
  className,
  defaultFraDato,
  defaultTilDato,
  ...datePickerOptions
}: PeriodeFormPartProps) {
  const { t } = useTranslation();
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const fraDato = useWatch({ control, name: `${formFieldName}.fraDato` });
  const tilDato = useWatch({ control, name: `${formFieldName}.tilDato` });

  const periodeError = get(errors, formFieldName);
  const periodeErPakrevdErrorMessage =
    (periodeError?.message?.includes("undefined") ||
      periodeError?.message === "periode.datoErPakrevd") &&
    "periode.datoErPakrevd";

  return (
    <div className={className}>
      {label && <h3 className="mb-4 text-lg font-semibold">{label}</h3>}

      <DatePickerFormPart
        className="mt-4"
        defaultSelected={defaultFraDato}
        error={!fraDato && periodeErPakrevdErrorMessage}
        formFieldName={`${formFieldName}.fraDato`}
        label={fraDatoLabel ?? t("periode.fraDato")}
        {...datePickerOptions}
      />

      <DatePickerFormPart
        className="mt-4"
        defaultSelected={defaultTilDato}
        description={tilDatoDescription}
        error={!tilDato && periodeErPakrevdErrorMessage}
        formFieldName={`${formFieldName}.tilDato`}
        label={tilDatoLabel ?? t("periode.tilDato")}
        {...datePickerOptions}
      />
      {!periodeErPakrevdErrorMessage && periodeError ? (
        <ErrorMessage className="mt-1">{t(periodeError.message)}</ErrorMessage>
      ) : undefined}
    </div>
  );
}
