import {
  Skjemadel,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes.ts";

export type FlytGrunnlag = Pick<
  UtsendtArbeidstakerSkjemaDto,
  "metadata" | "motpartensUtsendingsperiodeOgLand"
>;

/**
 * Hvilke spørsmål skjemadelen skal ha svar på, gitt arbeidsgivertype og AAREG-treff.
 * Speiler `UtsendtArbeidstakerFlyt` i melosys-skjema-api.
 */
export interface UtsendtArbeidstakerFlyt {
  utenlandsoppdragetSkalOppgis: boolean;
  arbeidsstedSkalOppgis: boolean;
  arbeidsstedForStatsansatt: boolean;
  arbeidstakerdelForStatsansatt: boolean;
  lonnOppgisISkatteforhold: boolean;
  /**
   * Statlig arbeidsgiver der AAREG-treffet ikke er kjent ennå (perioden er ikke lagret),
   * så de neste stegene avhenger av svaret på steg 1.
   */
  flytenErUkjent: boolean;
}

export function getUtsendtArbeidstakerFlyt(
  skjema: FlytGrunnlag,
): UtsendtArbeidstakerFlyt {
  const { metadata } = skjema;
  const erStatligArbeidsgiver = metadata.erStatligArbeidsgiver === true;
  const erStatsansatt =
    erStatligArbeidsgiver && metadata.harArbeidsforholdIAareg === true;
  const flytenErUkjent =
    erStatligArbeidsgiver &&
    metadata.skjemadel !== Skjemadel.ARBEIDSGIVERS_DEL &&
    typeof metadata.harArbeidsforholdIAareg !== "boolean";

  if (metadata.skjemadel === Skjemadel.ARBEIDSTAKERS_DEL) {
    // Forhåndsutfylt fra en innsendt arbeidsgivers del betyr at arbeidsgiveren sendte først
    const arbeidstakerSenderFoerst =
      erStatsansatt && !skjema.motpartensUtsendingsperiodeOgLand;
    return {
      utenlandsoppdragetSkalOppgis: false,
      arbeidsstedSkalOppgis: arbeidstakerSenderFoerst,
      arbeidsstedForStatsansatt: true,
      arbeidstakerdelForStatsansatt: erStatsansatt,
      lonnOppgisISkatteforhold: arbeidstakerSenderFoerst,
      flytenErUkjent,
    };
  }

  return {
    utenlandsoppdragetSkalOppgis: !erStatligArbeidsgiver,
    arbeidsstedSkalOppgis: true,
    arbeidsstedForStatsansatt: erStatligArbeidsgiver,
    arbeidstakerdelForStatsansatt:
      metadata.skjemadel === Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL &&
      erStatsansatt,
    lonnOppgisISkatteforhold: false,
    flytenErUkjent,
  };
}
