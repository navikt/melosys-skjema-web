// Test data constants that can be reused across tests

import type { UserInfo } from "../../../src/httpClients/dekoratorenClient";
import {
  type ArbeidsgiversSkjemaDto,
  type ArbeidstakersSkjemaDto,
  LandKode,
  type OrganisasjonDto,
  type SkjemaInnsendtKvittering,
  SkjemaStatus,
} from "../../../src/types/melosysSkjemaTypes";

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
  status: SkjemaStatus.UTKAST,
  data: {},
};

export const testArbeidstakerSkjema: ArbeidstakersSkjemaDto = {
  id: testArbeidstakerSkjemaId,
  fnr: testUserInfo.userId,
  status: SkjemaStatus.UTKAST,
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
  periodeFra: "01.01.2026",
  periodeFraIso: "2026-01-01",
  periode: {
    fraDato: "2026-01-01",
    tilDato: "2026-12-31",
  },
  periodeTil: "31.12.2026",
  periodeTilIso: "2026-12-31",
  utsendelseLand: { label: "Sverige", value: LandKode.SE },
};

export const skjemaInnsendtKvittering: SkjemaInnsendtKvittering = {
  skjemaId: "test-skjema-id",
  status: SkjemaStatus.SENDT,
  referanseId: "ABC123XYZ",
};
