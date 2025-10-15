// Global teardown for Playwright E2E tests
import { FullConfig } from '@playwright/test';

async function globalTeardown(_config: FullConfig) {
  console.log('🧹 Cleaning up Playwright E2E test environment...');

  // You can add cleanup logic here, such as:
  // - Removing test data
  // - Cleaning up test files
  // - Resetting database state
  // - Clearing caches

  console.log('✅ Playwright E2E test environment cleanup complete');
}

export default globalTeardown;
