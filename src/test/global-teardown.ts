// Global teardown for Jest tests
// This runs once after all tests complete

export default async function globalTeardown() {
  console.log('🧹 Cleaning up test environment...')
  
  // You can add any global cleanup logic here, such as:
  // - Stopping test servers
  // - Cleaning up test databases
  // - Closing external service connections
  
  console.log('✅ Test environment cleanup complete')
}