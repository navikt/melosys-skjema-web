import { PencilIcon } from "@navikt/aksel-icons";
import { Button, ButtonProps } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

interface EndreKnappProps
  extends Omit<ButtonProps, "icon" | "type" | "variant"> {
  children?: React.ReactNode;
}

export function EndreKnapp({ children, className, ...rest }: EndreKnappProps) {
  const { t } = useTranslation();
  return (
    <Button
      className={className}
      icon={<PencilIcon />}
      type="button"
      variant="tertiary-neutral"
      {...rest}
    >
      {children || t("felles.endre")}
    </Button>
  );
}
