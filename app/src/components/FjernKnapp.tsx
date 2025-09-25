import { TrashIcon } from "@navikt/aksel-icons";
import { Button, ButtonProps } from "@navikt/ds-react";

interface FjernKnappProps
  extends Omit<ButtonProps, "icon" | "type" | "variant"> {
  children?: React.ReactNode;
}

export function FjernKnapp({
  children = "Fjern",
  className,
  ...rest
}: FjernKnappProps) {
  return (
    <Button
      className={className}
      icon={<TrashIcon />}
      type="button"
      variant="tertiary-neutral"
      {...rest}
    >
      {children}
    </Button>
  );
}
