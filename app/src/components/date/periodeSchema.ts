import { z } from "zod";

export const periodeSchema = z
  .object({
    fraDato: z
      .string({ error: "periode.datoErPakrevd" })
      .min(1, "periode.datoErPakrevd"),
    tilDato: z
      .string({ error: "periode.datoErPakrevd" })
      .min(1, "periode.datoErPakrevd"),
  })
  .refine((data) => new Date(data.fraDato) <= new Date(data.tilDato), {
    error: "periode.tilDatoMaVareEtterFraDato",
    path: ["tilDato"],
  });
