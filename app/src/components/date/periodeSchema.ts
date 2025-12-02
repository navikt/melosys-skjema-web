import { z } from "zod";

export const periodeSchema = z
  .object({
    fraDato: z
      .string({ error: "felles.fraDatoErPakrevd" })
      .min(1, "felles.fraDatoErPakrevd"),
    tilDato: z
      .string({ error: "felles.tilDatoErPakrevd" })
      .min(1, "felles.tilDatoErPakrevd"),
  })
  .refine((data) => new Date(data.fraDato) <= new Date(data.tilDato), {
    error: "felles.tilDatoMaVareEtterFraDato",
    path: ["tilDato"],
  });
