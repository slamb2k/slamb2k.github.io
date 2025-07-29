import { test, expect } from '@playwright/test';

test('Debug navigation buttons in sidebar', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  // Check the sidebar structure more carefully
  const sidebar = page.locator('aside');
  await expect(sidebar).toBeVisible();

  // Look for navigation within the sidebar
  const sidebarNav = sidebar.locator('nav');
  await expect(sidebarNav).toBeVisible();

  // Look for motion.button elements specifically
  const motionButtons = sidebarNav.locator('button');
  const buttonCount = await motionButtons.count();
  console.log(`Found ${buttonCount} buttons in sidebar nav`);

  for (let i = 0; i < buttonCount; i++) {
    const button = motionButtons.nth(i);
    const text = await button.textContent();
    const classes = await button.getAttribute('class');
    console.log(`Navigation Button ${i}: "${text}" (classes: ${classes})`);
  }

  // Look for EXPERIENCE button specifically
  const experienceButton = sidebarNav.locator('button', { hasText: 'EXPERIENCE' });
  const isVisible = await experienceButton.isVisible();
  console.log(`EXPERIENCE button visible: ${isVisible}`);

  if (isVisible) {
    // Get the letters within EXPERIENCE
    const letters = experienceButton.locator('span');
    const letterCount = await letters.count();
    console.log(`Found ${letterCount} letter spans in EXPERIENCE`);

    for (let i = 0; i < letterCount; i++) {
      const letter = letters.nth(i);
      const text = await letter.textContent();
      const transform = await letter.evaluate(el => getComputedStyle(el).transform);
      console.log(`Letter ${i}: "${text}" transform: ${transform}`);
    }
  }
});
