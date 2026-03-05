import {
  UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
  UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
} from "~/types/melosysSkjemaTypes.ts";

export interface ArbeidsgiverSkjemaProps {
  skjema: {
    id: string;
    data: UtsendtArbeidstakerArbeidsgiversSkjemaDataDto;
  };
}

export interface ArbeidstakerSkjemaProps {
  skjema: {
    id: string;
    data: UtsendtArbeidstakerArbeidstakersSkjemaDataDto;
  };
}
