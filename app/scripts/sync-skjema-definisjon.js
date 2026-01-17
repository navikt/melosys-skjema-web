#!/usr/bin/env node
/**
 * Synkroniserer skjemadefinisjon fra backend JSON til frontend TypeScript.
 *
 * Bruk: npm run sync-skjema-definisjon
 *
 * Dette scriptet:
 * 1. Leser JSON-definisjonen fra backend (fra fil eller API)
 * 2. Genererer TypeScript med 'as const' for full type-inferens
 * 3. Legger til hjelpefunksjoner (getFelt, getSeksjon)
 * 4. Skriver til src/constants/skjemaDefinisjonA1.ts
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Konfigurasjon - prøv flere mulige stier
const POSSIBLE_BACKEND_PATHS = [
  // Når melosys-skjema-web er klonet ved siden av melosys-skjema-api
  resolve(
    __dirname,
    "../../../../melosys-skjema-api/src/main/resources/skjema-definisjoner/A1/v1/nb.json",
  ),
  // Når kjørt fra melosys-skjema-mottak-oppgave (symlink)
  resolve(
    __dirname,
    "../../../melosys-skjema-api/src/main/resources/skjema-definisjoner/A1/v1/nb.json",
  ),
  // Absolutt sti til nav-mappen
  resolve(
    "/home/isa/nav/melosys-skjema-api/src/main/resources/skjema-definisjoner/A1/v1/nb.json",
  ),
];
const OUTPUT_PATH = resolve(
  __dirname,
  "../src/constants/skjemaDefinisjonA1.ts",
);

function findBackendJsonPath() {
  for (const path of POSSIBLE_BACKEND_PATHS) {
    if (existsSync(path)) {
      return path;
    }
  }
  return null;
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
 * Genererer TypeScript-filen med definisjon og hjelpefunksjoner.
 */
function generateTypeScriptFile(jsonDefinition) {
  const header = `/**
 * AUTOGENERERT - Kopiert fra backend: melosys-skjema-api/src/main/resources/skjema-definisjoner/A1/v1/nb.json
 *
 * Ved endringer i backend, kjør: npm run sync-skjema-definisjon
 * Runtime-validering sjekker at denne filen er i sync med backend.
 */

`;

  const definition = `export const SKJEMA_DEFINISJON_A1 = ${objectToTypeScript(jsonDefinition)} as const;

`;

  const types = `// Typer inferert fra konstanten
export type SkjemaDefinisjonA1Type = typeof SKJEMA_DEFINISJON_A1;
export type SeksjonsNavn = keyof typeof SKJEMA_DEFINISJON_A1.seksjoner;
export type FeltNavn<S extends SeksjonsNavn> =
  keyof (typeof SKJEMA_DEFINISJON_A1.seksjoner)[S]["felter"];

// Base field type for all field kinds
interface BaseFeltType {
  label: string;
  type: string;
  pakrevd: boolean;
  hjelpetekst?: string;
}

`;

  const helpers = `/**
 * Typesikker aksess til felt.
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
 * Hent en hel seksjon.
 */
export function getSeksjon<S extends SeksjonsNavn>(seksjonNavn: S) {
  return SKJEMA_DEFINISJON_A1.seksjoner[seksjonNavn];
}
`;

  return header + definition + types + helpers;
}

/**
 * Hovedfunksjon - leser JSON og genererer TypeScript.
 */
async function main() {
  console.log("🔄 Synkroniserer skjemadefinisjon fra backend...\n");

  // Finn backend JSON-fil
  const backendJsonPath = findBackendJsonPath();
  if (!backendJsonPath) {
    console.error("❌ Fant ikke backend JSON-fil. Prøvde følgende stier:");
    for (const path of POSSIBLE_BACKEND_PATHS) {
      console.error(`   - ${path}`);
    }
    console.error("\nSjekk at melosys-skjema-api er klonet/tilgjengelig.");
    process.exit(1);
  }

  // Les JSON-definisjonen
  console.log(`📖 Leser: ${backendJsonPath}`);
  const jsonContent = readFileSync(backendJsonPath, "utf-8");
  const jsonDefinition = JSON.parse(jsonContent);

  console.log(`   Type: ${jsonDefinition.type}`);
  console.log(`   Versjon: ${jsonDefinition.versjon}`);
  console.log(`   Seksjoner: ${Object.keys(jsonDefinition.seksjoner).length}`);

  // Generer TypeScript
  console.log(`\n📝 Genererer TypeScript...`);
  const tsContent = generateTypeScriptFile(jsonDefinition);

  // Skriv til fil
  console.log(`💾 Skriver: ${OUTPUT_PATH}`);
  writeFileSync(OUTPUT_PATH, tsContent, "utf-8");

  console.log("\n✅ Skjemadefinisjon synkronisert!");
  console.log("\nNeste steg:");
  console.log("  1. Kjør 'npm run lint:fix' for å formatere filen");
  console.log("  2. Verifiser endringene med 'git diff'");
  console.log("  3. Commit endringene");
}

main().catch((error) => {
  console.error("❌ Feil ved synkronisering:", error.message);
  process.exit(1);
});
