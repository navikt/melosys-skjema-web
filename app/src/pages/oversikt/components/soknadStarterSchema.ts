import { z } from "zod";

import {
  OpprettSoknadMedKontekstRequest,
  Representasjonstype,
  Skjemadel,
} from "~/types/melosysSkjemaTypes.ts";

export const soknadStarterSchema = z
  .object({
    representasjonstype: z.nativeEnum(Representasjonstype),
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
    harFullmakt: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.arbeidsgiver) {
      ctx.addIssue({
        code: "custom",
        message: "oversiktFelles.valideringManglerArbeidsgiver",
        path: ["arbeidsgiver"],
      });
    }
    if (!data.arbeidstaker) {
      ctx.addIssue({
        code: "custom",
        message: "oversiktFelles.valideringManglerArbeidstaker",
        path: ["arbeidstaker"],
      });
    }
  })
  .transform((data): OpprettSoknadMedKontekstRequest => {
    // Beregn final representasjonstype med fullmakt
    let finalRepresentasjonstype = data.representasjonstype;
    if (data.harFullmakt) {
      if (data.representasjonstype === Representasjonstype.ARBEIDSGIVER) {
        finalRepresentasjonstype =
          Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT;
      } else if (data.representasjonstype === Representasjonstype.RADGIVER) {
        finalRepresentasjonstype = Representasjonstype.RADGIVER_MED_FULLMAKT;
      }
    }

    // Beregn skjemadel basert på representasjonstype
    const skjemadel = [
      Representasjonstype.RADGIVER,
      Representasjonstype.ARBEIDSGIVER,
    ].includes(data.representasjonstype)
      ? Skjemadel.ARBEIDSGIVERS_DEL
      : Skjemadel.ARBEIDSTAKERS_DEL;

    return {
      representasjonstype: finalRepresentasjonstype,
      radgiverfirma: data.radgiverfirma,
      arbeidsgiver: data.arbeidsgiver!,
      arbeidstaker: data.arbeidstaker!,
      skjemadel,
    };
  });

// Input-type for skjemaet (før transform)
export type SoknadStarterFormData = z.input<typeof soknadStarterSchema>;

// Output-type etter transform (= API request)
export type SoknadStarterOutput = z.output<typeof soknadStarterSchema>;
