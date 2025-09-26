import { test, expect } from '@playwright/test';

test('has correct dark theme background', async ({ page }) => {
  await page.goto('/');

  const body = page.locator('body');

  // Check that body has the dark background color
  // The midnight ocean theme uses oklch(0.16 0.02 230) which converts to approximately rgb(32, 36, 54)
  const backgroundColor = await body.evaluate(el => {
    return window.getComputedStyle(el).backgroundColor;
  });

  // Check that it's a dark color (low RGB values)
  const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    expect(r).toBeLessThan(60);
    expect(g).toBeLessThan(60);
    expect(b).toBeLessThan(70);
  }
});
