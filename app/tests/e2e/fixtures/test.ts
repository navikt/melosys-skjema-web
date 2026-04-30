import { test as base, expect } from "@playwright/test";

import { mockApiCatchAll } from "./api-mocks";

export const test = base.extend({
  page: async ({ page }, use) => {
    await mockApiCatchAll(page);
    await use(page);
  },
});

export { expect };
