import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check that there's exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Check that h2 comes after h1
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headingElements).map(h => ({
        level: parseInt(h.tagName[1]),
        text: h.textContent?.trim(),
      }));
    });

    // Verify heading hierarchy
    let previousLevel = 0;
    for (const heading of headings) {
      // Heading levels should not skip (e.g., h1 to h3)
      expect(heading.level).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = heading.level;
    }
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');

    // Check that focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      if (el) {
        const styles = window.getComputedStyle(el);
        return {
          tagName: el.tagName,
          hasOutline: styles.outline !== 'none' && styles.outline !== '',
          hasBorder: styles.borderStyle !== 'none',
          hasBoxShadow: styles.boxShadow !== 'none',
        };
      }
      return null;
    });

    // Verify focus is visible (through outline, border, or box-shadow)
    expect(
      focusedElement?.hasOutline || focusedElement?.hasBorder || focusedElement?.hasBoxShadow
    ).toBeTruthy();
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/');

    // Check all buttons have accessible names
    const buttons = await page.locator('button, a[role="button"]').all();
    for (const button of buttons) {
      const accessibleName = await button.evaluate(el => {
        return (
          el.getAttribute('aria-label') ||
          el.getAttribute('aria-labelledby') ||
          el.textContent?.trim()
        );
      });
      expect(accessibleName).toBeTruthy();
    }

    // Check all links have accessible names
    const links = await page.locator('a:not([role="button"])').all();
    for (const link of links) {
      const accessibleName = await link.evaluate(el => {
        return (
          el.getAttribute('aria-label') ||
          el.getAttribute('aria-labelledby') ||
          el.textContent?.trim()
        );
      });
      expect(accessibleName).toBeTruthy();
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa', 'wcag2aaa'])
      .analyze();

    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );

    expect(colorContrastViolations).toEqual([]);
  });

  test('should have skip navigation link', async ({ page }) => {
    await page.goto('/');

    // Check for skip navigation link
    const skipLink = page.locator('a[href="#main-content"], a:has-text("Skip to content")').first();

    // It should exist
    await expect(skipLink).toBeAttached();

    // It should become visible on focus
    await page.keyboard.press('Tab');
    const isVisible = await skipLink.isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('each page should have proper landmarks', async ({ page }) => {
    const pages = ['/', '/experience', '/projects', '/contact'];

    for (const path of pages) {
      await page.goto(path);

      // Check for main landmark
      const mainLandmark = await page.locator('main, [role="main"]').count();
      expect(mainLandmark).toBeGreaterThan(0);

      // Check for navigation landmark
      const navLandmark = await page.locator('nav, [role="navigation"]').count();
      expect(navLandmark).toBeGreaterThan(0);
    }
  });
});
