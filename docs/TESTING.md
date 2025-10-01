# Testing Guide for The Great Beans

This document provides comprehensive guidelines for testing in The Great Beans coffee export platform. Our testing strategy ensures code quality, reliability, and maintainability across all features.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Stack](#testing-stack)
- [Project Structure](#project-structure)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Test Scripts](#test-scripts)
- [Best Practices](#best-practices)
- [Coverage Requirements](#coverage-requirements)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Testing Philosophy

We follow the **Testing Pyramid** approach:

```
    /\
   /  \     E2E Tests (Few)
  /____\    - Critical user journeys
 /      \   - Cross-browser compatibility
/__________\ Integration Tests (Some)
            - API endpoints
            - Component integration
____________ Unit Tests (Many)
            - Pure functions
            - Components
            - Hooks
            - Utilities
```

### Core Principles

1. **Test Behavior, Not Implementation** - Focus on what the code does, not how it does it
2. **Write Tests First** - TDD approach for critical business logic
3. **Maintainable Tests** - Tests should be easy to read and update
4. **Fast Feedback** - Unit tests should run quickly for rapid development
5. **Realistic E2E Tests** - End-to-end tests should simulate real user scenarios

## Testing Stack

### Unit & Integration Testing
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers

### End-to-End Testing
- **Playwright** - Cross-browser E2E testing
- **Multiple browsers** - Chrome, Firefox, Safari, Edge
- **Mobile testing** - iOS Safari, Android Chrome

### Utilities
- **Faker.js** - Test data generation
- **MSW (Mock Service Worker)** - API mocking
- **Custom test utilities** - Project-specific helpers

## Project Structure

```
src/
├── test/
│   ├── utils/
│   │   ├── index.ts          # Main test utilities export
│   │   ├── render.tsx        # Custom render function
│   │   ├── mocks.ts          # Mock utilities and factories
│   │   ├── helpers.ts        # Test helper functions
│   │   └── factories.ts      # Data factories
│   └── setup.ts              # Jest setup configuration
├── components/
│   └── **/__tests__/         # Component unit tests
├── hooks/
│   └── **/__tests__/         # Hook unit tests
├── lib/
│   └── **/__tests__/         # Utility unit tests
└── app/
    └── **/__tests__/         # Page integration tests

tests/
├── e2e/
│   ├── homepage.spec.ts      # Homepage E2E tests
│   ├── product-catalog.spec.ts # Product catalog E2E tests
│   ├── rfq-flow.spec.ts      # RFQ flow E2E tests
│   ├── global-setup.ts       # E2E setup
│   └── global-teardown.ts    # E2E cleanup
└── fixtures/                 # Test data files
```

## Unit Testing

### Component Testing

```typescript
// Example: Button component test
import { render, screen } from '@/test/utils'
import { Button } from '../button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const { user } = render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
  })
})
```

### Hook Testing

```typescript
// Example: Custom hook test
import { renderHook, waitFor } from '@/test/utils'
import { useCoffeeProducts } from '../use-coffee-products'

describe('useCoffeeProducts', () => {
  it('loads products on mount', async () => {
    const { result } = renderHook(() => useCoffeeProducts())
    
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.products).toHaveLength(10)
  })
})
```

### Utility Testing

```typescript
// Example: Utility function test
import { formatPrice } from '../price-utils'

describe('formatPrice', () => {
  it('formats USD prices correctly', () => {
    expect(formatPrice(1234.56, 'USD')).toBe('$1,234.56')
  })

  it('handles zero values', () => {
    expect(formatPrice(0, 'USD')).toBe('$0.00')
  })

  it('throws error for invalid currency', () => {
    expect(() => formatPrice(100, 'INVALID')).toThrow('Invalid currency')
  })
})
```

## Integration Testing

### API Route Testing

```typescript
// Example: API route integration test
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/products/route'

describe('/api/products', () => {
  it('returns products list', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { page: '1', limit: '10' }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.products).toHaveLength(10)
    expect(data.pagination).toBeDefined()
  })
})
```

### Component Integration Testing

```typescript
// Example: Feature component integration test
import { render, screen, waitFor } from '@/test/utils'
import { ProductCatalog } from '../ProductCatalog'

describe('ProductCatalog Integration', () => {
  it('loads and displays products', async () => {
    render(<ProductCatalog />)
    
    expect(screen.getByText('Loading products...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Ethiopian Yirgacheffe')).toBeInTheDocument()
    })
    
    expect(screen.getAllByTestId('product-card')).toHaveLength(12)
  })

  it('filters products by origin', async () => {
    const { user } = render(<ProductCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('Ethiopian Yirgacheffe')).toBeInTheDocument()
    })
    
    await user.selectOptions(screen.getByLabelText('Origin'), 'Ethiopia')
    
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(3)
    })
  })
})
```

## End-to-End Testing

### Page Testing

```typescript
// Example: E2E page test
import { test, expect } from '@playwright/test'

test.describe('Product Catalog Page', () => {
  test('should display products and allow filtering', async ({ page }) => {
    await page.goto('/products')
    
    // Wait for products to load
    await expect(page.getByTestId('product-card')).toHaveCount(12)
    
    // Test filtering
    await page.getByLabel('Origin').selectOption('Ethiopia')
    await expect(page.getByTestId('product-card')).toHaveCount(3)
    
    // Test product navigation
    await page.getByTestId('product-card').first().click()
    await expect(page).toHaveURL(/\/products\/[^\/]+/)
  })
})
```

### User Journey Testing

```typescript
// Example: Complete user flow test
test('RFQ submission flow', async ({ page }) => {
  // Start from homepage
  await page.goto('/')
  await page.getByRole('button', { name: 'Get Quote' }).click()
  
  // Fill RFQ form
  await page.getByLabel('Company Name').fill('Test Company')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Quantity').fill('1000')
  
  // Submit and verify
  await page.getByRole('button', { name: 'Submit Quote' }).click()
  await expect(page.getByText('Quote submitted successfully')).toBeVisible()
})
```

## Test Scripts

### Available Commands

```bash
# Unit Tests
npm run test                    # Run all unit tests
npm run test:watch             # Run tests in watch mode
npm run test:watchAll          # Watch all files for changes
npm run test:coverage          # Run tests with coverage report
npm run test:coverage:watch    # Coverage in watch mode
npm run test:coverage:ci       # Coverage for CI (no watch)
npm run test:unit              # Run only unit tests
npm run test:integration       # Run only integration tests

# E2E Tests
npm run test:e2e               # Run E2E tests headless
npm run test:e2e:ui            # Run E2E tests with UI
npm run test:e2e:headed        # Run E2E tests with browser visible
npm run test:e2e:debug         # Debug E2E tests
npm run test:e2e:report        # Show E2E test report
npm run test:e2e:install       # Install Playwright browsers

# Combined
npm run test:all               # Run unit + E2E tests
npm run test:ci                # Run all tests for CI
```

### Development Workflow

```bash
# During development
npm run test:watch             # Keep unit tests running
npm run test:e2e:ui           # Debug E2E tests visually

# Before committing
npm run test:coverage         # Check coverage
npm run test:e2e             # Run E2E tests

# CI/CD pipeline
npm run test:ci              # Full test suite
```

## Best Practices

### General Guidelines

1. **Test Names Should Be Descriptive**
   ```typescript
   // ❌ Bad
   it('works')
   
   // ✅ Good
   it('should display error message when email is invalid')
   ```

2. **Use Data Test IDs for E2E Tests**
   ```typescript
   // Component
   <button data-testid="submit-button">Submit</button>
   
   // Test
   await page.getByTestId('submit-button').click()
   ```

3. **Mock External Dependencies**
   ```typescript
   // Mock API calls
   jest.mock('@/lib/api', () => ({
     fetchProducts: jest.fn().mockResolvedValue(mockProducts)
   }))
   ```

4. **Test Error States**
   ```typescript
   it('displays error when API fails', async () => {
     mockFetchProducts.mockRejectedValue(new Error('API Error'))
     render(<ProductList />)
     
     await waitFor(() => {
       expect(screen.getByText('Failed to load products')).toBeInTheDocument()
     })
   })
   ```

### Component Testing Best Practices

1. **Test User Interactions**
   ```typescript
   it('submits form when valid data is entered', async () => {
     const onSubmit = jest.fn()
     const { user } = render(<ContactForm onSubmit={onSubmit} />)
     
     await user.type(screen.getByLabelText('Email'), 'test@example.com')
     await user.click(screen.getByRole('button', { name: 'Submit' }))
     
     expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
   })
   ```

2. **Test Accessibility**
   ```typescript
   it('is accessible', async () => {
     const { container } = render(<Button>Click me</Button>)
     const results = await axe(container)
     expect(results).toHaveNoViolations()
   })
   ```

3. **Test Different States**
   ```typescript
   describe('Button states', () => {
     it('renders loading state', () => {
       render(<Button loading>Submit</Button>)
       expect(screen.getByRole('button')).toBeDisabled()
       expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
     })
   })
   ```

### E2E Testing Best Practices

1. **Use Page Object Model**
   ```typescript
   class ProductPage {
     constructor(private page: Page) {}
     
     async goto() {
       await this.page.goto('/products')
     }
     
     async filterByOrigin(origin: string) {
       await this.page.getByLabel('Origin').selectOption(origin)
     }
   }
   ```

2. **Wait for Elements Properly**
   ```typescript
   // ❌ Bad - arbitrary wait
   await page.waitForTimeout(2000)
   
   // ✅ Good - wait for specific condition
   await expect(page.getByTestId('product-card')).toHaveCount(12)
   ```

3. **Test Critical Paths Only**
   - Focus on user journeys that generate revenue
   - Test core functionality, not every edge case
   - Prioritize tests that catch regressions

## Coverage Requirements

### Minimum Coverage Targets

- **Overall Coverage**: 80%
- **Critical Business Logic**: 95%
- **UI Components**: 70%
- **Utility Functions**: 90%
- **API Routes**: 85%

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/test/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/domain/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  }
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "npm run test -- --findRelatedTests --passWithNoTests"
    ]
  }
}
```

## Troubleshooting

### Common Issues

1. **Tests Timing Out**
   ```typescript
   // Increase timeout for slow operations
   it('loads large dataset', async () => {
     // ... test code
   }, 10000) // 10 second timeout
   ```

2. **Flaky E2E Tests**
   ```typescript
   // Use proper waits instead of timeouts
   await expect(page.getByText('Success')).toBeVisible({ timeout: 10000 })
   ```

3. **Memory Issues in Jest**
   ```bash
   # Increase memory limit
   node --max-old-space-size=4096 node_modules/.bin/jest
   ```

4. **Playwright Browser Issues**
   ```bash
   # Reinstall browsers
   npx playwright install
   
   # Run with specific browser
   npx playwright test --project=chromium
   ```

### Debug Commands

```bash
# Debug Jest tests
npm run test -- --detectOpenHandles --forceExit

# Debug Playwright tests
npm run test:e2e:debug

# Run specific test file
npm run test -- Button.test.tsx

# Run tests matching pattern
npm run test -- --testNamePattern="should render"
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

For questions or suggestions about testing practices, please reach out to the development team or create an issue in the project repository.