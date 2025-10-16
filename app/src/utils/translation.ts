import { useTranslation } from "react-i18next";

export function useTranslateError() {
  const { t } = useTranslation();

  return (error?: string) => error && t(error);
}

export function useBooleanToJaNei() {
  const { t } = useTranslation();

  return (value: boolean) => (value ? t("felles.ja") : t("felles.nei"));
}
