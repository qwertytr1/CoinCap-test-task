import { test, expect } from '@playwright/test';

test.describe('Portfolio management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should be able to open and close the add coins modal', async ({ page }) => {

    await page.click('text=Добавить монету');


    await page.waitForSelector('.ant-modal-content');


    await expect(page.locator('.ant-modal-title')).toHaveText('Добавление монет');


    await page.click('text=Отмена');


    await page.waitForSelector('.ant-modal-content', { state: 'hidden' });


    const modal = await page.$('.ant-modal-content');
    expect(modal).toBeNull();
  });
});
