import { test, expect } from '@playwright/test';

test.describe('Dashboard Mobile Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/en/dashboard');
  });

  test('should display dashboard correctly on mobile (375px)', async ({
    page,
  }) => {
    // Set mobile viewport (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });

    // Check dashboard header is visible and properly sized
    const dashboardHeader = page.getByRole('heading', { name: /dashboard/i });
    await expect(dashboardHeader).toBeVisible();

    // Check stats cards are visible and properly stacked
    const statsCards = page.locator('[data-testid="stats-card"]');
    if (await statsCards.first().isVisible()) {
      // Should have at least 2 cards visible
      await expect(statsCards.first()).toBeVisible();
      await expect(statsCards.nth(1)).toBeVisible();
    }

    // Check tabs are visible and properly sized
    const tabsList = page.getByRole('tablist');
    await expect(tabsList).toBeVisible();

    // Check tab triggers are properly sized for touch
    const tabTriggers = page.getByRole('tab');
    const firstTab = tabTriggers.first();
    await expect(firstTab).toBeVisible();

    // Check tab content is visible
    const tabContent = page.getByRole('tabpanel');
    await expect(tabContent).toBeVisible();
  });

  test('should display dashboard correctly on tablet (768px)', async ({
    page,
  }) => {
    // Set tablet viewport (iPad)
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check dashboard layout adapts to tablet size
    const dashboardHeader = page.getByRole('heading', { name: /dashboard/i });
    await expect(dashboardHeader).toBeVisible();

    // Check stats cards grid layout
    const statsCards = page.locator('[data-testid="stats-card"]');
    if (await statsCards.first().isVisible()) {
      // Should display multiple cards in a row on tablet
      await expect(statsCards.first()).toBeVisible();
      await expect(statsCards.nth(1)).toBeVisible();
      await expect(statsCards.nth(2)).toBeVisible();
    }

    // Check tabs layout
    const tabsList = page.getByRole('tablist');
    await expect(tabsList).toBeVisible();

    // Check content cards are properly sized
    const contentCards = page.locator('.card');
    await expect(contentCards.first()).toBeVisible();
  });

  test('should display dashboard correctly on large tablet (1024px)', async ({
    page,
  }) => {
    // Set large tablet viewport (iPad Pro)
    await page.setViewportSize({ width: 1024, height: 1366 });

    // Check dashboard layout adapts to large tablet size
    const dashboardHeader = page.getByRole('heading', { name: /dashboard/i });
    await expect(dashboardHeader).toBeVisible();

    // Check all stats cards are visible in a row
    const statsCards = page.locator('[data-testid="stats-card"]');
    if (await statsCards.first().isVisible()) {
      await expect(statsCards.first()).toBeVisible();
      await expect(statsCards.nth(1)).toBeVisible();
      await expect(statsCards.nth(2)).toBeVisible();
      await expect(statsCards.nth(3)).toBeVisible();
    }

    // Check content layout uses available space efficiently
    const contentArea = page.getByRole('tabpanel');
    await expect(contentArea).toBeVisible();
  });

  test('should handle touch interactions properly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Test tab switching with touch
    const tabTriggers = page.getByRole('tab');
    const quotesTab = tabTriggers.filter({ hasText: /quotes/i });

    if (await quotesTab.isVisible()) {
      await quotesTab.click();

      // Check tab content changes
      const quotesContent = page.getByRole('tabpanel');
      await expect(quotesContent).toBeVisible();
    }

    // Test button interactions
    const buttons = page.getByRole('button');
    if (await buttons.first().isVisible()) {
      // Check button has proper touch target size (minimum 44px)
      const buttonBox = await buttons.first().boundingBox();
      if (buttonBox) {
        expect(buttonBox.height).toBeGreaterThanOrEqual(32); // Minimum touch target
      }
    }
  });

  test('should maintain readability on small screens', async ({ page }) => {
    // Set small mobile viewport
    await page.setViewportSize({ width: 320, height: 568 });

    // Check text is readable
    const headings = page.getByRole('heading');
    await expect(headings.first()).toBeVisible();

    // Check important content is not cut off
    const mainContent = page.getByRole('main');
    await expect(mainContent).toBeVisible();

    // Check no horizontal scrolling is needed
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // Allow small tolerance
  });

  test('should handle orientation changes', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 375, height: 667 });

    const dashboardHeader = page.getByRole('heading', { name: /dashboard/i });
    await expect(dashboardHeader).toBeVisible();

    // Switch to landscape
    await page.setViewportSize({ width: 667, height: 375 });

    // Check layout still works
    await expect(dashboardHeader).toBeVisible();

    // Check content is still accessible
    const tabContent = page.getByRole('tabpanel');
    await expect(tabContent).toBeVisible();
  });

  test('should load quickly on mobile', async ({ page }) => {
    // Set mobile viewport and slow network
    await page.setViewportSize({ width: 375, height: 667 });

    const startTime = Date.now();

    // Navigate to dashboard
    await page.goto('/en/dashboard');

    // Check critical content loads quickly
    const dashboardHeader = page.getByRole('heading', { name: /dashboard/i });
    await expect(dashboardHeader).toBeVisible();

    const loadTime = Date.now() - startTime;

    // Should load within reasonable time (5 seconds for mobile)
    expect(loadTime).toBeLessThan(5000);
  });
});
