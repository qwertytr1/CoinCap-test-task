import { test, expect } from '@playwright/test';

test.describe('CoinTable Search and Sort Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display correct coins based on search input', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();

    const searchInput = page.locator('input[placeholder="Search coin"]');
    await searchInput.fill('bitcoin');
    await page.waitForSelector('table tbody tr', { timeout: 2000 });

    const filteredCoins = await page.locator('table tbody tr').all();
    expect(filteredCoins.length).toEqual(expect.any(Number));

    for (const coin of filteredCoins) {
      const coinName = await coin.locator('td').nth(1).textContent();
      expect(coinName?.toLowerCase()).toContain('bitcoin');
    }

    await searchInput.fill('');
    await page.waitForSelector('table tbody tr', { timeout: 2000 });

    const allCoins = await page.locator('table tbody tr').all();
    expect(allCoins.length).toEqual(expect.any(Number));
    expect(allCoins.length).toBeGreaterThan(filteredCoins.length);
  });

  test('should sort coins by price in ascending and descending order', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();

    const priceHeader = page.locator('th').filter({ hasText: 'Price in USD' });

    const headerCount = await priceHeader.count();
    if (headerCount !== 0) {
      await priceHeader.click();
      await page.waitForSelector('table tbody tr', { timeout: 2000 });

      const pricesAsc = await page.evaluate(() => {
        const priceElements = Array.from(document.querySelectorAll('table tbody tr td:nth-child(4)'));
        return priceElements.map((el) => parseFloat(el.textContent?.replace('$', '').replace(',', '') || '0'));
      });

      for (let i = 0; i < pricesAsc.length - 1; i++) {
        expect(pricesAsc[i]).toBeLessThanOrEqual(pricesAsc[i + 1]);
      }

      await priceHeader.click();
      await page.waitForSelector('table tbody tr', { timeout: 5000 });

      const pricesDesc = await page.evaluate(() => {
        const priceElements = Array.from(document.querySelectorAll('table tbody tr td:nth-child(4)'));
        return priceElements.map((el) => parseFloat(el.textContent?.replace('$', '').replace(',', '') || '0'));
      });

      for (let i = 0; i < pricesDesc.length - 1; i++) {
        expect(pricesDesc[i]).toBeGreaterThanOrEqual(pricesDesc[i + 1]);
      }
    }
  });

});
