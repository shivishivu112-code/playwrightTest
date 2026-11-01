import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  //goto method is common to all pages, keep in BasePage
  //lets say if login page has goto then it belongs to loginPage only
  async goto(path: string) {
    await this.page.goto(path);
  }
}