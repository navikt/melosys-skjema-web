import { TrashIcon } from "@navikt/aksel-icons";
import { Button, ButtonProps } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

interface FjernKnappProperties extends Omit<
  ButtonProps,
  "icon" | "type" | "variant"
> {
  children?: React.ReactNode;
}

export function FjernKnapp({
  children,
  className,
  ...rest
}: FjernKnappProperties) {
  const { t } = useTranslation();
  return (
    <Button
      className={className}
      icon={<TrashIcon />}
      type="button"
      variant="tertiary-neutral"
      {...rest}
    >
      {children || t("felles.fjern")}
    </Button>
  );
}
