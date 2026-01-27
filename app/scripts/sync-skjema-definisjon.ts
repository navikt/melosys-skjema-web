/**
 * Script for å synkronisere skjemadefinisjoner fra backend til frontend.
 *
 * Henter skjemadefinisjon fra backend API for hvert språk og genererer
 * TypeScript-filer som kan importeres i frontend.
 *
 * Bruk:
 *   npx tsx scripts/sync-skjema-definisjon.ts
 *
 * Forutsetninger:
 *   - Backend må kjøre på localhost:8082
 */

import * as fs from "fs";
import * as path from "path";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8082";
const LANGUAGES = ["nb", "en"];
const SCHEMA_TYPE = "A1";
const OUTPUT_DIR = path.join(__dirname, "../src/skjema-definisjoner");

interface SkjemaDefinisjon {
  type: string;
  versjon: string;
  seksjoner: Record<string, Seksjon>;
}

interface Seksjon {
  tittel: string;
  beskrivelse?: string;
  felter: Record<string, Felt>;
}

interface Felt {
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
  maxLength?: number;
  alternativer?: Alternativ[];
  elementDefinisjon?: Record<string, Felt>;
}

interface Alternativ {
  verdi: string;
  label: string;
  beskrivelse?: string;
}

async function fetchSkjemaDefinisjon(
  språk: string
): Promise<SkjemaDefinisjon> {
  const url = `${BACKEND_URL}/api/skjema/definisjon/${SCHEMA_TYPE}?språk=${språk}`;
  console.log(`Henter skjemadefinisjon fra: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Feil ved henting av skjemadefinisjon: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

function generateTypeScriptFile(
  definisjon: SkjemaDefinisjon,
  språk: string
): string {
  const json = JSON.stringify(definisjon, null, 2);

  return `/**
 * Auto-generert fil - IKKE REDIGER MANUELT
 *
 * Generert fra backend skjemadefinisjon.
 * Kjør 'npm run sync-skjema-definisjon' for å oppdatere.
 *
 * Språk: ${språk}
 * Type: ${definisjon.type}
 * Versjon: ${definisjon.versjon}
 */

export const skjemaDefinisjon${definisjon.type}_${språk} = ${json} as const;

export type SkjemaDefinisjon${definisjon.type} = typeof skjemaDefinisjon${definisjon.type}_${språk};
`;
}

function generateIndexFile(languages: string[], schemaType: string): string {
  const imports = languages
    .map(
      (lang) =>
        `export { skjemaDefinisjon${schemaType}_${lang} } from './${schemaType}_${lang}';`
    )
    .join("\n");

  const typeExport = `export type { SkjemaDefinisjon${schemaType} } from './${schemaType}_${languages[0]}';`;

  return `/**
 * Auto-generert fil - IKKE REDIGER MANUELT
 *
 * Re-eksporterer alle skjemadefinisjoner.
 */

${imports}

${typeExport}

export type Språk = ${languages.map((l) => `'${l}'`).join(" | ")};

export function getSkjemaDefinisjon(språk: Språk) {
  switch (språk) {
${languages.map((lang) => `    case '${lang}': return skjemaDefinisjon${schemaType}_${lang};`).join("\n")}
  }
}
`;
}

async function main() {
  console.log("Synkroniserer skjemadefinisjoner fra backend...\n");

  // Opprett output-mappe hvis den ikke finnes
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Opprettet mappe: ${OUTPUT_DIR}`);
  }

  const successfulLanguages: string[] = [];

  for (const språk of LANGUAGES) {
    try {
      const definisjon = await fetchSkjemaDefinisjon(språk);
      const tsContent = generateTypeScriptFile(definisjon, språk);
      const outputPath = path.join(OUTPUT_DIR, `${SCHEMA_TYPE}_${språk}.ts`);

      fs.writeFileSync(outputPath, tsContent);
      console.log(`✓ Generert: ${outputPath}`);
      successfulLanguages.push(språk);
    } catch (error) {
      console.error(`✗ Feil for språk '${språk}':`, error);
    }
  }

  if (successfulLanguages.length > 0) {
    // Generer index-fil
    const indexContent = generateIndexFile(successfulLanguages, SCHEMA_TYPE);
    const indexPath = path.join(OUTPUT_DIR, "index.ts");
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✓ Generert: ${indexPath}`);
  }

  console.log("\nSynkronisering fullført!");
  console.log(
    `Generert ${successfulLanguages.length} av ${LANGUAGES.length} språkfiler.`
  );
}

main().catch((error) => {
  console.error("Kritisk feil:", error);
  process.exit(1);
});
