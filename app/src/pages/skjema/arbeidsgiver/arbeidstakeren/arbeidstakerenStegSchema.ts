import { z } from "zod";

export const arbeidstakerenSchema = z.object({
  fodselsnummer: z.string().min(11, "validation.fodselsnummer.required"),
});
