import { Select, SelectProps } from "@navikt/ds-react";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { LandKode } from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

type LandVelgerFormPartProps = {
  formFieldName: string;
  label: string;
  className?: string;
  inkluderNorge?: boolean;
} & Omit<SelectProps, "children" | "onChange" | "value">;

const landKoder: LandKode[] = [
  LandKode.AT,
  LandKode.AX,
  LandKode.BE,
  LandKode.BG,
  LandKode.CH,
  LandKode.CY,
  LandKode.CZ,
  LandKode.DE,
  LandKode.DK,
  LandKode.EE,
  LandKode.ES,
  LandKode.FI,
  LandKode.FO,
  LandKode.FR,
  LandKode.GB,
  LandKode.GL,
  LandKode.GR,
  LandKode.HR,
  LandKode.HU,
  LandKode.IE,
  LandKode.IS,
  LandKode.IT,
  LandKode.LI,
  LandKode.LT,
  LandKode.LU,
  LandKode.LV,
  LandKode.MT,
  LandKode.NL,
  LandKode.PL,
  LandKode.PT,
  LandKode.RO,
  LandKode.SE,
  LandKode.SI,
  LandKode.SJ,
  LandKode.SK,
];

const landKoderMedNorge: LandKode[] = [...landKoder, LandKode.NO];

export function LandVelgerFormPart({
  formFieldName,
  label,
  className,
  inkluderNorge,
  ...selectProps
}: LandVelgerFormPartProps) {
  const { register, getFieldState, formState } = useFormContext();
  const { t } = useTranslation();
  const translateError = useTranslateError();

  const fieldState = getFieldState(formFieldName, formState);
  const error = translateError(fieldState.error?.message as string);

  const koder = inkluderNorge ? landKoderMedNorge : landKoder;

  const options = useMemo(
    () =>
      koder
        .map((kode) => ({ value: kode, label: t(`land.${kode}`) }))
        .toSorted((a, b) => a.label.localeCompare(b.label)),
    [koder, t],
  );

  return (
    <Select
      className={className}
      error={error}
      label={label}
      {...register(formFieldName)}
      {...selectProps}
    >
      <option value="">{t("landVelgerFormPart.velgLand")}</option>
      {options.map((land) => (
        <option key={land.value} value={land.value}>
          {land.label}
        </option>
      ))}
    </Select>
  );
}
