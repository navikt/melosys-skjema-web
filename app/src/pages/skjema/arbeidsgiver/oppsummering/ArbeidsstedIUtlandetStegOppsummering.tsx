import { FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import { landKodeTilNavn } from "~/components/LandVelgerFormPart.tsx";
import {
  Farvann,
  FastEllerVekslendeArbeidssted,
  OffshoreDto,
  OmBordPaFlyDto,
  PaLandDto,
  PaSkipDto,
  TypeInnretning,
} from "~/types/melosysSkjemaTypes.ts";
import { useBooleanToJaNei } from "~/utils/translation.ts";

import {
  arbeidsstedTypeOptions,
  stepKey as arbeidsstedIUtlandetStepKey,
} from "../arbeidssted-i-utlandet/ArbeidsstedIUtlandetSteg.tsx";
import { ARBEIDSGIVER_STEG_REKKEFOLGE } from "../stegRekkefølge.ts";
import { ArbeidsgiverSkjemaProps } from "../types.ts";

export function ArbeidsstedIUtlandetStegOppsummering({
  skjema,
}: ArbeidsgiverSkjemaProps) {
  const { t } = useTranslation();

  const arbeidsstedData = skjema.data.arbeidsstedIUtlandet;
  const arbeidsstedSteg = ARBEIDSGIVER_STEG_REKKEFOLGE.find(
    (steg) => steg.key === arbeidsstedIUtlandetStepKey,
  );
  const editHref = arbeidsstedSteg?.route.replace("$id", skjema.id) || "";

  return arbeidsstedData ? (
    <FormSummary className="mt-8">
      <FormSummary.Header>
        <FormSummary.Heading level="2">
          {t("arbeidsstedIUtlandetSteg.tittel")}
        </FormSummary.Heading>
      </FormSummary.Header>

      <FormSummary.Answers>
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.hvorSkalArbeidetUtfores")}
          </FormSummary.Label>
          <FormSummary.Value>
            {t(
              arbeidsstedTypeOptions.find(
                (option) => option.value === arbeidsstedData.arbeidsstedType,
              )?.labelKey || "",
            )}
          </FormSummary.Value>
        </FormSummary.Answer>

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
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  return (
    <>
      {paLand.fastEllerVekslendeArbeidssted && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.harFastArbeidsstedEllerVeksler")}
          </FormSummary.Label>
          <FormSummary.Value>
            {paLand.fastEllerVekslendeArbeidssted ===
            FastEllerVekslendeArbeidssted.FAST
              ? t("arbeidsstedIUtlandetSteg.fastArbeidssted")
              : t("arbeidsstedIUtlandetSteg.vekslerOfte")}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.fastArbeidssted?.vegadresse && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.vegadresse")}
          </FormSummary.Label>
          <FormSummary.Value>
            {paLand.fastArbeidssted.vegadresse}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.fastArbeidssted?.nummer && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.nummer")}
          </FormSummary.Label>
          <FormSummary.Value>{paLand.fastArbeidssted.nummer}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.fastArbeidssted?.postkode && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.postkode")}
          </FormSummary.Label>
          <FormSummary.Value>
            {paLand.fastArbeidssted.postkode}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.fastArbeidssted?.bySted && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.bySted")}
          </FormSummary.Label>
          <FormSummary.Value>{paLand.fastArbeidssted.bySted}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.beskrivelseVekslende && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.beskriv")}
          </FormSummary.Label>
          <FormSummary.Value>{paLand.beskrivelseVekslende}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paLand.erHjemmekontor !== undefined && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.erHjemmekontor")}
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
  const { t } = useTranslation();

  return (
    <>
      {offshore.navnPaInnretning && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.navnPaInnretning")}
          </FormSummary.Label>
          <FormSummary.Value>{offshore.navnPaInnretning}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {offshore.typeInnretning && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.hvilkenTypeInnretning")}
          </FormSummary.Label>
          <FormSummary.Value>
            {offshore.typeInnretning ===
            TypeInnretning.PLATTFORM_ELLER_ANNEN_FAST_INNRETNING
              ? t("arbeidsstedIUtlandetSteg.plattformEllerFast")
              : t("arbeidsstedIUtlandetSteg.boreskipEllerFlyttbar")}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {offshore.sokkelLand && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.hvilketLandsSokkel")}
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
  const { t } = useTranslation();

  return (
    <>
      {paSkip.navnPaSkip && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.navnPaSkip")}
          </FormSummary.Label>
          <FormSummary.Value>{paSkip.navnPaSkip}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paSkip.yrketTilArbeidstaker && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.yrketTilArbeidstaker")}
          </FormSummary.Label>
          <FormSummary.Value>{paSkip.yrketTilArbeidstaker}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paSkip.seilerI && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.hvorSkalSkipetSeile")}
          </FormSummary.Label>
          <FormSummary.Value>
            {paSkip.seilerI === Farvann.INTERNASJONALT_FARVANN
              ? t("arbeidsstedIUtlandetSteg.internasjonaltFarvann")
              : t("arbeidsstedIUtlandetSteg.territorialfarvann")}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paSkip.flaggland && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.flaggland")}
          </FormSummary.Label>
          <FormSummary.Value>
            {landKodeTilNavn(paSkip.flaggland)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {paSkip.territorialfarvannLand && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.hvilketLandsTerritorialfarvann")}
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
  const { t } = useTranslation();
  const booleanToJaNei = useBooleanToJaNei();

  return (
    <>
      {omBordPaFly.hjemmebaseLand && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.hjemmebaseLand")}
          </FormSummary.Label>
          <FormSummary.Value>
            {landKodeTilNavn(omBordPaFly.hjemmebaseLand)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {omBordPaFly.hjemmebaseNavn && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.hjemmebaseNavn")}
          </FormSummary.Label>
          <FormSummary.Value>{omBordPaFly.hjemmebaseNavn}</FormSummary.Value>
        </FormSummary.Answer>
      )}

      {omBordPaFly.erVanligHjemmebase !== undefined && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.erVanligHjemmebase")}
          </FormSummary.Label>
          <FormSummary.Value>
            {booleanToJaNei(omBordPaFly.erVanligHjemmebase)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {omBordPaFly.vanligHjemmebaseLand && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.vanligHjemmebaseLand")}
          </FormSummary.Label>
          <FormSummary.Value>
            {landKodeTilNavn(omBordPaFly.vanligHjemmebaseLand)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}

      {omBordPaFly.vanligHjemmebaseNavn && (
        <FormSummary.Answer>
          <FormSummary.Label>
            {t("arbeidsstedIUtlandetSteg.vanligHjemmebaseNavn")}
          </FormSummary.Label>
          <FormSummary.Value>
            {omBordPaFly.vanligHjemmebaseNavn}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}
    </>
  );
}
