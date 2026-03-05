import type {
  UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto,
  UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
  UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
} from "~/types/melosysSkjemaTypes.ts";

export type SkjemaData =
  | UtsendtArbeidstakerArbeidsgiversSkjemaDataDto
  | UtsendtArbeidstakerArbeidstakersSkjemaDataDto
  | UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto;

// --- Discriminator-verdier fra @JsonSubTypes ---

export const ARBEIDSGIVERS_DEL = "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVERS_DEL";
export const ARBEIDSTAKERS_DEL = "UTSENDT_ARBEIDSTAKER_ARBEIDSTAKERS_DEL";
export const ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL =
  "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL";

// --- Type guards ---

export function isArbeidsgiversDel(
  data: SkjemaData,
): data is UtsendtArbeidstakerArbeidsgiversSkjemaDataDto {
  return data.type === ARBEIDSGIVERS_DEL;
}

export function isArbeidstakersDel(
  data: SkjemaData,
): data is UtsendtArbeidstakerArbeidstakersSkjemaDataDto {
  return data.type === ARBEIDSTAKERS_DEL;
}

export function isArbeidsgiverOgArbeidstakersDel(
  data: SkjemaData,
): data is UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto {
  return data.type === ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL;
}
