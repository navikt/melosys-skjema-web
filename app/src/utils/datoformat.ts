const LOCALE_MAP: Record<string, string> = {
  nb: "nb-NO",
  en: "en-GB",
};

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
