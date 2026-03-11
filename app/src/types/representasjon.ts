import { z } from "zod";

import type { UtsendtArbeidstakerSkjemaDto } from "~/types/melosysSkjemaTypes.ts";
import { Representasjonstype } from "~/types/melosysSkjemaTypes.ts";

export const representasjonsKontekstSchema = z.object({
  representasjonstype: z.enum([
    Representasjonstype.DEG_SELV,
    Representasjonstype.ARBEIDSGIVER,
    Representasjonstype.RADGIVER,
    Representasjonstype.ANNEN_PERSON,
  ]),
  radgiverOrgnr: z.coerce.string().optional(),
});

export type RepresentasjonsKontekst = z.infer<
  typeof representasjonsKontekstSchema
>;

/**
 * Utleder RepresentasjonsKontekst fra skjema-metadata.
 * MED_FULLMAKT-variantene mappes til sine ufullmakt-varianter,
 * og rådgiver-orgnr hentes fra metadata dersom det finnes.
 */
export function toRepresentasjonsKontekst(
  metadata: UtsendtArbeidstakerSkjemaDto["metadata"],
): RepresentasjonsKontekst {
  const representasjonstype = tilKontekstType(metadata.representasjonstype);
  const radgiverOrgnr =
    "radgiverfirma" in metadata ? metadata.radgiverfirma.orgnr : undefined;

  return { representasjonstype, radgiverOrgnr };
}

function tilKontekstType(
  representasjonstype: Representasjonstype,
): RepresentasjonsKontekst["representasjonstype"] {
  switch (representasjonstype) {
    case Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT: {
      return Representasjonstype.ARBEIDSGIVER;
    }
    case Representasjonstype.RADGIVER_MED_FULLMAKT: {
      return Representasjonstype.RADGIVER;
    }
    default: {
      return representasjonstype as RepresentasjonsKontekst["representasjonstype"];
    }
  }
}
