const clusterName = process.env.NAIS_CLUSTER_NAME ?? "";
const env = clusterName.startsWith("prod") ? "prod" : "dev";

// NAIS-ingressen stripper ikke path-prefiksen, så Express må selv montere
// app-routene under BASE_PATH. Trailing slash fjernes så mount-pathen blir
// "/foo" (Express-konvensjon), ikke "/foo/".
const basePath = (process.env.BASE_PATH ?? "").replace(/\/+$/, "");

const app = {
  env: env as "dev" | "prod",
  host: process.env.EXPRESS_HOST ?? "::",
  port: Number(process.env.EXPRESS_PORT ?? "8080"),
  basePath,
};

export default {
  app,
};
