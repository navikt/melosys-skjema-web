#!/usr/bin/env node
/**
 * Synkroniserer skjemadefinisjoner fra backend JSON til frontend TypeScript.
 *
 * Bruk: npm run sync-skjema-definisjon
 *
 * Dette scriptet:
 * 1. Leser JSON-definisjonene fra backend (nb.json og en.json)
 * 2. Genererer TypeScript med 'as const' for full type-inferens
 * 3. Legger til hjelpefunksjoner (getFelt, getSeksjon, getSkjemaDefinisjon)
 * 4. Skriver til src/constants/skjemaDefinisjonA1.ts
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Støttede språk
const LANGUAGES = ["nb", "en"];

function buildPossibleBasePaths() {
  const paths = [
    // Når melosys-skjema-web er klonet ved siden av melosys-skjema-api
    resolve(__dirname, "../../../../melosys-skjema-api"),
    // Når kjørt fra melosys-skjema-mottak-oppgave (symlink)
    resolve(__dirname, "../../../melosys-skjema-api"),
  ];

  // Støtte for miljøvariabel MELOSYS_SKJEMA_API_PATH
  if (process.env.MELOSYS_SKJEMA_API_PATH) {
    paths.unshift(process.env.MELOSYS_SKJEMA_API_PATH);
  }

  return paths;
}

const POSSIBLE_BASE_PATHS = buildPossibleBasePaths();
const OUTPUT_PATH = resolve(
  __dirname,
  "../src/constants/skjemaDefinisjonA1.ts",
);

function findBackendBasePath() {
  for (const basePath of POSSIBLE_BASE_PATHS) {
    const nbPath = resolve(
      basePath,
      "src/main/resources/skjema-definisjoner/A1/v1/nb.json",
    );
    if (existsSync(nbPath)) {
      return basePath;
    }
  }
  return null;
}

function getJsonPath(basePath, lang) {
  return resolve(
    basePath,
    `src/main/resources/skjema-definisjoner/A1/v1/${lang}.json`,
  );
}

/**
 * Konverterer et JavaScript-objekt til formatert TypeScript-kode.
 * Håndterer spesielle tegn i strenger og nested objekter/arrays.
 */
function objectToTypeScript(obj, indent = 2) {
  const spaces = " ".repeat(indent);
  const lines = [];

  if (Array.isArray(obj)) {
    lines.push("[");
    for (const [index, item] of obj.entries()) {
      const comma = index < obj.length - 1 ? "," : "";
      if (typeof item === "object" && item !== null) {
        lines.push(spaces + objectToTypeScript(item, indent + 2) + comma);
      } else {
        lines.push(spaces + JSON.stringify(item) + comma);
      }
    }
    lines.push(" ".repeat(indent - 2) + "]");
    return lines.join("\n");
  }

  if (typeof obj === "object" && obj !== null) {
    lines.push("{");
    const entries = Object.entries(obj);
    for (const [index, [key, value]] of entries.entries()) {
      const comma = index < entries.length - 1 ? "," : "";
      // Bruk quotes for nøkler med spesialtegn
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : JSON.stringify(key);

      if (typeof value === "object" && value !== null) {
        lines.push(
          `${spaces}${safeKey}: ${objectToTypeScript(value, indent + 2)}${comma}`,
        );
      } else if (typeof value === "string") {
        // Håndter multiline strenger
        if (value.includes("\n")) {
          lines.push(`${spaces}${safeKey}: ${JSON.stringify(value)}${comma}`);
        } else {
          lines.push(`${spaces}${safeKey}: ${JSON.stringify(value)}${comma}`);
        }
      } else {
        lines.push(`${spaces}${safeKey}: ${JSON.stringify(value)}${comma}`);
      }
    }
    lines.push(" ".repeat(indent - 2) + "}");
    return lines.join("\n");
  }

  return JSON.stringify(obj);
}

/**
 * Genererer TypeScript-filen med definisjoner for alle språk og hjelpefunksjoner.
 */
function generateTypeScriptFile(definitions) {
  const header = `/**
 * AUTOGENERERT - Kopiert fra backend: melosys-skjema-api/src/main/resources/skjema-definisjoner/A1/v1/
 *
 * Ved endringer i backend, kjør: npm run sync-skjema-definisjon
 *
 * Inneholder definisjoner for språk: ${Object.keys(definitions).join(", ")}
 */

`;

  // Generer konstanter for hvert språk
  let languageConstants = "";
  for (const [lang, def] of Object.entries(definitions)) {
    languageConstants += `const SKJEMA_DEFINISJON_A1_${lang.toUpperCase()} = ${objectToTypeScript(def)} as const;

`;
  }

  // Lag en samlet eksport med alle språk
  const allLanguagesExport = `export const SKJEMA_DEFINISJONER_A1 = {
  nb: SKJEMA_DEFINISJON_A1_NB,
  en: SKJEMA_DEFINISJON_A1_EN,
} as const;

export type SupportedLanguage = keyof typeof SKJEMA_DEFINISJONER_A1;

`;

  // Behold backward compatibility med SKJEMA_DEFINISJON_A1 som peker til norsk
  const backwardCompatExport = `// Backward compatibility - brukes av eksisterende kode
// OBS: Denne bytter IKKE språk ved runtime. Bruk getSkjemaDefinisjon(lang) for språkstøtte.
export const SKJEMA_DEFINISJON_A1 = SKJEMA_DEFINISJON_A1_NB;

`;

  const types = `// Typer inferert fra konstanten
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

`;

  const helpers = `/**
 * Hent skjemadefinisjon for et gitt språk.
 * Brukes for runtime språkbytte.
 * Note: Type assertion needed because NB and EN have same structure but different literal string values.
 */
export function getSkjemaDefinisjon(lang: SupportedLanguage): SkjemaDefinisjonA1Type {
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
  const definisjon = SKJEMA_DEFINISJONER_A1[lang] as unknown as SkjemaDefinisjonA1Type;
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
  const definisjon = SKJEMA_DEFINISJONER_A1[lang] as unknown as SkjemaDefinisjonA1Type;
  return definisjon.seksjoner[seksjonNavn];
}
`;

  return (
    header +
    languageConstants +
    allLanguagesExport +
    backwardCompatExport +
    types +
    helpers
  );
}

/**
 * Hovedfunksjon - leser JSON-filer for alle språk og genererer TypeScript.
 */
async function main() {
  console.log("🔄 Synkroniserer skjemadefinisjoner fra backend...\n");

  // Finn backend base path
  const backendBasePath = findBackendBasePath();
  if (!backendBasePath) {
    console.error("❌ Fant ikke backend JSON-filer. Prøvde følgende stier:");
    for (const path of POSSIBLE_BASE_PATHS) {
      console.error(`   - ${path}`);
    }
    console.error("\nLøsning:");
    console.error(
      "  1. Sjekk at melosys-skjema-api er klonet ved siden av melosys-skjema-web",
    );
    console.error("  2. Eller sett miljøvariabel MELOSYS_SKJEMA_API_PATH:");
    console.error(
      "     MELOSYS_SKJEMA_API_PATH=/path/to/melosys-skjema-api npm run sync-skjema-definisjon",
    );
    process.exit(1);
  }

  const definitions = {};

  // Les JSON-definisjon for hvert språk
  for (const lang of LANGUAGES) {
    const jsonPath = getJsonPath(backendBasePath, lang);

    if (!existsSync(jsonPath)) {
      console.warn(`⚠️  Mangler ${lang}.json - hopper over`);
      continue;
    }

    console.log(`📖 Leser: ${jsonPath}`);
    const jsonContent = readFileSync(jsonPath, "utf-8");
    const jsonDefinition = JSON.parse(jsonContent);

    definitions[lang] = jsonDefinition;

    console.log(`   Type: ${jsonDefinition.type}`);
    console.log(`   Versjon: ${jsonDefinition.versjon}`);
    console.log(`   Seksjoner: ${Object.keys(jsonDefinition.seksjoner).length}`);
  }

  if (Object.keys(definitions).length === 0) {
    console.error("❌ Ingen språkfiler funnet!");
    process.exit(1);
  }

  // Generer TypeScript
  console.log(`\n📝 Genererer TypeScript med ${Object.keys(definitions).length} språk...`);
  const tsContent = generateTypeScriptFile(definitions);

  // Skriv til fil
  console.log(`💾 Skriver: ${OUTPUT_PATH}`);
  writeFileSync(OUTPUT_PATH, tsContent, "utf-8");

  console.log("\n✅ Skjemadefinisjoner synkronisert!");
  console.log(`   Språk: ${Object.keys(definitions).join(", ")}`);
  console.log("\nNeste steg:");
  console.log("  1. Kjør 'npm run lint:fix' for å formatere filen");
  console.log("  2. Verifiser endringene med 'git diff'");
  console.log("  3. Commit endringene");
}

main().catch((error) => {
  console.error("❌ Feil ved synkronisering:", error.message);
  process.exit(1);
});
