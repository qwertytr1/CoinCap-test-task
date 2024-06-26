import { test, expect } from '@playwright/test';

test.describe('Portfolio management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should be able to add and delete a coin from the portfolio', async ({ page }) => {

    await page.click('text=Добавить монету');


    await page.waitForSelector('.ant-modal-content');


    const radioInputs = await page.$$('.ant-radio-input:visible');


    if (radioInputs.length > 0) {

      await radioInputs[0].click();


      await page.fill('input[type="number"]', '1');


      await page.click('text=Добавить');


      await page.waitForSelector('.ant-modal-content', { state: 'hidden' });


      const portfolioRowsAfterAdd = await page.$$('.ant-table-row');
      expect(portfolioRowsAfterAdd.length).toBeGreaterThan(0);

      await page.waitForSelector('.ant-table-row .ant-btn-link');
      await page.click('.ant-table-row .ant-btn-link');


      await page.waitForSelector('.ant-modal-content');


      await page.click('text=OK');


      await page.waitForSelector('.ant-modal-content', { state: 'hidden' });


      const portfolioRowsAfterDelete = await page.$$('.ant-table-row');
      expect(portfolioRowsAfterDelete.length).toEqual(0);
    }
  });
});
