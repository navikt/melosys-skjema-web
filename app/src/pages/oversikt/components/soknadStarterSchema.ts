import { z } from "zod";

import {
  OpprettUtsendtArbeidstakerSoknadRequest,
  Representasjonstype,
} from "~/types/melosysSkjemaTypes.ts";

function representasjonstypeMedFullmakt(
  representasjonstype: Representasjonstype,
): Representasjonstype {
  if (representasjonstype === Representasjonstype.ARBEIDSGIVER)
    return Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT;
  if (representasjonstype === Representasjonstype.RADGIVER)
    return Representasjonstype.RADGIVER_MED_FULLMAKT;
  return representasjonstype;
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
    bekreftelse: z.boolean(),
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
  .superRefine((data, ctx) => {
    if (data.bekreftelse) {
      return;
    }

    ctx.addIssue({
      code: "custom",
      message: "oversiktFelles.valideringManglerBekreftelseDegSelv",
      path: ["bekreftelse"],
    });
  })
  .transform((data): OpprettUtsendtArbeidstakerSoknadRequest => {
    return {
      representasjonstype: data.skalFylleUtForArbeidstaker
        ? representasjonstypeMedFullmakt(data.representasjonstype)
        : data.representasjonstype,
      radgiverfirma: data.radgiverfirma,
      arbeidsgiver: data.arbeidsgiver!,
      arbeidstaker: data.arbeidstaker!,
    };
  });

// Input-type for skjemaet (før transform)
export type SoknadStarterFormData = z.input<typeof soknadStarterSchema>;

// Output-type etter transform (= API request)
export type SoknadStarterOutput = z.output<typeof soknadStarterSchema>;
