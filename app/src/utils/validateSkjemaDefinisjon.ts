/**
 * Runtime validation to check that static skjemadefinisjon matches backend.
 *
 * Call this on app startup (in development) to detect drift between
 * the static TypeScript file and the backend definition.
 */

import { SKJEMA_DEFINISJON_A1 } from "~/constants/skjemaDefinisjonA1";

const API_PROXY_URL = "/api";

interface ValidationResult {
  isValid: boolean;
  differences: string[];
}

/**
 * Fetches the current definition from backend and compares with static.
 * Returns validation result with any differences found.
 */
export async function validateSkjemaDefinisjon(
  skjemaType: string = "A1",
  sprak: string = "nb",
): Promise<ValidationResult> {
  try {
    const response = await fetch(
      `${API_PROXY_URL}/skjema/definisjon/${skjemaType}?sprak=${sprak}`,
    );

    if (!response.ok) {
      return {
        isValid: false,
        differences: [`Failed to fetch backend definition: ${response.status}`],
      };
    }

    const backendDefinisjon = await response.json();
    const differences: string[] = [];

    // Compare version
    if (backendDefinisjon.versjon !== SKJEMA_DEFINISJON_A1.versjon) {
      differences.push(
        `Version mismatch: static=${SKJEMA_DEFINISJON_A1.versjon}, backend=${backendDefinisjon.versjon}`,
      );
    }

    // Compare sections
    const staticSeksjoner = Object.keys(SKJEMA_DEFINISJON_A1.seksjoner);
    const backendSeksjoner = Object.keys(backendDefinisjon.seksjoner || {});

    // Check for missing/extra sections
    for (const seksjon of staticSeksjoner) {
      if (!backendSeksjoner.includes(seksjon)) {
        differences.push(`Section '${seksjon}' in static but not in backend`);
      }
    }
    for (const seksjon of backendSeksjoner) {
      if (!staticSeksjoner.includes(seksjon)) {
        differences.push(`Section '${seksjon}' in backend but not in static`);
      }
    }

    // Deep compare each section
    for (const seksjon of staticSeksjoner) {
      if (!backendDefinisjon.seksjoner?.[seksjon]) continue;

      const staticSeksjon =
        SKJEMA_DEFINISJON_A1.seksjoner[
          seksjon as keyof typeof SKJEMA_DEFINISJON_A1.seksjoner
        ];
      const backendSeksjon = backendDefinisjon.seksjoner[seksjon];

      // Compare title
      if (staticSeksjon.tittel !== backendSeksjon.tittel) {
        differences.push(
          `Section '${seksjon}' tittel mismatch: static="${staticSeksjon.tittel}", backend="${backendSeksjon.tittel}"`,
        );
      }

      // Compare fields
      const staticFelter = Object.keys(staticSeksjon.felter);
      const backendFelter = Object.keys(backendSeksjon.felter || {});

      for (const felt of staticFelter) {
        if (!backendFelter.includes(felt)) {
          differences.push(
            `Field '${seksjon}.${felt}' in static but not in backend`,
          );
        }
      }
      for (const felt of backendFelter) {
        if (!staticFelter.includes(felt)) {
          differences.push(
            `Field '${seksjon}.${felt}' in backend but not in static`,
          );
        }
      }

      // Compare field labels (most likely to change)
      for (const felt of staticFelter) {
        if (!backendSeksjon.felter?.[felt]) continue;

        // Use any cast for runtime comparison (types are complex nested objects)
        const staticFelt = (staticSeksjon.felter as Record<string, unknown>)[
          felt
        ] as { label?: string };
        const backendFelt = backendSeksjon.felter[felt] as { label?: string };

        if (staticFelt?.label && staticFelt.label !== backendFelt?.label) {
          differences.push(
            `Field '${seksjon}.${felt}' label mismatch:\n  static="${staticFelt.label}"\n  backend="${backendFelt?.label}"`,
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
        `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
      ],
    };
  }
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
  }
}
