import { landKodeTilNavn } from "~/components/LandVelgerFormPart.tsx";
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

export function formaterVerdi(felt: FeltUnion, verdi: unknown): string {
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

    case "COUNTRY_SELECT": {
      return landKodeTilNavn(String(verdi));
    }

    default: {
      return String(verdi);
    }
  }
}
