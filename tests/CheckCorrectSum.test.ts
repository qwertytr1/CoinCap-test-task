import { test, expect } from '@playwright/test';

test.describe('Portfolio modal', () => {
  test('should calculate total portfolio value correctly', async ({ page }) => {
    // Open the page
    await page.goto('http://localhost:3000');

    // Click the "Добавить монету" button
    await page.click('text=Добавить монету');

    // Wait for the modal to be visible
    await page.waitForSelector('.ant-modal-content');

    // Find all visible radio inputs
    const coins = await page.$$('.ant-radio-input:visible');

    // Check if there are visible radio inputs
    if (coins.length > 0) {
      // Add some coins with specific quantities
      for (let i = 0; i < 3; i++) {
        await coins[i].click();
        await page.fill('input[type="number"]', '1');
        await page.click('text=Добавить');
        await page.waitForSelector('.ant-table-row');
      }

      // Wait for the modal to close
      await page.waitForSelector('.ant-modal-content', { state: 'hidden' });

      // Get the total portfolio value from the footer of the PortfolioModal
      const totalPortfolioValueText = await page.textContent('.ant-modal-footer .ant-typography strong');

      // Extract the total portfolio value from the text
      const totalPortfolioValue = totalPortfolioValueText ? parseFloat(totalPortfolioValueText.substring(totalPortfolioValueText.indexOf('$') + 1)) : 0;

      // Calculate the expected total portfolio value based on the added coins' prices
      const expectedTotalPortfolioValue = 3 * 10; // Assuming each coin costs $10

      // Verify if the total portfolio value is calculated correctly
      expect(totalPortfolioValue).toEqual(expectedTotalPortfolioValue);
    }
  });
});
