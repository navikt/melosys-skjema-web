import { z } from "zod";

import type { NySoknad } from "~/pages/skjema/nySoknad.ts";
import {
  OpprettetVia,
  Representasjonstype,
} from "~/types/melosysSkjemaTypes.ts";

function representasjonstypeMedFullmakt(
  representasjonstype: Representasjonstype,
): Representasjonstype {
  if (representasjonstype === Representasjonstype.ARBEIDSGIVER)
    return Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT;
  return representasjonstype === Representasjonstype.RADGIVER
    ? Representasjonstype.RADGIVER_MED_FULLMAKT
    : representasjonstype;
}

export const soknadStarterSchema = z
  .object({
    representasjonstype: z.enum(Representasjonstype),
    radgiverfirma: z
      .object({
        orgnr: z.string().min(1),
        navn: z.string().min(1),
      })
      .optional(),
    arbeidsgiver: z
      .object({
        orgnr: z.string().min(1),
        navn: z.string().min(1),
      })
      .optional(),
    arbeidstaker: z
      .object({
        fnr: z.string().min(1),
        etternavn: z.string().optional(),
      })
      .optional(),
    skalFylleUtForArbeidstaker: z.boolean().optional(),
  })
  .refine((data) => !!data.arbeidsgiver, {
    error: "oversiktFelles.valideringManglerArbeidsgiver",
    path: ["arbeidsgiver"],
    when: () => true,
  })
  .refine((data) => !!data.arbeidstaker, {
    error: "oversiktFelles.valideringManglerArbeidstaker",
    path: ["arbeidstaker"],
    when: () => true,
  })
  .transform((data): NySoknad => {
    return {
      representasjonstype: data.skalFylleUtForArbeidstaker
        ? representasjonstypeMedFullmakt(data.representasjonstype)
        : data.representasjonstype,
      radgiverfirma: data.radgiverfirma,
      arbeidsgiver: data.arbeidsgiver!,
      arbeidstaker: data.arbeidstaker!,
      opprettetVia: OpprettetVia.ORDINAER,
    };
  });

// Input-type for skjemaet (før transform)
export type SoknadStarterFormData = z.input<typeof soknadStarterSchema>;

// Output-type etter transform (= API request)
export type SoknadStarterOutput = z.output<typeof soknadStarterSchema>;
