import { type Page } from "@playwright/test";

export class RollevelgerPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/rollevelger");
  }

  async selectOrganization(organizationName: string) {
    await this.page.getByText(organizationName).click();
  }
}
