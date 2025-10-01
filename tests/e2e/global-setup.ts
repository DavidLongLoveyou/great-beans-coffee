// Global setup for Playwright E2E tests
import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🎭 Setting up Playwright E2E test environment...')
  
  // Get the base URL from config
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000'
  
  // Launch browser for setup
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Wait for the application to be ready
    console.log(`🌐 Waiting for application at ${baseURL}...`)
    await page.goto(baseURL, { waitUntil: 'networkidle' })
    
    // Verify the application is running
    await page.waitForSelector('body', { timeout: 30000 })
    console.log('✅ Application is ready for testing')
    
    // You can add additional setup here, such as:
    // - Creating test users
    // - Seeding test data
    // - Setting up authentication tokens
    // - Clearing previous test data
    
    // Example: Check if we need to seed test data
    const title = await page.title()
    console.log(`📄 Application title: ${title}`)
    
  } catch (error) {
    console.error('❌ Failed to set up test environment:', error)
    throw error
  } finally {
    await browser.close()
  }
  
  console.log('✅ Playwright E2E test environment setup complete')
}

export default globalSetup