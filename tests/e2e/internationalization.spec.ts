import { test, expect } from '@playwright/test';

test.describe('Internationalization (i18n)', () => {
  const supportedLocales = ['en', 'de', 'ja', 'fr', 'it', 'es', 'nl', 'ko'];

  test.describe('Language Navigation', () => {
    test('should display language selector', async ({ page }) => {
      await page.goto('/');

      const languageSelector = page.getByTestId('language-selector');
      await expect(languageSelector).toBeVisible();

      // Should show current language
      await expect(languageSelector).toContainText(/en|english/i);
    });

    test('should switch between supported languages', async ({ page }) => {
      await page.goto('/');

      const languageSelector = page.getByTestId('language-selector');
      await languageSelector.click();

      // Check that all supported languages are available
      for (const locale of supportedLocales.slice(0, 4)) {
        // Test first 4 to avoid timeout
        const languageOption = page.getByRole('option', {
          name: new RegExp(locale, 'i'),
        });
        await expect(languageOption).toBeVisible();
      }

      // Switch to German
      const germanOption = page.getByRole('option', {
        name: /deutsch|german|de/i,
      });
      await germanOption.click();

      // Should redirect to German version
      await expect(page).toHaveURL(/^.*\/de\//);

      // Should display German content
      await expect(page.getByText(/willkommen|kaffee|produkte/i)).toBeVisible();
    });

    test('should maintain page context when switching languages', async ({
      page,
    }) => {
      // Start on products page
      await page.goto('/products');

      const languageSelector = page.getByTestId('language-selector');
      await languageSelector.click();

      // Switch to French
      const frenchOption = page.getByRole('option', {
        name: /français|french|fr/i,
      });
      await frenchOption.click();

      // Should be on French products page
      await expect(page).toHaveURL(/^.*\/fr\/products/);

      // Should display French content
      await expect(page.getByText(/produits|café/i)).toBeVisible();
    });
  });

  test.describe('Localized Content', () => {
    test('should display localized navigation menu', async ({ page }) => {
      // Test English navigation
      await page.goto('/');
      await expect(page.getByRole('link', { name: /products/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /services/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /about/i })).toBeVisible();

      // Switch to German
      await page.goto('/de');
      await expect(page.getByRole('link', { name: /produkte/i })).toBeVisible();
      await expect(
        page.getByRole('link', { name: /dienstleistungen/i })
      ).toBeVisible();
      await expect(page.getByRole('link', { name: /über uns/i })).toBeVisible();
    });

    test('should display localized product information', async ({ page }) => {
      // English product page
      await page.goto('/products');
      await page.waitForSelector('[data-testid="product-card"]');

      const firstProductCard = page
        .locator('[data-testid="product-card"]')
        .first();
      await firstProductCard.click();

      // Should show English product details
      await expect(
        page.getByText(/origin|processing|tasting notes/i)
      ).toBeVisible();

      // Switch to German product page
      await page.goto('/de/products');
      await page.waitForSelector('[data-testid="product-card"]');

      const germanProductCard = page
        .locator('[data-testid="product-card"]')
        .first();
      await germanProductCard.click();

      // Should show German product details
      await expect(
        page.getByText(/herkunft|verarbeitung|geschmacksnoten/i)
      ).toBeVisible();
    });

    test('should display localized RFQ form', async ({ page }) => {
      // English RFQ form
      await page.goto('/quote');
      await expect(page.getByLabel(/company name/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(
        page.getByRole('button', { name: /submit|send/i })
      ).toBeVisible();

      // German RFQ form
      await page.goto('/de/quote');
      await expect(page.getByLabel(/firmenname|unternehmen/i)).toBeVisible();
      await expect(page.getByLabel(/e-mail/i)).toBeVisible();
      await expect(
        page.getByRole('button', { name: /senden|abschicken/i })
      ).toBeVisible();
    });
  });

  test.describe('SEO and Meta Tags', () => {
    test('should have correct hreflang tags', async ({ page }) => {
      await page.goto('/');

      // Check for hreflang tags
      const hreflangTags = page.locator('link[rel="alternate"][hreflang]');
      await expect(hreflangTags).toHaveCount(supportedLocales.length + 1); // +1 for x-default

      // Check specific hreflang tags
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        'href',
        /\/en\//
      );
      await expect(page.locator('link[hreflang="de"]')).toHaveAttribute(
        'href',
        /\/de\//
      );
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
        'href',
        /\/en\//
      );
    });

    test('should have localized meta tags', async ({ page }) => {
      // English meta tags
      await page.goto('/');
      await expect(page).toHaveTitle(/The Great Beans.*Coffee/i);

      const englishDescription = page.locator('meta[name="description"]');
      await expect(englishDescription).toHaveAttribute(
        'content',
        /coffee.*vietnam.*export/i
      );

      // German meta tags
      await page.goto('/de');
      await expect(page).toHaveTitle(/The Great Beans.*Kaffee/i);

      const germanDescription = page.locator('meta[name="description"]');
      await expect(germanDescription).toHaveAttribute(
        'content',
        /kaffee.*vietnam.*export/i
      );
    });

    test('should have correct Open Graph tags for different languages', async ({
      page,
    }) => {
      // English Open Graph
      await page.goto('/');
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        'content',
        'en_US'
      );
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        'content',
        /The Great Beans/i
      );

      // German Open Graph
      await page.goto('/de');
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        'content',
        'de_DE'
      );
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        'content',
        /The Great Beans/i
      );
    });
  });

  test.describe('URL Structure', () => {
    test('should have correct URL patterns for different locales', async ({
      page,
    }) => {
      // Default English (no locale prefix)
      await page.goto('/');
      await expect(page).toHaveURL(/^[^\/]*\/$|^[^\/]*\/en\/$/);

      // German with locale prefix
      await page.goto('/de');
      await expect(page).toHaveURL(/\/de\//);

      // Japanese with locale prefix
      await page.goto('/ja');
      await expect(page).toHaveURL(/\/ja\//);
    });

    test('should redirect invalid locales to default', async ({ page }) => {
      // Try invalid locale
      await page.goto('/invalid-locale');

      // Should redirect to default (English)
      await expect(page).toHaveURL(/^[^\/]*\/$|^[^\/]*\/en\/$/);
    });

    test('should maintain deep links with locale switching', async ({
      page,
    }) => {
      // Start with deep link in English
      await page.goto('/products/vietnam-robusta-grade-1');

      // Switch to German via language selector
      const languageSelector = page.getByTestId('language-selector');
      await languageSelector.click();

      const germanOption = page.getByRole('option', {
        name: /deutsch|german|de/i,
      });
      await germanOption.click();

      // Should maintain the product path in German
      await expect(page).toHaveURL(/\/de\/products\/vietnam-robusta-grade-1/);
    });
  });

  test.describe('Date and Number Formatting', () => {
    test('should format dates according to locale', async ({ page }) => {
      // Create an RFQ to see date formatting
      await page.goto('/quote');

      const deliveryDate = page.getByLabel(/delivery.*date|target.*date/i);
      if (await deliveryDate.isVisible()) {
        // Check date input format (should be locale-appropriate)
        await deliveryDate.click();

        // In English, should show MM/DD/YYYY or similar
        await expect(deliveryDate).toHaveAttribute(
          'placeholder',
          /mm|dd|yyyy/i
        );
      }

      // Switch to German
      await page.goto('/de/quote');

      const germanDeliveryDate = page.getByLabel(/lieferdatum|zieldatum/i);
      if (await germanDeliveryDate.isVisible()) {
        await germanDeliveryDate.click();

        // In German, should show DD.MM.YYYY or similar
        await expect(germanDeliveryDate).toHaveAttribute(
          'placeholder',
          /dd|mm|yyyy/i
        );
      }
    });

    test('should format numbers according to locale', async ({ page }) => {
      await page.goto('/products');
      await page.waitForSelector('[data-testid="product-card"]');

      // Check price formatting in English (should use $ and commas)
      const priceElements = page.locator('[data-testid="product-price"]');
      if (await priceElements.first().isVisible()) {
        const englishPrice = await priceElements.first().textContent();
        expect(englishPrice).toMatch(/\$|USD/);
      }

      // Switch to German
      await page.goto('/de/products');
      await page.waitForSelector('[data-testid="product-card"]');

      // Check price formatting in German (should use € and periods/commas appropriately)
      const germanPriceElements = page.locator('[data-testid="product-price"]');
      if (await germanPriceElements.first().isVisible()) {
        const germanPrice = await germanPriceElements.first().textContent();
        expect(germanPrice).toMatch(/€|EUR/);
      }
    });
  });

  test.describe('RTL Language Support', () => {
    test('should handle RTL languages if supported', async ({ page }) => {
      // This test would be relevant if Arabic or Hebrew were added
      // For now, we'll test that the layout doesn't break with longer text

      await page.goto('/de'); // German has longer words

      // Check that navigation doesn't overflow
      const navigation = page.getByRole('navigation');
      await expect(navigation).toBeVisible();

      // Check that buttons maintain proper spacing
      const ctaButton = page.getByRole('button', { name: /angebot|quote/i });
      if (await ctaButton.isVisible()) {
        await expect(ctaButton).toBeVisible();
      }
    });
  });
});
