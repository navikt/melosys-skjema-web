import { Select, VStack } from "@navikt/ds-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OrganisasjonSoker } from "~/components/OrganisasjonSoker.tsx";
import { SimpleOrganisasjonDto } from "~/types/melosysSkjemaTypes.ts";

const ANNEN_ARBEIDSGIVER = "annen-arbeidsgiver";

interface ArbeidsforholdVelgerProperties {
  arbeidsgivere: SimpleOrganisasjonDto[];
  formFieldName: string;
  initialOrgnr?: string;
}

/**
 * Nedtrekksliste med arbeidsgivere fra Aa-registeret (DEG_SELV). «Annen arbeidsgiver»
 * viser org.nr.-feltet for arbeidsgivere som ikke er i listen.
 */
export function ArbeidsforholdVelger({
  arbeidsgivere,
  formFieldName,
  initialOrgnr,
}: ArbeidsforholdVelgerProperties) {
  const { t } = useTranslation();
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const initialOrgnrErIListen = arbeidsgivere.some(
    (org) => org.orgnr === initialOrgnr,
  );
  const [valg, setValg] = useState(() => {
    if (!initialOrgnr) return "";
    return initialOrgnrErIListen ? initialOrgnr : ANNEN_ARBEIDSGIVER;
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nyttValg = e.target.value;
    setValg(nyttValg);
    const valgtOrganisasjon = arbeidsgivere.find(
      (org) => org.orgnr === nyttValg,
    );
    setValue(
      formFieldName,
      valgtOrganisasjon
        ? { orgnr: valgtOrganisasjon.orgnr, navn: valgtOrganisasjon.navn }
        : undefined,
      { shouldValidate: !!valgtOrganisasjon },
    );
  };

  const formError = errors[formFieldName]?.message;

  return (
    <VStack gap="space-24">
      <div className="max-w-lg w-full">
        <Select
          description={t("oversiktFelles.arbeidsforholdVelgerInfo")}
          error={
            valg !== ANNEN_ARBEIDSGIVER && typeof formError === "string"
              ? t(formError)
              : undefined
          }
          label={t("oversiktFelles.arbeidsforholdVelgerLabel")}
          onChange={handleChange}
          value={valg}
        >
          <option value="">
            {t("oversiktFelles.arbeidsforholdVelgerPlaceholder")}
          </option>
          {arbeidsgivere.map((org) => (
            <option key={org.orgnr} value={org.orgnr}>
              {`${org.navn} (${org.orgnr})`}
            </option>
          ))}
          {arbeidsgivere.length > 0 && <hr />}
          <option value={ANNEN_ARBEIDSGIVER}>
            {t("oversiktFelles.arbeidsforholdVelgerAnnenArbeidsgiver")}
          </option>
        </Select>
      </div>

      {valg === ANNEN_ARBEIDSGIVER && (
        <OrganisasjonSoker
          formFieldName={formFieldName}
          initialOrgnr={initialOrgnrErIListen ? undefined : initialOrgnr}
          label={t("oversiktFelles.arbeidsgiverOrgnrLabel")}
        />
      )}
    </VStack>
  );
}
