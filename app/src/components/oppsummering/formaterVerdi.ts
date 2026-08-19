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
import { formaterBelop } from "~/utils/belopFormat.ts";
import { formatDato } from "~/utils/datoformat.ts";
import { mapToSupportedLanguage } from "~/utils/languages.ts";

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
  sprak: string,
): string {
  if (verdi === null || verdi === undefined) return "\u{2013}";

  const visningssprak = mapToSupportedLanguage(sprak);

  switch (felt.type) {
    case "BOOLEAN": {
      const boolFelt = felt as BooleanFeltDefinisjon;
      return verdi === true ? boolFelt.jaLabel : boolFelt.neiLabel;
    }

    case "DATE": {
      return formatDato(verdi as string, visningssprak);
    }

    case "PERIOD": {
      const periode = verdi as { fraDato?: string; tilDato?: string };
      const fra = periode.fraDato
        ? formatDato(periode.fraDato, visningssprak)
        : "\u{2013}";
      const til = periode.tilDato
        ? formatDato(periode.tilDato, visningssprak)
        : "\u{2013}";
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
        const formatert = formaterBelop(stringVerdi, visningssprak);
        return formatert ? `${formatert} kr` : stringVerdi;
      }
      return stringVerdi;
    }
  }
}
