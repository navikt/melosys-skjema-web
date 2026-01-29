/**
 * Runtime validation to check that static skjemadefinisjon matches backend.
 *
 * Call this on app startup (in development) to detect drift between
 * the static TypeScript file and the backend definition.
 */

import { toast } from "react-hot-toast";

import {
  SKJEMA_DEFINISJONER_A1,
  type SupportedLanguage,
} from "~/constants/skjemaDefinisjonA1";

const API_PROXY_URL = "/api";

interface ValidationResult {
  isValid: boolean;
  differences: string[];
}

/**
 * Fetches the current definition from backend and compares with static for one language.
 */
async function validateForLanguage(
  skjemaType: string,
  sprak: SupportedLanguage,
): Promise<ValidationResult> {
  try {
    const response = await fetch(
      `${API_PROXY_URL}/skjema/definisjon/${skjemaType}?sprak=${sprak}`,
    );

    if (!response.ok) {
      return {
        isValid: false,
        differences: [
          `[${sprak}] Failed to fetch backend definition: ${response.status}`,
        ],
      };
    }

    const backendDefinisjon = await response.json();
    const staticDefinisjon = SKJEMA_DEFINISJONER_A1[sprak];
    const differences: string[] = [];

    // Compare version
    if (backendDefinisjon.versjon !== staticDefinisjon.versjon) {
      differences.push(
        `[${sprak}] Version mismatch: static=${staticDefinisjon.versjon}, backend=${backendDefinisjon.versjon}`,
      );
    }

    // Compare sections
    const staticSeksjoner = Object.keys(staticDefinisjon.seksjoner);
    const backendSeksjoner = Object.keys(backendDefinisjon.seksjoner || {});

    // Check for missing/extra sections
    for (const seksjon of staticSeksjoner) {
      if (!backendSeksjoner.includes(seksjon)) {
        differences.push(
          `[${sprak}] Section '${seksjon}' in static but not in backend`,
        );
      }
    }
    for (const seksjon of backendSeksjoner) {
      if (!staticSeksjoner.includes(seksjon)) {
        differences.push(
          `[${sprak}] Section '${seksjon}' in backend but not in static`,
        );
      }
    }

    // Deep compare each section
    for (const seksjon of staticSeksjoner) {
      if (!backendDefinisjon.seksjoner?.[seksjon]) continue;

      const staticSeksjon =
        staticDefinisjon.seksjoner[
          seksjon as keyof typeof staticDefinisjon.seksjoner
        ];
      const backendSeksjon = backendDefinisjon.seksjoner[seksjon];

      // Compare title
      if (staticSeksjon.tittel !== backendSeksjon.tittel) {
        differences.push(
          `[${sprak}] Section '${seksjon}' tittel mismatch: static="${staticSeksjon.tittel}", backend="${backendSeksjon.tittel}"`,
        );
      }

      // Compare fields
      const staticFelter = Object.keys(staticSeksjon.felter);
      const backendFelter = Object.keys(backendSeksjon.felter || {});

      for (const felt of staticFelter) {
        if (!backendFelter.includes(felt)) {
          differences.push(
            `[${sprak}] Field '${seksjon}.${felt}' in static but not in backend`,
          );
        }
      }
      for (const felt of backendFelter) {
        if (!staticFelter.includes(felt)) {
          differences.push(
            `[${sprak}] Field '${seksjon}.${felt}' in backend but not in static`,
          );
        }
      }

      // Compare field labels (most likely to change)
      for (const felt of staticFelter) {
        if (!backendSeksjon.felter?.[felt]) continue;

        const staticFelt = (staticSeksjon.felter as Record<string, unknown>)[
          felt
        ] as { label?: string };
        const backendFelt = backendSeksjon.felter[felt] as { label?: string };

        if (staticFelt?.label && staticFelt.label !== backendFelt?.label) {
          differences.push(
            `[${sprak}] Field '${seksjon}.${felt}' label mismatch:\n  static="${staticFelt.label}"\n  backend="${backendFelt?.label}"`,
          );
        }
      }
    }

    return {
      isValid: differences.length === 0,
      differences,
    };
  } catch (error) {
    return {
      isValid: false,
      differences: [
        `[${sprak}] Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
      ],
    };
  }
}

/**
 * Fetches the current definition from backend and compares with static.
 * Validates all languages (nb, en).
 */
export async function validateSkjemaDefinisjon(
  skjemaType: string = "A1",
): Promise<ValidationResult> {
  const languages: SupportedLanguage[] = ["nb", "en"];

  // Valider alle språk parallelt
  const results = await Promise.all(
    languages.map((lang) => validateForLanguage(skjemaType, lang)),
  );

  const allDifferences = results.flatMap((r) => r.differences);

  return {
    isValid: allDifferences.length === 0,
    differences: allDifferences,
  };
}

/**
 * Logs validation result to console with appropriate severity.
 * Call this in development to catch drift early.
 */
export async function logSkjemaDefinisjonValidation(): Promise<void> {
  const result = await validateSkjemaDefinisjon();

  // Check if this is a connection/fetch error vs actual validation differences
  const isConnectionError = result.differences.some(
    (d) =>
      d.startsWith("Failed to fetch") ||
      d.startsWith("Validation error: Failed to fetch") ||
      d.includes("NetworkError"),
  );

  if (result.isValid) {
    // eslint-disable-next-line no-console
    console.info("✅ Skjemadefinisjon: statisk fil matcher backend");
  } else if (isConnectionError) {
    // eslint-disable-next-line no-console
    console.warn(
      "⚠️ Skjemadefinisjon: Kunne ikke validere mot backend (ikke tilgjengelig)",
    );
    // eslint-disable-next-line no-console
    console.warn("   Dette er normalt hvis backend ikke kjører lokalt.");
  } else {
    // eslint-disable-next-line no-console
    console.error(
      "❌ Skjemadefinisjon: Statisk fil er IKKE i sync med backend!",
    );
    for (const diff of result.differences) {
      // eslint-disable-next-line no-console
      console.error(`   - ${diff}`);
    }
    // eslint-disable-next-line no-console
    console.error(
      "\n   Kjør 'npm run sync-skjema-definisjon' for å oppdatere.",
    );

    // Vis toast i UI så utvikler ser det
    toast.error(
      "Skjemadefinisjon ut av sync! Kjør: npm run sync-skjema-definisjon",
      { duration: 10000 },
    );
  }
}
