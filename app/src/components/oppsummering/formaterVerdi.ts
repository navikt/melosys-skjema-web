import type { TFunction } from "i18next";

import type {
  BooleanFeltDefinisjon,
  CountrySelectFeltDefinisjon,
  DateFeltDefinisjon,
  ListeFeltDefinisjon,
  PeriodeFeltDefinisjon,
  SelectFeltDefinisjon,
  TextareaFeltDefinisjon,
  TextFeltDefinisjon,
} from "~/types/melosysSkjemaTypes.ts";

export type FeltUnion =
  | BooleanFeltDefinisjon
  | CountrySelectFeltDefinisjon
  | DateFeltDefinisjon
  | ListeFeltDefinisjon
  | PeriodeFeltDefinisjon
  | SelectFeltDefinisjon
  | TextFeltDefinisjon
  | TextareaFeltDefinisjon;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Beløpsfelter som skal formateres med tusenskilletegn og kr-suffiks */
const BELOP_FELTER = new Set([
  "pengestotteSomMottasFraAndreLandBelop",
  "inntekterFraUtenlandskVirksomhet",
  "inntekterFraEgenVirksomhet",
]);

function formaterBelop(verdi: string): string {
  const trimmed = verdi.trim();
  const parts = trimmed.split(",");
  const helTall = parts[0] ?? "0";
  const desimaler = parts[1] ?? "00";
  const medTusenSkille = helTall.replaceAll(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${medTusenSkille},${desimaler} kr`;
}

export function formaterVerdi(
  felt: FeltUnion,
  verdi: unknown,
  t: TFunction,
  feltNavn?: string,
): string {
  if (verdi === null || verdi === undefined) return "\u2013";

  switch (felt.type) {
    case "BOOLEAN": {
      const boolFelt = felt as BooleanFeltDefinisjon;
      return verdi === true ? boolFelt.jaLabel : boolFelt.neiLabel;
    }

    case "DATE": {
      return formatDate(verdi as string);
    }

    case "PERIOD": {
      const periode = verdi as { fraDato?: string; tilDato?: string };
      const fra = periode.fraDato ? formatDate(periode.fraDato) : "\u2013";
      const til = periode.tilDato ? formatDate(periode.tilDato) : "\u2013";
      return `${fra} \u2013 ${til}`;
    }

    case "SELECT": {
      const selectFelt = felt as SelectFeltDefinisjon;
      return (
        selectFelt.alternativer.find((a) => a.verdi === String(verdi))?.label ??
        String(verdi)
      );
    }

    case "CHECKBOX_GROUP": {
      const checkboxFelt = felt as unknown as SelectFeltDefinisjon;
      const selections = verdi as Record<string, boolean> | undefined;
      if (!selections) return "\u2013";
      const selectedLabels = checkboxFelt.alternativer
        .filter((a) => selections[a.verdi])
        .map((a) => a.label);
      return selectedLabels.length > 0 ? selectedLabels.join(", ") : "\u2013";
    }

    case "COUNTRY_SELECT": {
      return t(`land.${String(verdi)}`);
    }

    default: {
      const strVerdi = String(verdi);
      if (feltNavn && BELOP_FELTER.has(feltNavn)) {
        return formaterBelop(strVerdi);
      }
      return strVerdi;
    }
  }
}
