import { PlusIcon } from "@navikt/aksel-icons";
import { Button, ButtonProps } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

interface LeggTilKnappProps extends Omit<
  ButtonProps,
  "icon" | "size" | "variant"
> {
  children?: React.ReactNode;
}

export function LeggTilKnapp({
  children,
  className,
  ...rest
}: LeggTilKnappProps) {
  const { t } = useTranslation();
  return (
    <Button
      className={`w-fit ${className || ""}`}
      icon={<PlusIcon />}
      size="small"
      type="button"
      variant="secondary"
      {...rest}
    >
      {children || t("felles.leggTil")}
    </Button>
  );
}
