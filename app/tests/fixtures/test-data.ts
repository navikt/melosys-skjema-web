// Test data constants that can be reused across tests

import type { UserInfo } from "../../src/httpClients/dekoratorenClient";
import type {
  ArbeidsgiversSkjemaDto,
  ArbeidstakersSkjemaDto,
  OrganisasjonDto,
} from "../../src/types/melosysSkjemaTypes";

export const testOrganization: OrganisasjonDto = {
  orgnr: "123456789",
  navn: "Test Bedrift AS",
  organisasjonsform: "BEDR",
};

export const testUserInfo: UserInfo = {
  userId: "12345678901",
  name: "Test Bruker",
};

export const testArbeidsgiverSkjemaId = "test-arbeidsgiver-skjema-id";
export const testArbeidstakerSkjemaId = "test-arbeidstaker-skjema-id";

export const testArbeidsgiverSkjema: ArbeidsgiversSkjemaDto = {
  id: testArbeidsgiverSkjemaId,
  orgnr: "123456789",
  status: "UTKAST",
  data: {},
};

export const testArbeidstakerSkjema: ArbeidstakersSkjemaDto = {
  id: testArbeidstakerSkjemaId,
  fnr: testUserInfo.userId,
  status: "UTKAST",
  data: {},
};

export const formFieldValues = {
  // Arbeidsgiver form values
  organisasjonsnummer: testOrganization.orgnr,

  // Arbeidstaker form values
  fornavn: "Test",
  etternavn: "Bruker",
  telefonnummer: "12345678",
  epost: "test@example.com",
  adresse: "Testveien 1",
  postnummer: "0123",
  poststed: "Oslo",

  // Common form values
  periodeFra: "01.01.2024",
  periodeFraIso: "2024-01-01",
  periodeTil: "31.12.2024",
  periodeTilIso: "2024-12-31",
  utsendelseLand: { label: "Sverige", value: "SV" },
};
