import { ChevronDownIcon, GlobeIcon } from "@navikt/aksel-icons";
import { Button, Dropdown, HStack } from "@navikt/ds-react";
import { setParams } from "@navikt/nav-dekoratoren-moduler";
import { useTranslation } from "react-i18next";

import { type Language, SUPPORTED_LANGUAGES } from "~/utils/languages.ts";

export function MaalformVelger() {
  const { i18n } = useTranslation();

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === i18n.language) ??
    SUPPORTED_LANGUAGES[0]!;

  const handleChangeLanguage = async (code: Language["code"]) => {
    await setParams({ language: code });
    await i18n.changeLanguage(code);
  };

  return (
    <Dropdown>
      <Button as={Dropdown.Toggle} variant="tertiary-neutral">
        <HStack align="center" gap="2">
          <GlobeIcon aria-hidden fontSize="1.25rem" />
          <span>{currentLanguage.label}</span>
          <ChevronDownIcon aria-hidden fontSize="1.25rem" />
        </HStack>
      </Button>
      <Dropdown.Menu>
        <Dropdown.Menu.List>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Dropdown.Menu.List.Item
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
            >
              {lang.label}
            </Dropdown.Menu.List.Item>
          ))}
        </Dropdown.Menu.List>
      </Dropdown.Menu>
    </Dropdown>
  );
}
