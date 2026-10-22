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
  forenkletArbeidssted: boolean;
  forenkletArbeidstakerdel: boolean;
  lonnOppgisISkatteforhold: boolean;
  /**
   * Offentlig arbeidsgiver der AAREG-treffet ikke er kjent ennå (perioden er ikke lagret),
   * så de neste stegene avhenger av svaret på steg 1.
   */
  flytenErUkjent: boolean;
}

export function getUtsendtArbeidstakerFlyt(
  skjema: FlytGrunnlag,
): UtsendtArbeidstakerFlyt {
  const { metadata } = skjema;
  const erOffentligArbeidsgiver = metadata.erOffentligArbeidsgiver === true;
  const erOffentligTjenesteperson =
    erOffentligArbeidsgiver && metadata.harArbeidsforholdIAareg === true;
  const flytenErUkjent =
    erOffentligArbeidsgiver &&
    metadata.skjemadel !== Skjemadel.ARBEIDSGIVERS_DEL &&
    typeof metadata.harArbeidsforholdIAareg !== "boolean";

  if (metadata.skjemadel === Skjemadel.ARBEIDSTAKERS_DEL) {
    // Forhåndsutfylt fra en innsendt arbeidsgivers del betyr at arbeidsgiveren sendte først
    const arbeidstakerSenderFoerst =
      erOffentligTjenesteperson && !skjema.motpartensUtsendingsperiodeOgLand;
    return {
      utenlandsoppdragetSkalOppgis: false,
      arbeidsstedSkalOppgis: arbeidstakerSenderFoerst,
      forenkletArbeidssted: true,
      forenkletArbeidstakerdel: erOffentligTjenesteperson,
      lonnOppgisISkatteforhold: arbeidstakerSenderFoerst,
      flytenErUkjent,
    };
  }

  return {
    utenlandsoppdragetSkalOppgis: !erOffentligArbeidsgiver,
    arbeidsstedSkalOppgis: true,
    forenkletArbeidssted: erOffentligArbeidsgiver,
    forenkletArbeidstakerdel:
      metadata.skjemadel === Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL &&
      erOffentligTjenesteperson,
    lonnOppgisISkatteforhold: false,
    flytenErUkjent,
  };
}
