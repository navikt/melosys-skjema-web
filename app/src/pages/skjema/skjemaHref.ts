const defaultBasePath =
  import.meta.env.VITE_BASE_PATH ?? import.meta.env.BASE_URL;

export function byggHrefMedBasePath(
  href: string,
  basePath: string = defaultBasePath,
): string {
  const normalisertBasePath = basePath.replace(/\/+$/, "");
  const normalisertHref = href.startsWith("/") ? href : `/${href}`;

  return `${normalisertBasePath}${normalisertHref}`;
}

export function byggSkjemaStegHref(
  route: string,
  skjemaId: string,
  basePath: string = defaultBasePath,
): string {
  return byggHrefMedBasePath(route.replace("$id", skjemaId), basePath);
}
