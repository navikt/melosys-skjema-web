import { test as base } from "@playwright/test";

import { STATSANSATT_FLYT } from "~/featuretoggle/toggleNavn";

import { mockApiCatchAll, mockFeatureToggles } from "./api-mocks";

export const test = base.extend({
  page: async ({ page }, usePage) => {
    await mockApiCatchAll(page);
    await mockFeatureToggles(page, { [STATSANSATT_FLYT]: true });
    // eslint-disable-next-line @eslint-react/rules-of-hooks
    await usePage(page);
  },
});

export { expect } from "@playwright/test";
