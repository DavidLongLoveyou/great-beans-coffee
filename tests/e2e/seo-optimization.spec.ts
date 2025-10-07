import { test, expect } from '@playwright/test';

test.describe('SEO Optimization', () => {
  test.describe('Meta Tags and HTML Structure', () => {
    test('should have proper meta tags on homepage', async ({ page }) => {
      await page.goto('/');
      
      // Check title
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(60); // SEO best practice
      
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      const description = await metaDescription.getAttribute('content');
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(120);
      expect(description!.length).toBeLessThan(160); // SEO best practice
      
      // Check meta keywords (if used)
      const metaKeywords = page.locator('meta[name="keywords"]');
      if (await metaKeywords.count() > 0) {
        const keywords = await metaKeywords.getAttribute('content');
        expect(keywords).toBeTruthy();
      }
      
      // Check canonical URL
      const canonical = page.locator('link[rel="canonical"]');
      const canonicalHref = await canonical.getAttribute('href');
      expect(canonicalHref).toBeTruthy();
      expect(canonicalHref).toContain('localhost:3000');
    });

    test('should have proper Open Graph tags', async ({ page }) => {
      await page.goto('/');
      
      // Check OG title
      const ogTitle = page.locator('meta[property="og:title"]');
      const ogTitleContent = await ogTitle.getAttribute('content');
      expect(ogTitleContent).toBeTruthy();
      
      // Check OG description
      const ogDescription = page.locator('meta[property="og:description"]');
      const ogDescContent = await ogDescription.getAttribute('content');
      expect(ogDescContent).toBeTruthy();
      
      // Check OG image
      const ogImage = page.locator('meta[property="og:image"]');
      const ogImageContent = await ogImage.getAttribute('content');
      expect(ogImageContent).toBeTruthy();
      
      // Check OG type
      const ogType = page.locator('meta[property="og:type"]');
      const ogTypeContent = await ogType.getAttribute('content');
      expect(ogTypeContent).toBe('website');
      
      // Check OG URL
      const ogUrl = page.locator('meta[property="og:url"]');
      const ogUrlContent = await ogUrl.getAttribute('content');
      expect(ogUrlContent).toBeTruthy();
    });

    test('should have proper Twitter Card tags', async ({ page }) => {
      await page.goto('/');
      
      // Check Twitter card type
      const twitterCard = page.locator('meta[name="twitter:card"]');
      const cardType = await twitterCard.getAttribute('content');
      expect(cardType).toBeTruthy();
      expect(['summary', 'summary_large_image']).toContain(cardType);
      
      // Check Twitter title
      const twitterTitle = page.locator('meta[name="twitter:title"]');
      const titleContent = await twitterTitle.getAttribute('content');
      expect(titleContent).toBeTruthy();
      
      // Check Twitter description
      const twitterDesc = page.locator('meta[name="twitter:description"]');
      const descContent = await twitterDesc.getAttribute('content');
      expect(descContent).toBeTruthy();
      
      // Check Twitter image
      const twitterImage = page.locator('meta[name="twitter:image"]');
      const imageContent = await twitterImage.getAttribute('content');
      expect(imageContent).toBeTruthy();
    });

    test('should have proper hreflang tags for internationalization', async ({ page }) => {
      await page.goto('/');
      
      // Check for hreflang tags
      const hreflangTags = page.locator('link[rel="alternate"][hreflang]');
      const hreflangCount = await hreflangTags.count();
      
      if (hreflangCount > 0) {
        // Should have multiple language versions
        expect(hreflangCount).toBeGreaterThan(1);
        
        // Check each hreflang tag
        for (let i = 0; i < hreflangCount; i++) {
          const tag = hreflangTags.nth(i);
          const hreflang = await tag.getAttribute('hreflang');
          const href = await tag.getAttribute('href');
          
          expect(hreflang).toBeTruthy();
          expect(href).toBeTruthy();
          
          // Should be valid language codes
          expect(hreflang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
        }
        
        // Should have x-default
        const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
        await expect(xDefault).toHaveCount(1);
      }
    });

    test('should have proper structured data (JSON-LD)', async ({ page }) => {
      await page.goto('/');
      
      // Check for JSON-LD structured data
      const jsonLdScripts = page.locator('script[type="application/ld+json"]');
      const jsonLdCount = await jsonLdScripts.count();
      
      if (jsonLdCount > 0) {
        // Parse and validate JSON-LD
        for (let i = 0; i < jsonLdCount; i++) {
          const script = jsonLdScripts.nth(i);
          const content = await script.textContent();
          
          expect(content).toBeTruthy();
          
          // Should be valid JSON
          let jsonData;
          expect(() => {
            jsonData = JSON.parse(content!);
          }).not.toThrow();
          
          // Should have @context and @type
          expect(jsonData['@context']).toBeTruthy();
          expect(jsonData['@type']).toBeTruthy();
        }
      }
    });
  });

  test.describe('Product Page SEO', () => {
    test('should have optimized meta tags for product pages', async ({ page }) => {
      await page.goto('/products');
      
      // Find first product and navigate to it
      const productCard = page.locator('[data-testid="product-card"]').first();
      if (await productCard.isVisible()) {
        await productCard.click();
        
        // Wait for navigation
        await page.waitForURL(/\/products\/[^\/]+/);
        
        // Check product-specific meta tags
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title).toContain('Coffee'); // Should mention coffee
        
        const metaDescription = page.locator('meta[name="description"]');
        const description = await metaDescription.getAttribute('content');
        expect(description).toBeTruthy();
        expect(description!.length).toBeGreaterThan(100);
        
        // Check product structured data
        const jsonLdScripts = page.locator('script[type="application/ld+json"]');
        const jsonLdCount = await jsonLdScripts.count();
        
        if (jsonLdCount > 0) {
          const script = jsonLdScripts.first();
          const content = await script.textContent();
          const jsonData = JSON.parse(content!);
          
          // Should be Product schema
          expect(jsonData['@type']).toBe('Product');
          expect(jsonData.name).toBeTruthy();
          expect(jsonData.description).toBeTruthy();
        }
      }
    });

    test('should have proper breadcrumb markup', async ({ page }) => {
      await page.goto('/products');
      
      const productCard = page.locator('[data-testid="product-card"]').first();
      if (await productCard.isVisible()) {
        await productCard.click();
        await page.waitForURL(/\/products\/[^\/]+/);
        
        // Check for breadcrumb navigation
        const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i });
        if (await breadcrumb.isVisible()) {
          await expect(breadcrumb).toBeVisible();
          
          // Should have breadcrumb structured data
          const breadcrumbJsonLd = page.locator('script[type="application/ld+json"]');
          const scripts = await breadcrumbJsonLd.all();
          
          const hasBreadcrumbSchema = await Promise.all(
            scripts.map(async (script) => {
              const content = await script.textContent();
              const jsonData = JSON.parse(content!);
              return jsonData['@type'] === 'BreadcrumbList';
            })
          );
          
          expect(hasBreadcrumbSchema.some(Boolean)).toBe(true);
        }
      }
    });
  });

  test.describe('URL Structure and Navigation', () => {
    test('should have SEO-friendly URLs', async ({ page }) => {
      await page.goto('/products');
      
      // Check current URL structure
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/products$/);
      
      // Navigate to product detail
      const productCard = page.locator('[data-testid="product-card"]').first();
      if (await productCard.isVisible()) {
        await productCard.click();
        
        const productUrl = page.url();
        
        // Should have SEO-friendly product URL
        expect(productUrl).toMatch(/\/products\/[a-z0-9-]+$/);
        expect(productUrl).not.toContain('?');
        expect(productUrl).not.toContain('&');
        expect(productUrl).not.toContain('=');
      }
    });

    test('should have proper internal linking', async ({ page }) => {
      await page.goto('/');
      
      // Check for internal links
      const internalLinks = page.locator('a[href^="/"], a[href^="./"], a[href^="../"]');
      const linkCount = await internalLinks.count();
      
      expect(linkCount).toBeGreaterThan(5); // Should have multiple internal links
      
      // Check that links are accessible
      for (let i = 0; i < Math.min(5, linkCount); i++) {
        const link = internalLinks.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        
        expect(href).toBeTruthy();
        expect(text?.trim()).toBeTruthy(); // Should have link text
      }
    });

    test('should handle trailing slashes consistently', async ({ page }) => {
      // Test with trailing slash
      await page.goto('/products/');
      await expect(page).toHaveURL(/\/products\/?$/);
      
      // Test without trailing slash
      await page.goto('/products');
      await expect(page).toHaveURL(/\/products\/?$/);
      
      // Should not have redirect loops
      const response = await page.goto('/products');
      expect(response?.status()).toBeLessThan(400);
    });
  });

  test.describe('Sitemap and Robots', () => {
    test('should have accessible sitemap.xml', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');
      
      expect(response?.status()).toBe(200);
      
      const content = await page.content();
      expect(content).toContain('<?xml');
      expect(content).toContain('<urlset');
      expect(content).toContain('<url>');
      expect(content).toContain('<loc>');
    });

    test('should have proper robots.txt', async ({ page }) => {
      const response = await page.goto('/robots.txt');
      
      expect(response?.status()).toBe(200);
      
      const content = await page.textContent('body');
      expect(content).toContain('User-agent:');
      expect(content).toContain('Sitemap:');
    });
  });

  test.describe('Page Speed and Core Web Vitals', () => {
    test('should have optimized images for SEO', async ({ page }) => {
      await page.goto('/');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        for (let i = 0; i < Math.min(5, imageCount); i++) {
          const img = images.nth(i);
          
          // Should have alt text
          const alt = await img.getAttribute('alt');
          expect(alt).toBeTruthy();
          
          // Should have proper dimensions
          const width = await img.getAttribute('width');
          const height = await img.getAttribute('height');
          
          if (width && height) {
            expect(parseInt(width)).toBeGreaterThan(0);
            expect(parseInt(height)).toBeGreaterThan(0);
          }
          
          // Should use modern formats or optimization
          const src = await img.getAttribute('src');
          if (src) {
            expect(src).toMatch(/\.(webp|avif|jpg|jpeg|png)$/i);
          }
        }
      }
    });

    test('should minimize render-blocking resources', async ({ page }) => {
      const responses: any[] = [];
      
      page.on('response', response => {
        responses.push({
          url: response.url(),
          headers: response.headers(),
          resourceType: response.request().resourceType(),
        });
      });
      
      await page.goto('/');
      
      // Check for render-blocking CSS
      const cssResponses = responses.filter(r => r.resourceType === 'stylesheet');
      
      // Should minimize blocking CSS
      expect(cssResponses.length).toBeLessThan(5);
    });
  });

  test.describe('Multi-language SEO', () => {
    test('should have proper SEO for German pages', async ({ page }) => {
      await page.goto('/de');
      
      // Check German meta tags
      const title = await page.title();
      expect(title).toBeTruthy();
      
      const metaDescription = page.locator('meta[name="description"]');
      const description = await metaDescription.getAttribute('content');
      expect(description).toBeTruthy();
      
      // Check lang attribute
      const html = page.locator('html');
      const lang = await html.getAttribute('lang');
      expect(lang).toBe('de');
      
      // Check hreflang tags
      const hreflangTags = page.locator('link[rel="alternate"][hreflang]');
      const hreflangCount = await hreflangTags.count();
      expect(hreflangCount).toBeGreaterThan(0);
    });

    test('should have proper SEO for Japanese pages', async ({ page }) => {
      await page.goto('/ja');
      
      // Check Japanese meta tags
      const title = await page.title();
      expect(title).toBeTruthy();
      
      const html = page.locator('html');
      const lang = await html.getAttribute('lang');
      expect(lang).toBe('ja');
      
      // Check for proper encoding
      const charset = page.locator('meta[charset]');
      const charsetValue = await charset.getAttribute('charset');
      expect(charsetValue?.toLowerCase()).toBe('utf-8');
    });
  });

  test.describe('Local SEO and Business Information', () => {
    test('should have proper business schema markup', async ({ page }) => {
      await page.goto('/');
      
      const jsonLdScripts = page.locator('script[type="application/ld+json"]');
      const scripts = await jsonLdScripts.all();
      
      let hasOrganizationSchema = false;
      
      for (const script of scripts) {
        const content = await script.textContent();
        const jsonData = JSON.parse(content!);
        
        if (jsonData['@type'] === 'Organization') {
          hasOrganizationSchema = true;
          
          // Should have required organization fields
          expect(jsonData.name).toBeTruthy();
          expect(jsonData.url).toBeTruthy();
          
          // Should have contact information
          if (jsonData.contactPoint) {
            expect(jsonData.contactPoint.contactType).toBeTruthy();
          }
          
          break;
        }
      }
      
      expect(hasOrganizationSchema).toBe(true);
    });

    test('should have proper contact information markup', async ({ page }) => {
      await page.goto('/contact');
      
      // Check for contact page specific SEO
      const title = await page.title();
      expect(title).toContain('Contact');
      
      // Check for structured data
      const jsonLdScripts = page.locator('script[type="application/ld+json"]');
      if (await jsonLdScripts.count() > 0) {
        const script = jsonLdScripts.first();
        const content = await script.textContent();
        const jsonData = JSON.parse(content!);
        
        // Should have contact-related schema
        expect(['Organization', 'ContactPage', 'LocalBusiness']).toContain(jsonData['@type']);
      }
    });
  });

  test.describe('E-commerce SEO', () => {
    test('should have proper product schema with offers', async ({ page }) => {
      await page.goto('/products');
      
      const productCard = page.locator('[data-testid="product-card"]').first();
      if (await productCard.isVisible()) {
        await productCard.click();
        await page.waitForURL(/\/products\/[^\/]+/);
        
        const jsonLdScripts = page.locator('script[type="application/ld+json"]');
        const scripts = await jsonLdScripts.all();
        
        let hasProductSchema = false;
        
        for (const script of scripts) {
          const content = await script.textContent();
          const jsonData = JSON.parse(content!);
          
          if (jsonData['@type'] === 'Product') {
            hasProductSchema = true;
            
            // Should have required product fields
            expect(jsonData.name).toBeTruthy();
            expect(jsonData.description).toBeTruthy();
            
            // Should have offers for B2B
            if (jsonData.offers) {
              expect(jsonData.offers['@type']).toBe('Offer');
              expect(jsonData.offers.availability).toBeTruthy();
            }
            
            break;
          }
        }
        
        expect(hasProductSchema).toBe(true);
      }
    });

    test('should have proper category page SEO', async ({ page }) => {
      await page.goto('/products');
      
      // Check category page meta tags
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title).toContain('Products');
      
      const metaDescription = page.locator('meta[name="description"]');
      const description = await metaDescription.getAttribute('content');
      expect(description).toBeTruthy();
      
      // Should have proper heading structure
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      
      const h1Text = await h1.textContent();
      expect(h1Text).toBeTruthy();
    });
  });
});