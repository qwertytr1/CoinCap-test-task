import { test, expect } from '@playwright/test';

test.describe('Portfolio modal', () => {
  test('should calculate total portfolio value correctly', async ({ page }) => {

    await page.goto('http://localhost:3000');

    await page.click('text=Добавить монету');


    await page.waitForSelector('.ant-modal-content');


    const coins = await page.$$('.ant-radio-input:visible');

    if (coins.length > 0) {

      for (let i = 0; i < 3; i++) {
        await coins[i].click();
        await page.fill('input[type="number"]', '1');
        await page.click('text=Добавить');
        await page.waitForSelector('.ant-table-row');
      }


      await page.waitForSelector('.ant-modal-content', { state: 'hidden' });

      const totalPortfolioValueText = await page.textContent('.ant-modal-footer .ant-typography strong');


      const totalPortfolioValue = totalPortfolioValueText ? parseFloat(totalPortfolioValueText.substring(totalPortfolioValueText.indexOf('$') + 1)) : 0;

      const expectedTotalPortfolioValue = 3 * 10;


      expect(totalPortfolioValue).toEqual(expectedTotalPortfolioValue);
    }
  });
});
