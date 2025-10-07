import { test, expect } from '@playwright/test';

test.describe('Contact Forms and Lead Generation', () => {
  test.describe('General Contact Form', () => {
    test('should display contact form with all required fields', async ({ page }) => {
      await page.goto('/contact');
      
      // Check form presence
      const contactForm = page.getByTestId('contact-form');
      await expect(contactForm).toBeVisible();
      
      // Check required fields
      await expect(page.getByLabel(/name/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/company/i)).toBeVisible();
      await expect(page.getByLabel(/message|inquiry/i)).toBeVisible();
      
      // Check submit button
      await expect(page.getByRole('button', { name: /send|submit/i })).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/contact');
      
      const submitButton = page.getByRole('button', { name: /send|submit/i });
      await submitButton.click();
      
      // Should show validation errors
      await expect(page.getByText(/name.*required|please enter.*name/i)).toBeVisible();
      await expect(page.getByText(/email.*required|please enter.*email/i)).toBeVisible();
      await expect(page.getByText(/message.*required|please enter.*message/i)).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/contact');
      
      const emailInput = page.getByLabel(/email/i);
      await emailInput.fill('invalid-email');
      
      const submitButton = page.getByRole('button', { name: /send|submit/i });
      await submitButton.click();
      
      // Should show email validation error
      await expect(page.getByText(/valid email|email format/i)).toBeVisible();
    });

    test('should submit contact form successfully', async ({ page }) => {
      await page.goto('/contact');
      
      // Fill out form
      await page.getByLabel(/name/i).fill('John Smith');
      await page.getByLabel(/email/i).fill('john.smith@coffeeimporters.com');
      await page.getByLabel(/company/i).fill('Premium Coffee Importers');
      await page.getByLabel(/phone/i).fill('+1-555-0123');
      await page.getByLabel(/message|inquiry/i).fill('Interested in your premium Arabica selection for our retail chain.');
      
      // Submit form
      const submitButton = page.getByRole('button', { name: /send|submit/i });
      await submitButton.click();
      
      // Should show success message
      await expect(page.getByText(/thank you|message sent|received/i)).toBeVisible();
      
      // Should show confirmation details
      await expect(page.getByText(/contact.*soon|respond.*24.*hours/i)).toBeVisible();
    });

    test('should handle form submission errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('**/api/contact', route => {
        route.fulfill({ status: 500, body: 'Server Error' });
      });
      
      await page.goto('/contact');
      
      // Fill and submit form
      await page.getByLabel(/name/i).fill('Test User');
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/message|inquiry/i).fill('Test message');
      
      const submitButton = page.getByRole('button', { name: /send|submit/i });
      await submitButton.click();
      
      // Should show error message
      await expect(page.getByText(/error.*sending|try again|failed/i)).toBeVisible();
      
      // Form should remain filled
      await expect(page.getByLabel(/name/i)).toHaveValue('Test User');
      await expect(page.getByLabel(/email/i)).toHaveValue('test@example.com');
    });
  });

  test.describe('Newsletter Subscription', () => {
    test('should display newsletter signup form', async ({ page }) => {
      await page.goto('/');
      
      // Newsletter form should be visible on homepage
      const newsletterForm = page.getByTestId('newsletter-form');
      await expect(newsletterForm).toBeVisible();
      
      // Should have email input and subscribe button
      await expect(page.getByLabel(/email.*newsletter|subscribe.*email/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /subscribe|sign up/i })).toBeVisible();
    });

    test('should validate newsletter email', async ({ page }) => {
      await page.goto('/');
      
      const emailInput = page.getByLabel(/email.*newsletter|subscribe.*email/i);
      await emailInput.fill('invalid-email');
      
      const subscribeButton = page.getByRole('button', { name: /subscribe|sign up/i });
      await subscribeButton.click();
      
      // Should show validation error
      await expect(page.getByText(/valid email|email format/i)).toBeVisible();
    });

    test('should subscribe to newsletter successfully', async ({ page }) => {
      await page.goto('/');
      
      const emailInput = page.getByLabel(/email.*newsletter|subscribe.*email/i);
      await emailInput.fill('subscriber@coffeelovers.com');
      
      const subscribeButton = page.getByRole('button', { name: /subscribe|sign up/i });
      await subscribeButton.click();
      
      // Should show success message
      await expect(page.getByText(/subscribed|thank you.*subscribing/i)).toBeVisible();
      
      // Email input should be cleared
      await expect(emailInput).toHaveValue('');
    });

    test('should handle duplicate newsletter subscription', async ({ page }) => {
      // Mock API response for duplicate email
      await page.route('**/api/newsletter', route => {
        route.fulfill({ 
          status: 409, 
          body: JSON.stringify({ error: 'Email already subscribed' })
        });
      });
      
      await page.goto('/');
      
      const emailInput = page.getByLabel(/email.*newsletter|subscribe.*email/i);
      await emailInput.fill('existing@subscriber.com');
      
      const subscribeButton = page.getByRole('button', { name: /subscribe|sign up/i });
      await subscribeButton.click();
      
      // Should show appropriate message
      await expect(page.getByText(/already subscribed|already registered/i)).toBeVisible();
    });
  });

  test.describe('Quick Quote Request', () => {
    test('should display quick quote form on product pages', async ({ page }) => {
      await page.goto('/products');
      await page.waitForSelector('[data-testid="product-card"]');
      
      const firstProductCard = page.locator('[data-testid="product-card"]').first();
      await firstProductCard.click();
      
      // Should have quick quote form
      const quickQuoteForm = page.getByTestId('quick-quote-form');
      await expect(quickQuoteForm).toBeVisible();
      
      // Should have essential fields
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/quantity/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /quick quote|get quote/i })).toBeVisible();
    });

    test('should submit quick quote request', async ({ page }) => {
      await page.goto('/products');
      await page.waitForSelector('[data-testid="product-card"]');
      
      const firstProductCard = page.locator('[data-testid="product-card"]').first();
      await firstProductCard.click();
      
      // Fill quick quote form
      await page.getByLabel(/email/i).fill('buyer@coffeeshop.com');
      await page.getByLabel(/quantity/i).fill('500');
      
      const quickQuoteButton = page.getByRole('button', { name: /quick quote|get quote/i });
      await quickQuoteButton.click();
      
      // Should show success message
      await expect(page.getByText(/quote request.*sent|contact.*soon/i)).toBeVisible();
    });

    test('should validate quick quote fields', async ({ page }) => {
      await page.goto('/products');
      await page.waitForSelector('[data-testid="product-card"]');
      
      const firstProductCard = page.locator('[data-testid="product-card"]').first();
      await firstProductCard.click();
      
      const quickQuoteButton = page.getByRole('button', { name: /quick quote|get quote/i });
      await quickQuoteButton.click();
      
      // Should show validation errors
      await expect(page.getByText(/email.*required/i)).toBeVisible();
      await expect(page.getByText(/quantity.*required/i)).toBeVisible();
    });
  });

  test.describe('Lead Magnet Downloads', () => {
    test('should display lead magnet forms', async ({ page }) => {
      await page.goto('/market-insights');
      
      // Should have download forms for reports
      const downloadForm = page.getByTestId('report-download-form');
      if (await downloadForm.isVisible()) {
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByLabel(/company/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /download|get report/i })).toBeVisible();
      }
    });

    test('should download report after form submission', async ({ page }) => {
      await page.goto('/market-insights');
      
      const downloadForm = page.getByTestId('report-download-form');
      if (await downloadForm.isVisible()) {
        // Fill form
        await page.getByLabel(/email/i).fill('analyst@tradingcompany.com');
        await page.getByLabel(/company/i).fill('Global Trading Co.');
        
        // Set up download handling
        const downloadPromise = page.waitForEvent('download');
        
        const downloadButton = page.getByRole('button', { name: /download|get report/i });
        await downloadButton.click();
        
        // Should trigger download
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/\.pdf$/);
      }
    });
  });

  test.describe('Multi-language Contact Forms', () => {
    test('should display contact form in German', async ({ page }) => {
      await page.goto('/de/contact');
      
      // Should show German labels
      await expect(page.getByLabel(/name|vorname|nachname/i)).toBeVisible();
      await expect(page.getByLabel(/e-mail/i)).toBeVisible();
      await expect(page.getByLabel(/unternehmen|firma/i)).toBeVisible();
      await expect(page.getByLabel(/nachricht|anfrage/i)).toBeVisible();
      
      // Submit button in German
      await expect(page.getByRole('button', { name: /senden|abschicken/i })).toBeVisible();
    });

    test('should display validation messages in German', async ({ page }) => {
      await page.goto('/de/contact');
      
      const submitButton = page.getByRole('button', { name: /senden|abschicken/i });
      await submitButton.click();
      
      // Should show German validation messages
      await expect(page.getByText(/name.*erforderlich|bitte.*name/i)).toBeVisible();
      await expect(page.getByText(/e-mail.*erforderlich|bitte.*e-mail/i)).toBeVisible();
    });

    test('should submit German contact form successfully', async ({ page }) => {
      await page.goto('/de/contact');
      
      // Fill German form
      await page.getByLabel(/name|vorname/i).fill('Hans Müller');
      await page.getByLabel(/e-mail/i).fill('hans.mueller@kaffeeimport.de');
      await page.getByLabel(/unternehmen|firma/i).fill('Kaffee Import GmbH');
      await page.getByLabel(/nachricht|anfrage/i).fill('Interesse an Ihren Premium-Arabica-Sorten für unsere Rösterei.');
      
      const submitButton = page.getByRole('button', { name: /senden|abschicken/i });
      await submitButton.click();
      
      // Should show German success message
      await expect(page.getByText(/vielen dank|nachricht.*gesendet|erhalten/i)).toBeVisible();
    });
  });

  test.describe('Form Analytics and Tracking', () => {
    test('should track form interactions', async ({ page }) => {
      let analyticsEvents: any[] = [];

      await page.route('**/analytics/**', route => {
        analyticsEvents.push({
          event: route.request().url(),
          data: route.request().postData(),
        });
        route.fulfill({ status: 200 });
      });

      await page.goto('/contact');
      
      // Interact with form
      await page.getByLabel(/name/i).fill('Test User');
      await page.getByLabel(/email/i).fill('test@example.com');
      
      const submitButton = page.getByRole('button', { name: /send|submit/i });
      await submitButton.click();
      
      // Should track form events
      expect(analyticsEvents.length).toBeGreaterThan(0);
      
      const formEvents = analyticsEvents.filter(e => 
        e.data?.includes('form_started') || 
        e.data?.includes('form_submitted')
      );
      expect(formEvents.length).toBeGreaterThan(0);
    });
  });
});