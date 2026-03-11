// Test data constants that can be reused across tests

import type { UserInfo } from "../../../src/httpClients/dekoratorenClient";
import {
  type ArbeidsgiverMetadata,
  type DegSelvMetadata,
  LandKode,
  type OrganisasjonDto,
  Representasjonstype,
  Skjemadel,
  type SkjemaInnsendtKvittering,
  SkjemaStatus,
  SkjemaType,
  type UtsendtArbeidstakerSkjemaDto,
} from "../../../src/types/melosysSkjemaTypes";

// Gyldige organisasjonsnummer (MOD11-validert)
export const korrektFormatertOrgnr = "974760673";
export const korrektFormatertOrgnr2 = "910253158";

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

export const testArbeidsgiverSkjema: UtsendtArbeidstakerSkjemaDto = {
  id: testArbeidsgiverSkjemaId,
  orgnr: "123456789",
  fnr: "",
  status: SkjemaStatus.UTKAST,
  type: SkjemaType.UTSENDT_ARBEIDSTAKER,
  metadata: {
    metadatatype: "ArbeidsgiverMetadata",
    representasjonstype: Representasjonstype.ARBEIDSGIVER,
    juridiskEnhetOrgnr: "123456789",
    arbeidsgiverNavn: "Test Bedrift AS",
    skjemadel: Skjemadel.ARBEIDSGIVERS_DEL,
  } as ArbeidsgiverMetadata,
  data: {
    type: "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVERS_DEL",
  },
};

export const testArbeidstakerSkjema: UtsendtArbeidstakerSkjemaDto = {
  id: testArbeidstakerSkjemaId,
  fnr: testUserInfo.userId,
  orgnr: "",
  status: SkjemaStatus.UTKAST,
  type: SkjemaType.UTSENDT_ARBEIDSTAKER,
  metadata: {
    metadatatype: "DegSelvMetadata",
    representasjonstype: Representasjonstype.DEG_SELV,
    juridiskEnhetOrgnr: "123456789",
    arbeidsgiverNavn: "Test Bedrift AS",
    skjemadel: Skjemadel.ARBEIDSTAKERS_DEL,
  } as DegSelvMetadata,
  data: {
    type: "UTSENDT_ARBEIDSTAKER_ARBEIDSTAKERS_DEL",
  },
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
