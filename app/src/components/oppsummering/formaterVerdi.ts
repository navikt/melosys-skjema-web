import type { TFunction } from "i18next";

import type {
  BooleanFeltDefinisjon,
  CheckboxGruppeFeltDefinisjon,
  CountrySelectFeltDefinisjon,
  DateFeltDefinisjon,
  ListeFeltDefinisjon,
  PeriodeFeltDefinisjon,
  SelectFeltDefinisjon,
  TextareaFeltDefinisjon,
  TextFeltDefinisjon,
} from "~/types/melosysSkjemaTypes.ts";
import { formaterBelopForVisning } from "~/utils/belopFormat.ts";

export type FeltUnion =
  | BooleanFeltDefinisjon
  | CheckboxGruppeFeltDefinisjon
  | CountrySelectFeltDefinisjon
  | DateFeltDefinisjon
  | ListeFeltDefinisjon
  | PeriodeFeltDefinisjon
  | SelectFeltDefinisjon
  | TextFeltDefinisjon
  | TextareaFeltDefinisjon;

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
Beløpsfelter som skal formateres med tusenskilletegn og kr-suffiks
*/
function erBelopFelt(felt: FeltUnion): boolean {
  return (
    felt.type === "TEXT" && (felt as TextFeltDefinisjon).format === "BELOP"
  );
}

/**
Henter labels for valgte alternativer i en checkbox-gruppe
*/
function hentValgteCheckboxLabels(
  felt: CheckboxGruppeFeltDefinisjon,
  selected: string[] | undefined,
): string[] {
  if (!selected || selected.length === 0) return [];
  return felt.alternativer
    .filter((a) => selected.includes(a.verdi))
    .map((a) => a.label);
}

export function formaterVerdi(
  felt: FeltUnion,
  verdi: unknown,
  t: TFunction,
): string {
  if (verdi === null || verdi === undefined) return "\u{2013}";

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
      const fra = periode.fraDato ? formatDate(periode.fraDato) : "\u{2013}";
      const til = periode.tilDato ? formatDate(periode.tilDato) : "\u{2013}";
      return `${fra} \u{2013} ${til}`;
    }

    case "SELECT": {
      const selectFelt = felt as SelectFeltDefinisjon;
      return (
        selectFelt.alternativer.find((a) => a.verdi === String(verdi))?.label ??
        String(verdi)
      );
    }

    case "CHECKBOX_GROUP": {
      const checkboxFelt = felt as CheckboxGruppeFeltDefinisjon;
      const selected = verdi as string[] | undefined;
      const selectedLabels = hentValgteCheckboxLabels(checkboxFelt, selected);
      return selectedLabels.length > 0 ? selectedLabels.join(", ") : "\u{2013}";
    }

    case "COUNTRY_SELECT": {
      return t(`land.${String(verdi)}`);
    }

    default: {
      const stringVerdi = String(verdi);
      if (erBelopFelt(felt)) {
        const formatert = formaterBelopForVisning(stringVerdi);
        return formatert ? `${formatert} kr` : stringVerdi;
      }
      return stringVerdi;
    }
  }
}
