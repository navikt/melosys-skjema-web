const clusterName = process.env.NAIS_CLUSTER_NAME ?? "";
const env = clusterName.startsWith("prod") ? "prod" : "dev";

const app = {
  env: env as "dev" | "prod",
  host: process.env.EXPRESS_HOST ?? "::",
  port: Number(process.env.EXPRESS_PORT ?? "8080"),
};

export default {
  app,
};
