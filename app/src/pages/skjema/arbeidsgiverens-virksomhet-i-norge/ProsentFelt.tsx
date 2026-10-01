import { BodyShort, Label, TextField, VStack } from "@navikt/ds-react";
import type { ComponentProps } from "react";

type ProsentFeltProperties = Omit<
  ComponentProps<typeof TextField>,
  "hideLabel" | "label"
> & {
  label: string;
};

/**
 * TextField med «%» bak inputen. Aksel har ikke innebygd suffiks, så labelen vises
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
          className="[&_input]:w-20"
          hideLabel
          inputMode="numeric"
          label={label}
          maxLength={3}
          {...textFieldProps}
        />
        <BodyShort
          aria-hidden
          as="span"
          className="absolute top-0 left-22 flex h-12 items-center"
        >
          %
        </BodyShort>
      </div>
    </VStack>
  );
}
