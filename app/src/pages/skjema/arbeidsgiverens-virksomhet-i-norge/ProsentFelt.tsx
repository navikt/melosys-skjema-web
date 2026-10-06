import { BodyShort, Label, TextField, VStack } from "@navikt/ds-react";
import type { ComponentProps } from "react";

type ProsentFeltProperties = Omit<
  ComponentProps<typeof TextField>,
  "hideLabel" | "label"
> & {
  label: string;
};

export const FELTBREDDE = "[&_input]:w-36";

/**
 * TextField med «%» inne i inputen. Aksel har ikke innebygd suffiks, så labelen vises
 * separat (aria-hidden) mens TextField har skjult label som gir tilgjengelig navn.
 */
export function ProsentFelt({
  label,
  className,
  ...textFieldProps
}: ProsentFeltProperties) {
  return (
    <VStack className={className} gap="space-8">
      <Label aria-hidden as="span">
        {label}
      </Label>
      <div className="relative">
        <TextField
          className={`${FELTBREDDE} [&_input]:pr-10`}
          hideLabel
          inputMode="numeric"
          label={label}
          maxLength={3}
          {...textFieldProps}
        />
        <BodyShort
          aria-hidden
          as="span"
          className="pointer-events-none absolute top-0 left-0 flex h-12 w-36 items-center justify-end pr-4"
          textColor="subtle"
        >
          %
        </BodyShort>
      </div>
    </VStack>
  );
}
