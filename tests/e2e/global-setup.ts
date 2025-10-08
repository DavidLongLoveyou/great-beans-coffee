// Global setup for Playwright E2E tests
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🎭 Setting up Playwright E2E test environment...');

  // Get the base URL from config
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';

  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the application to be ready
    console.log(`🌐 Waiting for application at ${baseURL}...`);

    // Try to navigate to the application
    const response = await page.goto(baseURL, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    if (!response || response.status() >= 400) {
      throw new Error(`Failed to load application: ${response?.status()}`);
    }

    // Wait for the page to be interactive
    await page.waitForLoadState('domcontentloaded');

    // Check if we can get the title (indicates page is loaded)
    const title = await page.title();
    console.log(`📄 Application title: ${title}`);

    // Try to find any visible element to confirm the page is working
    try {
      await page.waitForSelector('h1, [data-testid], main, header', {
        timeout: 10000,
        state: 'visible',
      });
    } catch (e) {
      console.log('⚠️ No main content found, but page loaded successfully');
    }

    console.log('✅ Application is ready for testing');

    // You can add additional setup here, such as:
    // - Creating test users
    // - Seeding test data
    // - Setting up authentication tokens
    // - Clearing previous test data
  } catch (error) {
    console.error('❌ Failed to set up test environment:', error);
    console.error(
      'Response status:',
      await page.evaluate(() => document.readyState)
    );
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Playwright E2E test environment setup complete');
}

export default globalSetup;
