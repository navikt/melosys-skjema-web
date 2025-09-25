import { PlusIcon } from "@navikt/aksel-icons";
import { Button, ButtonProps } from "@navikt/ds-react";

interface LeggTilKnappProps
  extends Omit<ButtonProps, "icon" | "size" | "variant"> {
  children: React.ReactNode;
}

export function LeggTilKnapp({
  children,
  className,
  ...rest
}: LeggTilKnappProps) {
  return (
    <Button
      className={`w-fit ${className || ""}`}
      icon={<PlusIcon />}
      size="small"
      type="button"
      variant="secondary"
      {...rest}
    >
      {children}
    </Button>
  );
}
