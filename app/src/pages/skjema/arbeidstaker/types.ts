import { UtsendtArbeidstakerArbeidstakersSkjemaDataDto } from "~/types/melosysSkjemaTypes.ts";

export interface ArbeidstakerSkjemaProps {
  skjema: {
    id: string;
    data: UtsendtArbeidstakerArbeidstakersSkjemaDataDto;
  };
}
