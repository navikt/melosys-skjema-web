import { useTranslation } from "react-i18next";

export function useTranslateError() {
  const { t } = useTranslation();

  return (error?: string) => error && t(error);
}
