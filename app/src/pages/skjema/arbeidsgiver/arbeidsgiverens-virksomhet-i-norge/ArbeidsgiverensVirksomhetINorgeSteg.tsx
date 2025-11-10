import { ErrorMessage, Loader } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { getOrganisasjonQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import { VirksomhetINorgeStegContent } from "~/pages/skjema/arbeidsgiver/arbeidsgiverens-virksomhet-i-norge/VirksomhetINorgeStegContent.tsx";
import { OrganisasjonMedJuridiskEnhet } from "~/types/melosysSkjemaTypes.ts";

import { ArbeidsgiverStegLoader } from "../components/ArbeidsgiverStegLoader.tsx";
import { ArbeidsgiverSkjemaProps } from "../types.ts";

export const stepKey = "arbeidsgiverens-virksomhet-i-norge";

function ArbeidsgiverensVirksomhetINorgeStegContent({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  if (!skjema.data.arbeidsgiveren) {
    return (
      <Navigate
        params={{ id: skjema.id }}
        to="/skjema/arbeidsgiver/$id/arbeidsgiveren"
      />
    );
  }

  const { t } = useTranslation();

  const organisasjonMedJuridiskEnhet = useQuery(
    getOrganisasjonQuery(skjema.data.arbeidsgiveren.organisasjonsnummer),
  );

  const erOffentligVirksomhet =
    organisasjonMedJuridiskEnhet?.data &&
    erOrganisasjonOffentligVirksomhet(organisasjonMedJuridiskEnhet.data);

  if (organisasjonMedJuridiskEnhet?.error) {
    return <ErrorMessage>{t("felles.feil")}</ErrorMessage>;
  }

  if (organisasjonMedJuridiskEnhet?.isPending) return <Loader />;

  /*
    På et punkt så skal vi implementere en alternativ flyt dersom det er offentlig virksomhet.
    Dette var så langt jeg kom før vi måtte reprioritere litt. Lar allikevel denne nå litt unødvendige sjekken
    være igjen for å gjøre det enklere å plukke opp igjen senere.
   */
  if (erOffentligVirksomhet) {
    return <VirksomhetINorgeStegContent skjema={skjema} />;
  }
  return <VirksomhetINorgeStegContent skjema={skjema} />;
}

interface ArbeidsgiverensVirksomhetINorgeStegProps {
  id: string;
}

export function ArbeidsgiverensVirksomhetINorgeSteg({
  id,
}: ArbeidsgiverensVirksomhetINorgeStegProps) {
  return (
    <ArbeidsgiverStegLoader id={id}>
      {(skjema) => (
        <ArbeidsgiverensVirksomhetINorgeStegContent skjema={skjema} />
      )}
    </ArbeidsgiverStegLoader>
  );
}

function erOrganisasjonOffentligVirksomhet(
  organisasjon: OrganisasjonMedJuridiskEnhet,
) {
  return (
    organisasjon.juridiskEnhet.juridiskEnhetDetaljer?.enhetstype === "STAT" &&
    organisasjon.juridiskEnhet.juridiskEnhetDetaljer?.sektorkode === "6100"
  );
}
