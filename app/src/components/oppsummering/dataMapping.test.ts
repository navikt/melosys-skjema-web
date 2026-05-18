import { describe, expect, it } from "vitest";

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1.ts";
import { StegKey } from "~/constants/stegKeys.ts";
import { STEG_REKKEFOLGE } from "~/pages/skjema/stegRekkefølge.ts";
import {
  ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
  ARBEIDSGIVERS_DEL,
  ARBEIDSTAKERS_DEL,
} from "~/pages/skjema/types.ts";
import {
  ArbeidsstedType,
  FastEllerVekslendeArbeidssted,
  LandKode,
  type SkjemaDefinisjonDto,
  Skjemadel,
  type UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto,
  type UtsendtArbeidstakerArbeidsgiversSkjemaDataDto,
  type UtsendtArbeidstakerArbeidstakersSkjemaDataDto,
} from "~/types/melosysSkjemaTypes.ts";

import { resolveSeksjoner, VirksomhetTypeKey } from "./dataMapping.ts";

const definisjon = SKJEMA_DEFINISJON_A1 as unknown as SkjemaDefinisjonDto;

const utsendingsperiodeOgLand = {
  utsendelseLand: LandKode.SE,
  utsendelsePeriode: { fraDato: "2026-01-01", tilDato: "2026-12-31" },
};

const arbeidstakersDelDto: UtsendtArbeidstakerArbeidstakersSkjemaDataDto = {
  type: ARBEIDSTAKERS_DEL,
  utsendingsperiodeOgLand,
  arbeidssituasjon: {
    harVaertEllerSkalVaereILonnetArbeidFoerUtsending: true,
    skalJobbeForFlereVirksomheter: false,
  },
  skatteforholdOgInntekt: {
    erSkattepliktigTilNorgeIHeleutsendingsperioden: true,
    mottarPengestotteFraAnnetEosLandEllerSveits: false,
  },
  familiemedlemmer: { skalHaMedFamiliemedlemmer: false },
  tilleggsopplysninger: { harFlereOpplysningerTilSoknaden: false },
  vedlegg: { harAnnenDokumentasjon: false },
};

const arbeidsgiversDelDto: UtsendtArbeidstakerArbeidsgiversSkjemaDataDto = {
  type: ARBEIDSGIVERS_DEL,
  utsendingsperiodeOgLand,
  arbeidsgiverensVirksomhetINorge: {
    erArbeidsgiverenOffentligVirksomhet: true,
  },
  utenlandsoppdraget: {
    arbeidsgiverHarOppdragILandet: true,
    arbeidstakerBleAnsattForUtenlandsoppdraget: false,
    arbeidstakerForblirAnsattIHelePerioden: true,
    arbeidstakerErstatterAnnenPerson: false,
  },
  arbeidsstedIUtlandet: {
    arbeidsstedType: ArbeidsstedType.PA_LAND,
    paLand: {
      navnPaVirksomhet: "Test AS",
      fastEllerVekslendeArbeidssted: FastEllerVekslendeArbeidssted.FAST,
      erHjemmekontor: false,
    },
  },
  arbeidstakerensLonn: {
    arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: true,
  },
  tilleggsopplysninger: { harFlereOpplysningerTilSoknaden: false },
  vedlegg: { harAnnenDokumentasjon: false },
};

const kombinertDto: UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto =
  {
    type: ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
    utsendingsperiodeOgLand,
    tilleggsopplysninger: { harFlereOpplysningerTilSoknaden: false },
    vedlegg: { harAnnenDokumentasjon: false },
    arbeidsgiversData: {
      arbeidsgiverensVirksomhetINorge:
        arbeidsgiversDelDto.arbeidsgiverensVirksomhetINorge,
      utenlandsoppdraget: arbeidsgiversDelDto.utenlandsoppdraget,
      arbeidsstedIUtlandet: arbeidsgiversDelDto.arbeidsstedIUtlandet,
      arbeidstakerensLonn: arbeidsgiversDelDto.arbeidstakerensLonn,
    },
    arbeidstakersData: {
      arbeidssituasjon: arbeidstakersDelDto.arbeidssituasjon,
      skatteforholdOgInntekt: arbeidstakersDelDto.skatteforholdOgInntekt,
      familiemedlemmer: arbeidstakersDelDto.familiemedlemmer,
    },
  };

describe("resolveSeksjoner", () => {
  it("arbeidstakers del inneholder alle forventede seksjoner med utsendingsperiodeOgLand øverst", () => {
    const seksjoner = resolveSeksjoner(arbeidstakersDelDto, definisjon);
    expect(seksjoner.map((s) => s.seksjonNavn)).toEqual([
      "utsendingsperiodeOgLand",
      "arbeidssituasjon",
      "skatteforholdOgInntekt",
      "familiemedlemmer",
      "tilleggsopplysningerArbeidstaker",
      "vedleggArbeidstaker",
    ]);
  });

  it("arbeidsgivers del inneholder alle forventede seksjoner med utsendingsperiodeOgLand øverst", () => {
    const seksjoner = resolveSeksjoner(arbeidsgiversDelDto, definisjon);
    expect(seksjoner.map((s) => s.seksjonNavn)).toEqual([
      "utsendingsperiodeOgLand",
      "arbeidsgiverensVirksomhetINorge",
      "utenlandsoppdragetArbeidsgiver",
      "arbeidsstedIUtlandet",
      "arbeidsstedPaLand",
      "arbeidstakerensLonn",
      "tilleggsopplysningerArbeidsgiver",
      "vedleggArbeidsgiver",
    ]);
  });

  it("kombinert flyt har utsendingsperiodeOgLand øverst og ingen duplikater", () => {
    const seksjoner = resolveSeksjoner(kombinertDto, definisjon);
    const navn = seksjoner.map((s) => s.seksjonNavn);

    expect(navn[0]).toBe("utsendingsperiodeOgLand");
    expect(new Set(navn).size).toBe(navn.length);
  });

  // Dekningstest: fanger nye steg som blir lagt til uten oppdatering av dataMapping.
  // Hvis noen legger til et nytt content-steg i STEG_REKKEFOLGE med en tilhørende
  // seksjonsdefinisjon, må det også få minst én entry i resolveSeksjoner-output.
  describe("hvert content-steg har minst én seksjon i oppsummeringen", () => {
    const META_STEG = new Set<string>([StegKey.VEDLEGG, StegKey.OPPSUMMERING]);

    const cases: Array<{
      navn: string;
      skjemadel: Skjemadel;
      dto:
        | UtsendtArbeidstakerArbeidstakersSkjemaDataDto
        | UtsendtArbeidstakerArbeidsgiversSkjemaDataDto
        | UtsendtArbeidstakerArbeidsgiverOgArbeidstakerSkjemaDataDto;
    }> = [
      {
        navn: "arbeidstakers del",
        skjemadel: Skjemadel.ARBEIDSTAKERS_DEL,
        dto: arbeidstakersDelDto,
      },
      {
        navn: "arbeidsgivers del",
        skjemadel: Skjemadel.ARBEIDSGIVERS_DEL,
        dto: arbeidsgiversDelDto,
      },
      {
        navn: "kombinert",
        skjemadel: Skjemadel.ARBEIDSGIVER_OG_ARBEIDSTAKERS_DEL,
        dto: kombinertDto,
      },
    ];

    it.each(cases)("$navn dekker alle content-steg", ({ skjemadel, dto }) => {
      const stegRekkefolge = STEG_REKKEFOLGE[skjemadel];
      const contentSteg = stegRekkefolge
        .map((s) => s.key)
        .filter((key) => !META_STEG.has(key));

      const seksjoner = resolveSeksjoner(dto, definisjon);
      const dekkede = new Set(seksjoner.map((s) => s.stegKey));

      const manglende = contentSteg.filter((key) => !dekkede.has(key));
      expect(
        manglende,
        `Steg uten seksjon i oppsummeringen: ${manglende.join(", ")}`,
      ).toEqual([]);
    });
  });

  describe("flatning av virksomhetslister", () => {
    const utenlandskVirksomhet = {
      navn: "Foreign Co",
      organisasjonsnummer: "ABC123",
      vegnavnOgHusnummer: "Main Street 1",
      bygning: "Building A",
      postkode: "12345",
      byStedsnavn: "Stockholm",
      region: "Stockholm County",
      land: LandKode.SE,
      tilhorerSammeKonsern: false,
    };

    it("merker norske og utenlandske virksomheter med __type og inkluderer adressefelter for utenlandske", () => {
      const dto: UtsendtArbeidstakerArbeidsgiversSkjemaDataDto = {
        ...arbeidsgiversDelDto,
        arbeidstakerensLonn: {
          arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: false,
          virksomheterSomUtbetalerLonnOgNaturalytelser: {
            norskeVirksomheter: [{ organisasjonsnummer: "987654321" }],
            utenlandskeVirksomheter: [utenlandskVirksomhet],
          },
        },
      };

      const lønnSeksjon = resolveSeksjoner(dto, definisjon).find(
        (s) => s.seksjonNavn === "arbeidstakerensLonn",
      );
      const virksomheter = lønnSeksjon?.data
        .virksomheterSomUtbetalerLonnOgNaturalytelser as Array<
        Record<string, unknown>
      >;

      expect(virksomheter).toHaveLength(2);
      expect(virksomheter[0]).toEqual({
        __type: VirksomhetTypeKey.NORSK,
        organisasjonsnummer: "987654321",
      });
      expect(virksomheter[1]).toMatchObject({
        __type: VirksomhetTypeKey.UTENLANDSK,
        navn: "Foreign Co",
        vegnavnOgHusnummer: "Main Street 1",
        bygning: "Building A",
        postkode: "12345",
        byStedsnavn: "Stockholm",
        region: "Stockholm County",
        land: LandKode.SE,
        tilhorerSammeKonsern: false,
      });
    });

    it("itemTypeLabels i definisjonen har samme nøkler som VirksomhetTypeKey", () => {
      const liste =
        definisjon.seksjoner.arbeidstakerensLonn?.felter
          .virksomheterSomUtbetalerLonnOgNaturalytelser;
      const labels = (liste as { itemTypeLabels?: Record<string, string> })
        ?.itemTypeLabels;

      expect(labels).toBeDefined();
      expect(Object.keys(labels ?? {}).toSorted()).toEqual(
        [VirksomhetTypeKey.NORSK, VirksomhetTypeKey.UTENLANDSK].toSorted(),
      );
    });
  });
});
