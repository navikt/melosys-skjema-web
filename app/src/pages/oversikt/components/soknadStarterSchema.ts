import { z } from "zod";

export const soknadStarterSchema = z
  .object({
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
  });

export type SoknadStarterFormData = z.infer<typeof soknadStarterSchema>;
