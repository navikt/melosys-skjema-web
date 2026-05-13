/** Maks lengde for et formatert beløpsfelt (f.eks. "999 999 999 999" = 16 tegn) */
export const BELOP_MAX_LENGTH = 16;

const belopFormatter = new Intl.NumberFormat("nb-NO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formaterer en rå inputverdi som et norsk kronebeløp (hele kroner) for visning.
 * - Fjerner eventuelle desimaler (trunkerer, avrunder ikke)
 * - Legger til tusenskilletegn (non-breaking space via Intl.NumberFormat)
 * Eksempler: "1234" → "1 234", "1000000" → "1 000 000", "12.5" → "12"
 */
export function formaterBelopForVisning(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const normalized = trimmed.replaceAll(/\s/g, "").replace(/[.,]\d*$/, "");
  if (!/^\d+$/.test(normalized)) return value;
  const parsed = Number.parseInt(normalized, 10);

  return belopFormatter.format(parsed);
}

/**
 * Fjerner formatering (mellomrom) fra et visningsformatert beløp,
 * beholder kun siffer — formatet melosys-skjema-api forventer: "1234"
 */
export function stripBelopFormatering(value: string): string {
  return value.replaceAll(/\s/g, "");
}

// [AGENT] Normaliserer beløp til backend-formatet ^[1-9]\d*$ — fjerner whitespace, desimaler og ledende nuller
/**
 * Normaliserer et beløp til formatet backend forventer (regex: ^[1-9]\d*$).
 * Fjerner whitespace, desimaldel og ledende nuller.
 * Eksempler: "01" → "1", "01.50" → "1", "100,50" → "100", "1 000" → "1000"
 */
export function normaliserBelopForApi(value: string): string {
  return value
    .trim()
    .replaceAll(/\s/g, "")
    .replace(/[.,]\d*$/, "")
    .replace(/^0+/, "");
}
