/**
 * AUTOGENERERT - Kopiert fra backend: melosys-skjema-api/src/main/resources/skjema-definisjoner/A1/v1/
 *
 * Ved endringer i backend, kjør: npm run sync-skjema-definisjon
 *
 * Inneholder definisjoner for språk: nb, en
 */

const SKJEMA_DEFINISJON_A1_NB = {
  type: "A1",
  versjon: "1",
  seksjoner: {
    utenlandsoppdragetArbeidstaker: {
      tittel: "Utenlandsoppdraget",
      felter: {
        utsendelsesLand: {
          type: "COUNTRY_SELECT",
          label: "I hvilket land skal du utføre arbeid?",
          pakrevd: true,
        },
        utsendelsePeriode: {
          type: "PERIOD",
          label: "Utsendingsperiode",
          hjelpetekst: "Oppgi omtrentlig dato hvis du ikke vet nøyaktig dato.",
          fraDatoLabel: "Fra dato",
          tilDatoLabel: "Til dato",
          pakrevd: true,
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
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        aktivitetIMaanedenFoerUtsendingen: {
          type: "TEXTAREA",
          label: "Beskriv aktiviteten din måneden før utsendingen",
          hjelpetekst:
            "For eksempel studier, ferie eller selvstendig virksomhet",
          pakrevd: false,
        },
        skalJobbeForFlereVirksomheter: {
          type: "BOOLEAN",
          label:
            "Skal du også drive selvstendig virksomhet eller arbeide for en annen arbeidsgiver i utsendingsperioden?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        virksomheterArbeidstakerJobberForIutsendelsesPeriode: {
          type: "LIST",
          label: "Hvem skal du jobbe for i utsendelsesperioden?",
          hjelpetekst:
            "Legg til norske og/eller utenlandske virksomheter du skal jobbe for i utsendingsperioden.",
          leggTilLabel: "Legg til virksomhet",
          fjernLabel: "Fjern",
          pakrevd: false,
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
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        mottarPengestotteFraAnnetEosLandEllerSveits: {
          type: "BOOLEAN",
          label: "Mottar du pengestøtte fra et annet EØS-land eller Sveits?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        landSomUtbetalerPengestotte: {
          type: "COUNTRY_SELECT",
          label: "Fra hvilket land mottar du pengestøtte?",
          pakrevd: false,
        },
        pengestotteSomMottasFraAndreLandBelop: {
          type: "TEXT",
          label: "Hvor mye penger mottar du brutto per måned",
          hjelpetekst: "Oppgi beløpet i norske kroner",
          pakrevd: false,
        },
        pengestotteSomMottasFraAndreLandBeskrivelse: {
          type: "TEXTAREA",
          label: "Hva slags pengestøtte mottar du",
          pakrevd: false,
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
          hjelpetekst:
            "Vi spør om dette fordi vi ønsker å behandle søknader fra flere i samme familie samtidig",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        familiemedlemmer: {
          type: "LIST",
          label: "Familiemedlemmer",
          leggTilLabel: "Legg til familiemedlem",
          fjernLabel: "Fjern",
          pakrevd: false,
          elementDefinisjon: {
            fornavn: {
              type: "TEXT",
              label: "Fornavn",
              pakrevd: true,
            },
            etternavn: {
              type: "TEXT",
              label: "Etternavn",
              pakrevd: true,
            },
            harNorskFodselsnummerEllerDnummer: {
              type: "BOOLEAN",
              label: "Har personen norsk fødselsnummer eller D-nummer?",
              jaLabel: "Ja",
              neiLabel: "Nei",
              pakrevd: true,
            },
            fodselsnummer: {
              type: "TEXT",
              label: "Fødselsnummer / D-nummer",
              pakrevd: false,
            },
            fodselsdato: {
              type: "DATE",
              label: "Fødselsdato",
              pakrevd: false,
            },
          },
        },
      },
    },
    tilleggsopplysningerArbeidstaker: {
      tittel: "Tilleggsopplysninger",
      felter: {
        harFlereOpplysningerTilSoknaden: {
          type: "BOOLEAN",
          label: "Har du noen flere opplysninger til søknaden?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label: "Beskriv de flere opplysningene du har til søknaden",
          maxLength: 2000,
          pakrevd: false,
        },
      },
    },
    arbeidsgiverensVirksomhetINorge: {
      tittel: "Arbeidsgiverens virksomhet i Norge",
      felter: {
        erArbeidsgiverenOffentligVirksomhet: {
          type: "BOOLEAN",
          label: "Er arbeidsgiveren en offentlig virksomhet?",
          hjelpetekst:
            "Offentlige virksomheter er statsorganer og underliggende virksomheter, for eksempel departementer og universiteter.",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        erArbeidsgiverenBemanningsEllerVikarbyraa: {
          type: "BOOLEAN",
          label: "Er arbeidsgiveren et bemannings- eller vikarbyrå?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: false,
        },
        opprettholderArbeidsgiverenVanligDrift: {
          type: "BOOLEAN",
          label: "Opprettholder arbeidsgiveren vanlig drift i Norge?",
          hjelpetekst:
            "Med dette mener vi at arbeidsgiveren fortsatt har aktivitet og ansatte som jobber i Norge i perioden.",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: false,
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
          hjelpetekst: "Oppgi omtrentlig dato hvis du ikke vet nøyaktig dato.",
          fraDatoLabel: "Fra dato",
          tilDatoLabel: "Til dato",
          pakrevd: true,
        },
        arbeidsgiverHarOppdragILandet: {
          type: "BOOLEAN",
          label:
            "Har du som arbeidsgiver oppdrag i landet arbeidstaker skal sendes ut til?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        arbeidstakerBleAnsattForUtenlandsoppdraget: {
          type: "BOOLEAN",
          label:
            "Ble arbeidstaker ansatt på grunn av dette utenlandsoppdraget?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        arbeidstakerForblirAnsattIHelePerioden: {
          type: "BOOLEAN",
          label:
            "Vil arbeidstaker fortsatt være ansatt hos dere i hele utsendingsperioden?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        arbeidstakerErstatterAnnenPerson: {
          type: "BOOLEAN",
          label:
            "Erstatter arbeidstaker en annen person som var sendt ut for å gjøre det samme arbeidet?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: {
          type: "BOOLEAN",
          label:
            "Vil arbeidstakeren arbeide for virksomheten i Norge etter utenlandsoppdraget?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: false,
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
          hjelpetekst: "Oppgi omtrentlig dato hvis du ikke vet nøyaktig dato.",
          fraDatoLabel: "Fra dato",
          tilDatoLabel: "Til dato",
          pakrevd: false,
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
          label: "Vegadresse",
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
        beskrivelseVekslende: {
          type: "TEXTAREA",
          label: "Beskriv hvor arbeidstakeren skal jobbe",
          pakrevd: false,
        },
        erHjemmekontor: {
          type: "BOOLEAN",
          label: "Er arbeidstakeren utsendt for å jobbe på hjemmekontor?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
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
          hjelpetekst:
            "Vi trenger informasjon om hva slags arbeid arbeidstakeren utfører om bord på skipet",
          pakrevd: true,
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
          hjelpetekst:
            "Med hjemmebase mener vi flyplassen der arbeidstakeren starter og avslutter flyvningene sine",
          pakrevd: true,
        },
        hjemmebaseNavn: {
          type: "TEXT",
          label: "Hva er navnet på hjemmebasen?",
          pakrevd: true,
        },
        erVanligHjemmebase: {
          type: "BOOLEAN",
          label: "Er dette hjemmebasen arbeidstakeren jobber fra til vanlig?",
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
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
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        virksomheterSomUtbetalerLonnOgNaturalytelser: {
          type: "LIST",
          label: "Hvem utbetaler lønnen og eventuelle naturalytelser?",
          hjelpetekst:
            "Legg til norske og/eller utenlandske virksomheter som utbetaler lønnen og eventuelle naturalytelser",
          leggTilLabel: "Legg til virksomhet",
          fjernLabel: "Fjern",
          pakrevd: false,
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
          jaLabel: "Ja",
          neiLabel: "Nei",
          pakrevd: true,
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label: "Beskriv de flere opplysningene du har til søknaden",
          maxLength: 2000,
          pakrevd: false,
        },
      },
    },
  },
} as const;

const SKJEMA_DEFINISJON_A1_EN = {
  type: "A1",
  versjon: "1",
  seksjoner: {
    utenlandsoppdragetArbeidstaker: {
      tittel: "The Foreign Assignment",
      felter: {
        utsendelsesLand: {
          type: "COUNTRY_SELECT",
          label: "In which country will you perform work?",
          pakrevd: true,
        },
        utsendelsePeriode: {
          type: "PERIOD",
          label: "Assignment period",
          hjelpetekst:
            "Enter approximate date if you don't know the exact date.",
          fraDatoLabel: "From date",
          tilDatoLabel: "To date",
          pakrevd: true,
        },
      },
    },
    arbeidssituasjon: {
      tittel: "Employment situation",
      felter: {
        harVaertEllerSkalVaereILonnetArbeidFoerUtsending: {
          type: "BOOLEAN",
          label:
            "Have you been or will you be in paid employment in Norway for at least one month immediately before the posting?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        aktivitetIMaanedenFoerUtsendingen: {
          type: "TEXTAREA",
          label: "Describe your activity in the month before the posting",
          hjelpetekst: "For example studies, vacation or self-employment",
          pakrevd: false,
        },
        skalJobbeForFlereVirksomheter: {
          type: "BOOLEAN",
          label:
            "Will you also be self-employed or work for another employer during the posting period?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        virksomheterArbeidstakerJobberForIutsendelsesPeriode: {
          type: "LIST",
          label: "Who will you work for during the posting period?",
          hjelpetekst:
            "Add Norwegian and/or foreign companies you will work for during the posting period.",
          leggTilLabel: "Add company",
          fjernLabel: "Remove",
          pakrevd: false,
          elementDefinisjon: {
            organisasjonsnummer: {
              type: "TEXT",
              label: "Organization number",
              pakrevd: true,
            },
            navn: {
              type: "TEXT",
              label: "Company name",
              pakrevd: false,
            },
          },
        },
      },
    },
    skatteforholdOgInntekt: {
      tittel: "Tax conditions and income",
      felter: {
        erSkattepliktigTilNorgeIHeleutsendingsperioden: {
          type: "BOOLEAN",
          label:
            "Are you liable to pay tax to Norway for the entire posting period?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        mottarPengestotteFraAnnetEosLandEllerSveits: {
          type: "BOOLEAN",
          label:
            "Do you receive financial support from another EEA country or Switzerland?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        landSomUtbetalerPengestotte: {
          type: "COUNTRY_SELECT",
          label: "From which country do you receive financial support?",
          pakrevd: false,
        },
        pengestotteSomMottasFraAndreLandBelop: {
          type: "TEXT",
          label: "How much money do you receive gross per month",
          hjelpetekst: "Enter the amount in Norwegian kroner",
          pakrevd: false,
        },
        pengestotteSomMottasFraAndreLandBeskrivelse: {
          type: "TEXTAREA",
          label: "What kind of financial support do you receive",
          pakrevd: false,
        },
      },
    },
    familiemedlemmer: {
      tittel: "Family Members",
      felter: {
        skalHaMedFamiliemedlemmer: {
          type: "BOOLEAN",
          label:
            "Do you have a spouse, partner, cohabitant or children who will accompany you?",
          hjelpetekst:
            "We ask this because we want to process applications from multiple family members simultaneously",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        familiemedlemmer: {
          type: "LIST",
          label: "Family members",
          leggTilLabel: "Add family member",
          fjernLabel: "Remove",
          pakrevd: false,
          elementDefinisjon: {
            fornavn: {
              type: "TEXT",
              label: "First name",
              pakrevd: true,
            },
            etternavn: {
              type: "TEXT",
              label: "Last name",
              pakrevd: true,
            },
            harNorskFodselsnummerEllerDnummer: {
              type: "BOOLEAN",
              label:
                "Does the person have a Norwegian national identity number or D-number?",
              jaLabel: "Yes",
              neiLabel: "No",
              pakrevd: true,
            },
            fodselsnummer: {
              type: "TEXT",
              label: "National identity number / D-number",
              pakrevd: false,
            },
            fodselsdato: {
              type: "DATE",
              label: "Date of birth",
              pakrevd: false,
            },
          },
        },
      },
    },
    tilleggsopplysningerArbeidstaker: {
      tittel: "Additional Information",
      felter: {
        harFlereOpplysningerTilSoknaden: {
          type: "BOOLEAN",
          label: "Do you have any additional information for the application?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label:
            "Describe the additional information you have for the application",
          maxLength: 2000,
          pakrevd: false,
        },
      },
    },
    arbeidsgiverensVirksomhetINorge: {
      tittel: "Employer's business in Norway",
      felter: {
        erArbeidsgiverenOffentligVirksomhet: {
          type: "BOOLEAN",
          label: "Is the employer a public enterprise?",
          hjelpetekst:
            "Public enterprises are state bodies and subordinate enterprises, for example ministries and universities.",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        erArbeidsgiverenBemanningsEllerVikarbyraa: {
          type: "BOOLEAN",
          label: "Is the employer a staffing or temporary work agency?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: false,
        },
        opprettholderArbeidsgiverenVanligDrift: {
          type: "BOOLEAN",
          label: "Does the employer maintain normal operations in Norway?",
          hjelpetekst:
            "By this we mean that the employer still has activity and employees working in Norway during the period.",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: false,
        },
      },
    },
    utenlandsoppdragetArbeidsgiver: {
      tittel: "The Foreign Assignment",
      felter: {
        utsendelseLand: {
          type: "COUNTRY_SELECT",
          label: "To which country is the employee being sent?",
          pakrevd: true,
        },
        arbeidstakerUtsendelsePeriode: {
          type: "PERIOD",
          label: "Assignment period",
          hjelpetekst:
            "Enter approximate date if you don't know the exact date.",
          fraDatoLabel: "From date",
          tilDatoLabel: "To date",
          pakrevd: true,
        },
        arbeidsgiverHarOppdragILandet: {
          type: "BOOLEAN",
          label:
            "Do you as an employer have assignments in the country where the employee will be sent?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        arbeidstakerBleAnsattForUtenlandsoppdraget: {
          type: "BOOLEAN",
          label: "Was the employee hired because of this foreign assignment?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        arbeidstakerForblirAnsattIHelePerioden: {
          type: "BOOLEAN",
          label:
            "Will the employee still be employed by you during the entire posting period?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        arbeidstakerErstatterAnnenPerson: {
          type: "BOOLEAN",
          label:
            "Is the employee replacing another person who was sent out to do the same work?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: {
          type: "BOOLEAN",
          label:
            "Will the employee work for the company in Norway after the foreign assignment?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: false,
        },
        utenlandsoppholdetsBegrunnelse: {
          type: "TEXTAREA",
          label: "Why should the employee work abroad?",
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
          label: "Previous employee's assignment",
          hjelpetekst:
            "Enter approximate date if you don't know the exact date.",
          fraDatoLabel: "From date",
          tilDatoLabel: "To date",
          pakrevd: false,
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
              label: "On ship",
            },
            {
              verdi: "OM_BORD_PA_FLY",
              label: "On board an aircraft",
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
          label: "Name of the business",
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
        beskrivelseVekslende: {
          type: "TEXTAREA",
          label: "Describe where the employee will work",
          pakrevd: false,
        },
        erHjemmekontor: {
          type: "BOOLEAN",
          label: "Is the employee posted to work from home office?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
      },
    },
    arbeidsstedOffshore: {
      tittel: "Offshore workplace",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Name of the business",
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
              label: "Drilling ship or other mobile installation",
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
      tittel: "Workplace on ship",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Name of the business",
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
          hjelpetekst:
            "We need information about what kind of work the employee performs on board the ship",
          pakrevd: true,
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
          label: "What is the flag country of the ship?",
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
      tittel: "Workplace on board an aircraft",
      felter: {
        navnPaVirksomhet: {
          type: "TEXT",
          label: "Name of the business",
          pakrevd: true,
        },
        hjemmebaseLand: {
          type: "COUNTRY_SELECT",
          label:
            "In which country does the employee have their home base during the application period?",
          hjelpetekst:
            "By home base we mean the airport where the employee starts and ends their flights",
          pakrevd: true,
        },
        hjemmebaseNavn: {
          type: "TEXT",
          label: "What is the name of the home base?",
          pakrevd: true,
        },
        erVanligHjemmebase: {
          type: "BOOLEAN",
          label: "Is this the home base the employee usually works from?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
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
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        virksomheterSomUtbetalerLonnOgNaturalytelser: {
          type: "LIST",
          label: "Who pays the salary and any benefits in kind?",
          hjelpetekst:
            "Add Norwegian and/or foreign companies that pay the salary and any benefits in kind",
          leggTilLabel: "Add company",
          fjernLabel: "Remove",
          pakrevd: false,
          elementDefinisjon: {
            organisasjonsnummer: {
              type: "TEXT",
              label: "Organization number",
              pakrevd: true,
            },
            navn: {
              type: "TEXT",
              label: "Company name",
              pakrevd: false,
            },
          },
        },
      },
    },
    tilleggsopplysningerArbeidsgiver: {
      tittel: "Additional Information",
      felter: {
        harFlereOpplysningerTilSoknaden: {
          type: "BOOLEAN",
          label: "Do you have any additional information for the application?",
          jaLabel: "Yes",
          neiLabel: "No",
          pakrevd: true,
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label:
            "Describe the additional information you have for the application",
          maxLength: 2000,
          pakrevd: false,
        },
      },
    },
  },
} as const;

export const SKJEMA_DEFINISJONER_A1 = {
  nb: SKJEMA_DEFINISJON_A1_NB,
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

// Base field type for all field kinds
interface BaseFeltType {
  label: string;
  type: string;
  pakrevd: boolean;
  hjelpetekst?: string;
}

/**
 * Hent skjemadefinisjon for et gitt språk.
 * Brukes for runtime språkbytte.
 * Note: Type assertion needed because NB and EN have same structure but different literal string values.
 */
export function getSkjemaDefinisjon(
  lang: SupportedLanguage,
): SkjemaDefinisjonA1Type {
  return SKJEMA_DEFINISJONER_A1[lang] as unknown as SkjemaDefinisjonA1Type;
}

/**
 * Typesikker aksess til felt for et gitt språk.
 * Note: Type assertion needed because NB and EN have same structure but different literal string values.
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
 * Typesikker aksess til felt (norsk bokmål).
 * TypeScript varsler hvis seksjon eller feltnavn er feil.
 * The field is guaranteed to exist if the correct section/field names are used.
 */
export function getFelt<S extends SeksjonsNavn>(
  seksjonNavn: S,
  feltNavn: FeltNavn<S>,
): BaseFeltType {
  const seksjon = SKJEMA_DEFINISJON_A1.seksjoner[seksjonNavn];
  // Non-null assertion is safe because FeltNavn<S> guarantees the field exists
  return (seksjon.felter as Record<string, BaseFeltType>)[feltNavn as string]!;
}

/**
 * Hent en hel seksjon (norsk bokmål).
 */
export function getSeksjon<S extends SeksjonsNavn>(seksjonNavn: S) {
  return SKJEMA_DEFINISJON_A1.seksjoner[seksjonNavn];
}

/**
 * Hent en hel seksjon for et gitt språk.
 * Note: Type assertion needed because NB and EN have same structure but different literal string values.
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
