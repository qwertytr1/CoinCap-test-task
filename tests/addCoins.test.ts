import { test, expect } from '@playwright/test';

test.describe('Portfolio management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should be able to add and delete a coin from the portfolio', async ({ page }) => {
    // Click the "Добавить монету" button
    await page.click('text=Добавить монету');

    // Wait for the modal to be visible
    await page.waitForSelector('.ant-modal-content');

    // Find all visible radio inputs
    const radioInputs = await page.$$('.ant-radio-input:visible');

    // Check if at least one visible radio input is found
    if (radioInputs.length > 0) {
      // Click the first visible radio input
      await radioInputs[0].click();

      // Add quantity
      await page.fill('input[type="number"]', '1');

      // Click the "Добавить" button
      await page.click('text=Добавить');

      // Wait for the modal to close
      await page.waitForSelector('.ant-modal-content', { state: 'hidden' });

      // Check if the coin has been added to the portfolio
      const portfolioRowsAfterAdd = await page.$$('.ant-table-row');
      expect(portfolioRowsAfterAdd.length).toBeGreaterThan(0);

      // Click the "Удалить" button of the first coin in the portfolio
      await page.waitForSelector('.ant-table-row .ant-btn-link');
      await page.click('.ant-table-row .ant-btn-link');

      // Wait for the confirmation modal to be visible
      await page.waitForSelector('.ant-modal-content');

      // Click the "OK" button in the confirmation modal
      await page.click('text=OK');

      // Wait for the confirmation modal to close
      await page.waitForSelector('.ant-modal-content', { state: 'hidden' });

      // Check if the coin has been removed from the portfolio
      const portfolioRowsAfterDelete = await page.$$('.ant-table-row');
      expect(portfolioRowsAfterDelete.length).toEqual(0);
    }
  });
});
