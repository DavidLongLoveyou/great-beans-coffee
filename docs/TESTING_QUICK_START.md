# Testing Quick Start Guide

Get up and running with testing in The Great Beans project in 5 minutes.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
npm run test:e2e:install  # Install Playwright browsers
```

### 2. Run Your First Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 📝 Writing Your First Test

### Unit Test Example
Create `src/components/ui/__tests__/my-component.test.tsx`:

```typescript
import { render, screen } from '@/test/utils'
import { MyComponent } from '../my-component'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Hello World" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const { user } = render(<MyComponent onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### E2E Test Example
Create `tests/e2e/my-feature.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('My Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/my-feature')
    
    await page.getByLabel('Input field').fill('test value')
    await page.getByRole('button', { name: 'Submit' }).click()
    
    await expect(page.getByText('Success!')).toBeVisible()
  })
})
```

## 🛠️ Essential Commands

```bash
# Development
npm run test:watch          # Watch unit tests
npm run test:e2e:ui        # Debug E2E tests visually

# Coverage
npm run test:coverage      # Generate coverage report

# Debugging
npm run test:e2e:debug     # Debug E2E tests step by step
npm run test -- --verbose # Verbose unit test output

# CI/Production
npm run test:ci           # Run all tests for CI
```

## 🎯 Testing Checklist

Before committing code, ensure:

- [ ] Unit tests pass: `npm run test`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] Coverage meets requirements: `npm run test:coverage`
- [ ] No linting errors: `npm run lint`

## 📚 Common Patterns

### Testing Forms
```typescript
it('submits form with valid data', async () => {
  const onSubmit = jest.fn()
  const { user } = render(<ContactForm onSubmit={onSubmit} />)
  
  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.type(screen.getByLabelText('Message'), 'Hello world')
  await user.click(screen.getByRole('button', { name: 'Submit' }))
  
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    message: 'Hello world'
  })
})
```

### Testing API Calls
```typescript
import { mockFetch } from '@/test/utils/mocks'

it('loads data from API', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ products: [{ id: 1, name: 'Coffee' }] })
  })
  
  render(<ProductList />)
  
  await waitFor(() => {
    expect(screen.getByText('Coffee')).toBeInTheDocument()
  })
})
```

### Testing Navigation
```typescript
// E2E test
test('navigates between pages', async ({ page }) => {
  await page.goto('/')
  
  await page.getByRole('link', { name: 'Products' }).click()
  await expect(page).toHaveURL('/products')
  
  await page.getByTestId('product-card').first().click()
  await expect(page).toHaveURL(/\/products\/\d+/)
})
```

## 🔧 Troubleshooting

### Test Fails Randomly
```typescript
// Use proper waits instead of timeouts
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
}, { timeout: 5000 })
```

### E2E Test Times Out
```typescript
// Increase timeout for slow operations
test('slow operation', async ({ page }) => {
  test.setTimeout(60000) // 60 seconds
  // ... test code
})
```

### Mock Not Working
```typescript
// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})
```

## 📖 Next Steps

1. Read the full [Testing Guide](./TESTING.md)
2. Check out existing tests in the codebase
3. Set up your IDE with testing extensions
4. Join the team's testing discussions

## 🆘 Need Help?

- Check the [Testing Guide](./TESTING.md) for detailed information
- Look at existing tests for examples
- Ask the team in Slack #development channel
- Create an issue for testing-related bugs

---

Happy testing! 🧪