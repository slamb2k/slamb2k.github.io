import { test, expect } from '@playwright/test';

test('has dark green background', async ({ page }) => {
  await page.goto('/');

  const body = page.locator('body');

  await expect(body).toHaveCSS('background-color', 'rgb(47, 79, 79)');
});
