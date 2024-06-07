import { test, expect } from '@playwright/test';

test.describe('CoinTable Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display correct coins based on search input', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
    const searchInput = page.locator('input[placeholder="Search coin"]');
    await searchInput.fill('bitcoin');
    await page.waitForTimeout(2000);
    const filteredCoins = await page.locator('table').locator('tbody').locator('tr').all();
    console.log('Filtered Coins:', filteredCoins.length);
    for (const coin of filteredCoins) {
      const coinName = await coin.locator('td').nth(1).textContent();
      console.log('Coin Name:', coinName);
      expect(coinName?.toLowerCase()).toContain('bitcoin');
    }
    await searchInput.fill('');
    await page.waitForTimeout(2000);
    const allCoins = await page.locator('table').locator('tbody').locator('tr').all();
    console.log('All Coins:', allCoins.length);
    expect(allCoins.length).toBeGreaterThan(filteredCoins.length);
  });
});
