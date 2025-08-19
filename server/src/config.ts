function requireEnvironment(environmentName: string) {
  const environmentContent = process.env[environmentName];
  if (!environmentContent) {
    throw new Error(
      "Missing environment variable with name: " + environmentName,
    );
  }
  return environmentContent;
}

const proxy = {
  apiScope: requireEnvironment("API_SCOPE"),
  apiUrl: requireEnvironment("API_URL"),
};

const app = {
  env: requireEnvironment("ENV") as "dev" | "prod",
  nestedPath: requireEnvironment("NESTED_PATH"),
  host: requireEnvironment("EXPRESS_HOST"),
  port: Number(requireEnvironment("EXPRESS_PORT")),
};

export default { proxy, app };
