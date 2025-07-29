import { test, expect } from '@playwright/test';

test('Debug sidebar navigation structure', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  // Take a screenshot to see what's rendered
  await page.screenshot({ path: 'debug-sidebar.png', fullPage: true });

  // Log all navigation elements
  const navElements = page.locator('nav');
  const navCount = await navElements.count();
  console.log(`Found ${navCount} nav elements`);

  // Log all buttons
  const buttons = page.locator('button');
  const buttonCount = await buttons.count();
  console.log(`Found ${buttonCount} buttons`);

  for (let i = 0; i < buttonCount; i++) {
    const button = buttons.nth(i);
    const text = await button.textContent();
    console.log(`Button ${i}: "${text}"`);
  }

  // Look for EXPERIENCE specifically
  const experienceButtons = page.getByText('EXPERIENCE');
  const expCount = await experienceButtons.count();
  console.log(`Found ${expCount} elements with EXPERIENCE text`);

  // Check sidebar visibility
  const sidebar = page.locator('aside');
  const sidebarVisible = await sidebar.isVisible();
  console.log(`Sidebar visible: ${sidebarVisible}`);

  // Check if we're on mobile view
  const viewportSize = page.viewportSize();
  console.log(`Viewport size: ${viewportSize?.width}x${viewportSize?.height}`);
});
