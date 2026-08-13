/**
 * AUTOGENERERT - Synkronisert fra backend: melosys-skjema-api
 *
 * Ved endringer i backend, kjør: npm run sync-skjema-definisjon
 *
 * Inneholder definisjoner for språk: nb, nn, en
 */

const SKJEMA_DEFINISJON_A1_NB = {
  type: "UTSENDT_ARBEIDSTAKER",
  versjon: "1",
  seksjoner: {
    utsendingsperiodeOgLand: {
      tittel: "Utenlandsoppdraget",
      felter: {
        utsendelseLand: {
          type: "COUNTRY_SELECT",
          label: "I hvilket land skal arbeidet utføres?",
          pakrevd: true,
        },
        utsendelsePeriode: {
          type: "PERIOD",
          label: "Utsendingsperiode",
          pakrevd: true,
          hjelpetekst: "Oppgi omtrentlig dato hvis du ikke vet nøyaktig dato.",
          fraDatoLabel: "Fra dato",
          tilDatoLabel: "Til dato",
        },
      },
    },
    arbeidssituasjon: {
      tittel: "Arbeidssituasjon",
      felter: {
        harVaertEllerSkalVaereILonnetArbeidFoerUtsending: {
          type: "BOOLEAN",
          label:
            "Har du vært eller skal du være i lønnet arbeid i Norge i minst én måned rett før utsendingen?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        aktivitetIMaanedenFoerUtsendingen: {
          type: "TEXTAREA",
          label: "Beskriv aktiviteten din måneden før utsendingen",
          pakrevd: false,
          hjelpetekst:
            "For eksempel studier, ferie eller selvstendig virksomhet",
        },
        skalJobbeForFlereVirksomheter: {
          type: "BOOLEAN",
          label:
            "Skal du også drive selvstendig virksomhet eller arbeide for en annen arbeidsgiver i utsendingsperioden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        virksomheterArbeidstakerJobberForIutsendelsesPeriode: {
          type: "LIST",
          label: "Hvem skal du jobbe for i utsendelsesperioden?",
          pakrevd: false,
          hjelpetekst:
            "Legg til norske og/eller utenlandske virksomheter du skal jobbe for i utsendingsperioden.",
          leggTilLabel: "Legg til virksomhet",
          fjernLabel: "Fjern",
          elementDefinisjon: {
            organisasjonsnummer: {
              type: "TEXT",
              label: "Organisasjonsnummer",
              pakrevd: true,
            },
            navn: {
              type: "TEXT",
              label: "Virksomhetsnavn",
              pakrevd: false,
            },
            ansettelsesform: {
              type: "SELECT",
              label: "Hva jobber du som i denne virksomheten?",
              pakrevd: true,
              alternativer: [
                {
                  verdi: "ARBEIDSTAKER_ELLER_FRILANSER",
                  label: "Arbeidstaker eller frilanser",
                },
                {
                  verdi: "SELVSTENDIG_NAERINGSDRIVENDE",
                  label: "Selvstendig næringsdrivende",
                },
                {
                  verdi: "STATSANSATT",
                  label: "Statsansatt",
                },
              ],
            },
            vegnavnOgHusnummer: {
              type: "TEXT",
              label: "Vegnavn og husnummer",
              pakrevd: true,
            },
            bygning: {
              type: "TEXT",
              label: "Bygning",
              pakrevd: false,
            },
            postkode: {
              type: "TEXT",
              label: "Postkode",
              pakrevd: false,
            },
            byStedsnavn: {
              type: "TEXT",
              label: "By/stedsnavn",
              pakrevd: false,
            },
            region: {
              type: "TEXT",
              label: "Region",
              pakrevd: false,
            },
            land: {
              type: "COUNTRY_SELECT",
              label: "Land",
              pakrevd: true,
            },
            tilhorerSammeKonsern: {
              type: "BOOLEAN",
              label: "Tilhører samme konsern som norsk arbeidsgiver?",
              pakrevd: true,
              jaLabel: "Ja",
              neiLabel: "Nei",
            },
          },
          itemTypeLabels: {
            norsk: "Norsk virksomhet",
            utenlandsk: "Utenlandsk virksomhet",
          },
        },
      },
    },
    skatteforholdOgInntekt: {
      tittel: "Skatteforhold og inntekt",
      felter: {
        erSkattepliktigTilNorgeIHeleutsendingsperioden: {
          type: "BOOLEAN",
          label: "Er du skattepliktig til Norge i hele utsendingsperioden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        mottarPengestotteFraAnnetEosLandEllerSveits: {
          type: "BOOLEAN",
          label: "Mottar du pengestøtte fra et annet EØS-land eller Sveits?",
          pakrevd: true,
          hjelpetekst:
            "Med «pengestøtte» mener vi penger du mottar som kompensasjon for tapt arbeidsinntekt. Sykepenger, foreldrepenger, dagpenger og arbeidsavklaringspenger er eksempler på slik pengestøtte i Norge.",
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        landSomUtbetalerPengestotte: {
          type: "COUNTRY_SELECT",
          label: "Fra hvilket land mottar du pengestøtte?",
          pakrevd: false,
        },
        pengestotteSomMottasFraAndreLandBelop: {
          type: "TEXT",
          label: "Hvor mye penger mottar du brutto per måned?",
          pakrevd: false,
          hjelpetekst: "Oppgi beløpet i norske kroner",
          format: "BELOP",
        },
        pengestotteSomMottasFraAndreLandBeskrivelse: {
          type: "TEXTAREA",
          label: "Hva slags pengestøtte mottar du?",
          pakrevd: false,
        },
        inntektFraNorskEllerUtenlandskVirksomhet: {
          type: "CHECKBOX_GROUP",
          label:
            "Får du arbeidsinntekten din fra en norsk eller utenlandsk virksomhet?",
          pakrevd: false,
          alternativer: [
            {
              verdi: "NORSK_VIRKSOMHET",
              label: "Norsk virksomhet",
            },
            {
              verdi: "UTENLANDSK_VIRKSOMHET",
              label: "Utenlandsk virksomhet",
            },
          ],
        },
        hvilkeTyperInntektHarDu: {
          type: "CHECKBOX_GROUP",
          label: "Hvilken inntekt har du?",
          pakrevd: false,
          alternativer: [
            {
              verdi: "LOENN",
              label: "Lønnsinntekt",
            },
            {
              verdi: "INNTEKT_FRA_EGEN_VIRKSOMHET",
              label: "Inntekt fra egen virksomhet",
            },
          ],
        },
        inntekt: {
          type: "TEXT",
          label: "Lønnsinntekt",
          pakrevd: false,
          hjelpetekst:
            "Du skal føre opp samlet månedlig inntekt, inkludert eventuelle utenlandstillegg og verdi av naturalytelser dekt av virksomheten. Hvis inntekten din varierer fra måned til måned, oppgi gjennomsnittlig inntekt i brutto per måned.",
          format: "BELOP",
        },
        inntektFraEgenVirksomhet: {
          type: "TEXT",
          label: "Inntekter fra egen virksomhet",
          pakrevd: false,
          format: "BELOP",
        },
      },
    },
    familiemedlemmer: {
      tittel: "Familiemedlemmer",
      felter: {
        skalHaMedFamiliemedlemmer: {
          type: "BOOLEAN",
          label:
            "Har du ektefelle, partner, samboer eller barn som skal være med deg?",
          pakrevd: true,
          hjelpetekst:
            "Vi spør om dette fordi vi ønsker å behandle søknader fra flere i samme familie samtidig",
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
      },
    },
    tilleggsopplysningerArbeidstaker: {
      tittel: "Tilleggsopplysninger",
      felter: {
        harFlereOpplysningerTilSoknaden: {
          type: "BOOLEAN",
          label: "Har du noen flere opplysninger til søknaden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label: "Beskriv disse her",
          pakrevd: false,
          maxLength: 2000,
        },
      },
    },
    vedleggArbeidstaker: {
      tittel: "Vedlegg",
      felter: {
        harAnnenDokumentasjon: {
          type: "BOOLEAN",
          label: "Har du noen annen dokumentasjon du ønsker å legge ved?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
      },
    },
    arbeidsgiverensVirksomhetINorge: {
      tittel: "Arbeidsgiverens virksomhet i Norge",
      felter: {
        erArbeidsgiverenOffentligVirksomhet: {
          type: "BOOLEAN",
          label: "Er arbeidsgiveren en offentlig virksomhet?",
          pakrevd: true,
          hjelpetekst:
            "Offentlige virksomheter er statsorganer og underliggende virksomheter, for eksempel departementer og universiteter.",
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        erArbeidsgiverenBemanningsEllerVikarbyraa: {
          type: "BOOLEAN",
          label: "Er arbeidsgiveren et bemannings- eller vikarbyrå?",
          pakrevd: false,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        opprettholderArbeidsgiverenVanligDrift: {
          type: "BOOLEAN",
          label: "Opprettholder arbeidsgiveren vanlig drift i Norge?",
          pakrevd: false,
          hjelpetekst:
            "Med dette mener vi at arbeidsgiveren fortsatt har aktivitet og ansatte som jobber i Norge i perioden.",
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
      },
    },
    utenlandsoppdragetArbeidsgiver: {
      tittel: "Utenlandsoppdraget",
      felter: {
        utsendelseLand: {
          type: "COUNTRY_SELECT",
          label: "Hvilket land sendes arbeidstakeren til?",
          pakrevd: true,
        },
        arbeidstakerUtsendelsePeriode: {
          type: "PERIOD",
          label: "Utsendingsperiode",
          pakrevd: true,
          hjelpetekst: "Oppgi omtrentlig dato hvis du ikke vet nøyaktig dato.",
          fraDatoLabel: "Fra dato",
          tilDatoLabel: "Til dato",
        },
        arbeidsgiverHarOppdragILandet: {
          type: "BOOLEAN",
          label:
            "Har du som arbeidsgiver oppdrag i landet arbeidstaker skal sendes ut til?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        arbeidstakerBleAnsattForUtenlandsoppdraget: {
          type: "BOOLEAN",
          label:
            "Ble arbeidstaker ansatt på grunn av dette utenlandsoppdraget?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        arbeidstakerForblirAnsattIHelePerioden: {
          type: "BOOLEAN",
          label:
            "Vil arbeidstaker fortsatt være ansatt hos dere i hele utsendingsperioden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        arbeidstakerErstatterAnnenPerson: {
          type: "BOOLEAN",
          label:
            "Erstatter arbeidstaker en annen person som var sendt ut for å gjøre det samme arbeidet?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: {
          type: "BOOLEAN",
          label:
            "Vil arbeidstakeren arbeide for virksomheten i Norge etter utenlandsoppdraget?",
          pakrevd: false,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        utenlandsoppholdetsBegrunnelse: {
          type: "TEXTAREA",
          label: "Hvorfor skal arbeidstakeren arbeide i utlandet?",
          pakrevd: false,
        },
        ansettelsesforholdBeskrivelse: {
          type: "TEXTAREA",
          label:
            "Beskriv arbeidstakerens ansettelsesforhold i utsendingsperioden",
          pakrevd: false,
        },
        forrigeArbeidstakerUtsendelsePeriode: {
          type: "PERIOD",
          label: "Forrige arbeidstakers utsendelse",
          pakrevd: false,
          hjelpetekst: "Oppgi omtrentlig dato hvis du ikke vet nøyaktig dato.",
          fraDatoLabel: "Fra dato",
          tilDatoLabel: "Til dato",
        },
      },
    },
    arbeidsstedIUtlandet: {
      tittel: "Arbeidssted i utlandet",
      felter: {
        arbeidsstedType: {
          type: "SELECT",
          label: "Hvor skal arbeidet utføres?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "PA_LAND",
              label: "På land",
            },
            {
              verdi: "OFFSHORE",
              label: "Offshore",
            },
            {
              verdi: "PA_SKIP",
              label: "På skip",
            },
            {
              verdi: "OM_BORD_PA_FLY",
              label: "Om bord på fly",
            },
          ],
        },
      },
    },
    arbeidsstedPaLand: {
      tittel: "Arbeidssted på land",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Navn på virksomheten",
          pakrevd: true,
        },
        fastEllerVekslendeArbeidssted: {
          type: "SELECT",
          label:
            "Har arbeidstakeren fast arbeidssted i dette landet eller veksler det ofte?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "FAST",
              label: "Fast arbeidssted",
            },
            {
              verdi: "VEKSLENDE",
              label: "Veksler ofte",
            },
          ],
        },
        vegadresse: {
          type: "TEXT",
          label: "Gate/vei",
          pakrevd: false,
        },
        nummer: {
          type: "TEXT",
          label: "Nummer",
          pakrevd: false,
        },
        postkode: {
          type: "TEXT",
          label: "Postkode",
          pakrevd: false,
        },
        bySted: {
          type: "TEXT",
          label: "By/sted/region",
          pakrevd: false,
        },
        land: {
          type: "COUNTRY_SELECT",
          label: "Land",
          pakrevd: false,
        },
        erHjemmekontor: {
          type: "BOOLEAN",
          label: "Er arbeidstakeren utsendt for å jobbe på hjemmekontor?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
      },
    },
    arbeidsstedOffshore: {
      tittel: "Arbeidssted offshore",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Navn på virksomheten",
          pakrevd: true,
        },
        navnPaInnretning: {
          type: "TEXT",
          label: "Navn på innretning",
          pakrevd: true,
        },
        typeInnretning: {
          type: "SELECT",
          label: "Hvilken type innretning er dette?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "PLATTFORM_ELLER_ANNEN_FAST_INNRETNING",
              label: "Plattform eller annen fast innretning",
            },
            {
              verdi: "BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING",
              label: "Boreskip eller annen flyttbar innretning",
            },
          ],
        },
        sokkelLand: {
          type: "COUNTRY_SELECT",
          label: "Hvilket lands sokkel er dette?",
          pakrevd: true,
        },
      },
    },
    arbeidsstedPaSkip: {
      tittel: "Arbeidssted på skip",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Navn på virksomheten",
          pakrevd: true,
        },
        navnPaSkip: {
          type: "TEXT",
          label: "Hva er navnet på skipet arbeidstakeren skal jobbe på?",
          pakrevd: true,
        },
        yrketTilArbeidstaker: {
          type: "TEXT",
          label: "Hva er yrket til arbeidstakeren?",
          pakrevd: true,
          hjelpetekst:
            "Vi trenger informasjon om hva slags arbeid arbeidstakeren utfører om bord på skipet",
        },
        seilerI: {
          type: "SELECT",
          label: "Hvor skal skipet seile?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "INTERNASJONALT_FARVANN",
              label: "Internasjonalt farvann",
            },
            {
              verdi: "TERRITORIALFARVANN",
              label: "Innenfor territorialfarvann",
            },
          ],
        },
        flaggland: {
          type: "COUNTRY_SELECT",
          label: "Hva er flagglandet til skipet?",
          pakrevd: false,
        },
        territorialfarvannLand: {
          type: "COUNTRY_SELECT",
          label: "Hvilket lands territorialfarvann?",
          pakrevd: false,
        },
      },
    },
    arbeidsstedOmBordPaFly: {
      tittel: "Arbeidssted om bord på fly",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Navn på virksomheten",
          pakrevd: true,
        },
        hjemmebaseLand: {
          type: "COUNTRY_SELECT",
          label:
            "I hvilket land har arbeidstakeren hjemmebase i søknadsperioden?",
          pakrevd: true,
          hjelpetekst:
            "Med hjemmebase mener vi flyplassen der arbeidstakeren starter og avslutter flyvningene sine",
        },
        hjemmebaseNavn: {
          type: "TEXT",
          label: "Hva er navnet på hjemmebasen?",
          pakrevd: true,
        },
        erVanligHjemmebase: {
          type: "BOOLEAN",
          label: "Er dette hjemmebasen arbeidstakeren jobber fra til vanlig?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        vanligHjemmebaseLand: {
          type: "COUNTRY_SELECT",
          label:
            "I hvilket land ligger hjemmebasen arbeidstakeren vanligvis jobber fra?",
          pakrevd: false,
        },
        vanligHjemmebaseNavn: {
          type: "TEXT",
          label:
            "Hva er navnet på hjemmebasen arbeidstakeren vanligvis jobber fra?",
          pakrevd: false,
        },
      },
    },
    arbeidstakerensLonn: {
      tittel: "Arbeidstakerens lønn",
      felter: {
        arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: {
          type: "BOOLEAN",
          label:
            "Utbetaler du som arbeidsgiver all lønn og eventuelle naturalytelser i utsendingsperioden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        virksomheterSomUtbetalerLonnOgNaturalytelser: {
          type: "LIST",
          label: "Hvem utbetaler lønnen og eventuelle naturalytelser?",
          pakrevd: false,
          hjelpetekst:
            "Legg til norske og/eller utenlandske virksomheter som utbetaler lønnen og eventuelle naturalytelser",
          leggTilLabel: "Legg til virksomhet",
          fjernLabel: "Fjern",
          elementDefinisjon: {
            organisasjonsnummer: {
              type: "TEXT",
              label: "Organisasjonsnummer",
              pakrevd: true,
            },
            navn: {
              type: "TEXT",
              label: "Virksomhetsnavn",
              pakrevd: false,
            },
            vegnavnOgHusnummer: {
              type: "TEXT",
              label: "Vegnavn og husnummer",
              pakrevd: true,
            },
            bygning: {
              type: "TEXT",
              label: "Bygning",
              pakrevd: false,
            },
            postkode: {
              type: "TEXT",
              label: "Postkode",
              pakrevd: false,
            },
            byStedsnavn: {
              type: "TEXT",
              label: "By/stedsnavn",
              pakrevd: false,
            },
            region: {
              type: "TEXT",
              label: "Region",
              pakrevd: false,
            },
            land: {
              type: "COUNTRY_SELECT",
              label: "Land",
              pakrevd: true,
            },
            tilhorerSammeKonsern: {
              type: "BOOLEAN",
              label: "Tilhører samme konsern som norsk arbeidsgiver?",
              pakrevd: true,
              jaLabel: "Ja",
              neiLabel: "Nei",
            },
          },
          itemTypeLabels: {
            norsk: "Norsk virksomhet",
            utenlandsk: "Utenlandsk virksomhet",
          },
        },
      },
    },
    tilleggsopplysningerArbeidsgiver: {
      tittel: "Tilleggsopplysninger",
      felter: {
        harFlereOpplysningerTilSoknaden: {
          type: "BOOLEAN",
          label: "Har du noen flere opplysninger til søknaden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label: "Beskriv disse her",
          pakrevd: false,
          maxLength: 2000,
        },
      },
    },
    vedleggArbeidsgiver: {
      tittel: "Vedlegg",
      felter: {
        harAnnenDokumentasjon: {
          type: "BOOLEAN",
          label: "Har du noen annen dokumentasjon du ønsker å legge ved?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
      },
    },
  },
} as const;

const SKJEMA_DEFINISJON_A1_NN = {
  type: "UTSENDT_ARBEIDSTAKER",
  versjon: "1",
  seksjoner: {
    utsendingsperiodeOgLand: {
      tittel: "Utsendingsperiode og land",
      felter: {
        utsendelseLand: {
          type: "COUNTRY_SELECT",
          label: "I kva for land skal arbeidet utførast?",
          pakrevd: true,
        },
        utsendelsePeriode: {
          type: "PERIOD",
          label: "Utsendingsperiode",
          pakrevd: true,
          hjelpetekst:
            "Oppgi omtrentleg dato dersom du ikkje veit nøyaktig dato.",
          fraDatoLabel: "Frå dato",
          tilDatoLabel: "Til dato",
        },
      },
    },
    arbeidssituasjon: {
      tittel: "Arbeidssituasjon",
      felter: {
        harVaertEllerSkalVaereILonnetArbeidFoerUtsending: {
          type: "BOOLEAN",
          label:
            "Har du vore, eller skal du vere i løna arbeid i Noreg i minst ein månad rett før utsendinga?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        aktivitetIMaanedenFoerUtsendingen: {
          type: "TEXTAREA",
          label: "Skildre aktiviteten din i månaden før utsendinga",
          pakrevd: false,
          hjelpetekst:
            "For eksempel studium, ferie eller sjølvstendig verksemd",
        },
        skalJobbeForFlereVirksomheter: {
          type: "BOOLEAN",
          label:
            "Skal du også drive sjølvstendig verksemd eller arbeide for ein annan arbeidsgivar i utsendingsperioden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        virksomheterArbeidstakerJobberForIutsendelsesPeriode: {
          type: "LIST",
          label: "Kven skal du jobbe for i utsendingsperioden?",
          pakrevd: false,
          hjelpetekst:
            "Legg til norske og/eller utanlandske verksemder du skal jobbe for i utsendingsperioden.",
          leggTilLabel: "Legg til verksemd",
          fjernLabel: "Fjern",
          elementDefinisjon: {
            organisasjonsnummer: {
              type: "TEXT",
              label: "Organisasjonsnummer",
              pakrevd: true,
            },
            navn: {
              type: "TEXT",
              label: "Verksemdsnamn",
              pakrevd: false,
            },
            ansettelsesform: {
              type: "SELECT",
              label: "Kva jobbar du som i denne verksemda?",
              pakrevd: true,
              alternativer: [
                {
                  verdi: "ARBEIDSTAKER_ELLER_FRILANSER",
                  label: "Arbeidstakar eller frilansar",
                },
                {
                  verdi: "SELVSTENDIG_NAERINGSDRIVENDE",
                  label: "Sjølvstendig næringsdrivande",
                },
                {
                  verdi: "STATSANSATT",
                  label: "Statstilsett",
                },
              ],
            },
            vegnavnOgHusnummer: {
              type: "TEXT",
              label: "Vegnamn og husnummer",
              pakrevd: true,
            },
            bygning: {
              type: "TEXT",
              label: "Bygning",
              pakrevd: false,
            },
            postkode: {
              type: "TEXT",
              label: "Postkode",
              pakrevd: false,
            },
            byStedsnavn: {
              type: "TEXT",
              label: "By/stadnamn",
              pakrevd: false,
            },
            region: {
              type: "TEXT",
              label: "Region",
              pakrevd: false,
            },
            land: {
              type: "COUNTRY_SELECT",
              label: "Land",
              pakrevd: true,
            },
            tilhorerSammeKonsern: {
              type: "BOOLEAN",
              label:
                "Høyrer verksemda til same konsern som den norske arbeidsgivaren?",
              pakrevd: true,
              jaLabel: "Ja",
              neiLabel: "Nei",
            },
          },
          itemTypeLabels: {
            norsk: "Norsk verksemd",
            utenlandsk: "Utanlandsk verksemd",
          },
        },
      },
    },
    skatteforholdOgInntekt: {
      tittel: "Skatteforhold og inntekt",
      felter: {
        erSkattepliktigTilNorgeIHeleutsendingsperioden: {
          type: "BOOLEAN",
          label: "Er du skattepliktig til Noreg i heile utsendingsperioden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        mottarPengestotteFraAnnetEosLandEllerSveits: {
          type: "BOOLEAN",
          label: "Tek du imot pengestøtte frå eit anna EØS-land eller Sveits?",
          pakrevd: true,
          hjelpetekst:
            'Med "pengestøtte" meiner vi pengar du tek imot som kompensasjon for tapt arbeidsinntekt. Sjukepengar, foreldrepengar, dagpengar og arbeidsavklaringspengar er eksempel på slik pengestøtte i Noreg.',
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        landSomUtbetalerPengestotte: {
          type: "COUNTRY_SELECT",
          label: "Frå kva land tek du imot pengestøtte?",
          pakrevd: false,
        },
        pengestotteSomMottasFraAndreLandBelop: {
          type: "TEXT",
          label: "Kor mykje pengar tek du imot brutto per månad?",
          pakrevd: false,
          hjelpetekst: "Oppgi beløpet i norske kroner",
          format: "BELOP",
        },
        pengestotteSomMottasFraAndreLandBeskrivelse: {
          type: "TEXTAREA",
          label: "Kva slags pengestøtte tek du imot?",
          pakrevd: false,
        },
        inntektFraNorskEllerUtenlandskVirksomhet: {
          type: "CHECKBOX_GROUP",
          label:
            "Får du arbeidsinntekta di frå ei norsk eller utanlandsk verksemd?",
          pakrevd: false,
          alternativer: [
            {
              verdi: "NORSK_VIRKSOMHET",
              label: "Norsk verksemd",
            },
            {
              verdi: "UTENLANDSK_VIRKSOMHET",
              label: "Utanlandsk verksemd",
            },
          ],
        },
        hvilkeTyperInntektHarDu: {
          type: "CHECKBOX_GROUP",
          label: "Kva slags inntekt har du?",
          pakrevd: false,
          alternativer: [
            {
              verdi: "LOENN",
              label: "Lønsinntekt",
            },
            {
              verdi: "INNTEKT_FRA_EGEN_VIRKSOMHET",
              label: "Inntekt frå eiga verksemd",
            },
          ],
        },
        inntekt: {
          type: "TEXT",
          label: "Lønsinntekt",
          pakrevd: false,
          hjelpetekst:
            "Du skal føre opp samla månadleg inntekt, inkludert eventuelle utlandstillegg og verdi av naturalytingar dekte av verksemda. Dersom inntekta di varierer frå månad til månad, oppgi gjennomsnittleg inntekt i brutto per månad.",
          format: "BELOP",
        },
        inntektFraEgenVirksomhet: {
          type: "TEXT",
          label: "Inntekter frå eiga verksemd",
          pakrevd: false,
          format: "BELOP",
        },
      },
    },
    familiemedlemmer: {
      tittel: "Familiemedlemmar",
      felter: {
        skalHaMedFamiliemedlemmer: {
          type: "BOOLEAN",
          label:
            "Har du ektefelle, partnar, sambuar eller barn som skal vere med deg?",
          pakrevd: true,
          hjelpetekst:
            "Vi spør om dette fordi vi ønskjer å behandle søknader frå fleire i same familie samtidig",
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
      },
    },
    tilleggsopplysningerArbeidstaker: {
      tittel: "Tilleggsopplysningar",
      felter: {
        harFlereOpplysningerTilSoknaden: {
          type: "BOOLEAN",
          label: "Har du fleire opplysningar til søknaden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label: "Skildre desse her",
          pakrevd: false,
          maxLength: 2000,
        },
      },
    },
    vedleggArbeidstaker: {
      tittel: "Vedlegg",
      felter: {
        harAnnenDokumentasjon: {
          type: "BOOLEAN",
          label: "Har du anna dokumentasjon du ønskjer å leggje ved?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
      },
    },
    arbeidsgiverensVirksomhetINorge: {
      tittel: "Verksemda til arbeidsgivaren i Noreg",
      felter: {
        erArbeidsgiverenOffentligVirksomhet: {
          type: "BOOLEAN",
          label: "Er arbeidsgivaren ei offentleg verksemd?",
          pakrevd: true,
          hjelpetekst:
            "Offentlege verksemder er statsorgan og underliggjande verksemder, til dømes departement og universitet.",
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        erArbeidsgiverenBemanningsEllerVikarbyraa: {
          type: "BOOLEAN",
          label: "Er arbeidsgivaren eit bemannings- eller vikarbyrå?",
          pakrevd: false,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        opprettholderArbeidsgiverenVanligDrift: {
          type: "BOOLEAN",
          label: "Held arbeidsgivaren oppe vanleg drift i Noreg?",
          pakrevd: false,
          hjelpetekst:
            "Med dette meiner vi at arbeidsgivaren framleis har aktivitet og tilsette som jobbar i Noreg i perioden.",
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
      },
    },
    utenlandsoppdragetArbeidsgiver: {
      tittel: "Utsendingsperiode og land",
      felter: {
        utsendelseLand: {
          type: "COUNTRY_SELECT",
          label: "I kva for land skal arbeidet utførast?",
          pakrevd: true,
        },
        arbeidstakerUtsendelsePeriode: {
          type: "PERIOD",
          label: "Utsendingsperiode",
          pakrevd: true,
          hjelpetekst:
            "Oppgi omtrentleg dato dersom du ikkje veit nøyaktig dato.",
          fraDatoLabel: "Frå dato",
          tilDatoLabel: "Til dato",
        },
        arbeidsgiverHarOppdragILandet: {
          type: "BOOLEAN",
          label:
            "Har du som arbeidsgivar oppdrag i landet arbeidstakaren skal sendast ut til?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        arbeidstakerBleAnsattForUtenlandsoppdraget: {
          type: "BOOLEAN",
          label:
            "Vart arbeidstakaren tilsett på grunn av dette utanlandsoppdraget?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        arbeidstakerForblirAnsattIHelePerioden: {
          type: "BOOLEAN",
          label:
            "Vil arbeidstakaren framleis vere tilsett hos dykk i heile utsendingsperioden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        arbeidstakerErstatterAnnenPerson: {
          type: "BOOLEAN",
          label:
            "Erstattar arbeidstakaren ein annan person som var sendt ut for å gjere det same arbeidet?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: {
          type: "BOOLEAN",
          label:
            "Vil arbeidstakaren arbeide for verksemda i Noreg etter utanlandsoppdraget?",
          pakrevd: false,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        utenlandsoppholdetsBegrunnelse: {
          type: "TEXTAREA",
          label: "Kvifor skal arbeidstakaren arbeide i utlandet?",
          pakrevd: false,
        },
        ansettelsesforholdBeskrivelse: {
          type: "TEXTAREA",
          label:
            "Skildre tilsetjingsforholdet til arbeidstakaren i utsendingsperioden",
          pakrevd: false,
        },
        forrigeArbeidstakerUtsendelsePeriode: {
          type: "PERIOD",
          label: "Utsendinga til førre arbeidstakar",
          pakrevd: false,
          hjelpetekst:
            "Oppgi omtrentleg dato dersom du ikkje veit nøyaktig dato.",
          fraDatoLabel: "Frå dato",
          tilDatoLabel: "Til dato",
        },
      },
    },
    arbeidsstedIUtlandet: {
      tittel: "Arbeidsstad i utlandet",
      felter: {
        arbeidsstedType: {
          type: "SELECT",
          label: "Kor skal arbeidet utførast?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "PA_LAND",
              label: "På land",
            },
            {
              verdi: "OFFSHORE",
              label: "Offshore",
            },
            {
              verdi: "PA_SKIP",
              label: "På skip",
            },
            {
              verdi: "OM_BORD_PA_FLY",
              label: "Om bord på fly",
            },
          ],
        },
      },
    },
    arbeidsstedPaLand: {
      tittel: "Arbeidsstad på land",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Namn på verksemda",
          pakrevd: true,
        },
        fastEllerVekslendeArbeidssted: {
          type: "SELECT",
          label:
            "Har arbeidstakaren fast arbeidsstad i dette landet, eller vekslar det ofte?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "FAST",
              label: "Fast arbeidsstad",
            },
            {
              verdi: "VEKSLENDE",
              label: "Vekslar ofte",
            },
          ],
        },
        vegadresse: {
          type: "TEXT",
          label: "Gate/veg",
          pakrevd: false,
        },
        nummer: {
          type: "TEXT",
          label: "Nummer",
          pakrevd: false,
        },
        postkode: {
          type: "TEXT",
          label: "Postkode",
          pakrevd: false,
        },
        bySted: {
          type: "TEXT",
          label: "By/stad/region",
          pakrevd: false,
        },
        land: {
          type: "COUNTRY_SELECT",
          label: "Land",
          pakrevd: false,
        },
        erHjemmekontor: {
          type: "BOOLEAN",
          label: "Er arbeidstakaren utsendt for å jobbe på heimekontor?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
      },
    },
    arbeidsstedOffshore: {
      tittel: "Arbeidsstad offshore",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Namn på verksemda",
          pakrevd: true,
        },
        navnPaInnretning: {
          type: "TEXT",
          label: "Namn på innretning",
          pakrevd: true,
        },
        typeInnretning: {
          type: "SELECT",
          label: "Kva slags type innretning er dette?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "PLATTFORM_ELLER_ANNEN_FAST_INNRETNING",
              label: "Plattform eller anna fast innretning",
            },
            {
              verdi: "BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING",
              label: "Boreskip eller anna flyttbar innreting",
            },
          ],
        },
        sokkelLand: {
          type: "COUNTRY_SELECT",
          label: "Kva for lands sokkel er dette?",
          pakrevd: true,
        },
      },
    },
    arbeidsstedPaSkip: {
      tittel: "Arbeidsstad på skip",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Namn på verksemda",
          pakrevd: true,
        },
        navnPaSkip: {
          type: "TEXT",
          label: "Kva er namnet på skipet arbeidstakaren skal jobbe på?",
          pakrevd: true,
        },
        yrketTilArbeidstaker: {
          type: "TEXT",
          label: "Kva er yrket til arbeidstakaren?",
          pakrevd: true,
          hjelpetekst:
            "Vi treng informasjon om kva slags arbeid arbeidstakaren utfører om bord på skipet",
        },
        seilerI: {
          type: "SELECT",
          label: "Kor skal skipet segle?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "INTERNASJONALT_FARVANN",
              label: "Internasjonalt farvatn",
            },
            {
              verdi: "TERRITORIALFARVANN",
              label: "Innanfor territorialfarvatn",
            },
          ],
        },
        flaggland: {
          type: "COUNTRY_SELECT",
          label: "Kva er flagglandet til skipet?",
          pakrevd: false,
        },
        territorialfarvannLand: {
          type: "COUNTRY_SELECT",
          label: "Kva for lands territorialfarvatn?",
          pakrevd: false,
        },
      },
    },
    arbeidsstedOmBordPaFly: {
      tittel: "Arbeidsstad om bord på fly",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Namn på verksemda",
          pakrevd: true,
        },
        hjemmebaseLand: {
          type: "COUNTRY_SELECT",
          label:
            "I kva for land har arbeidstakaren heimebase i søknadsperioden?",
          pakrevd: true,
          hjelpetekst:
            "Med heimebase meiner vi flyplassen der arbeidstakaren startar og avsluttar flygingane sine",
        },
        hjemmebaseNavn: {
          type: "TEXT",
          label: "Kva er namnet på heimebasen?",
          pakrevd: true,
        },
        erVanligHjemmebase: {
          type: "BOOLEAN",
          label: "Er dette heimebasen arbeidstakaren vanlegvis jobbar frå?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        vanligHjemmebaseLand: {
          type: "COUNTRY_SELECT",
          label:
            "I kva for land ligg heimebasen arbeidstakaren vanlegvis jobbar frå?",
          pakrevd: false,
        },
        vanligHjemmebaseNavn: {
          type: "TEXT",
          label:
            "Kva er namnet på heimebasen arbeidstakaren vanlegvis jobbar frå?",
          pakrevd: false,
        },
      },
    },
    arbeidstakerensLonn: {
      tittel: "Løna til arbeidstakaren",
      felter: {
        arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: {
          type: "BOOLEAN",
          label:
            "Utbetaler du som arbeidsgivar all løn og eventuelle naturalytingar i utsendingsperioden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        virksomheterSomUtbetalerLonnOgNaturalytelser: {
          type: "LIST",
          label: "Kven utbetaler løna og eventuelle naturalytingar?",
          pakrevd: false,
          hjelpetekst:
            "Legg til norske og/eller utanlandske verksemder som utbetaler løna og eventuelle naturalytingar",
          leggTilLabel: "Legg til verksemd",
          fjernLabel: "Fjern",
          elementDefinisjon: {
            organisasjonsnummer: {
              type: "TEXT",
              label: "Organisasjonsnummer",
              pakrevd: true,
            },
            navn: {
              type: "TEXT",
              label: "Verksemdsnamn",
              pakrevd: false,
            },
            vegnavnOgHusnummer: {
              type: "TEXT",
              label: "Vegnamn og husnummer",
              pakrevd: true,
            },
            bygning: {
              type: "TEXT",
              label: "Bygning",
              pakrevd: false,
            },
            postkode: {
              type: "TEXT",
              label: "Postkode",
              pakrevd: false,
            },
            byStedsnavn: {
              type: "TEXT",
              label: "By/stadnamn",
              pakrevd: false,
            },
            region: {
              type: "TEXT",
              label: "Region",
              pakrevd: false,
            },
            land: {
              type: "COUNTRY_SELECT",
              label: "Land",
              pakrevd: true,
            },
            tilhorerSammeKonsern: {
              type: "BOOLEAN",
              label:
                "Høyrer verksemda til same konsern som den norske arbeidsgivaren?",
              pakrevd: true,
              jaLabel: "Ja",
              neiLabel: "Nei",
            },
          },
          itemTypeLabels: {
            norsk: "Norsk verksemd",
            utenlandsk: "Utanlandsk verksemd",
          },
        },
      },
    },
    tilleggsopplysningerArbeidsgiver: {
      tittel: "Tilleggsopplysningar",
      felter: {
        harFlereOpplysningerTilSoknaden: {
          type: "BOOLEAN",
          label: "Har du fleire opplysningar til søknaden?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label: "Skildre desse her",
          pakrevd: false,
          maxLength: 2000,
        },
      },
    },
    vedleggArbeidsgiver: {
      tittel: "Vedlegg",
      felter: {
        harAnnenDokumentasjon: {
          type: "BOOLEAN",
          label: "Har du anna dokumentasjon du ønskjer å leggje ved?",
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
      },
    },
  },
} as const;

const SKJEMA_DEFINISJON_A1_EN = {
  type: "UTSENDT_ARBEIDSTAKER",
  versjon: "1",
  seksjoner: {
    utsendingsperiodeOgLand: {
      tittel: "Posting Period and Country",
      felter: {
        utsendelseLand: {
          type: "COUNTRY_SELECT",
          label: "In which country will the work be performed?",
          pakrevd: true,
        },
        utsendelsePeriode: {
          type: "PERIOD",
          label: "Posting period",
          pakrevd: true,
          hjelpetekst:
            "Provide an approximate date if you do not know the exact date.",
          fraDatoLabel: "From date",
          tilDatoLabel: "To date",
        },
      },
    },
    arbeidssituasjon: {
      tittel: "Work situation",
      felter: {
        harVaertEllerSkalVaereILonnetArbeidFoerUtsending: {
          type: "BOOLEAN",
          label:
            "Have you been, or will you be, in paid employment in Norway for at least one month before being posted abroad?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        aktivitetIMaanedenFoerUtsendingen: {
          type: "TEXTAREA",
          label:
            "Describe your activity in the month prior to being posted abroad",
          pakrevd: false,
          hjelpetekst: "For example studies, holiday or self-employment",
        },
        skalJobbeForFlereVirksomheter: {
          type: "BOOLEAN",
          label:
            "Will you also work for another employer or pursue activities as self-employed during the posting period?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        virksomheterArbeidstakerJobberForIutsendelsesPeriode: {
          type: "LIST",
          label: "Who will you work for during the posting period?",
          pakrevd: false,
          hjelpetekst:
            "Add Norwegian and/or foreign companies you will work for during the posting period.",
          leggTilLabel: "Add company",
          fjernLabel: "Remove",
          elementDefinisjon: {
            organisasjonsnummer: {
              type: "TEXT",
              label: "Organisation number",
              pakrevd: true,
            },
            navn: {
              type: "TEXT",
              label: "Company name",
              pakrevd: false,
            },
            ansettelsesform: {
              type: "SELECT",
              label: "What do you work as in this company?",
              pakrevd: true,
              alternativer: [
                {
                  verdi: "ARBEIDSTAKER_ELLER_FRILANSER",
                  label: "Employee or freelancer",
                },
                {
                  verdi: "SELVSTENDIG_NAERINGSDRIVENDE",
                  label: "Self-employed",
                },
                {
                  verdi: "STATSANSATT",
                  label: "Civil servant",
                },
              ],
            },
            vegnavnOgHusnummer: {
              type: "TEXT",
              label: "Street name and number",
              pakrevd: true,
            },
            bygning: {
              type: "TEXT",
              label: "Building",
              pakrevd: false,
            },
            postkode: {
              type: "TEXT",
              label: "Postal code",
              pakrevd: false,
            },
            byStedsnavn: {
              type: "TEXT",
              label: "City/place name",
              pakrevd: false,
            },
            region: {
              type: "TEXT",
              label: "Region",
              pakrevd: false,
            },
            land: {
              type: "COUNTRY_SELECT",
              label: "Country",
              pakrevd: true,
            },
            tilhorerSammeKonsern: {
              type: "BOOLEAN",
              label:
                "Is the company part of the same corporate group as the Norwegian employer?",
              pakrevd: true,
              jaLabel: "Yes",
              neiLabel: "No",
            },
          },
          itemTypeLabels: {
            norsk: "Norwegian company",
            utenlandsk: "Foreign company",
          },
        },
      },
    },
    skatteforholdOgInntekt: {
      tittel: "Tax and income information",
      felter: {
        erSkattepliktigTilNorgeIHeleutsendingsperioden: {
          type: "BOOLEAN",
          label:
            "Are you liable to pay tax to Norway for the entire posting period?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        mottarPengestotteFraAnnetEosLandEllerSveits: {
          type: "BOOLEAN",
          label:
            "Do you receive cash benefits from another EEA country or Switzerland?",
          pakrevd: true,
          hjelpetekst:
            'By "cash benefits" we mean money you receive as compensation for lost earnings. Sickness benefits, parental benefits, unemployment benefits and work assessment allowance (AAP) are examples of cash benefits in Norway.',
          jaLabel: "Yes",
          neiLabel: "No",
        },
        landSomUtbetalerPengestotte: {
          type: "COUNTRY_SELECT",
          label: "From which country do you receive cash benefits?",
          pakrevd: false,
        },
        pengestotteSomMottasFraAndreLandBelop: {
          type: "TEXT",
          label: "How much do you receive gross per month?",
          pakrevd: false,
          hjelpetekst: "Enter the amount in Norwegian kroner",
          format: "BELOP",
        },
        pengestotteSomMottasFraAndreLandBeskrivelse: {
          type: "TEXTAREA",
          label: "What type of cash benefits do you receive?",
          pakrevd: false,
        },
        inntektFraNorskEllerUtenlandskVirksomhet: {
          type: "CHECKBOX_GROUP",
          label:
            "Is your employment income from a Norwegian or foreign company?",
          pakrevd: false,
          alternativer: [
            {
              verdi: "NORSK_VIRKSOMHET",
              label: "Norwegian company",
            },
            {
              verdi: "UTENLANDSK_VIRKSOMHET",
              label: "Foreign company",
            },
          ],
        },
        hvilkeTyperInntektHarDu: {
          type: "CHECKBOX_GROUP",
          label: "What kind of income do you have?",
          pakrevd: false,
          alternativer: [
            {
              verdi: "LOENN",
              label: "Salary",
            },
            {
              verdi: "INNTEKT_FRA_EGEN_VIRKSOMHET",
              label: "Self-employment income",
            },
          ],
        },
        inntekt: {
          type: "TEXT",
          label: "Salary",
          pakrevd: false,
          hjelpetekst:
            "You should report your total monthly income, including any foreign allowances and the value of benefits in kind covered by the company. If your income varies from month to month, please state the average gross income per month.",
          format: "BELOP",
        },
        inntektFraEgenVirksomhet: {
          type: "TEXT",
          label: "Self-employment income",
          pakrevd: false,
          format: "BELOP",
        },
      },
    },
    familiemedlemmer: {
      tittel: "Family members",
      felter: {
        skalHaMedFamiliemedlemmer: {
          type: "BOOLEAN",
          label:
            "Do you have a spouse, partner, cohabitant or children who will accompany you?",
          pakrevd: true,
          hjelpetekst:
            "We ask for this information because we wish to process applications from several members of a family at the same time.",
          jaLabel: "Yes",
          neiLabel: "No",
        },
      },
    },
    tilleggsopplysningerArbeidstaker: {
      tittel: "Additional information",
      felter: {
        harFlereOpplysningerTilSoknaden: {
          type: "BOOLEAN",
          label: "Do you have any additional information for the application?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label: "Describe here",
          pakrevd: false,
          maxLength: 2000,
        },
      },
    },
    vedleggArbeidstaker: {
      tittel: "Attachments",
      felter: {
        harAnnenDokumentasjon: {
          type: "BOOLEAN",
          label: "Do you have any other documentation you wish to attach?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
      },
    },
    arbeidsgiverensVirksomhetINorge: {
      tittel: "Employer's business in Norway",
      felter: {
        erArbeidsgiverenOffentligVirksomhet: {
          type: "BOOLEAN",
          label: "Is the employer a public sector entity?",
          pakrevd: true,
          hjelpetekst:
            "Public sector entities are state bodies and subordinate organisations, for example ministries and universities.",
          jaLabel: "Yes",
          neiLabel: "No",
        },
        erArbeidsgiverenBemanningsEllerVikarbyraa: {
          type: "BOOLEAN",
          label: "Is the employer a staffing or temporary work agency?",
          pakrevd: false,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        opprettholderArbeidsgiverenVanligDrift: {
          type: "BOOLEAN",
          label:
            "Does the employer maintain regular business operations in Norway?",
          pakrevd: false,
          hjelpetekst:
            "By this we mean that the employer still has activity and employees working in Norway during the period.",
          jaLabel: "Yes",
          neiLabel: "No",
        },
      },
    },
    utenlandsoppdragetArbeidsgiver: {
      tittel: "Posting Period and Country",
      felter: {
        utsendelseLand: {
          type: "COUNTRY_SELECT",
          label: "In which country will the work be performed?",
          pakrevd: true,
        },
        arbeidstakerUtsendelsePeriode: {
          type: "PERIOD",
          label: "Posting period",
          pakrevd: true,
          hjelpetekst:
            "Provide an approximate date if you do not know the exact date.",
          fraDatoLabel: "From date",
          tilDatoLabel: "To date",
        },
        arbeidsgiverHarOppdragILandet: {
          type: "BOOLEAN",
          label:
            "Do you as an employer have assignments in the country where the employee will be posted?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        arbeidstakerBleAnsattForUtenlandsoppdraget: {
          type: "BOOLEAN",
          label: "Was the employee hired because of this posting assignment?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        arbeidstakerForblirAnsattIHelePerioden: {
          type: "BOOLEAN",
          label:
            "Will the employee still be employed by you during the entire posting period?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        arbeidstakerErstatterAnnenPerson: {
          type: "BOOLEAN",
          label:
            "Is the employee replacing another person who was posted to do the same work?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: {
          type: "BOOLEAN",
          label:
            "Will the employee work for the company in Norway after the posting period?",
          pakrevd: false,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        utenlandsoppholdetsBegrunnelse: {
          type: "TEXTAREA",
          label: "Why will the employee work abroad?",
          pakrevd: false,
        },
        ansettelsesforholdBeskrivelse: {
          type: "TEXTAREA",
          label:
            "Describe the employee's employment relationship during the posting period",
          pakrevd: false,
        },
        forrigeArbeidstakerUtsendelsePeriode: {
          type: "PERIOD",
          label: "Previous employee's posting",
          pakrevd: false,
          hjelpetekst:
            "Provide an approximate date if you do not know the exact date.",
          fraDatoLabel: "From date",
          tilDatoLabel: "To date",
        },
      },
    },
    arbeidsstedIUtlandet: {
      tittel: "Place of work abroad",
      felter: {
        arbeidsstedType: {
          type: "SELECT",
          label: "Where will the work be performed?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "PA_LAND",
              label: "On land",
            },
            {
              verdi: "OFFSHORE",
              label: "Offshore",
            },
            {
              verdi: "PA_SKIP",
              label: "On a ship",
            },
            {
              verdi: "OM_BORD_PA_FLY",
              label: "On an aircraft",
            },
          ],
        },
      },
    },
    arbeidsstedPaLand: {
      tittel: "Place of work on land",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Name of the company",
          pakrevd: true,
        },
        fastEllerVekslendeArbeidssted: {
          type: "SELECT",
          label:
            "Does the employee have a fixed place of work in this country or does it vary frequently?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "FAST",
              label: "Fixed place of work",
            },
            {
              verdi: "VEKSLENDE",
              label: "Varies frequently",
            },
          ],
        },
        vegadresse: {
          type: "TEXT",
          label: "Street address",
          pakrevd: false,
        },
        nummer: {
          type: "TEXT",
          label: "Number",
          pakrevd: false,
        },
        postkode: {
          type: "TEXT",
          label: "Postal code",
          pakrevd: false,
        },
        bySted: {
          type: "TEXT",
          label: "City/place/region",
          pakrevd: false,
        },
        land: {
          type: "COUNTRY_SELECT",
          label: "Country",
          pakrevd: false,
        },
        erHjemmekontor: {
          type: "BOOLEAN",
          label: "Is the employee being posted to work remotely from home?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
      },
    },
    arbeidsstedOffshore: {
      tittel: "Place of work offshore",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Name of the company",
          pakrevd: true,
        },
        navnPaInnretning: {
          type: "TEXT",
          label: "Name of installation",
          pakrevd: true,
        },
        typeInnretning: {
          type: "SELECT",
          label: "What type of installation is this?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "PLATTFORM_ELLER_ANNEN_FAST_INNRETNING",
              label: "Platform or other fixed installation",
            },
            {
              verdi: "BORESKIP_ELLER_ANNEN_FLYTTBAR_INNRETNING",
              label: "Drillship or other mobile installation",
            },
          ],
        },
        sokkelLand: {
          type: "COUNTRY_SELECT",
          label: "Which country's continental shelf is this?",
          pakrevd: true,
        },
      },
    },
    arbeidsstedPaSkip: {
      tittel: "Place of work on ship",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Name of the company",
          pakrevd: true,
        },
        navnPaSkip: {
          type: "TEXT",
          label: "What is the name of the ship the employee will work on?",
          pakrevd: true,
        },
        yrketTilArbeidstaker: {
          type: "TEXT",
          label: "What is the employee's occupation?",
          pakrevd: true,
          hjelpetekst:
            "We need information about what kind of work the employee performs on board the ship",
        },
        seilerI: {
          type: "SELECT",
          label: "Where will the ship sail?",
          pakrevd: true,
          alternativer: [
            {
              verdi: "INTERNASJONALT_FARVANN",
              label: "International waters",
            },
            {
              verdi: "TERRITORIALFARVANN",
              label: "Within territorial waters",
            },
          ],
        },
        flaggland: {
          type: "COUNTRY_SELECT",
          label: "What is the flag state of the ship?",
          pakrevd: false,
        },
        territorialfarvannLand: {
          type: "COUNTRY_SELECT",
          label: "Which country's territorial waters?",
          pakrevd: false,
        },
      },
    },
    arbeidsstedOmBordPaFly: {
      tittel: "Place of work on board aircraft",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Name of the company",
          pakrevd: true,
        },
        hjemmebaseLand: {
          type: "COUNTRY_SELECT",
          label:
            "In which country does the employee have their home base during the application period?",
          pakrevd: true,
          hjelpetekst:
            "By home base we mean the airport where the employee starts and ends their flights",
        },
        hjemmebaseNavn: {
          type: "TEXT",
          label: "What is the name of the home base?",
          pakrevd: true,
        },
        erVanligHjemmebase: {
          type: "BOOLEAN",
          label: "Is this the home base the employee usually works from?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        vanligHjemmebaseLand: {
          type: "COUNTRY_SELECT",
          label:
            "In which country is the home base the employee usually works from located?",
          pakrevd: false,
        },
        vanligHjemmebaseNavn: {
          type: "TEXT",
          label:
            "What is the name of the home base the employee usually works from?",
          pakrevd: false,
        },
      },
    },
    arbeidstakerensLonn: {
      tittel: "Employee's salary",
      felter: {
        arbeidsgiverBetalerAllLonnOgNaturaytelserIUtsendingsperioden: {
          type: "BOOLEAN",
          label:
            "Do you as an employer pay all salary and any benefits in kind during the posting period?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        virksomheterSomUtbetalerLonnOgNaturalytelser: {
          type: "LIST",
          label: "Who pays the salary and any benefits in kind?",
          pakrevd: false,
          hjelpetekst:
            "Add Norwegian and/or foreign companies that pay the salary and any benefits in kind",
          leggTilLabel: "Add company",
          fjernLabel: "Remove",
          elementDefinisjon: {
            organisasjonsnummer: {
              type: "TEXT",
              label: "Organisation number",
              pakrevd: true,
            },
            navn: {
              type: "TEXT",
              label: "Company name",
              pakrevd: false,
            },
            vegnavnOgHusnummer: {
              type: "TEXT",
              label: "Street name and number",
              pakrevd: true,
            },
            bygning: {
              type: "TEXT",
              label: "Building",
              pakrevd: false,
            },
            postkode: {
              type: "TEXT",
              label: "Postal code",
              pakrevd: false,
            },
            byStedsnavn: {
              type: "TEXT",
              label: "City/place name",
              pakrevd: false,
            },
            region: {
              type: "TEXT",
              label: "Region",
              pakrevd: false,
            },
            land: {
              type: "COUNTRY_SELECT",
              label: "Country",
              pakrevd: true,
            },
            tilhorerSammeKonsern: {
              type: "BOOLEAN",
              label:
                "Is the company part of the same corporate group as the Norwegian employer?",
              pakrevd: true,
              jaLabel: "Yes",
              neiLabel: "No",
            },
          },
          itemTypeLabels: {
            norsk: "Norwegian company",
            utenlandsk: "Foreign company",
          },
        },
      },
    },
    tilleggsopplysningerArbeidsgiver: {
      tittel: "Additional information",
      felter: {
        harFlereOpplysningerTilSoknaden: {
          type: "BOOLEAN",
          label: "Do you have any additional information for the application?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label: "Describe here",
          pakrevd: false,
          maxLength: 2000,
        },
      },
    },
    vedleggArbeidsgiver: {
      tittel: "Attachments",
      felter: {
        harAnnenDokumentasjon: {
          type: "BOOLEAN",
          label: "Do you have any other documentation you wish to attach?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
      },
    },
  },
} as const;

export const SKJEMA_DEFINISJONER_A1 = {
  nb: SKJEMA_DEFINISJON_A1_NB,
  nn: SKJEMA_DEFINISJON_A1_NN,
  en: SKJEMA_DEFINISJON_A1_EN,
} as const;

export type SupportedLanguage = keyof typeof SKJEMA_DEFINISJONER_A1;

// Backward compatibility - brukes av eksisterende kode
// OBS: Denne bytter IKKE språk ved runtime. Bruk getSkjemaDefinisjon(lang) for språkstøtte.
export const SKJEMA_DEFINISJON_A1 = SKJEMA_DEFINISJON_A1_NB;

// Typer inferert fra konstanten
export type SkjemaDefinisjonA1Type = typeof SKJEMA_DEFINISJON_A1_NB;
export type SeksjonsNavn = keyof typeof SKJEMA_DEFINISJON_A1_NB.seksjoner;
export type FeltNavn<S extends SeksjonsNavn> =
  keyof (typeof SKJEMA_DEFINISJON_A1_NB.seksjoner)[S]["felter"];

interface BaseFeltType {
  label: string;
  type: string;
  pakrevd: boolean;
  hjelpetekst?: string;
  format?: string;
  jaLabel?: string;
  neiLabel?: string;
}

/**
 * Hent skjemadefinisjon for et gitt språk.
 */
export function getSkjemaDefinisjon(
  lang: SupportedLanguage,
): SkjemaDefinisjonA1Type {
  return SKJEMA_DEFINISJONER_A1[lang] as unknown as SkjemaDefinisjonA1Type;
}

/**
 * Typesikker aksess til felt for et gitt språk.
 */
export function getFeltForLang<S extends SeksjonsNavn>(
  lang: SupportedLanguage,
  seksjonNavn: S,
  feltNavn: FeltNavn<S>,
): BaseFeltType {
  const definisjon = SKJEMA_DEFINISJONER_A1[
    lang
  ] as unknown as SkjemaDefinisjonA1Type;
  const seksjon = definisjon.seksjoner[seksjonNavn];
  return (seksjon.felter as Record<string, BaseFeltType>)[feltNavn as string]!;
}

/**
 * Hent en hel seksjon for et gitt språk.
 */
export function getSeksjonForLang<S extends SeksjonsNavn>(
  lang: SupportedLanguage,
  seksjonNavn: S,
) {
  const definisjon = SKJEMA_DEFINISJONER_A1[
    lang
  ] as unknown as SkjemaDefinisjonA1Type;
  return definisjon.seksjoner[seksjonNavn];
}
