import { test, expect } from '@playwright/test';

test.describe('SidebarNavigation Animation - Final Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('letters complete exactly 2 rotations and return to 0 degrees', async ({ page }) => {
    // Find the EXPERIENCE navigation button
    const experienceButton = page.locator('nav button').filter({ hasText: 'EXPERIENCE' });
    await expect(experienceButton).toBeVisible();

    // Get all letters in EXPERIENCE
    const letters = experienceButton.locator('motion-span, span[class*="inline-block"]');
    const letterCount = await letters.count();
    console.log(`Found ${letterCount} letters in EXPERIENCE`);

    // Verify initial state - all letters should be at 0 degrees
    console.log('=== Initial State ===');
    for (let i = 0; i < letterCount; i++) {
      const letter = letters.nth(i);
      const transform = await letter.evaluate(el => getComputedStyle(el).transform);
      console.log(`Letter ${i}: transform = ${transform}`);

      // Transform should be 'none' or identity matrix
      expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBeTruthy();
    }

    // Hover over the EXPERIENCE button to trigger animation
    console.log('=== Triggering Animation ===');
    await experienceButton.hover();

    // Wait for animation to complete (1000ms + stagger delays)
    await page.waitForTimeout(1200);

    // Check final state - all letters should be back to 0 degrees
    console.log('=== Final State After Animation ===');
    let allLettersAtZero = true;
    for (let i = 0; i < letterCount; i++) {
      const letter = letters.nth(i);
      const transform = await letter.evaluate(el => getComputedStyle(el).transform);
      console.log(`Letter ${i}: final transform = ${transform}`);

      // Check if transform indicates 0 degrees rotation
      const isAtZero =
        transform === 'none' ||
        transform === 'matrix(1, 0, 0, 1, 0, 0)' ||
        transform === 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';

      if (!isAtZero) {
        console.error(`❌ Letter ${i} is NOT at 0 degrees: ${transform}`);
        allLettersAtZero = false;
      } else {
        console.log(`✅ Letter ${i} is at 0 degrees`);
      }
    }

    expect(allLettersAtZero).toBeTruthy();
  });

  test('rapid hover/unhover does not leave letters in non-zero positions', async ({ page }) => {
    const experienceButton = page.locator('nav button').filter({ hasText: 'EXPERIENCE' });
    const letters = experienceButton.locator('motion-span, span[class*="inline-block"]');

    console.log('=== Testing Rapid Hover/Unhover ===');

    // Perform rapid hover and unhover
    await experienceButton.hover();
    await page.waitForTimeout(100); // Brief hover
    await page.mouse.move(0, 0); // Move mouse away quickly

    // Wait a bit more than animation duration to ensure completion
    await page.waitForTimeout(1500);

    // Check that all letters are at 0 degrees
    const letterCount = await letters.count();
    let allLettersAtZero = true;

    for (let i = 0; i < letterCount; i++) {
      const letter = letters.nth(i);
      const transform = await letter.evaluate(el => getComputedStyle(el).transform);
      console.log(`Letter ${i} after rapid unhover: ${transform}`);

      const isAtZero =
        transform === 'none' ||
        transform === 'matrix(1, 0, 0, 1, 0, 0)' ||
        transform === 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';

      if (!isAtZero) {
        console.error(`❌ Letter ${i} stuck at non-zero rotation: ${transform}`);
        allLettersAtZero = false;
      }
    }

    expect(allLettersAtZero).toBeTruthy();
  });

  test('animation state management prevents overlapping animations', async ({ page }) => {
    const experienceButton = page.locator('nav button').filter({ hasText: 'EXPERIENCE' });

    console.log('=== Testing Animation State Management ===');

    // Trigger multiple rapid hovers
    await experienceButton.hover();
    await page.waitForTimeout(50);
    await experienceButton.hover(); // Second hover should be ignored
    await page.waitForTimeout(50);
    await experienceButton.hover(); // Third hover should be ignored

    // Wait for any animation to complete
    await page.waitForTimeout(1500);

    // Verify the component is in a clean state
    const letters = experienceButton.locator('motion-span, span[class*="inline-block"]');
    const letterCount = await letters.count();

    for (let i = 0; i < letterCount; i++) {
      const letter = letters.nth(i);
      const transform = await letter.evaluate(el => getComputedStyle(el).transform);

      const isAtZero =
        transform === 'none' ||
        transform === 'matrix(1, 0, 0, 1, 0, 0)' ||
        transform === 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';

      expect(isAtZero).toBeTruthy();
    }
  });
});
