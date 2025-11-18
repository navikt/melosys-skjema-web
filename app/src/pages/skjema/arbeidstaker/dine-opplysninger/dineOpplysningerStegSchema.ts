import { z } from "zod";

const baseDineOpplysningerSchema = z.object({
  harNorskFodselsnummer: z.boolean(),
  fodselsnummer: z.string().optional(),
  fornavn: z.string().optional(),
  etternavn: z.string().optional(),
  fodselsdato: z.string().optional(),
});

export const dineOpplysningerSchema = baseDineOpplysningerSchema.superRefine(
  (data, ctx) => {
    if (data.harNorskFodselsnummer) {
      if (!data.fodselsnummer?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "dineOpplysningerSteg.fodselsnummerEllerDNummerErPakrevdNarDuHarNorskFodselsnummer",
          path: ["fodselsnummer"],
        });
      } else if (!/^\d{11}$/.test(data.fodselsnummer)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "dineOpplysningerSteg.fodselsnummerEllerDNummerMaVare11Siffer",
          path: ["fodselsnummer"],
        });
      }
    } else {
      if (!data.fornavn || data.fornavn.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "dineOpplysningerSteg.fornavnErPakrevdOgMaVareMinst2Tegn",
          path: ["fornavn"],
        });
      }
      if (!data.etternavn || data.etternavn.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "dineOpplysningerSteg.etternavnErPakrevdOgMaVareMinst2Tegn",
          path: ["etternavn"],
        });
      }
      if (!data.fodselsdato?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "dineOpplysningerSteg.fodselsdatoErPakrevd",
          path: ["fodselsdato"],
        });
      }
    }
  },
);
