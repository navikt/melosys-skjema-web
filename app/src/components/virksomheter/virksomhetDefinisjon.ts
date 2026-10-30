import { useTranslation } from "react-i18next";

interface VirksomhetFeltDefinisjon {
  readonly label: string;
  readonly pakrevd: boolean;
}

interface VirksomhetValgFeltDefinisjon extends VirksomhetFeltDefinisjon {
  readonly alternativer: ReadonlyArray<{
    readonly verdi: string;
    readonly label: string;
  }>;
}

export interface VirksomhetElementDefinisjon {
  readonly navn: VirksomhetFeltDefinisjon;
  readonly organisasjonsnummer: VirksomhetFeltDefinisjon;
  readonly organisasjonsnummerEllerRegistreringsnummer: VirksomhetFeltDefinisjon;
  readonly vegnavnOgHusnummer: VirksomhetFeltDefinisjon;
  readonly bygning: VirksomhetFeltDefinisjon;
  readonly postkode: VirksomhetFeltDefinisjon;
  readonly byStedsnavn: VirksomhetFeltDefinisjon;
  readonly region: VirksomhetFeltDefinisjon;
  readonly land: VirksomhetFeltDefinisjon;
  readonly tilhorerSammeKonsern: VirksomhetFeltDefinisjon;
  readonly ansettelsesform?: VirksomhetValgFeltDefinisjon;
}

export interface VirksomhetListeDefinisjon {
  readonly label: string;
  readonly hjelpetekst?: string;
  readonly elementDefinisjon: VirksomhetElementDefinisjon;
}

/**
 * Gir ledeteksten for et felt i skjemaet, med «(valgfritt)» når feltet ikke er påkrevd.
 */
export function useFeltLabel() {
  const { t } = useTranslation();
  return (felt: VirksomhetFeltDefinisjon) =>
    felt.pakrevd ? felt.label : `${felt.label} ${t("felles.valgfritt")}`;
}
