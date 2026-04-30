import { test as base } from "@playwright/test";

import { mockApiCatchAll } from "./api-mocks";

export const test = base.extend({
  page: async ({ page }, usePage) => {
    await mockApiCatchAll(page);
    // eslint-disable-next-line @eslint-react/rules-of-hooks
    await usePage(page);
  },
});

export { expect } from "@playwright/test";
