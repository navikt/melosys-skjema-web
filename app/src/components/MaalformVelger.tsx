import { ChevronDownIcon, LanguageIcon } from "@navikt/aksel-icons";
import { Button, Dropdown, HStack } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "nb", label: "Bokmål" },
  { code: "nn", label: "Nynorsk" },
];

export function MaalformVelger() {
  const { i18n } = useTranslation();

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  const handleChangeLanguage = (code: string) => {
    void i18n.changeLanguage(code);
  };

  return (
    <Dropdown>
      <Button as={Dropdown.Toggle} size="small" variant="tertiary-neutral">
        <HStack align="center" gap="2">
          <LanguageIcon aria-hidden fontSize="1.25rem" />
          <span>{currentLanguage?.label}</span>
          <ChevronDownIcon aria-hidden fontSize="1.25rem" />
        </HStack>
      </Button>
      <Dropdown.Menu>
        <Dropdown.Menu.List>
          {LANGUAGES.map((lang) => (
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
