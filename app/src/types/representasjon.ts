import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

export type RepresentasjonsKontekst = {
  representasjonstype: Exclude<
    Representasjonstype,
    | Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT
    | Representasjonstype.RADGIVER_MED_FULLMAKT
  >;
  radgiverOrgnr?: string;
};
