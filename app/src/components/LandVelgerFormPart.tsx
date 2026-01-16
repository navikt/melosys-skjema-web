import { Select, SelectProps } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LandKode } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

type LandVelgerFormPartProps = {
  formFieldName: string;
  label: string;
  className?: string;
} & Omit<SelectProps, "children" | "onChange" | "value">;

const landOptions = [
  { value: LandKode.BE, label: "Belgia" },
  { value: LandKode.BG, label: "Bulgaria" },
  { value: LandKode.DK, label: "Danmark" },
  { value: LandKode.EE, label: "Estland" },
  { value: LandKode.FI, label: "Finland" },
  { value: LandKode.FR, label: "Frankrike" },
  { value: LandKode.FO, label: "Færøyene" },
  { value: LandKode.GL, label: "Grønland" },
  { value: LandKode.GR, label: "Hellas" },
  { value: LandKode.IE, label: "Irland" },
  { value: LandKode.IS, label: "Island" },
  { value: LandKode.IT, label: "Italia" },
  { value: LandKode.HR, label: "Kroatia" },
  { value: LandKode.CY, label: "Kypros" },
  { value: LandKode.LV, label: "Latvia" },
  { value: LandKode.LI, label: "Liechtenstein" },
  { value: LandKode.LT, label: "Litauen" },
  { value: LandKode.LU, label: "Luxembourg" },
  { value: LandKode.MT, label: "Malta" },
  { value: LandKode.NL, label: "Nederland" },
  { value: LandKode.PL, label: "Polen" },
  { value: LandKode.PT, label: "Portugal" },
  { value: LandKode.RO, label: "Romania" },
  { value: LandKode.SK, label: "Slovakia" },
  { value: LandKode.SI, label: "Slovenia" },
  { value: LandKode.ES, label: "Spania" },
  { value: LandKode.GB, label: "Storbritannia" },
  { value: LandKode.SJ, label: "Svalbard og Jan Mayen" },
  { value: LandKode.CH, label: "Sveits" },
  { value: LandKode.SE, label: "Sverige" },
  { value: LandKode.CZ, label: "Tsjekkia" },
  { value: LandKode.DE, label: "Tyskland" },
  { value: LandKode.HU, label: "Ungarn" },
  { value: LandKode.AT, label: "Østerrike" },
  { value: LandKode.AX, label: "Åland" },
];

export function LandVelgerFormPart({
  formFieldName,
  label,
  className,
  ...selectProps
}: LandVelgerFormPartProps) {
  const { register, getFieldState, formState } = useFormContext();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const fieldState = getFieldState(formFieldName, formState);
  const error = translateError(fieldState.error?.message as string);

  return (
    <Select
      className={className}
      error={error}
      label={label}
      {...register(formFieldName)}
      {...selectProps}
    >
      <option value="">{t("landVelgerFormPart.velgLand")}</option>
      {landOptions.map((land) => (
        <option key={land.value} value={land.value}>
          {land.label}
        </option>
      ))}
    </Select>
  );
}

export function landKodeTilNavn(landkode: string): string {
  const land = landOptions.find((land) => land.value === landkode);

  return land ? land.label : landkode;
}
