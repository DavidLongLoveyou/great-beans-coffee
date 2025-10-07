import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

test.describe('PDF Generation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear downloads directory before each test
    const downloadsPath = path.join(process.cwd(), 'test-downloads');
    try {
      await fs.rmdir(downloadsPath, { recursive: true });
    } catch (error) {
      // Directory might not exist, which is fine
    }
    await fs.mkdir(downloadsPath, { recursive: true });
  });

  test.describe('Product Specification PDF', () => {
    test('should generate PDF from product detail page', async ({ page }) => {
      // Navigate to a product detail page
      await page.goto('/products');
      await page.waitForSelector('[data-testid="product-card"]');
      
      const firstProductCard = page.locator('[data-testid="product-card"]').first();
      await firstProductCard.click();
      
      // Wait for product detail page to load
      await expect(page).toHaveURL(/\/products\/[^\/]+/);
      
      // Set up download handling
      const downloadPromise = page.waitForEvent('download');
      
      // Click the download PDF button
      const downloadButton = page.getByRole('button', { name: /download.*spec|download.*pdf/i });
      await expect(downloadButton).toBeVisible();
      await downloadButton.click();
      
      // Wait for download to complete
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.pdf$/);
      
      // Verify the file was downloaded
      const downloadPath = path.join(process.cwd(), 'test-downloads', download.suggestedFilename());
      await download.saveAs(downloadPath);
      
      // Check file exists and has content
      const stats = await fs.stat(downloadPath);
      expect(stats.size).toBeGreaterThan(1000); // PDF should be at least 1KB
    });

    test('should show loading state during PDF generation', async ({ page }) => {
      await page.goto('/products');
      await page.waitForSelector('[data-testid="product-card"]');
      
      const firstProductCard = page.locator('[data-testid="product-card"]').first();
      await firstProductCard.click();
      
      const downloadButton = page.getByRole('button', { name: /download.*spec|download.*pdf/i });
      await expect(downloadButton).toBeVisible();
      
      // Click download and immediately check for loading state
      await downloadButton.click();
      
      // Should show loading text
      await expect(downloadButton).toContainText(/generating|loading/i);
      await expect(downloadButton).toBeDisabled();
      
      // Wait for loading to complete
      await expect(downloadButton).not.toContainText(/generating|loading/i, { timeout: 10000 });
      await expect(downloadButton).toBeEnabled();
    });

    test('should handle PDF generation errors gracefully', async ({ page }) => {
      // Mock a network error for PDF generation
      await page.route('**/api/pdf/**', route => {
        route.abort('failed');
      });
      
      await page.goto('/products');
      await page.waitForSelector('[data-testid="product-card"]');
      
      const firstProductCard = page.locator('[data-testid="product-card"]').first();
      await firstProductCard.click();
      
      const downloadButton = page.getByRole('button', { name: /download.*spec|download.*pdf/i });
      await downloadButton.click();
      
      // Should show error message
      await expect(page.getByText(/error.*generating|failed.*download/i)).toBeVisible();
    });
  });

  test.describe('RFQ Document PDF', () => {
    test('should generate PDF from RFQ detail page', async ({ page }) => {
      // First create an RFQ by going through the flow
      await page.goto('/quote');
      
      // Fill out RFQ form
      await fillBasicRFQInfo(page);
      await selectProduct(page, 0);
      
      const quantityInput = page.getByLabel(/quantity/i);
      await quantityInput.fill('1000');
      
      // Submit RFQ
      const submitButton = page.getByRole('button', { name: /submit|send|request quote/i });
      await submitButton.click();
      
      // Should be redirected to RFQ detail page
      await expect(page).toHaveURL(/\/rfq\/[^\/]+/);
      
      // Set up download handling
      const downloadPromise = page.waitForEvent('download');
      
      // Click the download PDF button
      const downloadButton = page.getByRole('button', { name: /download.*rfq|download.*quote/i });
      await expect(downloadButton).toBeVisible();
      await downloadButton.click();
      
      // Wait for download to complete
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/rfq.*\.pdf$/i);
      
      // Verify the file was downloaded
      const downloadPath = path.join(process.cwd(), 'test-downloads', download.suggestedFilename());
      await download.saveAs(downloadPath);
      
      // Check file exists and has content
      const stats = await fs.stat(downloadPath);
      expect(stats.size).toBeGreaterThan(2000); // RFQ PDF should be larger than product spec
    });

    test('should include all RFQ details in PDF', async ({ page }) => {
      // Create RFQ with comprehensive details
      await page.goto('/quote');
      
      await fillBasicRFQInfo(page);
      await selectProduct(page, 0);
      
      const quantityInput = page.getByLabel(/quantity/i);
      await quantityInput.fill('5000');
      
      // Add special requirements
      const specialRequirements = page.getByLabel(/special requirements|additional notes/i);
      if (await specialRequirements.isVisible()) {
        await specialRequirements.fill('Organic certification required. Custom packaging for retail distribution.');
      }
      
      // Set delivery date
      const deliveryDate = page.getByLabel(/delivery.*date|target.*date/i);
      if (await deliveryDate.isVisible()) {
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 3);
        await deliveryDate.fill(futureDate.toISOString().split('T')[0]);
      }
      
      // Submit RFQ
      const submitButton = page.getByRole('button', { name: /submit|send|request quote/i });
      await submitButton.click();
      
      // Download PDF
      const downloadPromise = page.waitForEvent('download');
      const downloadButton = page.getByRole('button', { name: /download.*rfq|download.*quote/i });
      await downloadButton.click();
      
      const download = await downloadPromise;
      const downloadPath = path.join(process.cwd(), 'test-downloads', download.suggestedFilename());
      await download.saveAs(downloadPath);
      
      // Verify file size indicates comprehensive content
      const stats = await fs.stat(downloadPath);
      expect(stats.size).toBeGreaterThan(3000); // Should be larger with more details
    });
  });

  test.describe('PDF Generation in Different Languages', () => {
    test('should generate PDF in German locale', async ({ page }) => {
      // Navigate to German version
      await page.goto('/de/products');
      await page.waitForSelector('[data-testid="product-card"]');
      
      const firstProductCard = page.locator('[data-testid="product-card"]').first();
      await firstProductCard.click();
      
      const downloadPromise = page.waitForEvent('download');
      const downloadButton = page.getByRole('button', { name: /herunterladen|pdf/i });
      await downloadButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.pdf$/);
      
      // Verify German content in loading state
      await expect(page.getByText(/generieren|erstellen/i)).toBeVisible();
    });

    test('should generate PDF in Japanese locale', async ({ page }) => {
      // Navigate to Japanese version
      await page.goto('/ja/products');
      await page.waitForSelector('[data-testid="product-card"]');
      
      const firstProductCard = page.locator('[data-testid="product-card"]').first();
      await firstProductCard.click();
      
      const downloadPromise = page.waitForEvent('download');
      const downloadButton = page.getByRole('button', { name: /ダウンロード|pdf/i });
      await downloadButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    });
  });
});

// Helper functions
async function fillBasicRFQInfo(page: any) {
  await page.getByLabel(/company name/i).fill('Test Coffee Importers GmbH');
  await page.getByLabel(/email/i).fill('test@coffeeimporters.de');
  await page.getByLabel(/phone/i).fill('+49-30-12345678');

  const countrySelect = page.getByLabel(/country/i);
  if (await countrySelect.isVisible()) {
    await countrySelect.click();
    await page.getByRole('option', { name: /germany|deutschland/i }).click();
  }
}

async function selectProduct(page: any, index: number) {
  const productSelector = page.getByTestId('product-selector');
  if (await productSelector.isVisible()) {
    await productSelector.click();
    const productOptions = page.locator('[data-testid="product-option"]');
    await productOptions.nth(index).click();
  }
}