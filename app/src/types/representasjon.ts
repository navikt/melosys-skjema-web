import { z } from "zod";

import type { UtsendtArbeidstakerSkjemaDto } from "~/types/melosysSkjemaTypes.ts";
import {
  OpprettetVia,
  Representasjonstype,
} from "~/types/melosysSkjemaTypes.ts";

export const representasjonskontekstSchema = z.object({
  representasjonstype: z.enum([
    Representasjonstype.DEG_SELV,
    Representasjonstype.ARBEIDSGIVER,
    Representasjonstype.RADGIVER,
    Representasjonstype.ANNEN_PERSON,
  ]),
  radgiverOrgnr: z.coerce.string().optional(),
  arbeidsgiverOrgnr: z.coerce.string().optional(),
  // Ren statistikk-parameter: ukjente verdier ignoreres i stedet for å velte siden
  opprettetVia: z.preprocess(
    (verdi) =>
      Object.values(OpprettetVia).includes(verdi as OpprettetVia)
        ? verdi
        : undefined,
    z.enum(OpprettetVia).optional(),
  ),
  // Ugyldig format droppes så opprettelsen aldri feiler på en ødelagt lenke
  prefyllFraSkjemaId: z.preprocess(
    (verdi) =>
      typeof verdi === "string" && z.uuid().safeParse(verdi).success
        ? verdi
        : undefined,
    z.string().optional(),
  ),
});

export type Representasjonskontekst = z.infer<
  typeof representasjonskontekstSchema
>;

/**
 * Utleder Representasjonskontekst fra skjema-metadata.
 * MED_FULLMAKT-variantene mappes til sine ufullmakt-varianter,
 * og rådgiver-orgnr hentes fra metadata dersom det finnes.
 */
export function toRepresentasjonskontekst(
  metadata: UtsendtArbeidstakerSkjemaDto["metadata"],
): Representasjonskontekst {
  const representasjonstype = tilKontekstType(metadata.representasjonstype);
  const radgiverOrgnr =
    "radgiverfirma" in metadata ? metadata.radgiverfirma.orgnr : undefined;

  return { representasjonstype, radgiverOrgnr };
}

function tilKontekstType(
  representasjonstype: Representasjonstype,
): Representasjonskontekst["representasjonstype"] {
  switch (representasjonstype) {
    case Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT: {
      return Representasjonstype.ARBEIDSGIVER;
    }
    case Representasjonstype.RADGIVER_MED_FULLMAKT: {
      return Representasjonstype.RADGIVER;
    }
    default: {
      return representasjonstype as Representasjonskontekst["representasjonstype"];
    }
  }
}
