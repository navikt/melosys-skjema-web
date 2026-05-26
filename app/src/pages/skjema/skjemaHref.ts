export function byggHrefMedBasePath(
  href: string,
  basePath: string = import.meta.env.BASE_URL,
): string {
  const normalisertBasePath = basePath.replace(/\/$/, "");
  const normalisertHref = href.startsWith("/") ? href : `/${href}`;

  return `${normalisertBasePath}${normalisertHref}`;
}

export function byggSkjemaStegHref(
  route: string,
  skjemaId: string,
  basePath: string = import.meta.env.BASE_URL,
): string {
  return byggHrefMedBasePath(route.replace("$id", skjemaId), basePath);
}
