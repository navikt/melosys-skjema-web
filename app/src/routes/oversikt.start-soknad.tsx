import { createFileRoute, redirect } from "@tanstack/react-router";

import { StartSoknadPage } from "~/pages/oversikt/start-soknad/StartSoknadPage";
import {
  OpprettSoknadMedKontekstRequest,
  PersonDto,
  SimpleOrganisasjonDto,
} from "~/types/melosysSkjemaTypes";
import { validerSoknadKontekst } from "~/utils/valideringUtils";

export interface StartSoknadLocationState {
  arbeidsgiver?: SimpleOrganisasjonDto;
  arbeidstaker?: PersonDto;
  kontekst: OpprettSoknadMedKontekstRequest;
}

export const Route = createFileRoute("/oversikt/start-soknad")({
  component: StartSoknadRoute,
  beforeLoad: ({ location }) => {
    const state = location.state as unknown as
      | StartSoknadLocationState
      | undefined;

    // Redirect til rot hvis state mangler (f.eks. ved refresh)
    if (!state || !state.kontekst) {
      throw redirect({ to: "/" });
    }

    // Valider at nødvendig data er tilstede
    const kontekst = state.kontekst;
    const arbeidsgiver = state.arbeidsgiver;
    const arbeidstaker = state.arbeidstaker;

    // Redirect til oversikt hvis validering feiler
    const validering = validerSoknadKontekst(
      kontekst,
      arbeidsgiver,
      arbeidstaker,
    );

    if (!validering.gyldig) {
      throw redirect({ to: ".." });
    }

    return {
      hideSiteTitle: true,
      kontekst,
      arbeidsgiver,
      arbeidstaker,
    };
  },
});

function StartSoknadRoute() {
  const { kontekst, arbeidsgiver, arbeidstaker } = Route.useRouteContext();

  return (
    <StartSoknadPage
      arbeidsgiver={arbeidsgiver}
      arbeidstaker={arbeidstaker}
      kontekst={kontekst}
    />
  );
}
