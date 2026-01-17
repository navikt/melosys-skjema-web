import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { landKodeTilNavn } from "~/components/LandVelgerFormPart.tsx";
import {
  getSeksjon,
  SKJEMA_DEFINISJON_A1,
} from "~/constants/skjemaDefinisjonA1";
import {
  OffshoreDto,
  OmBordPaFlyDto,
  PaLandDto,
  PaSkipDto,
} from "~/types/melosysSkjemaTypes.ts";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import { stepKey as arbeidsstedIUtlandetStepKey } from "../arbeidssted-i-utlandet/ArbeidsstedIUtlandetSteg.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";

// Hent seksjoner og felter fra statiske definisjoner
const hovedSeksjon = getSeksjon("arbeidsstedIUtlandet");
const arbeidsstedIUtlandetFelter =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedIUtlandet.felter;

const paLandFelter = SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedPaLand.felter;
const offshoreFelter =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedOffshore.felter;
const paSkipFelter = SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedPaSkip.felter;
const omBordPaFlyFelter =
  SKJEMA_DEFINISJON_A1.seksjoner.arbeidsstedOmBordPaFly.felter;

// Hjelpefunksjon for å hente label for alternativ fra SELECT-felt
function getAlternativLabel(
  alternativer: ReadonlyArray<{ verdi: string; label: string }>,
  verdi: string,
): string {
  return alternativer.find((alt) => alt.verdi === verdi)?.label || verdi;
}

export function ArbeidsstedIUtlandetStegOppsummering({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const arbeidsstedData = skjema.data.arbeidsstedIUtlandet;
  const arbeidsstedSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidsstedIUtlandetStepKey,
  );
  const editHref = arbeidsstedSteg?.route.replace("$id", skjema.id) || "";

  const navnPaVirksomhet =
    arbeidsstedData?.paLand?.navnPaVirksomhet ??
    arbeidsstedData?.offshore?.navnPaVirksomhet ??
    arbeidsstedData?.paSkip?.navnPaVirksomhet ??
    arbeidsstedData?.omBordPaFly?.navnPaVirksomhet;

  return arbeidsstedData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">
          {hovedSeksjon.tittel}
        </FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            {arbeidsstedIUtlandetFelter.arbeidsstedType.label}
          </FormSummary.Label>
          <FormSummary.Value>
            {getAlternativLabel(
              arbeidsstedIUtlandetFelter.arbeidsstedType.alternativer,
              arbeidsstedData.arbeidsstedType,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

        {navnPaVirksomhet && (
          <FormSummary.Answer>
            <FormSummary.Label>
              {paLandFelter.navnPaVirksomhet.label}
            </FormSummary.Label>
            <FormSummary.Value>{navnPaVirksomhet}</FormSummary.Value>
          </FormSummary.Answer>
        )}

        {arbeidsstedData.paLand && (
          <PaLandOppsummering paLand={arbeidsstedData.paLand} />
        )}

        {arbeidsstedData.offshore && (
          <OffshoreOppsummering offshore={arbeidsstedData.offshore} />
        )}

        {arbeidsstedData.paSkip && (
          <PaSkipOppsummering paSkip={arbeidsstedData.paSkip} />
        )}

        {arbeidsstedData.omBordPaFly && (
          <OmBordPaFlyOppsummering omBordPaFly={arbeidsstedData.omBordPaFly} />
        )}
      </FormSummary.Answers>

      <FormSummary.Footer>
        <FormSummary.EditLink href={editHref}>
          {t("felles.endreSvar")}
        </FormSummary.EditLink>
      </FormSummary.Footer>
    </FormSummary>
  ) : null;
}

function PaLandOppsummering({ paLand }: { paLand: PaLandDto }) {
  const booleanToJaNei = useBooleanToJaNei();

  return (
    <>
      {paLand.fastEllerVekslendeArbeidssted && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {paLandFelter.fastEllerVekslendeArbeidssted.label}
          </FormSummary.Label>
          <FormSummary.Value>
            {getAlternativLabel(
              paLandFelter.fastEllerVekslendeArbeidssted.alternativer,
              paLand.fastEllerVekslendeArbeidssted,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.fastArbeidssted?.vegadresse && (
        <FormSummary.Answer>
          <FormSummary.Label>{paLandFelter.vegadresse.label}</FormSummary.Label>
          <FormSummary.Value>
            {paLand.fastArbeidssted.vegadresse}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.fastArbeidssted?.nummer && (
        <FormSummary.Answer>
          <FormSummary.Label>{paLandFelter.nummer.label}</FormSummary.Label>
          <FormSummary.Value>{paLand.fastArbeidssted.nummer}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.fastArbeidssted?.postkode && (
        <FormSummary.Answer>
          <FormSummary.Label>{paLandFelter.postkode.label}</FormSummary.Label>
          <FormSummary.Value>
            {paLand.fastArbeidssted.postkode}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.fastArbeidssted?.bySted && (
        <FormSummary.Answer>
          <FormSummary.Label>{paLandFelter.bySted.label}</FormSummary.Label>
          <FormSummary.Value>{paLand.fastArbeidssted.bySted}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.beskrivelseVekslende && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {paLandFelter.beskrivelseVekslende.label}
          </FormSummary.Label>
          <FormSummary.Value>{paLand.beskrivelseVekslende}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.erHjemmekontor !== undefined && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {paLandFelter.erHjemmekontor.label}
          </FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(paLand.erHjemmekontor)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}
    </>
  );
}

function OffshoreOppsummering({ offshore }: { offshore: OffshoreDto }) {
  return (
    <>
      {offshore.navnPaInnretning && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {offshoreFelter.navnPaInnretning.label}
          </FormSummary.Label>
          <FormSummary.Value>{offshore.navnPaInnretning}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {offshore.typeInnretning && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {offshoreFelter.typeInnretning.label}
          </FormSummary.Label>
          <FormSummary.Value>
            {getAlternativLabel(
              offshoreFelter.typeInnretning.alternativer,
              offshore.typeInnretning,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {offshore.sokkelLand && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {offshoreFelter.sokkelLand.label}
          </FormSummary.Label>
          <FormSummary.Value>
            {landKodeTilNavn(offshore.sokkelLand)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}
    </>
  );
}

function PaSkipOppsummering({ paSkip }: { paSkip: PaSkipDto }) {
  return (
    <>
      {paSkip.navnPaSkip && (
        <FormSummary.Answer>
          <FormSummary.Label>{paSkipFelter.navnPaSkip.label}</FormSummary.Label>
          <FormSummary.Value>{paSkip.navnPaSkip}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paSkip.yrketTilArbeidstaker && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {paSkipFelter.yrketTilArbeidstaker.label}
          </FormSummary.Label>
          <FormSummary.Value>{paSkip.yrketTilArbeidstaker}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paSkip.seilerI && (
        <FormSummary.Answer>
          <FormSummary.Label>{paSkipFelter.seilerI.label}</FormSummary.Label>
          <FormSummary.Value>
            {getAlternativLabel(
              paSkipFelter.seilerI.alternativer,
              paSkip.seilerI,
            )}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paSkip.flaggland && (
        <FormSummary.Answer>
          <FormSummary.Label>{paSkipFelter.flaggland.label}</FormSummary.Label>
          <FormSummary.Value>
            {landKodeTilNavn(paSkip.flaggland)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paSkip.territorialfarvannLand && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {paSkipFelter.territorialfarvannLand.label}
          </FormSummary.Label>
          <FormSummary.Value>
            {landKodeTilNavn(paSkip.territorialfarvannLand)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}
    </>
  );
}

function OmBordPaFlyOppsummering({
  omBordPaFly,
}: {
  omBordPaFly: OmBordPaFlyDto;
}) {
  const booleanToJaNei = useBooleanToJaNei();

  return (
    <>
      {omBordPaFly.hjemmebaseLand && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {omBordPaFlyFelter.hjemmebaseLand.label}
          </FormSummary.Label>
          <FormSummary.Value>
            {landKodeTilNavn(omBordPaFly.hjemmebaseLand)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {omBordPaFly.hjemmebaseNavn && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {omBordPaFlyFelter.hjemmebaseNavn.label}
          </FormSummary.Label>
          <FormSummary.Value>{omBordPaFly.hjemmebaseNavn}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {omBordPaFly.erVanligHjemmebase !== undefined && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {omBordPaFlyFelter.erVanligHjemmebase.label}
          </FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(omBordPaFly.erVanligHjemmebase)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {omBordPaFly.vanligHjemmebaseLand && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {omBordPaFlyFelter.vanligHjemmebaseLand.label}
          </FormSummary.Label>
          <FormSummary.Value>
            {landKodeTilNavn(omBordPaFly.vanligHjemmebaseLand)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {omBordPaFly.vanligHjemmebaseNavn && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {omBordPaFlyFelter.vanligHjemmebaseNavn.label}
          </FormSummary.Label>
          <FormSummary.Value>
            {omBordPaFly.vanligHjemmebaseNavn}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}
    </>
  );
}
