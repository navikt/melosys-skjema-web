/**
 * AUTOGENERERT - Synkronisert fra backend: melosys-skjema-api
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
          label: "Hvor mye penger mottar du brutto per måned",
          pakrevd: false,
          hjelpetekst: "Oppgi beløpet i norske kroner",
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
          pakrevd: true,
          hjelpetekst:
            "Vi spør om dette fordi vi ønsker å behandle søknader fra flere i samme familie samtidig",
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        familiemedlemmer: {
          type: "LIST",
          label: "Familiemedlemmer",
          pakrevd: false,
          leggTilLabel: "Legg til familiemedlem",
          fjernLabel: "Fjern",
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
              pakrevd: true,
              jaLabel: "Ja",
              neiLabel: "Nei",
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
          pakrevd: true,
          jaLabel: "Ja",
          neiLabel: "Nei",
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label: "Beskriv de flere opplysningene du har til søknaden",
          pakrevd: false,
          maxLength: 2000,
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
          label: "Beskriv de flere opplysningene du har til søknaden",
          pakrevd: false,
          maxLength: 2000,
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
      tittel: "Foreign assignment",
      felter: {
        utsendelsesLand: {
          type: "COUNTRY_SELECT",
          label: "In which country will you be working?",
          pakrevd: true,
        },
        utsendelsePeriode: {
          type: "PERIOD",
          label: "Posting period",
          pakrevd: true,
          hjelpetekst:
            "Provide an approximate date if you don't know the exact date.",
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
            "Have you been or will you be in paid employment in Norway for at least one month right before the posting?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        aktivitetIMaanedenFoerUtsendingen: {
          type: "TEXTAREA",
          label: "Describe your activity in the month before the posting",
          pakrevd: false,
          hjelpetekst: "For example studies, vacation or self-employment",
        },
        skalJobbeForFlereVirksomheter: {
          type: "BOOLEAN",
          label:
            "Will you also work for another employer or run a self-employed business during the posting period?",
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
              label: "Organization number",
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
                  label: "Government employee",
                },
              ],
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
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        mottarPengestotteFraAnnetEosLandEllerSveits: {
          type: "BOOLEAN",
          label:
            "Do you receive financial support from another EEA country or Switzerland?",
          pakrevd: true,
          hjelpetekst:
            "By «financial support» we mean money you receive as compensation for lost income from work. Sickness benefits, parental benefits, unemployment benefits and work assessment allowance are examples of such financial support in Norway.",
          jaLabel: "Yes",
          neiLabel: "No",
        },
        landSomUtbetalerPengestotte: {
          type: "COUNTRY_SELECT",
          label: "From which country do you receive financial support?",
          pakrevd: false,
        },
        pengestotteSomMottasFraAndreLandBelop: {
          type: "TEXT",
          label: "How much money do you receive gross per month",
          pakrevd: false,
          hjelpetekst: "Enter the amount in Norwegian kroner",
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
          pakrevd: true,
          hjelpetekst:
            "We ask this because we want to process applications from multiple family members simultaneously",
          jaLabel: "Yes",
          neiLabel: "No",
        },
        familiemedlemmer: {
          type: "LIST",
          label: "Family members",
          pakrevd: false,
          leggTilLabel: "Add family member",
          fjernLabel: "Remove",
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
              pakrevd: true,
              jaLabel: "Yes",
              neiLabel: "No",
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
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label:
            "Describe the additional information you have for the application",
          pakrevd: false,
          maxLength: 2000,
        },
      },
    },
    arbeidsgiverensVirksomhetINorge: {
      tittel: "Employer's business in Norway",
      felter: {
        erArbeidsgiverenOffentligVirksomhet: {
          type: "BOOLEAN",
          label: "Is the employer a public enterprise?",
          pakrevd: true,
          hjelpetekst:
            "Public enterprises are state bodies and subordinate enterprises, for example ministries and universities.",
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
          label: "Does the employer maintain normal operations in Norway?",
          pakrevd: false,
          hjelpetekst:
            "By this we mean that the employer still has activity and employees working in Norway during the period.",
          jaLabel: "Yes",
          neiLabel: "No",
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
          pakrevd: true,
          hjelpetekst:
            "Enter approximate date if you don't know the exact date.",
          fraDatoLabel: "From date",
          tilDatoLabel: "To date",
        },
        arbeidsgiverHarOppdragILandet: {
          type: "BOOLEAN",
          label:
            "Do you as an employer have assignments in the country where the employee will be sent?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        arbeidstakerBleAnsattForUtenlandsoppdraget: {
          type: "BOOLEAN",
          label: "Was the employee hired because of this foreign assignment?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        arbeidstakerForblirAnsattIHelePerioden: {
          type: "BOOLEAN",
          label:
            "Will the employee still be employed by you during the entire assignment period?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        arbeidstakerErstatterAnnenPerson: {
          type: "BOOLEAN",
          label:
            "Is the employee replacing another person who was sent out to do the same work?",
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        arbeidstakerVilJobbeForVirksomhetINorgeEtterOppdraget: {
          type: "BOOLEAN",
          label:
            "Will the employee work for the company in Norway after the foreign assignment?",
          pakrevd: false,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        utenlandsoppholdetsBegrunnelse: {
          type: "TEXTAREA",
          label: "Why should the employee work abroad?",
          pakrevd: false,
        },
        ansettelsesforholdBeskrivelse: {
          type: "TEXTAREA",
          label:
            "Describe the employee's employment relationship during the assignment period",
          pakrevd: false,
        },
        forrigeArbeidstakerUtsendelsePeriode: {
          type: "PERIOD",
          label: "Previous employee's assignment",
          pakrevd: false,
          hjelpetekst:
            "Enter approximate date if you don't know the exact date.",
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
      tittel: "Workplace on land",
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
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
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
      tittel: "Workplace on board aircraft",
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
          pakrevd: true,
          jaLabel: "Yes",
          neiLabel: "No",
        },
        tilleggsopplysningerTilSoknad: {
          type: "TEXTAREA",
          label:
            "Describe the additional information you have for the application",
          pakrevd: false,
          maxLength: 2000,
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

interface BaseFeltType {
  label: string;
  type: string;
  pakrevd: boolean;
  hjelpetekst?: string;
}

/**
 * Hent skjemadefinisjon for et gitt språk.
 */
export function getSkjemaDefinisjon(
  lang: SupportedLanguage,
): SkjemaDefinisjonA1Type {
  return SKJEMA_DEFINISJONER_A1[lang] as SkjemaDefinisjonA1Type;
}

/**
 * Typesikker aksess til felt for et gitt språk.
 */
export function getFeltForLang<S extends SeksjonsNavn>(
  lang: SupportedLanguage,
  seksjonNavn: S,
  feltNavn: FeltNavn<S>,
): BaseFeltType {
  const definisjon = SKJEMA_DEFINISJONER_A1[lang] as SkjemaDefinisjonA1Type;
  const seksjon = definisjon.seksjoner[seksjonNavn];
  return (seksjon.felter as Record<string, BaseFeltType>)[feltNavn as string]!;
}

/**
 * Typesikker aksess til felt (norsk bokmål).
 */
export function getFelt<S extends SeksjonsNavn>(
  seksjonNavn: S,
  feltNavn: FeltNavn<S>,
): BaseFeltType {
  const seksjon = SKJEMA_DEFINISJON_A1.seksjoner[seksjonNavn];
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
 */
export function getSeksjonForLang<S extends SeksjonsNavn>(
  lang: SupportedLanguage,
  seksjonNavn: S,
) {
  const definisjon = SKJEMA_DEFINISJONER_A1[lang] as SkjemaDefinisjonA1Type;
  return definisjon.seksjoner[seksjonNavn];
}
