import { FormProgress } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

export type StegKey =
  | "arbeidsgiverens-virksomhet-i-norge"
  | "utenlandsoppdraget"
  | "arbeidssted-i-utlandet"
  | "arbeidstakerens-lonn"
  | "tilleggsopplysninger"
  | "vedlegg"
  | "oppsummering"
  | "arbeidssituasjon"
  | "skatteforhold-og-inntekt"
  | "familiemedlemmer";

export interface StegRekkefolgeItem {
  key: StegKey;
  title: string;
  route: string;
}

type FremgangsindikatorProps = {
  aktivtSteg: number;
  stegRekkefolge: StegRekkefolgeItem[];
  className?: string;
};

export const Fremgangsindikator = ({
  aktivtSteg,
  stegRekkefolge,
  className,
}: FremgangsindikatorProps) => {
  const { t } = useTranslation();
  return (
    <FormProgress
      activeStep={aktivtSteg}
      className={className ? `col-span-2 ${className}` : "col-span-2"}
      interactiveSteps={true}
      totalSteps={stegRekkefolge.length}
    >
      {stegRekkefolge.map((step) => (
        <FormProgress.Step href={step.key} key={step.key}>
          {t(step.title)}
        </FormProgress.Step>
      ))}
    </FormProgress>
  );
};
