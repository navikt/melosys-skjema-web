import { Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { RadioGroupJaNeiFormPart } from "~/components/RadioGroupJaNeiFormPart.tsx";
import { useSkjemaDefinisjon } from "~/hooks/useSkjemaDefinisjon.ts";
import {
  FastEllerVekslendeArbeidssted,
  type LandKode,
} from "~/types/melosysSkjemaTypes.ts";
import { useTranslateError } from "~/utils/translation.ts";

import { arbeidsstedIUtlandetSchema } from "./arbeidsstedIUtlandetStegSchema.ts";
import { NavnPaVirksomhetFormPart } from "./NavnPaVirksomhetFormPart.tsx";

type ArbeidsstedIUtlandetFormData = z.infer<typeof arbeidsstedIUtlandetSchema>;

interface PaLandFormProperties {
  utsendelseLand?: LandKode;
  /**
  Utelater hjemmekontorspørsmålet i flyten for statlig arbeidsgiver.
  */
  statsansattFlyt?: boolean;
  /**
  Bruker arbeidstakerdelens tekster i du-form.
  */
  erArbeidstaker?: boolean;
}

export function PaLandForm({
  utsendelseLand,
  statsansattFlyt = false,
  erArbeidstaker = false,
}: PaLandFormProperties) {
  const { t } = useTranslation();
  const translateError = useTranslateError();
  const { getSeksjon } = useSkjemaDefinisjon();
  const felter = getSeksjon(
    erArbeidstaker ? "arbeidsstedPaLandArbeidstaker" : "arbeidsstedPaLand",
  ).felter;
  const erHjemmekontorFelt =
    getSeksjon("arbeidsstedPaLand").felter.erHjemmekontor;
  const { control } = useFormContext<ArbeidsstedIUtlandetFormData>();

  const fastEllerVekslendeArbeidssted = useWatch({
    name: "paLand.fastEllerVekslendeArbeidssted",
  });

  // Note: React Hook Form's FieldErrors cannot narrow discriminated unions.
  // This is a known design limitation (react-hook-form/react-hook-form#9287)
  // We use Controller's fieldState.error for individual field errors when available
  return (
    <div className="mt-6">
      <NavnPaVirksomhetFormPart
        formFieldName="paLand.navnPaVirksomhet"
        label={felter.navnPaVirksomhet.label}
      />

      <Controller
        control={control}
        name="paLand.fastEllerVekslendeArbeidssted"
        render={({ field, fieldState }) => (
          <RadioGroup
            className="mt-4"
            error={translateError(fieldState.error?.message)}
            legend={felter.fastEllerVekslendeArbeidssted.label}
            onChange={field.onChange}
            value={field.value ?? ""}
          >
            {felter.fastEllerVekslendeArbeidssted.alternativer.map((alt) => (
              <Radio key={alt.verdi} size="small" value={alt.verdi}>
                {alt.label}
              </Radio>
            ))}
          </RadioGroup>
        )}
      />

      {fastEllerVekslendeArbeidssted === FastEllerVekslendeArbeidssted.FAST && (
        <div className="mt-4">
          <Controller
            control={control}
            name="paLand.fastArbeidssted.vegadresse"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={felter.vegadresse.label}
                value={field.value ?? ""}
              />
            )}
          />
          <Controller
            control={control}
            name="paLand.fastArbeidssted.nummer"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={felter.nummer.label}
                value={field.value ?? ""}
              />
            )}
          />
          <Controller
            control={control}
            name="paLand.fastArbeidssted.postkode"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={felter.postkode.label}
                value={field.value ?? ""}
              />
            )}
          />
          <Controller
            control={control}
            name="paLand.fastArbeidssted.bySted"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                className="mt-4"
                error={translateError(fieldState.error?.message)}
                label={felter.bySted.label}
                value={field.value ?? ""}
              />
            )}
          />
          {utsendelseLand && (
            <TextField
              className="mt-4"
              label={felter.land.label}
              readOnly
              value={t(`land.${utsendelseLand}`)}
            />
          )}
        </div>
      )}

      {!statsansattFlyt && (
        <RadioGroupJaNeiFormPart
          className="mt-6"
          formFieldName="paLand.erHjemmekontor"
          legend={erHjemmekontorFelt.label}
        />
      )}
    </div>
  );
}
