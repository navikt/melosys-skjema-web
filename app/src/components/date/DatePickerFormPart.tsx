import {
  DatePicker,
  useDatepicker,
  UseDatepickerOptions,
} from "@navikt/ds-react";
import { formatISO, getYear, max, min } from "date-fns";
import { Ref, useImperativeHandle, useRef, useState } from "react";
import { get, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { formatDato } from "~/utils/datoformat.ts";
import { useTranslateError } from "~/utils/translation.ts";

const ÅR_FØR_OG_ETTER_I_ÅRSVELGER = 5;

/**
 * Aksel lister alle år mellom fromDate og toDate i års-dropdownen, og bruker
 * samme grenser for navigasjonen. Kalenderen får derfor et glidende vindu på
 * ±5 år rundt året som vises. Vinduet følger året som vises, også når brukeren
 * blar med pilene eller velger et annet år, slik at hele det gyldige området
 * (fromDate/toDate fra hooken) fortsatt kan nås. Validering av inntastet dato
 * bruker fortsatt hookens fromDate/toDate.
 */
function getÅrsvelgerVindu({
  visningsmåned,
  sisteKalenderår,
  fromDate,
  toDate,
}: {
  visningsmåned: Date;
  sisteKalenderår?: number;
  fromDate?: Date;
  toDate?: Date;
}) {
  const visningsår = getYear(visningsmåned);
  const førsteÅr = visningsår - ÅR_FØR_OG_ETTER_I_ÅRSVELGER;
  const sisteÅr = Math.min(
    visningsår + ÅR_FØR_OG_ETTER_I_ÅRSVELGER,
    Math.max(sisteKalenderår ?? Infinity, visningsår),
  );
  const vinduStart = new Date(førsteÅr, 0, 1);
  const vinduSlutt = new Date(sisteÅr, 11, 31);

  return {
    fromDate: fromDate ? max([fromDate, vinduStart]) : vinduStart,
    toDate: toDate ? min([toDate, vinduSlutt]) : vinduSlutt,
  };
}

export type DatePickerFormPartHandle = {
  /**
  Tømmer feltet uten å trigge validering (ingen "påkrevd"-feil vises).
  */
  clearWithoutValidation: () => void;
};

type DatePickerFormPartProperties = {
  formFieldName: string;
  label: string;
  description?: string;
  className?: string;
  error?: string;
  ref?: Ref<DatePickerFormPartHandle>;
  /**
  Kalles i tillegg til den interne lagringen når datoen endres.
  */
  onDateChange?: (date?: Date) => void;
  /**
  Siste år kalenderen lar brukeren bla til. Påvirker ikke validering av inntastet dato.
  */
  sisteKalenderår?: number;
} & Omit<UseDatepickerOptions, "onDateChange" | "onValidate">;

export function DatePickerFormPart({
  formFieldName,
  label,
  description,
  className,
  error: externalError,
  ref,
  onDateChange,
  sisteKalenderår,
  ...datePickerOptions
}: DatePickerFormPartProperties) {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const translateError = useTranslateError();
  const { t, i18n } = useTranslation();
  const [grensefeil, setGrensefeil] = useState<{
    nøkkel: "periode.datoErForTidlig" | "periode.datoErForSen";
    grense: Date;
  }>();

  // Engangssignal: settes når feltet tømmes programmatisk, slik at den
  // påfølgende onDateChange hopper over validering for nettopp den endringen.
  const skipValidationRef = useRef(false);

  // Registrer feltet i react-hook-form slik at valideringsfeil
  // fra zodResolver legges inn i formState.errors for dette feltet
  register(formFieldName);

  const fieldError = get(errors, formFieldName)?.message as string | undefined;

  const datePicker = useDatepicker({
    onValidate: ({ isBefore, isAfter }) => {
      const { fromDate, toDate } = datePickerOptions;
      if (isBefore && fromDate) {
        setGrensefeil({ nøkkel: "periode.datoErForTidlig", grense: fromDate });
      } else if (isAfter && toDate) {
        setGrensefeil({ nøkkel: "periode.datoErForSen", grense: toDate });
      } else {
        setGrensefeil(undefined);
      }
    },
    onDateChange: (date) => {
      const shouldValidate = !skipValidationRef.current;
      skipValidationRef.current = false;

      setValue(
        formFieldName,
        date ? formatISO(date, { representation: "date" }) : undefined,
        { shouldValidate },
      );
      if (!shouldValidate) {
        clearErrors(formFieldName);
      }
      onDateChange?.(date);
    },
    ...datePickerOptions,
  });

  useImperativeHandle(
    ref,
    () => ({
      clearWithoutValidation: () => {
        skipValidationRef.current = true;
        datePicker.setSelected(undefined);
      },
    }),
    [datePicker],
  );

  // Aksel tømmer verdien når en inntastet dato er utenfor fromDate/toDate, så
  // skjemavalideringen ser bare et tomt felt. Da vises grensen i stedet for
  // den generelle «gyldig dato»-meldingen.
  const grensefeilTekst =
    fieldError &&
    grensefeil &&
    t(grensefeil.nøkkel, {
      dato: formatDato(
        formatISO(grensefeil.grense, { representation: "date" }),
        i18n.language,
      ),
    });
  const error =
    translateError(externalError) ||
    grensefeilTekst ||
    translateError(fieldError);

  const [idag] = useState(() => new Date());
  const årsvelgerVindu = getÅrsvelgerVindu({
    visningsmåned: datePicker.datepickerProps.month ?? idag,
    sisteKalenderår,
    fromDate: datePicker.datepickerProps.fromDate,
    toDate: datePicker.datepickerProps.toDate,
  });

  return (
    <DatePicker
      {...datePicker.datepickerProps}
      {...årsvelgerVindu}
      dropdownCaption
      fixedWeeks={true}
    >
      <DatePicker.Input
        {...datePicker.inputProps}
        className={className}
        description={description}
        error={error}
        label={label}
      />
    </DatePicker>
  );
}
