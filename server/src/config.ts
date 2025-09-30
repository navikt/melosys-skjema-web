import { requireEnvironment } from "./utils.js";

const app = {
  env: requireEnvironment("ENV") as "dev" | "prod",
  host: requireEnvironment("EXPRESS_HOST"),
  port: Number(requireEnvironment("EXPRESS_PORT")),
};

export default {
  app,
};
