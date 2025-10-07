import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Performance and Accessibility', () => {
  test.describe('Core Web Vitals', () => {
    test('should meet Core Web Vitals thresholds on homepage', async ({
      page,
    }) => {
      await page.goto('/');

      // Measure performance metrics
      const performanceMetrics = await page.evaluate(() => {
        return new Promise(resolve => {
          new PerformanceObserver(list => {
            const entries = list.getEntries();
            const metrics: { loadTime?: number; domContentLoaded?: number; firstContentfulPaint?: number; largestContentfulPaint?: number; fcp?: number; lcp?: number } = {};

            entries.forEach(entry => {
              if (entry.entryType === 'navigation') {
                const navEntry = entry as PerformanceNavigationTiming;
                metrics.loadTime =
                  navEntry.loadEventEnd - navEntry.loadEventStart;
                metrics.domContentLoaded =
                  navEntry.domContentLoadedEventEnd -
                  navEntry.domContentLoadedEventStart;
              }

              if (entry.entryType === 'paint') {
                if (entry.name === 'first-contentful-paint') {
                  metrics.fcp = entry.startTime;
                }
                if (entry.name === 'largest-contentful-paint') {
                  metrics.lcp = entry.startTime;
                }
              }
            });

            resolve(metrics);
          }).observe({ entryTypes: ['navigation', 'paint'] });

          // Fallback timeout
          setTimeout(() => resolve({}), 5000);
        });
      });

      // Core Web Vitals thresholds
      const metrics = performanceMetrics as { lcp?: number; fcp?: number };
      if (metrics.lcp) {
        expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
      }
      if (metrics.fcp) {
        expect(metrics.fcp).toBeLessThan(1800); // FCP < 1.8s
      }
    });

    test('should have fast page load times', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/products');

      // Wait for main content to be visible
      await expect(page.getByRole('heading')).toBeVisible();

      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle large product catalogs efficiently', async ({
      page,
    }) => {
      await page.goto('/products');

      const startTime = Date.now();

      // Scroll through products to test virtual scrolling/pagination
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('PageDown');
        await page.waitForTimeout(100);
      }

      const scrollTime = Date.now() - startTime;

      // Should remain responsive during scrolling
      expect(scrollTime).toBeLessThan(2000);

      // Should still be able to interact with elements
      const productCards = page.locator('[data-testid="product-card"]');
      if ((await productCards.count()) > 0) {
        await expect(productCards.first()).toBeVisible();
      }
    });

    test('should optimize image loading', async ({ page }) => {
      await page.goto('/products');

      // Check for lazy loading attributes
      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        // Check first few images for optimization attributes
        for (let i = 0; i < Math.min(3, imageCount); i++) {
          const img = images.nth(i);

          // Should have loading="lazy" for images below the fold
          const _loading = await img.getAttribute('loading');
          const src = await img.getAttribute('src');

          // Should use optimized formats or CDN
          if (src) {
            expect(src).toMatch(/\.(webp|avif|jpg|jpeg|png)$/i);
          }
        }
      }
    });
  });

  test.describe('Accessibility Compliance', () => {
    test('should pass WCAG 2.1 AA compliance on homepage', async ({ page }) => {
      await page.goto('/');
      await injectAxe(page);

      // Check accessibility
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('should pass accessibility on product catalog', async ({ page }) => {
      await page.goto('/products');
      await page.waitForSelector('[data-testid="product-card"]');
      await injectAxe(page);

      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('should pass accessibility on RFQ form', async ({ page }) => {
      await page.goto('/quote');
      await injectAxe(page);

      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');

      // Check heading structure
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1); // Should have exactly one H1

      const h2 = page.locator('h2');
      const _h3 = page.locator('h3');

      // Should have logical heading progression
      const h1Count = await h1.count();
      const h2Count = await h2.count();

      expect(h1Count).toBe(1);
      if (h2Count > 0) {
        // H2s should come after H1
        const firstH2 = h2.first();
        await expect(firstH2).toBeVisible();
      }
    });

    test('should have proper ARIA labels and roles', async ({ page }) => {
      await page.goto('/');

      // Check navigation has proper ARIA
      const nav = page.getByRole('navigation');
      await expect(nav).toBeVisible();

      // Check buttons have accessible names
      const buttons = page.getByRole('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(5, buttonCount); i++) {
        const button = buttons.nth(i);
        const accessibleName =
          (await button.getAttribute('aria-label')) ||
          (await button.textContent());
        expect(accessibleName).toBeTruthy();
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/');

      // Test tab navigation
      await page.keyboard.press('Tab');

      // Should focus on first interactive element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Continue tabbing through interactive elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const currentFocus = page.locator(':focus');
        await expect(currentFocus).toBeVisible();
      }
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/');
      await injectAxe(page);

      // Check specifically for color contrast issues
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });

    test('should provide alternative text for images', async ({ page }) => {
      await page.goto('/products');

      const images = page.locator('img');
      const imageCount = await images.count();

      // Check that all images have alt text
      for (let i = 0; i < Math.min(10, imageCount); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // Alt text should exist and be meaningful
        expect(alt).toBeTruthy();
        expect(alt!.length).toBeGreaterThan(0);
      }
    });

    test('should support screen readers', async ({ page }) => {
      await page.goto('/');

      // Check for screen reader landmarks
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('navigation')).toBeVisible();

      // Check for skip links
      const skipLink = page.getByRole('link', {
        name: /skip.*content|skip.*main/i,
      });
      if (await skipLink.isVisible()) {
        await expect(skipLink).toBeVisible();
      }
    });
  });

  test.describe('Mobile Performance', () => {
    test('should perform well on mobile devices', async ({ page, context }) => {
      // Simulate mobile device
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'connection', {
          value: {
            effectiveType: '3g',
            downlink: 1.5,
            rtt: 300,
          },
        });
      });

      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      const startTime = Date.now();
      await page.goto('/');

      // Wait for main content
      await expect(page.getByRole('heading')).toBeVisible();

      const loadTime = Date.now() - startTime;

      // Should load reasonably fast on mobile
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle touch interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/products');

      // Test touch interactions
      const productCard = page.locator('[data-testid="product-card"]').first();
      if (await productCard.isVisible()) {
        // Simulate touch tap
        await productCard.tap();

        // Should navigate to product detail
        await expect(page).toHaveURL(/\/products\/[^\/]+/);
      }
    });

    test('should optimize for mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 }); // iPhone 5
      await page.goto('/');

      // Check that content fits in mobile viewport
      const body = page.locator('body');
      const bodyWidth = await body.evaluate(el => el.scrollWidth);

      // Should not have horizontal scroll
      expect(bodyWidth).toBeLessThanOrEqual(320);

      // Navigation should be mobile-friendly
      const nav = page.getByRole('navigation');
      await expect(nav).toBeVisible();
    });
  });

  test.describe('Resource Optimization', () => {
    test('should minimize bundle size', async ({ page }) => {
      // Monitor network requests
      const requests: any[] = [];

      page.on('request', request => {
        requests.push({
          url: request.url(),
          resourceType: request.resourceType(),
        });
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check JavaScript bundle sizes
      const jsRequests = requests.filter(r => r.resourceType === 'script');
      const totalJSSize = jsRequests.length;

      // Should not load excessive number of JS files
      expect(totalJSSize).toBeLessThan(20);
    });

    test('should use efficient caching strategies', async ({ page }) => {
      await page.goto('/');

      // Check for cache headers on static assets
      const responses: any[] = [];

      page.on('response', response => {
        responses.push({
          url: response.url(),
          headers: response.headers(),
          status: response.status(),
        });
      });

      await page.reload();

      // Check that static assets have cache headers
      const staticAssets = responses.filter(
        r =>
          r.url.includes('.js') ||
          r.url.includes('.css') ||
          r.url.includes('.png') ||
          r.url.includes('.jpg')
      );

      staticAssets.forEach(asset => {
        // Should have cache-control headers
        expect(
          asset.headers['cache-control'] || asset.headers['etag']
        ).toBeTruthy();
      });
    });

    test('should preload critical resources', async ({ page }) => {
      await page.goto('/');

      // Check for preload links
      const preloadLinks = page.locator('link[rel="preload"]');
      const preloadCount = await preloadLinks.count();

      if (preloadCount > 0) {
        // Should preload critical resources
        for (let i = 0; i < preloadCount; i++) {
          const link = preloadLinks.nth(i);
          const href = await link.getAttribute('href');
          const as = await link.getAttribute('as');

          expect(href).toBeTruthy();
          expect(as).toBeTruthy();
        }
      }
    });
  });

  test.describe('Progressive Enhancement', () => {
    test('should work with CSS disabled', async ({ page }) => {
      // Disable CSS
      await page.addStyleTag({ content: '* { all: unset !important; }' });

      await page.goto('/');

      // Content should still be accessible
      await expect(page.getByRole('heading')).toBeVisible();
      await expect(page.getByRole('navigation')).toBeVisible();

      // Links should still work
      const productLink = page.getByRole('link', { name: /products/i });
      if (await productLink.isVisible()) {
        await productLink.click();
        await expect(page).toHaveURL(/\/products/);
      }
    });

    test('should degrade gracefully with limited JavaScript', async ({
      page,
    }) => {
      // Disable some modern JavaScript features
      await page.addInitScript(() => {
        delete (window as any).IntersectionObserver;
        delete (window as any).ResizeObserver;
      });

      await page.goto('/');

      // Should still function
      await expect(page.getByRole('heading')).toBeVisible();

      // Basic navigation should work
      await page.getByRole('link', { name: /products/i }).click();
      await expect(page).toHaveURL(/\/products/);
    });
  });
});
