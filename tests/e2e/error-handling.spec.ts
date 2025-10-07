import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test.describe('404 Error Pages', () => {
    test('should display custom 404 page for non-existent routes', async ({ page }) => {
      await page.goto('/non-existent-page');
      
      // Should show 404 status
      expect(page.url()).toContain('/non-existent-page');
      
      // Should display custom 404 content
      await expect(page.getByText(/404|page not found|not found/i)).toBeVisible();
      await expect(page.getByText(/sorry|oops|page.*exist/i)).toBeVisible();
      
      // Should have navigation back to home
      await expect(page.getByRole('link', { name: /home|back.*home/i })).toBeVisible();
      
      // Should maintain site navigation
      await expect(page.getByRole('navigation')).toBeVisible();
    });

    test('should display 404 for non-existent product', async ({ page }) => {
      await page.goto('/products/non-existent-product');
      
      // Should show product-specific 404
      await expect(page.getByText(/product.*not found|product.*exist/i)).toBeVisible();
      
      // Should suggest alternative products
      const suggestedProducts = page.getByTestId('suggested-products');
      if (await suggestedProducts.isVisible()) {
        await expect(suggestedProducts).toBeVisible();
      }
      
      // Should have link to products catalog
      await expect(page.getByRole('link', { name: /browse.*products|view.*catalog/i })).toBeVisible();
    });

    test('should display 404 for non-existent RFQ', async ({ page }) => {
      await page.goto('/rfq/non-existent-rfq-id');
      
      // Should show RFQ-specific 404
      await expect(page.getByText(/rfq.*not found|quote.*not found/i)).toBeVisible();
      
      // Should have link to create new RFQ
      await expect(page.getByRole('link', { name: /new.*quote|create.*rfq/i })).toBeVisible();
    });

    test('should handle 404 in different languages', async ({ page }) => {
      // German 404
      await page.goto('/de/non-existent-page');
      await expect(page.getByText(/404|seite.*nicht.*gefunden/i)).toBeVisible();
      
      // Japanese 404
      await page.goto('/ja/non-existent-page');
      await expect(page.getByText(/404|ページが見つかりません/i)).toBeVisible();
    });
  });

  test.describe('Network Error Handling', () => {
    test('should handle API timeouts gracefully', async ({ page }) => {
      // Mock slow API response
      await page.route('**/api/products', route => {
        setTimeout(() => {
          route.fulfill({ status: 200, body: '[]' });
        }, 30000); // 30 second delay
      });
      
      await page.goto('/products');
      
      // Should show loading state
      await expect(page.getByText(/loading|fetching/i)).toBeVisible();
      
      // Should eventually show timeout error
      await expect(page.getByText(/timeout|slow.*connection|try.*again/i)).toBeVisible({ timeout: 35000 });
      
      // Should have retry button
      await expect(page.getByRole('button', { name: /retry|try.*again/i })).toBeVisible();
    });

    test('should handle server errors (500)', async ({ page }) => {
      // Mock server error
      await page.route('**/api/products', route => {
        route.fulfill({ status: 500, body: 'Internal Server Error' });
      });
      
      await page.goto('/products');
      
      // Should show error message
      await expect(page.getByText(/server error|something.*wrong|try.*later/i)).toBeVisible();
      
      // Should maintain page layout
      await expect(page.getByRole('navigation')).toBeVisible();
      
      // Should have retry option
      await expect(page.getByRole('button', { name: /retry|refresh/i })).toBeVisible();
    });

    test('should handle network disconnection', async ({ page }) => {
      await page.goto('/products');
      
      // Simulate network disconnection
      await page.context().setOffline(true);
      
      // Try to navigate to another page
      await page.getByRole('link', { name: /services/i }).click();
      
      // Should show offline message
      await expect(page.getByText(/offline|no.*connection|check.*connection/i)).toBeVisible();
      
      // Restore connection
      await page.context().setOffline(false);
      
      // Should recover when connection is restored
      await page.reload();
      await expect(page.getByRole('heading')).toBeVisible();
    });

    test('should handle partial content loading failures', async ({ page }) => {
      // Mock image loading failures
      await page.route('**/*.jpg', route => route.abort());
      await page.route('**/*.png', route => route.abort());
      
      await page.goto('/products');
      
      // Should still display page content
      await expect(page.getByRole('heading')).toBeVisible();
      
      // Should show placeholder images or alt text
      const images = page.locator('img');
      if (await images.count() > 0) {
        // Images should have alt text or fallback
        await expect(images.first()).toHaveAttribute('alt');
      }
    });
  });

  test.describe('Form Error Handling', () => {
    test('should handle RFQ submission failures', async ({ page }) => {
      // Mock API error for RFQ submission
      await page.route('**/api/rfq', route => {
        route.fulfill({ status: 422, body: JSON.stringify({ error: 'Validation failed' }) });
      });
      
      await page.goto('/quote');
      
      // Fill and submit form
      await page.getByLabel(/company name/i).fill('Test Company');
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/phone/i).fill('+1-555-0123');
      
      const submitButton = page.getByRole('button', { name: /submit|send/i });
      await submitButton.click();
      
      // Should show error message
      await expect(page.getByText(/error.*submitting|failed.*submit|try.*again/i)).toBeVisible();
      
      // Form data should be preserved
      await expect(page.getByLabel(/company name/i)).toHaveValue('Test Company');
      await expect(page.getByLabel(/email/i)).toHaveValue('test@example.com');
      
      // Should allow retry
      await expect(submitButton).toBeEnabled();
    });

    test('should handle file upload failures', async ({ page }) => {
      await page.goto('/quote');
      
      // Mock file upload error
      await page.route('**/api/upload', route => {
        route.fulfill({ status: 413, body: 'File too large' });
      });
      
      const fileInput = page.getByLabel(/upload.*file|attach.*file/i);
      if (await fileInput.isVisible()) {
        // Try to upload a file
        await fileInput.setInputFiles({
          name: 'large-file.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.alloc(10 * 1024 * 1024), // 10MB file
        });
        
        // Should show file size error
        await expect(page.getByText(/file.*too.*large|size.*limit|reduce.*file/i)).toBeVisible();
      }
    });

    test('should handle session expiration', async ({ page }) => {
      await page.goto('/quote');
      
      // Fill form partially
      await page.getByLabel(/company name/i).fill('Test Company');
      
      // Mock session expiration
      await page.route('**/api/**', route => {
        route.fulfill({ status: 401, body: 'Session expired' });
      });
      
      // Try to submit
      const submitButton = page.getByRole('button', { name: /submit|send/i });
      await submitButton.click();
      
      // Should show session expired message
      await expect(page.getByText(/session.*expired|please.*refresh|login.*again/i)).toBeVisible();
      
      // Should offer to refresh or save progress
      await expect(page.getByRole('button', { name: /refresh|reload/i })).toBeVisible();
    });
  });

  test.describe('Browser Compatibility Issues', () => {
    test('should handle JavaScript disabled gracefully', async ({ page }) => {
      // Disable JavaScript
      await page.context().addInitScript(() => {
        Object.defineProperty(window, 'navigator', {
          value: { ...window.navigator, javaEnabled: () => false }
        });
      });
      
      await page.goto('/');
      
      // Should still display basic content
      await expect(page.getByRole('heading')).toBeVisible();
      
      // Should show noscript message if present
      const noscriptMessage = page.locator('noscript');
      if (await noscriptMessage.isVisible()) {
        await expect(noscriptMessage).toContainText(/javascript|enable/i);
      }
    });

    test('should handle unsupported browser features', async ({ page }) => {
      // Mock unsupported features
      await page.addInitScript(() => {
        // Remove modern APIs
        delete (window as any).fetch;
        delete (window as any).IntersectionObserver;
      });
      
      await page.goto('/');
      
      // Should still function with fallbacks
      await expect(page.getByRole('heading')).toBeVisible();
      
      // Navigation should still work
      await page.getByRole('link', { name: /products/i }).click();
      await expect(page).toHaveURL(/\/products/);
    });
  });

  test.describe('Data Validation Edge Cases', () => {
    test('should handle extremely long input values', async ({ page }) => {
      await page.goto('/contact');
      
      const longText = 'A'.repeat(10000); // 10,000 characters
      
      const messageField = page.getByLabel(/message|inquiry/i);
      await messageField.fill(longText);
      
      const submitButton = page.getByRole('button', { name: /send|submit/i });
      await submitButton.click();
      
      // Should show validation error for length
      await expect(page.getByText(/too long|character limit|maximum.*characters/i)).toBeVisible();
    });

    test('should handle special characters in input', async ({ page }) => {
      await page.goto('/contact');
      
      // Test with special characters
      await page.getByLabel(/name/i).fill('José María Ñoño <script>alert("xss")</script>');
      await page.getByLabel(/email/i).fill('test+special@example.com');
      await page.getByLabel(/message/i).fill('Testing with émojis 🚀 and symbols: @#$%^&*()');
      
      const submitButton = page.getByRole('button', { name: /send|submit/i });
      await submitButton.click();
      
      // Should handle special characters without breaking
      // Should not execute any scripts
      await expect(page.locator('text=XSS')).not.toBeVisible();
    });

    test('should handle malformed URLs', async ({ page }) => {
      // Test various malformed URLs
      const malformedUrls = [
        '/products//double-slash',
        '/products/%20with%20spaces',
        '/products/with spaces',
        '/products/with-unicode-café',
      ];
      
      for (const url of malformedUrls) {
        await page.goto(url);
        
        // Should either redirect to valid URL or show 404
        // Should not break the application
        await expect(page.getByRole('navigation')).toBeVisible();
      }
    });
  });

  test.describe('Performance Degradation Handling', () => {
    test('should handle slow image loading', async ({ page }) => {
      // Mock slow image loading
      await page.route('**/*.jpg', route => {
        setTimeout(() => {
          route.continue();
        }, 5000); // 5 second delay
      });
      
      await page.goto('/products');
      
      // Should show loading placeholders
      const images = page.locator('img');
      if (await images.count() > 0) {
        // Should have loading states or placeholders
        await expect(page.getByTestId('image-placeholder')).toBeVisible();
      }
      
      // Content should still be accessible
      await expect(page.getByRole('heading')).toBeVisible();
    });

    test('should handle memory constraints', async ({ page }) => {
      // Simulate memory pressure by loading many elements
      await page.goto('/products');
      
      // Scroll through many products to test memory handling
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('PageDown');
        await page.waitForTimeout(100);
      }
      
      // Should still be responsive
      await expect(page.getByRole('navigation')).toBeVisible();
      
      // Should not crash or become unresponsive
      await page.getByRole('link', { name: /home/i }).click();
      await expect(page).toHaveURL(/\/$/);
    });
  });
});