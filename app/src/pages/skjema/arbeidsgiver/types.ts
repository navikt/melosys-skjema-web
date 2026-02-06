import { UtsendtArbeidstakerArbeidsgiversSkjemaDataDto } from "~/types/melosysSkjemaTypes.ts";

export interface ArbeidsgiverSkjemaProps {
  skjema: {
    id: string;
    data: UtsendtArbeidstakerArbeidsgiversSkjemaDataDto;
  };
}
