import type { QueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { getUserInfo } from "~/httpClients/dekoratorenClient.ts";
import { getOrganisasjonMedJuridiskEnhetQuery } from "~/httpClients/melsosysSkjemaApiClient.ts";
import {
  OpprettetVia,
  type OpprettUtsendtArbeidstakerSoknadRequest,
  Representasjonstype,
  type VentendeMotpartSoknadDto,
} from "~/types/melosysSkjemaTypes.ts";

/**
Opplysningene som trengs for å opprette en søknad, før brukeren har bekreftet.
*/
export interface NySoknad {
  request: OpprettUtsendtArbeidstakerSoknadRequest;
  /**
  Fullt (verifisert) navn på arbeidstaker, kun til visning på introsiden.
  */
  arbeidstakerNavn: string;
}

// Opplysningene (bl.a. fnr) holdes bare i minnet: ikke i URL-en, som ofte logges,
// og ikke i nettleserhistorikken, der de ville overlevd utlogging og oppfrisking.
// Oppfriskes introsiden, er de borte og brukeren sendes til forsiden.
const minne: { nySoknad?: NySoknad } = {};

export function huskNySoknad(nySoknad: NySoknad) {
  minne.nySoknad = nySoknad;
}

/**
Navigerer til introsiden (/skjema/start) der brukeren bekrefter før utkastet opprettes.
*/
export function useGaTilSkjemaStart() {
  const navigate = useNavigate();
  return (nySoknad: NySoknad) => {
    huskNySoknad(nySoknad);
    return navigate({ to: "/skjema/start" });
  };
}

/**
Arbeidstakers del av en ventende motpart-søknad: DEG_SELV, forhåndsutfylt fra arbeidsgivers del.
Brukes av «Fyll ut din del» på oversikten og av varsel-lenka (/fyll-ut-din-del).
*/
export async function byggMotpartSoknad(
  queryClient: QueryClient,
  soknad: VentendeMotpartSoknadDto,
): Promise<NySoknad> {
  // Samme oppslag som søknadsstarteren: arbeidsgiver lagres som juridisk enhet.
  const [organisasjon, bruker] = await Promise.all([
    queryClient.fetchQuery(
      getOrganisasjonMedJuridiskEnhetQuery(soknad.arbeidsgiverOrgnr),
    ),
    queryClient.ensureQueryData(getUserInfo()),
  ]);
  return {
    request: {
      representasjonstype: Representasjonstype.DEG_SELV,
      arbeidsgiver: {
        orgnr: organisasjon.juridiskEnhet.orgnr,
        // API-et krever navn; bruk navnet fra arbeidsgivers del hvis registeret mangler det
        navn: organisasjon.juridiskEnhet.navn || soknad.arbeidsgiverNavn,
      },
      arbeidstaker: { fnr: bruker.userId, etternavn: bruker.name },
      opprettetVia: OpprettetVia.MOTPART_CTA,
      prefyllFraSkjemaId: soknad.skjemaId,
    },
    arbeidstakerNavn: bruker.name,
  };
}

export function hentNySoknad(): NySoknad | undefined {
  return minne.nySoknad;
}

export function glemNySoknad() {
  minne.nySoknad = undefined;
}
