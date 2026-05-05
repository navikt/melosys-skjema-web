/**
 * Formaterer en rå inputverdi som et norsk kronebeløp for visning.
 * - Erstatter punktum med komma
 * - Avrunder til 2 desimaler
 * - Legger til tusenskilletegn (mellomrom)
 * Eksempler: "1234.456" → "1 234,46", "1000000" → "1 000 000,00"
 */
export function formaterBelopForVisning(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  // Normaliser: erstatt komma med punktum for parsing
  const normalized = trimmed.replaceAll(/\s/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed) || parsed < 0) return value;

  // Avrund til 2 desimaler
  const rounded = parsed.toFixed(2);
  const parts = rounded.split(".");
  const helTall = parts[0] ?? "0";
  const desimaler = parts[1] ?? "00";

  // Legg til tusenskilletegn
  const medTusenSkille = helTall.replaceAll(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `${medTusenSkille},${desimaler}`;
}

/**
 * Fjerner formatering (mellomrom) fra et visningsformatert beløp,
 * beholder komma og siffer — formatet melosys-skjema-api forventer: "1234,46"
 */
export function stripBelopFormatering(value: string): string {
  return value.replaceAll(/\s/g, "");
}
