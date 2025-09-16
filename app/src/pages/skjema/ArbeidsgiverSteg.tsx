import { zodResolver } from "@hookform/resolvers/zod";
import { FormSummary, TextField } from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SkjemaSteg } from "~/pages/skjema/components/SkjemaSteg";
import { getValgtRolle } from "~/utils/sessionStorage.ts";

const arbeidsgiverSchema = z.object({
  organisasjonsnummer: z
    .string()
    .min(1, "Organisasjonsnummer er påkrevd")
    .regex(/^\d{9}$/, "Organisasjonsnummer må være 9 siffer"),
});

type ArbeidsgiverFormData = z.infer<typeof arbeidsgiverSchema>;

export function ArbeidsgiverSteg() {
  const navigate = useNavigate();

  const valgtRolle = getValgtRolle();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArbeidsgiverFormData>({
    resolver: zodResolver(arbeidsgiverSchema),
    defaultValues: {
      organisasjonsnummer: valgtRolle?.orgnr || "",
    },
  });

  const onSubmit = (data: ArbeidsgiverFormData) => {
    // eslint-disable-next-line no-console
    console.log("Form submitted", data);
    navigate({ to: "/skjema/arbeidstakeren" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SkjemaSteg
        config={{
          stegNummer: 2,
          tittel: "Arbeidsgiveren",
          forrigeRoute: "../veiledning",
          nesteRoute: "../arbeidstakeren",
          customNesteKnapp: { tekst: "Lagre og fortsett", type: "submit" },
        }}
      >
        <TextField
          className="mt-4"
          error={errors.organisasjonsnummer?.message}
          label="Arbeidsgiverens organisasjonsnummer"
          size="medium"
          style={{ maxWidth: "160px" }}
          {...register("organisasjonsnummer")}
          readOnly={valgtRolle?.orgnr !== undefined}
        />
        <FormSummary.Answer className="mt-4">
          <FormSummary.Label>Organisasjonens navn</FormSummary.Label>
          <FormSummary.Value>{valgtRolle?.navn}</FormSummary.Value>
        </FormSummary.Answer>
      </SkjemaSteg>
    </form>
  );
}
