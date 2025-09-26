import { test, expect } from '@playwright/test';

test('has correct dark theme background', async ({ page }) => {
  await page.goto('/');

  const body = page.locator('body');

  // Check that body has the dark background color
  // The midnight theme uses rgb(32, 36, 48) or the light theme rgb(55, 55, 55) if dark class not applied
  const backgroundColor = await body.evaluate(el => {
    return window.getComputedStyle(el).backgroundColor;
  });

  // Check that it's a dark color (low RGB values)
  const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    // Allow for both dark theme and light theme dark colors
    expect(r).toBeLessThan(60);
    expect(g).toBeLessThan(60);
    expect(b).toBeLessThan(60);
  }
});
