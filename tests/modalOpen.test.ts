import { test, expect } from '@playwright/test';

test.describe('Portfolio management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should be able to open and close the add coins modal', async ({ page }) => {
    // Click the "Добавить монету" button
    await page.click('text=Добавить монету');

    // Wait for the modal to be visible
    await page.waitForSelector('.ant-modal-content');

    // Check if the modal title is "Добавление монет"
    await expect(page.locator('.ant-modal-title')).toHaveText('Добавление монет');

    // Click the "Отмена" button to close the modal
    await page.click('text=Отмена');

    // Wait for the modal to close
    await page.waitForSelector('.ant-modal-content', { state: 'hidden' });

    // Check if the modal is closed
    const modal = await page.$('.ant-modal-content');
    expect(modal).toBeNull();
  });
});
