// Test data constants that can be reused across tests

import type { UserInfo } from "~/httpClients/dekoratorenClient";
import {
  type ArbeidsgiverMedFullmaktMetadata,
  type ArbeidsgiverMetadata,
  type DegSelvMetadata,
  type InnsendteSoknaderResponse,
  type InnsendtSkjemaResponse,
  LandKode,
  type OrganisasjonDto,
  type OrganisasjonMedJuridiskEnhetDto,
  type PersonMedFullmaktDto,
  Representasjonstype,
  Skjemadel,
  type SkjemaInnsendtKvittering,
  SkjemaStatus,
  SkjemaType,
  Sprak,
  type UtkastListeResponse,
  type UtsendtArbeidstakerSkjemaDto,
} from "~/types/melosysSkjemaTypes";

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
  opprettetDato: "2026-01-15T10:00:00Z",
  endretDato: "2026-01-16T14:30:00Z",
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
  opprettetDato: "2026-01-15T10:00:00Z",
  endretDato: "2026-01-16T14:30:00Z",
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

// ============ Oversikt test data ============

export const emptyUtkastListe: UtkastListeResponse = {
  utkast: [],
  antall: 0,
};

export const testUtkastListe: UtkastListeResponse = {
  utkast: [
    {
      id: "utkast-1",
      arbeidsgiverNavn: "Test Bedrift AS",
      arbeidsgiverOrgnr: "123456789",
      arbeidstakerNavn: "Test Bruker",
      arbeidstakerFnrMaskert: "123456*****",
      opprettetDato: "2026-01-15T10:00:00Z",
      sistEndretDato: "2026-01-16T14:30:00Z",
      status: SkjemaStatus.UTKAST,
    },
  ],
  antall: 1,
};

export const emptyInnsendteSoknader: InnsendteSoknaderResponse = {
  soknader: [],
  totaltAntall: 0,
  side: 1,
  antallPerSide: 5,
};

export const testInnsendteSoknader: InnsendteSoknaderResponse = {
  soknader: [
    {
      id: "innsendt-1",
      referanseId: "REF001",
      arbeidsgiverNavn: "Test Bedrift AS",
      arbeidsgiverOrgnr: "123456789",
      arbeidstakerNavn: "Test Bruker",
      arbeidstakerFnrMaskert: "123456*****",
      arbeidstakerFodselsdato: "1990-01-01",
      innsendtDato: "2026-01-10T12:00:00Z",
      status: SkjemaStatus.SENDT,
    },
  ],
  totaltAntall: 1,
  side: 1,
  antallPerSide: 5,
};

export const testInnsendteSoknaderToTreff: InnsendteSoknaderResponse = {
  soknader: [
    {
      id: "innsendt-1",
      referanseId: "REF001",
      arbeidsgiverNavn: "Test Bedrift AS",
      arbeidsgiverOrgnr: "123456789",
      arbeidstakerNavn: "Test Bruker",
      arbeidstakerFnrMaskert: "123456*****",
      arbeidstakerFodselsdato: "1990-01-01",
      innsendtDato: "2026-01-10T12:00:00Z",
      status: SkjemaStatus.SENDT,
    },
    {
      id: "innsendt-2",
      referanseId: "REF002",
      arbeidsgiverNavn: "Annen Bedrift AS",
      arbeidsgiverOrgnr: "987654321",
      arbeidstakerNavn: "Annen Bruker",
      arbeidstakerFnrMaskert: "654321*****",
      arbeidstakerFodselsdato: "1985-05-15",
      innsendtDato: "2026-02-20T08:00:00Z",
      status: SkjemaStatus.SENDT,
    },
  ],
  totaltAntall: 2,
  side: 1,
  antallPerSide: 5,
};

// ============ Innsendt skjema test data ============

export const testInnsendtSkjemaArbeidstakersDel: InnsendtSkjemaResponse = {
  skjemaId: testArbeidstakerSkjemaId,
  referanseId: "REF-AT-001",
  innsendtDato: "2026-01-10T12:00:00Z",
  innsendtSprak: Sprak.Nb,
  skjemaDefinisjonVersjon: "1",
  skjemaData: {
    type: "UTSENDT_ARBEIDSTAKER_ARBEIDSTAKERS_DEL",
  } as InnsendtSkjemaResponse["skjemaData"],
  definisjon: {
    seksjoner: {},
  } as unknown as InnsendtSkjemaResponse["definisjon"],
};

export const testInnsendtSkjemaArbeidsgiverDel: InnsendtSkjemaResponse = {
  skjemaId: testArbeidsgiverSkjemaId,
  referanseId: "REF-AG-001",
  innsendtDato: "2026-01-10T12:00:00Z",
  innsendtSprak: Sprak.Nb,
  skjemaDefinisjonVersjon: "1",
  skjemaData: {
    type: "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVERS_DEL",
  } as InnsendtSkjemaResponse["skjemaData"],
  definisjon: {
    seksjoner: {},
  } as unknown as InnsendtSkjemaResponse["definisjon"],
};

// ============ SoknadStarter test data ============

export const testOpprettSoknadResponseId = "opprettet-soknad-id-123";

/** Person med fullmakt — used for "med fullmakt" combobox selection */
export const testPersonMedFullmakt: PersonMedFullmaktDto = {
  fnr: "01019000083",
  navn: "Fullmakt Person",
  fodselsdato: "1990-01-01",
};

/** Arbeidstaker for "uten fullmakt" flow — fnr + etternavn typed manually */
export const testArbeidstakerUtenFullmakt = {
  fnr: "01019000083",
  etternavn: "Testersen",
};

/** VerifiserPerson response for uten-fullmakt flow */
export const testVerifiserPersonResponse = {
  navn: "Ola Testersen",
  fodselsdato: "1990-01-01",
};

/** Arbeidsgiver org used in ARBEIDSGIVER/RADGIVER flows (from Altinn tilganger) */
export const testArbeidsgiverOrganization: OrganisasjonDto = {
  orgnr: korrektFormatertOrgnr,
  navn: "Arbeidsgiveren AS",
  organisasjonsform: "AS",
};

/** Rådgiverfirma org for RADGIVER flow (from ereg lookup) */
export const testRadgiverfirmaOrgnr = korrektFormatertOrgnr2;
export const testRadgiverfirmaOrganisasjon: OrganisasjonMedJuridiskEnhetDto = {
  organisasjon: { orgnr: testRadgiverfirmaOrgnr, navn: "Rådgiver Filial" },
  juridiskEnhet: { orgnr: testRadgiverfirmaOrgnr, navn: "Rådgiverfirma AS" },
};

/** Ereg response for DEG_SELV org search (OrganisasjonSoker) */
export const testEregOrganisasjon: OrganisasjonMedJuridiskEnhetDto = {
  organisasjon: {
    orgnr: korrektFormatertOrgnr,
    navn: "Arbeidsgiver Virksomhet",
  },
  juridiskEnhet: { orgnr: korrektFormatertOrgnr, navn: "Arbeidsgiver AS" },
};

// ============ Kombinert (arbeidsgiver og arbeidstakers del) test data ============

export const testKombinertSkjemaId = "test-kombinert-skjema-id";

export const testKombinertSkjema: UtsendtArbeidstakerSkjemaDto = {
  id: testKombinertSkjemaId,
  orgnr: "123456789",
  fnr: "",
  status: SkjemaStatus.UTKAST,
  type: SkjemaType.UTSENDT_ARBEIDSTAKER,
  opprettetDato: "2026-01-15T10:00:00Z",
  endretDato: "2026-01-16T14:30:00Z",
  metadata: {
    metadatatype: "ArbeidsgiverMedFullmaktMetadata",
    representasjonstype: Representasjonstype.ARBEIDSGIVER_MED_FULLMAKT,
    juridiskEnhetOrgnr: "123456789",
    arbeidsgiverNavn: "Test Bedrift AS",
    skjemadel: Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
    fullmektigFnr: "01019000083",
  } as ArbeidsgiverMedFullmaktMetadata,
  data: {
    type: "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL",
    arbeidsgiversData: {},
    arbeidstakersData: {},
  },
};

export const testInnsendtSkjemaKombinertDel: InnsendtSkjemaResponse = {
  skjemaId: testKombinertSkjemaId,
  referanseId: "REF-KO-001",
  innsendtDato: "2026-01-10T12:00:00Z",
  innsendtSprak: Sprak.Nb,
  skjemaDefinisjonVersjon: "1",
  skjemaData: {
    type: "UTSENDT_ARBEIDSTAKER_ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL",
    arbeidsgiversData: {},
    arbeidstakersData: {},
  } as InnsendtSkjemaResponse["skjemaData"],
  definisjon: {
    seksjoner: {},
  } as unknown as InnsendtSkjemaResponse["definisjon"],
};
