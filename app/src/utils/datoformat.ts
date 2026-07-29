const LOCALE_MAP: Record<string, string> = {
  nb: "nb-NO",
  en: "en-GB",
};

/**
 * Formaterer en ren dato-streng (YYYY-MM-DD, uten tidssone) uten å gå via
 * Date-parsing av strengen — `new Date("2026-02-01")` tolkes som UTC-midnatt
 * og gir én dag feil for brukere vest for UTC.
 */
export function formatDato(isoDato: string, sprak: string): string {
  const locale = LOCALE_MAP[sprak] ?? "nb-NO";
  const [aar = 0, maaned = 1, dag = 1] = isoDato.split("-").map(Number);
  return new Date(aar, maaned - 1, dag).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Parser en ren dato-streng (YYYY-MM-DD) til lokal midnatt — `new Date("2026-02-01")`
 * tolkes som UTC-midnatt og gir én dag feil for brukere vest for UTC.
 */
export function parseIsoDato(isoDato: string): Date {
  const [aar = 0, maaned = 1, dag = 1] = isoDato.split("-").map(Number);
  return new Date(aar, maaned - 1, dag);
}

export function formatDatotid(dato: string, sprak: string): string {
  const locale = LOCALE_MAP[sprak] ?? "nb-NO";
  const d = new Date(dato);
  return d.toLocaleString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
