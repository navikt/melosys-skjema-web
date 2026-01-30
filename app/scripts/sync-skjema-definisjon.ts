#!/usr/bin/env node
/**
 * Synkroniserer skjemadefinisjoner fra backend JSON til frontend TypeScript.
 *
 * Bruk: npm run sync-skjema-definisjon
 *
 * Dette scriptet:
 * 1. Leser flerspråklig definisjon.json fra backend
 * 2. Trekker ut per-språk definisjoner
 * 3. Genererer TypeScript med 'as const' for full type-inferens
 * 4. Legger til hjelpefunksjoner (getFelt, getSeksjon, getSkjemaDefinisjon)
 * 5. Skriver til src/constants/skjemaDefinisjonA1.ts
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LANGUAGES = ["nb", "en"];
const SCHEMA_TYPE = "A1";
const SCHEMA_VERSION = "v1";

function buildPossibleBasePaths(): string[] {
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
const OUTPUT_PATH = resolve(__dirname, "../src/constants/skjemaDefinisjonA1.ts");

interface FlersprakligTekst {
  [språk: string]: string;
}

interface FlersprakligFelt {
  type: string;
  label: FlersprakligTekst;
  hjelpetekst?: FlersprakligTekst;
  pakrevd: boolean;
  jaLabel?: FlersprakligTekst;
  neiLabel?: FlersprakligTekst;
  fraDatoLabel?: FlersprakligTekst;
  tilDatoLabel?: FlersprakligTekst;
  leggTilLabel?: FlersprakligTekst;
  fjernLabel?: FlersprakligTekst;
  tomListeMelding?: FlersprakligTekst;
  maxLength?: number;
  alternativer?: Array<{
    verdi: string;
    label: FlersprakligTekst;
    beskrivelse?: FlersprakligTekst;
  }>;
  elementDefinisjon?: Record<string, FlersprakligFelt>;
}

interface FlersprakligSeksjon {
  tittel: FlersprakligTekst;
  beskrivelse?: FlersprakligTekst;
  felter: Record<string, FlersprakligFelt>;
}

interface FlersprakligDefinisjon {
  type: string;
  versjon: string;
  seksjoner: Record<string, FlersprakligSeksjon>;
}

interface EnkeltsprakligFelt {
  type: string;
  label: string;
  hjelpetekst?: string;
  pakrevd: boolean;
  jaLabel?: string;
  neiLabel?: string;
  fraDatoLabel?: string;
  tilDatoLabel?: string;
  leggTilLabel?: string;
  fjernLabel?: string;
  tomListeMelding?: string;
  maxLength?: number;
  alternativer?: Array<{
    verdi: string;
    label: string;
    beskrivelse?: string;
  }>;
  elementDefinisjon?: Record<string, EnkeltsprakligFelt>;
}

interface EnkeltsprakligSeksjon {
  tittel: string;
  beskrivelse?: string;
  felter: Record<string, EnkeltsprakligFelt>;
}

interface EnkeltsprakligDefinisjon {
  type: string;
  versjon: string;
  seksjoner: Record<string, EnkeltsprakligSeksjon>;
}

function findBackendBasePath(): string | null {
  for (const basePath of POSSIBLE_BASE_PATHS) {
    const defPath = resolve(
      basePath,
      `src/main/resources/skjema-definisjoner/${SCHEMA_TYPE}/${SCHEMA_VERSION}/definisjon.json`
    );
    if (existsSync(defPath)) {
      return basePath;
    }
  }
  return null;
}

function getDefinisjonPath(basePath: string): string {
  return resolve(
    basePath,
    `src/main/resources/skjema-definisjoner/${SCHEMA_TYPE}/${SCHEMA_VERSION}/definisjon.json`
  );
}

function extractText(tekst: FlersprakligTekst | undefined, språk: string): string | undefined {
  if (!tekst) return undefined;
  return tekst[språk] ?? tekst["nb"] ?? Object.values(tekst)[0];
}

function transformFelt(felt: FlersprakligFelt, språk: string): EnkeltsprakligFelt {
  const result: EnkeltsprakligFelt = {
    type: felt.type,
    label: extractText(felt.label, språk)!,
    pakrevd: felt.pakrevd,
  };

  if (felt.hjelpetekst) result.hjelpetekst = extractText(felt.hjelpetekst, språk);
  if (felt.jaLabel) result.jaLabel = extractText(felt.jaLabel, språk);
  if (felt.neiLabel) result.neiLabel = extractText(felt.neiLabel, språk);
  if (felt.fraDatoLabel) result.fraDatoLabel = extractText(felt.fraDatoLabel, språk);
  if (felt.tilDatoLabel) result.tilDatoLabel = extractText(felt.tilDatoLabel, språk);
  if (felt.leggTilLabel) result.leggTilLabel = extractText(felt.leggTilLabel, språk);
  if (felt.fjernLabel) result.fjernLabel = extractText(felt.fjernLabel, språk);
  if (felt.tomListeMelding) result.tomListeMelding = extractText(felt.tomListeMelding, språk);
  if (felt.maxLength) result.maxLength = felt.maxLength;

  if (felt.alternativer) {
    result.alternativer = felt.alternativer.map((alt) => ({
      verdi: alt.verdi,
      label: extractText(alt.label, språk)!,
      ...(alt.beskrivelse && { beskrivelse: extractText(alt.beskrivelse, språk) }),
    }));
  }

  if (felt.elementDefinisjon) {
    result.elementDefinisjon = {};
    for (const [key, value] of Object.entries(felt.elementDefinisjon)) {
      result.elementDefinisjon[key] = transformFelt(value, språk);
    }
  }

  return result;
}

function transformToSingleLanguage(
  def: FlersprakligDefinisjon,
  språk: string
): EnkeltsprakligDefinisjon {
  const result: EnkeltsprakligDefinisjon = {
    type: def.type,
    versjon: def.versjon,
    seksjoner: {},
  };

  for (const [seksjonKey, seksjon] of Object.entries(def.seksjoner)) {
    result.seksjoner[seksjonKey] = {
      tittel: extractText(seksjon.tittel, språk)!,
      ...(seksjon.beskrivelse && { beskrivelse: extractText(seksjon.beskrivelse, språk) }),
      felter: {},
    };

    for (const [feltKey, felt] of Object.entries(seksjon.felter)) {
      result.seksjoner[seksjonKey].felter[feltKey] = transformFelt(felt, språk);
    }
  }

  return result;
}

function objectToTypeScript(obj: unknown, indent = 2): string {
  const spaces = " ".repeat(indent);
  const lines: string[] = [];

  if (Array.isArray(obj)) {
    lines.push("[");
    for (const item of obj) {
      if (typeof item === "object" && item !== null) {
        lines.push(spaces + objectToTypeScript(item, indent + 2) + ",");
      } else {
        lines.push(spaces + JSON.stringify(item) + ",");
      }
    }
    lines.push(" ".repeat(indent - 2) + "]");
    return lines.join("\n");
  }

  if (typeof obj === "object" && obj !== null) {
    lines.push("{");
    const entries = Object.entries(obj);
    for (const [key, value] of entries) {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);

      if (typeof value === "object" && value !== null) {
        lines.push(`${spaces}${safeKey}: ${objectToTypeScript(value, indent + 2)},`);
      } else {
        lines.push(`${spaces}${safeKey}: ${JSON.stringify(value)},`);
      }
    }
    lines.push(" ".repeat(indent - 2) + "}");
    return lines.join("\n");
  }

  return JSON.stringify(obj);
}

function generateTypeScriptFile(definitions: Record<string, EnkeltsprakligDefinisjon>): string {
  const header = `/**
 * AUTOGENERERT - Synkronisert fra backend: melosys-skjema-api
 *
 * Ved endringer i backend, kjør: npm run sync-skjema-definisjon
 *
 * Inneholder definisjoner for språk: ${Object.keys(definitions).join(", ")}
 */

`;

  let languageConstants = "";
  for (const [lang, def] of Object.entries(definitions)) {
    languageConstants += `const SKJEMA_DEFINISJON_A1_${lang.toUpperCase()} = ${objectToTypeScript(def)} as const;

`;
  }

  const allLanguagesExport = `export const SKJEMA_DEFINISJONER_A1 = {
  nb: SKJEMA_DEFINISJON_A1_NB,
  en: SKJEMA_DEFINISJON_A1_EN,
} as const;

export type SupportedLanguage = keyof typeof SKJEMA_DEFINISJONER_A1;

`;

  const backwardCompatExport = `// Backward compatibility - brukes av eksisterende kode
// OBS: Denne bytter IKKE språk ved runtime. Bruk getSkjemaDefinisjon(lang) for språkstøtte.
export const SKJEMA_DEFINISJON_A1 = SKJEMA_DEFINISJON_A1_NB;

`;

  const types = `// Typer inferert fra konstanten
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

`;

  const helpers = `/**
 * Hent skjemadefinisjon for et gitt språk.
 */
export function getSkjemaDefinisjon(lang: SupportedLanguage): SkjemaDefinisjonA1Type {
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
  const definisjon = SKJEMA_DEFINISJONER_A1[lang] as unknown as SkjemaDefinisjonA1Type;
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
  const definisjon = SKJEMA_DEFINISJONER_A1[lang] as unknown as SkjemaDefinisjonA1Type;
  return definisjon.seksjoner[seksjonNavn];
}
`;

  return header + languageConstants + allLanguagesExport + backwardCompatExport + types + helpers;
}

async function main(): Promise<void> {
  console.log("🔄 Synkroniserer skjemadefinisjoner fra backend...\n");

  const backendBasePath = findBackendBasePath();
  if (!backendBasePath) {
    console.error("❌ Fant ikke backend definisjon.json. Prøvde følgende stier:");
    for (const path of POSSIBLE_BASE_PATHS) {
      console.error(`   - ${path}`);
    }
    console.error("\nLøsning:");
    console.error("  1. Sjekk at melosys-skjema-api er klonet ved siden av melosys-skjema-web");
    console.error("  2. Eller sett miljøvariabel MELOSYS_SKJEMA_API_PATH:");
    console.error(
      "     MELOSYS_SKJEMA_API_PATH=/path/to/melosys-skjema-api npm run sync-skjema-definisjon"
    );
    process.exit(1);
  }

  const defPath = getDefinisjonPath(backendBasePath);
  console.log(`📖 Leser: ${defPath}`);

  const jsonContent = readFileSync(defPath, "utf-8");
  const flersprakligDef: FlersprakligDefinisjon = JSON.parse(jsonContent);

  console.log(`   Type: ${flersprakligDef.type}`);
  console.log(`   Versjon: ${flersprakligDef.versjon}`);
  console.log(`   Seksjoner: ${Object.keys(flersprakligDef.seksjoner).length}`);

  const definitions: Record<string, EnkeltsprakligDefinisjon> = {};

  for (const lang of LANGUAGES) {
    console.log(`\n🌐 Transformerer til ${lang}...`);
    definitions[lang] = transformToSingleLanguage(flersprakligDef, lang);
  }

  console.log(`\n📝 Genererer TypeScript...`);
  const tsContent = generateTypeScriptFile(definitions);

  // Opprett output-mappe hvis den ikke finnes
  const outputDir = dirname(OUTPUT_PATH);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log(`💾 Skriver: ${OUTPUT_PATH}`);
  writeFileSync(OUTPUT_PATH, tsContent, "utf-8");

  // Formater med Prettier
  console.log("🎨 Formaterer med Prettier...");
  try {
    execSync(`npx prettier --write "${OUTPUT_PATH}"`, {
      cwd: dirname(__dirname),
      stdio: "pipe",
    });
  } catch {
    console.warn("⚠️  Prettier-formatering feilet, kjør manuelt: npm run lint:fix");
  }

  console.log("\n✅ Skjemadefinisjoner synkronisert!");
  console.log(`   Språk: ${Object.keys(definitions).join(", ")}`);
}

main().catch((error) => {
  console.error("❌ Feil ved synkronisering:", error);
  process.exit(1);
});
