import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

export const VALID_KONTEKST_TYPES = [
  Representasjonstype.DEG_SELV,
  Representasjonstype.ARBEIDSGIVER,
  Representasjonstype.RADGIVER,
  Representasjonstype.ANNEN_PERSON,
] as const;

export type RepresentasjonsKontekst = {
  representasjonstype: Exclude<
    Representasjonstype,
    | Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT
    | Representasjonstype.RADGIVER_MED_FULLMAKT
  >;
  radgiverOrgnr?: string;
};
