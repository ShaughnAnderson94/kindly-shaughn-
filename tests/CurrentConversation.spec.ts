import { test, expect } from '@playwright/test';

test.describe('CurrentConversation', () => {
  test('displays item donor username', async ({ page }) => {
    await page.goto('/conversations');
    await page.getByTestId('item-donor').click();
    expect(await page.waitForSelector('p[data-testid="item-donor"]'));
  });
});