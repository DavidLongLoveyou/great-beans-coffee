// Global setup for Jest tests
// This runs once before all tests

export default async function globalSetup() {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = 'file:./test.db'
  
  // Initialize test database if needed
  // Note: In a real scenario, you might want to set up a test database here
  console.log('🧪 Setting up test environment...')
  
  // You can add any global setup logic here, such as:
  // - Starting test servers
  // - Setting up test databases
  // - Initializing external services
  
  console.log('✅ Test environment setup complete')
}