export const en = {
  translation: {
    felles: {
      laster: "Loading...",
      feil: "An error occurred",
      feilVedLastingAvSkjema: "Error loading form",
      skjemaOppdateres:
        "We are updating the form right now. Please try again in a few minutes.",
      utkastReinitialisert:
        "The form has been updated since you started. Your previous answers and attachments have therefore been removed, and you must complete the form again.",
      fantIkkeSkjema: "Form not found",
      stegIkkeTilgjengelig: "This step is not available for this form part",
      brukerinfoMangler: "User information missing",
      kunneIkkeOppretteSkjema: "Could not create form. Please try again.",
      manglerOrganisasjonsnummer: "Organization number missing",
      lagre: "Save",
      lagreOgFortsett: "Save and continue",
      sendSoknad: "Submit application",
      skjemaSendtInn: "Form submitted",
      avbryt: "Cancel",
      ja: "Yes",
      nei: "No",
      tilbake: "Back",
      neste: "Next",
      fjern: "Remove",
      endre: "Edit",
      leggTil: "Add",
      endreSvar: "Edit answers",
      pakrevd: "required",
      forrigeSteg: "Previous step",
      nesteSteg: "Next step",
      sistOppdatert: "Last updated: {{tidspunkt}}",
      lagreUtkastOgFortsettSenere: "Save draft and continue later",
      avbrytOgSlett: "Cancel and delete",
      avbrytOgSlettUtkast: "Cancel and delete draft?",
      alleOpplysningerVilBliSlettet:
        "All information you have filled in will be deleted",
      neiFortsettUtfylling: "No, continue filling out",
      jaAvbrytOgSlettUtkast: "Yes, cancel and delete draft",
      lagreUtkastBeskrivelse:
        "The form will be saved as a draft on My Page so you can complete it later.",
      jaLagreOgFortsettSenere: "Yes, save and continue later",
      valgtVirksomhet: "Selected company",
      valgtOrganisasjon: "Selected organization",
      navn: "Name",
      ugyldigFodselsnummerEllerDnummer:
        "Invalid national identity number or D-number",
      stegGjelderArbeidsgiver: "This step applies to the employer",
      stegGjelderArbeidstaker: "This step applies to the employee",
      virksomhetsnavn: "Company name",
      organisasjonsnummer: "Organization number",
      stegManglerUtfylling:
        "You must complete the following steps before submitting the application",
      feilVedInnsending:
        "An error occurred while submitting the application. Please try again later.",
      organisasjonMedOrgnummerAriaLabel:
        "{{navn}} with organization number {{orgnummer}}",
    },
    periode: {
      fraDato: "From date",
      tilDato: "To date",
      datoErPakrevd: "You must enter a valid date",
      tilDatoMaVareEtterFraDato: "To date cannot be before from date",
    },
    soknadHeader: {
      soknadForUtsendtArbeidstakerInnenEuEosOgSveits:
        "Application for an A1 Certificate for Posted Workers in the EEA or Switzerland",
      bekreftelseFraArbeidsgiver:
        "Employer's confirmation of posting to another EEA country or Switzerland",
    },
    landVelgerFormPart: {
      velgLand: "Select country",
    },
    norskeVirksomheterFormPart: {
      norskVirksomhet: "Norwegian company",
      norskeVirksomheter: "Norwegian companies",
      organisasjonsnummer: "Organization number",
      leggTilNorskVirksomhet: "Add Norwegian company",
      endreNorskVirksomhet: "Edit Norwegian company",
      kunneIkkeFInneOrganisasjon:
        "Could not find organization with organization number",
    },
    utenlandskeVirksomheterFormPart: {
      utenlandskVirksomhet: "Foreign company",
      utenlandskeVirksomheter: "Foreign companies",
      navnPaVirksomhet: "Company name",
      organisasjonsnummerEllerRegistreringsnummerValgfritt:
        "Organization number or registration number (optional)",
      vegnavnOgHusnummerEvtPostboks:
        "Street address and house number, or P.O. box",
      bygningValgfritt: "Building (optional)",
      postkodeValgfritt: "Postal code (optional)",
      byStednavnValgfritt: "City/place name (optional)",
      regionValgfritt: "Region (optional)",
      land: "Country",
      tilhorerVirksomhetenSammeKonsernSomDenNorskeArbeidsgiveren:
        "Does the company belong to the same corporate group as the Norwegian employer?",
      leggTilUtenlandskVirksomhet: "Add foreign company",
      endreUtenlandskVirksomhet: "Edit foreign company",
      ansettelsesform: "What is your current position in this company?",
      arbeidstakerEllerFrilanser: "Employee or freelancer",
      selvstendigNaeringsdrivende: "Self-employed",
      statsansatt: "Civil servant",
    },
    familiemedlemmerSteg: {
      tittel: "Family members",
      duMaSvarePaOmDuHarFamiliemedlemmerSomSkalVaereMed:
        "You must answer whether you have a spouse, partner, cohabitant or children who will accompany you",
      infokortTittel: "Accompanying family members",
      informasjonOmEgenSoknad:
        "If family members need clarification of their social security affiliation, they must submit their own application. Accompanying family members can apply using the form:",
      soknadsskjemaLenke: "https://www.nav.no/fyllut/nav020807?lang=en",
      soknadsskjemaNavn:
        "Application for clarification of national insurance affiliation during stay in the EEA or Switzerland",
    },
    tilleggsopplysningerSteg: {
      tittel: "Additional information",
      duMaSvarePaOmDuHarFlereOpplysningerTilSoknaden:
        "You must answer whether you have additional information for the application",
      tilleggsopplysningerErPakrevdNarDuHarFlereOpplysninger:
        "Additional information is required when you have additional information",
    },
    vedleggSteg: {
      tittel: "Attachments",
      ingenVedleggLastetOpp: "No attachments uploaded",
      lastOppVedlegg: "Upload attachments",
      lastOppVedleggBeskrivelse:
        "You can upload PDF or images (JPG, PNG). Maximum file size 10 MB per file.",
      feilForStor: "The file is too large. Maximum file size is 10 MB.",
      feilUgyldigFormat:
        "Invalid file format. Only PDF, JPG and PNG are allowed.",
      feilVirusFunnet:
        "The file was rejected because it may contain harmful content.",
      feilUkjent: "Could not upload the file. Please try again later.",
      duMaSvarePaOmDuHarAnnenDokumentasjon:
        "You must answer whether you have other documentation you wish to attach",
      duMaLasteOppMinstEttVedlegg: "You must upload at least one attachment",
      feilVedHentingAvVedlegg:
        "Could not retrieve attachments. Please try again later.",
      feilVedSlettingAvVedlegg:
        "Could not delete the attachment. Please try again.",
      feilTomFil: "The file is empty.",
      feilMaksAntallVedlegg: "Maximum number of attachments (10) reached.",
    },
    arbeidssituasjonSteg: {
      tittel: "Work situation",
      fullmaktFraArbeidstakerTittel:
        "You have a power of attorney from the employee",
      fullmaktFraArbeidstakerBeskrivelse:
        "The following questions are answered on behalf of the employee.",
      duMaSvarePaOmDuHarVertEllerSkalVareILonnetArbeidINorgeForUtsending:
        "You must answer whether you have been or will be in paid employment in Norway before posting",
      duMaBeskriveAktivitetenNarDuIkkeHarVertILonnetArbeid:
        "You must describe your activity when you were not in paid employment",
      duMaSvarePaOmDuSkalJobbeForFlereVirksomheterIPerioden:
        "You must answer whether you will work for multiple companies during the period",
      duMaLeggeTilMinstEnVirksomhetNarDuSkalJobbeForFlereVirksomheter:
        "You must add at least one company when you will work for multiple companies",
    },
    skatteforholdOgInntektSteg: {
      tittel: "Tax and Income Information",
      inntektHeading: "Income",
      duMaSvarePaOmDuErSkattepliktigTilNorgeIHeleUtsendingsperioden:
        "You must answer whether you are liable to pay tax to Norway for the entire posting period",
      duMaSvarePaOmDuMottarPengestotteFraEtAnnetEosLandEllerSveits:
        "You must answer whether you receive cash benefits from another EEA country or Switzerland",
      duMaBeskriveHvaSlagsPengestotteDuMottar:
        "You must describe what type of cash benefits you receive",
      duMaVelgeHvilketLandSomUtbetalerPengestotten:
        "You must select which country pays the cash benefits",
      duMaOppgiEtGyldigBelopSomErStorreEnn0:
        "You must enter a valid amount greater than 0",
      duMaVelgeMinstEnInntektKilde:
        "You must select at least one work income source",
      duMaVelgeMinstEnInntektType: "You must select at least one income type",
      duMaOppgiLonnsinntekt: "You must specify salary income",
      duMaOppgiInntektFraEgenVirksomhet:
        "You must specify income from own business",
    },
    arbeidsstedIUtlandetSteg: {
      tittel: "Place of work abroad",
      velgArbeidssted: "Select workplace",
      duMaVelgeArbeidsstedType:
        "You must select where the work will be performed",
      duMaVelgeFastEllerVekslende:
        "You must select whether the employee has a fixed place of work or if it varies frequently",
      duMaSvarePaOmDetErHjemmekontor:
        "You must answer whether the employee is posted to work  remotely from home",
      vegadresseErPakrevd: "Street address is required",
      nummerErPakrevd: "Number is required",
      postkodeErPakrevd: "Postal code is required",
      byStedErPakrevd: "City/place/region is required",
      navnPaInnretningErPakrevd: "Name of installation is required",
      duMaVelgeTypeInnretning:
        "You must select what type of installation this is",
      sokkelLandErPakrevd:
        "You must select which country's continental shelf this is",
      navnPaSkipErPakrevd: "Name of the ship is required",
      yrketTilArbeidstakerErPakrevd: "Employee's occupation is required",
      duMaVelgeHvorSkipetSeiler: "You must select where the ship will sail",
      flagglandErPakrevd: "Flag state is required",
      territorialfarvannLandErPakrevd:
        "You must select which country's territorial waters the ship sails in",
      hjemmebaseLandErPakrevd:
        "You must select which country the employee has their home base in",
      hjemmebaseNavnErPakrevd: "The name of the home base is required",
      duMaSvarePaOmDetErVanligHjemmebase:
        "You must answer whether this is the home base the employee usually works from",
      vanligHjemmebaseLandErPakrevd:
        "You must select which country the usual home base is located in",
      vanligHjemmebaseNavnErPakrevd:
        "The name of the usual home base is required",
      navnPaVirksomhetErPakrevd: "Name of the company is required",
    },
    arbeidsgiverensVirksomhetINorgeSteg: {
      tittel: "Employer's business in Norway",
      duMaSvarePaOmArbeidsgiverenErEtBemanningsEllerVikarbyra:
        "You must answer whether the employer is a staffing or temporary work agency",
      duMaSvarePaOmArbeidsgiverenOpprettholderVanligDriftINorge:
        "You must answer whether the employer maintains regular business operations in Norway",
      opplysningerOmForetaketsSamledeVirksomhet:
        "Information about the company's overall business",
      registrertMedFaerreEnnAnsatte:
        "Information has been retrieved from the Brønnøysund Register Centre. {{virksomhetsnavn}} is registered with fewer than {{ansattgrense}} employees. If this is incorrect, please contact the Brønnøysund Register Centre.",
      registrertMedAnsatteEllerFlere:
        "Information has been retrieved from the Brønnøysund Register Centre. {{virksomhetsnavn}} is registered with {{ansattgrense}} or more employees. If this is incorrect, please contact the Brønnøysund Register Centre.",
      duMaOppgiAntallAdministrativtAnsatte:
        "You must state the number of administrative employees",
      duMaOppgiAntallUtsendteArbeidstakere:
        "You must state the number of posted workers",
      duMaOppgiAndelAnsatteRekruttertINorge:
        "You must state the share of employees recruited in Norway",
      duMaOppgiAndelOmsetningINorge:
        "You must state the share of turnover earned in Norway",
      duMaOppgiAndelOppdragUtfortINorge:
        "You must state the share of assignments performed in Norway",
      duMaOppgiAndelOppdragskontrakterInngattINorge:
        "You must state the share of assignment contracts concluded in Norway",
      antallMaVaereEtHeltallSomErNullEllerMer:
        "You must enter a whole number that is 0 or higher",
      andelMaVaereEtHeltallMellom0Og100:
        "You must enter a whole number between 0 and 100",
    },
    utenlandsoppdragetSteg: {
      tittel: "Posting Period and Country",
      duMaVelgeHvilketLandArbeidstakerenSendesTil:
        "You must select to which country the employee is being posted",
      duMaSvarePaOmDereHarOppdragILandet:
        "You must answer whether you have assignments in the country",
      duMaSvarePaOmArbeidstakerBleAnsattPaGrunnAvDetteUtenlandsoppdraget:
        "You must answer whether the employee was hired because of this posting assignment",
      duMaSvarePaOmArbeidstakerVilFortsattVareAnsattIHeleUtsendingsperioden:
        "You must answer whether the employee will still be employed during the entire posting period",
      duMaSvarePaOmArbeidstakerErstatterEnAnnenPerson:
        "You must answer whether the employee is replacing another person",
      begrunnelseErPakrevdNarArbeidsgiverIkkeHarOppdragILandet:
        "Justification is required when the employer does not have posting assignments in the country",
      beskrivelseAvAnsettelsesforholdErPakrevd:
        "Description of employment relationship is required",
      duMaSvarePaOmArbeidstakerenVilArbeideForVirksomhetenINorgeEtterOppdraget:
        "You must answer whether the employee will work for the company in Norway after the posting period",
      registrertSomOffentligVirksomhet:
        "Information has been retrieved from the Brønnøysund Register Centre. {{virksomhetsnavn}} is registered as a <lookup>public sector organisation</lookup>. If this is incorrect, please contact the Brønnøysund Register Centre.",
      offentligVirksomhetForklaring:
        "Public sector organisations are government bodies and their subordinate agencies, for example ministries and universities.",
    },
    utsendingsperiodeOgLandSteg: {
      tittel: "Posting period and country",
      duMaVelgeHvilketLandArbeidetSkalUtforesI:
        "You must select which country the work will be performed in",
      preutfyltAvArbeidsgiver:
        "Your employer, {{arbeidsgiverNavn}}, has confirmed that you will be working in {{land}} during the period {{fraDato}}–{{tilDato}}. You must check that the information is correct, and make changes if anything is wrong.",
      endreLandEllerPeriode: "Edit country or period",
      arbeidsgiverOppgaLand: "Your employer stated {{land}}",
      arbeidsgiverOppgaPeriode:
        "Your employer stated the period {{fraDato}}–{{tilDato}}",
    },
    arbeidstakerenslonnSteg: {
      tittel: "Employee's salary",
      duMaSvarePaOmDuBetalerAllLonnOgEventuelleNaturalyttelserIUtsendingsperioden:
        "You must answer whether you pay all salary and any benefits in kind during the posting period",
      duMaLeggeTilMinstEnVirksomhetNarDuIkkeBetalerAllLonnSelv:
        "You must add at least one other company when your company does not pay all the salary",
    },
    landingsside: {
      hei: "Hello",
      hvemVilDuBrukeNavPaVegneAv: "Who are you acting on behalf of?",
      degSelv: "YOURSELF",
      dinArbeidsgiver: "EMPLOYER",
      dinArbeidsgiverBeskrivelse:
        "submitting the application on behalf of the employer/employee",
      enArbeidsgiverSomRadgiver: "ADVISOR",
      enArbeidsgiverSomRadgiverBeskrivelse:
        "submitting the application on behalf of the employer/employee",
      annenPerson: "PRIVATE INDIVIDUAL",
      annenPersonBeskrivelse:
        "completing the application on behalf of another person",
      soknadVenterPaaDeg: "An application is waiting for you",
      avbryt: "Cancel",
    },
    appHeader: {
      tittel: "Membership and applicable legislation",
    },
    skjemaParterHeader: {
      arbeidsgiver: "Employer",
      arbeidstaker: "Employee",
    },
    kontekstVelger: {
      arbeidsgiver: "Employer",
      radgiver: "Advisor",
      annenPerson: "Another person",
      byttKontekstAriaLabel: "Open menu to change representation or language",
    },
    oversiktDegSelv: {
      tittel: "Overview page for applications",
      herKanDu: "Here you can:",
      infoBullet1: "Submit an application.",
      infoBullet2: "view started and previously submitted applications.",
      ettersendelse:
        "You cannot submit additional documentation here. You can either send a new application with attachments or send the documentation via ",
      ettersendelseLenke: "Send documentation to Nav",
      ettersendelseLenkeUrl:
        "https://www.nav.no/fyllut-ettersending/en/nav020807/innsendingsvalg",
      motpartCtaTittel:
        "{{arbeidsgiverNavn}} has submitted a confirmation that you are posted to another EEA country or Switzerland",
      motpartCtaBeskrivelse:
        "They have stated that you will be working in {{land}} during the period {{fraDato}}–{{tilDato}}. You can apply for an A1 Certificate for Posted Workers in the EEA or Switzerland by completing your part.",
      motpartCtaUtlandetFallback: "another country",
      motpartCtaBeskrivelseUtenPeriode:
        "You can apply for an A1 Certificate for Posted Workers in the EEA or Switzerland by completing your part.",
      motpartCtaKnapp: "Complete your part",
      motpartCtaFeil:
        "Could not retrieve the information. Please try again later.",
      motpartLenkeGaTilOversikten: "Go to the overview",
    },
    oversiktArbeidsgiver: {
      tittel: "Overview page for applications",
      herKanDu: "Here you can:",
      infoBullet1:
        "Submit an application for your employer and their employees.",
      infoBullet2:
        "View the authorizations and powers of attorney that have been granted to you",
      infoBullet3: "view started and previously submitted applications.",
      ettersendelse:
        "You cannot submit additional documentation here. Additional documents can be sent as attachments in a new application.",
    },
    oversiktRadgiver: {
      tittel: "Overview page for applications",
      herKanDu: "Here you can:",
      infoBullet1: "Submit an application for an employer and their employees.",
      infoBullet2:
        "View the authorizations and powers of attorney that have been granted to you",
      infoBullet3: "view started and previously submitted applications.",
      ettersendelse:
        "You cannot submit additional documentation here. Additional documents can be sent as attachments in a new application.",
    },
    oversiktAnnenPerson: {
      tittel: "Overview page for applications",
      herKanDu: "Here you can:",
      infoBullet1:
        "Submit an application for people who have granted you a power of attorney",
      infoBullet2: "view started and previously submitted applications.",
      ettersendelse:
        "You cannot submit additional documentation here. Additional documents can be sent as attachments in a new application.",
      personVelgerLabel:
        "Select the person on whose behalf you are completing the application",
      personVelgerBeskrivelse:
        "The list contains all persons who have given you power of attorney on nav.no.",
    },
    skjemaStart: {
      intro:
        "It is important that you provide correct information so that we can process your application.",
      linkText:
        "Read more about why it is important to provide correct information.",
      linkUrl: "https://www.nav.no/endringer/en",
      bekreftAtVilSvareRiktig:
        "I confirm that I will answer as accurately as I can",
      arbeidsgiverInfo:
        "As the employer, you will receive all letters regarding the processing of the case in Altinn.",
      radgiverInfo:
        "The company you work for will receive all letters regarding the processing of the case in Altinn as long as the access and powers of attorney are valid.",
      annenPersonInfo:
        "As an authorized representative, you will receive letters regarding the processing of the case for as long as the power of attorney remains valid.",
      startSoknad: "Start application",
      manglerBekreftelse:
        "You must confirm that you will answer as accurately as you can",
      feilVedOpprettelse:
        "An error occurred while creating the application. Please try again later.",
    },
    oversiktFelles: {
      utkastTittel: "DRAFTS",
      utkastBeskrivelse: "Applications you have started but not yet submitted",
      utkastFeilmelding:
        "Could not fetch started applications. Try reloading the page.",
      utkastArbeidsgiver: "Employer",
      utkastArbeidstaker: "Employee",
      utkastOpprettet: "Created",
      utkastSistEndret: "Last modified",
      soknadStarterTittel:
        "Who are you submitting the application on behalf of?",
      soknadStarterTittelDegSelv:
        "Provide the name of the employer posting you abroad",
      soknadStarterTittelAnnenPerson:
        "Who are you submitting the application on behalf of?",
      soknadStarterInfoAnnenPerson:
        "We need information about both the person you are applying on behalf of and their employer.",
      soknadStarterInfo:
        "We need information about both the employer and the employee. If you have a power of attorney from the employee, you can complete both parts of the application at the same time. If not, select that the employee will complete their own part. Before starting the application, you must provide the employee's name and national identity number or d-number.",
      arbeidsgiverTittel: "Employer",
      arbeidsgiverOrgnrLabel: "Employer's organization number",
      arbeidsgiverVelgerLabel: "Select employer (Organization number or name)",
      arbeidsgiverVelgerPlaceholder: "Organization number or name",
      arbeidsgiverVelgerInfo:
        "The list contains all employers you have been granted access to in Altinn.",
      ingenArbeidsgivereTittel: "You have no employers available",
      ingenArbeidsgivereInfo:
        "To submit an application on behalf of an employer, you must have been delegated authorizations by the company in Altinn",
      ingenArbeidsgivereLenke: "Read more about how to get access in Altinn",
      feilVedHentingAvArbeidsgivere:
        "An error occurred while fetching employers from Altinn. Please try again later.",
      feilVedHentingAvFullmakter:
        "An error occurred while fetching the people you are authorized to represent. Please try again later.",
      arbeidstakerTittel: "Employee",
      skalFylleUtForArbeidstakerLabel:
        "Will you submit the application on the behalf of the employee?",
      arbeidstakerMedFullmaktLabel:
        "Select the employee you want to submit an application on behalf of",
      arbeidstakerMedFullmaktBeskrivelse:
        "The list contains all employees who have given you a power of attorney",
      arbeidstakerIngenFullmakter:
        "You have not been given a power of attorney from any employees. The employee can give you a power of attorney on",
      arbeidstakerSelvUtfyllingCheckbox:
        "The employee will complete their part of the application themselves.",
      arbeidstakerMedFullmaktPlaceholder:
        "National identity number/ d-number or name",
      arbeidstakerMedFullmaktListePlaceholder: "+ Select...",
      arbeidstakerUtenFullmaktTittel: "Employee without a power of attorney",
      arbeidstakerUtenFullmaktBeskrivelse:
        "The employee must complete their part of the application themselves.",
      arbeidstakerFnrLabel: "National identity number/ d-number",
      arbeidstakerFulltNavnLabel: "Last name",
      arbeidstakerSokKnapp: "Search",
      arbeidstakerFnrTom: "Enter national identity number",
      arbeidstakerFnrUgyldig: "Invalid national identity number",
      arbeidstakerFulltNavnTom: "Enter last name",
      arbeidstakerVerifiseringFeilet:
        "Person not found with the specified national identity number and last name",
      arbeidstakerVerifisertLabel: "Person verified",
      arbeidstakerFjernKnapp: "Remove",
      gaTilSkjemaKnapp: "Start application",
      valideringFeilTittel: "You must fill in these fields:",
      valideringManglerArbeidsgiver: "Employer must be selected",
      valideringManglerArbeidstaker: "Employee must be selected",
      historikkTittel: "Previously submitted applications",
      historikkSokPlaceholder: "Search...",
      historikkKolonneVirksomhet: "Company",
      historikkKolonneArbeidstaker: "Employee",
      historikkKolonneFnr: "National identity/D-no",
      historikkKolonneInnsendt: "Submitted",
      historikkKolonneRefnrSaksnummer: "Ref.no. / case number",
      historikkRefnrLabel: "Ref.no.",
      historikkSaksnummerLabel: "Case number",
      historikkKolonneFodselsdato: "Date of birth",
      historikkKolonneArbeidsgiver: "Employer",
      historikkSeSkjema: "View form",
      historikkKolonneStatus: "Status",
      historikkAntallTreff: "{{antall}} results",
      historikkFeilmelding:
        "Could not retrieve submitted applications. Please try again later.",
      historikkIngenResultater: "No applications found",
      historikkStatusSendt: "Submitted",
      historikkStatusMottatt: "Received",
      historikkStatusAvsluttet: "Closed",
      historikkStatusSoknadMottatt: "Application received",
      historikkStatusVenterArbeidstakersDel: "Awaiting employee's part",
      historikkStatusVenterArbeidsgiversDel: "Awaiting employer's part",
      paginationForrige: "Previous",
      paginationNeste: "Next",
      orgnrLabel: "Org. no:",
      fullmaktLenkeUrl: "https://www.nav.no/fullmakt/en",
    },
    velgRadgiverfirma: {
      tittel: "Which advisory firm do you work for?",
      informasjon:
        "We need this information to send letters to the correct recipient in Altinn.",
      sokPaVirksomhet: "Search for company (org.no.)",
      duMaSokeForstFeil:
        "You must search for and select an advisory firm before you can continue",
      valgtFirma: "Selected organization",
      ok: "Ok",
    },
    oppsummeringSteg: {
      tittel: "Summary",
      svarPaVegneAvArbeidstaker:
        "The following answers are on behalf of the employee.",
    },
    generellValidering: {
      erPakrevd: "is required",
      organisasjonsnummerErPakrevd: "Organization number is required",
      organisasjonsnummerHarUgyldigFormat:
        "The organization number has an invalid format",
      organisasjonsnummerMaVare9Siffer: "Organization number must be 9 digits",
      navnPaVirksomhetErPakrevd: "Company name is required",
      vegnavnOgHusnummerErPakrevd:
        "Street address and house number are required",
      landErPakrevd: "Country is required",
      duMaSvarePaOmVirksomhetenTilhorerSammeKonsern:
        "You must answer whether the company is part of the same corporate group",
      ansettelsesformErPakrevd: "You must select an employment form",
      organisasjonIkkeFunnet: "No organization found with this number",
      feilVedSok: "Something went wrong with the search. Try again later.",
      ugyldigOrganisasjonsnummer: "The organization number is invalid",
      rateLimitOverskredet:
        "You have searched too many times. Wait a minute before trying again.",
    },
    innsendtSkjema: {
      tittel: "Submitted application",
      saksnummer: "Case number: {{saksnummer}}",
      arbeidstakersDel: "Employee's part of the application",
      arbeidsgiverDel: "Employer's part of the application",
      tilbakeTilOversikt: "Back to overview",
      feilVedLasting:
        "Could not retrieve submitted application. Please try again later.",
    },
    kvittering: {
      tittel: "Thank you!",
      melding: "We have received your application with reference",
      infoOversikt:
        "You can see the application under 'Previously submitted applications' on the application overview page.",
      tilOversikt: "Go to application overview",
    },
    land: {
      AT: "Austria",
      AX: "Åland Islands",
      BE: "Belgium",
      BG: "Bulgaria",
      CH: "Switzerland",
      CY: "Cyprus",
      CZ: "Czechia",
      DE: "Germany",
      DK: "Denmark",
      EE: "Estonia",
      ES: "Spain",
      FI: "Finland",
      FO: "Faroe Islands",
      FR: "France",
      GB: "United Kingdom",
      GL: "Greenland",
      GR: "Greece",
      HR: "Croatia",
      HU: "Hungary",
      IE: "Ireland",
      IS: "Iceland",
      IT: "Italy",
      LI: "Liechtenstein",
      LT: "Lithuania",
      LU: "Luxembourg",
      LV: "Latvia",
      MT: "Malta",
      NL: "Netherlands",
      NO: "Norway",
      PL: "Poland",
      PT: "Portugal",
      RO: "Romania",
      SE: "Sweden",
      SI: "Slovenia",
      SJ: "Svalbard and Jan Mayen",
      SK: "Slovakia",
    },
  },
};
