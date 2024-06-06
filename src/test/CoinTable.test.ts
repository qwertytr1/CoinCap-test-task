import { chromium, Browser, Page } from 'playwright';

describe('CoinTable functionality', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Search functionality works correctly', async () => {
    await page.fill('input[placeholder="Search coin"]', 'Bitcoin');
    await page.waitForSelector('div[data-testid="coin-table-content"]');
    const bitcoinRow = await page.$('div[data-testid="coin-row-bitcoin"]');
    expect(bitcoinRow).not.toBeNull();
  });

  test('Adding coin to portfolio works correctly', async () => {
    await page.click('button[data-testid="add-to-portfolio-bitcoin"]');
    await page.waitForSelector('div[data-testid="portfolio-modal"]');
    const bitcoinPortfolioRow = await page.$('div[data-testid="portfolio-row-bitcoin"]');
    expect(bitcoinPortfolioRow).not.toBeNull();
  });

  test('Deleting coin from portfolio works correctly', async () => {
    await page.click('button[data-testid="delete-coin-bitcoin"]');
    await page.waitForSelector('div[data-testid="delete-coin-confirmation"]');
    await page.click('button[data-testid="confirm-delete-coin"]');
    const bitcoinPortfolioRow = await page.$('div[data-testid="portfolio-row-bitcoin"]');
    expect(bitcoinPortfolioRow).toBeNull();
  });

  test('Opening and closing the Add Coins modal works correctly', async () => {
    await page.click('button[data-testid="add-coins-button"]');
    await page.waitForSelector('div[data-testid="add-coins-modal"]');
    await page.click('button[data-testid="close-add-coins-modal"]');
    const addCoinsModal = await page.$('div[data-testid="add-coins-modal"]');
    expect(addCoinsModal).toBeNull();
  });
});
