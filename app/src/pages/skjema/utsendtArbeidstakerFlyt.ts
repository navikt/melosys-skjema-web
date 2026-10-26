import { STATSANSATT_FLYT } from "~/featuretoggle/toggleNavn.ts";
import { useFeatureToggle } from "~/featuretoggle/useFeatureToggle.ts";
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
   * Statlig arbeidsgiver der AAREG-treffet ennå ikke er kjent.
   * Stegene kan derfor først bestemmes når utsendingsperioden er lagret og AAREG-oppslaget er utført.
   */
  flytenErUkjent: boolean;
}

export function getUtsendtArbeidstakerFlyt(
  skjema: FlytGrunnlag,
  statsansattFlytAktivert: boolean,
): UtsendtArbeidstakerFlyt {
  const { metadata } = skjema;
  // MIDLERTIDIG MELOSYS-7694: fjern gammel-flyt-grenen når statsansattflyten er permanent.
  if (!statsansattFlytAktivert) {
    const harArbeidsgiverdel =
      metadata.skjemadel !== Skjemadel.ARBEIDSTAKERS_DEL;
    return {
      utenlandsoppdragetSkalOppgis: harArbeidsgiverdel,
      arbeidsstedSkalOppgis: harArbeidsgiverdel,
      arbeidsstedForStatsansatt: false,
      arbeidstakerdelForStatsansatt: false,
      lonnOppgisISkatteforhold: false,
      flytenErUkjent: false,
    };
  }

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

// MIDLERTIDIG MELOSYS-7694: erstatt hooken med getUtsendtArbeidstakerFlyt ved avvikling av togglen.
export function useUtsendtArbeidstakerFlyt(skjema: FlytGrunnlag) {
  const statsansattFlytAktivert = useFeatureToggle(STATSANSATT_FLYT) ?? false;
  return getUtsendtArbeidstakerFlyt(skjema, statsansattFlytAktivert);
}
