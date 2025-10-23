import type { Locator } from "@playwright/test";

type RadioButtonGroupLocator<T extends string> = {
  [K in T]: Locator;
};

export type RadioButtonGroupJaNeiLocator = RadioButtonGroupLocator<
  "JA" | "NEI"
>;
