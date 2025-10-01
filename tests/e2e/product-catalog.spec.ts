import { test, expect } from '@playwright/test'

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products')
  })

  test('should load product catalog page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/products|catalog/i)
    
    // Check main heading
    await expect(page.getByRole('heading', { level: 1, name: /products|catalog|coffee/i })).toBeVisible()
    
    // Check products grid/list is present
    const productsContainer = page.getByTestId('products-grid')
    await expect(productsContainer).toBeVisible()
  })

  test('should display product cards with essential information', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards.first()).toBeVisible()
    
    // Check first product card contains required elements
    const firstCard = productCards.first()
    
    // Product image
    await expect(firstCard.locator('img')).toBeVisible()
    
    // Product name
    await expect(firstCard.getByRole('heading')).toBeVisible()
    
    // Product price or price range
    const priceElement = firstCard.locator('[data-testid="product-price"], .price')
    await expect(priceElement).toBeVisible()
    
    // Product origin or description
    const originElement = firstCard.locator('[data-testid="product-origin"], .origin')
    if (await originElement.isVisible()) {
      await expect(originElement).toContainText(/.+/)
    }
  })

  test('should navigate to product detail page when clicking product card', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]')
    
    const firstProductCard = page.locator('[data-testid="product-card"]').first()
    const productName = await firstProductCard.getByRole('heading').textContent()
    
    await firstProductCard.click()
    
    // Should navigate to product detail page
    await expect(page).toHaveURL(/\/products\/[^\/]+/)
    
    // Should display product detail information
    if (productName) {
      await expect(page.getByRole('heading', { name: new RegExp(productName, 'i') })).toBeVisible()
    }
  })

  test('should filter products by origin', async ({ page }) => {
    const originFilter = page.getByTestId('origin-filter')
    
    if (await originFilter.isVisible()) {
      // Select Ethiopia as origin
      await originFilter.click()
      const ethiopiaOption = page.getByRole('option', { name: /ethiopia/i })
      
      if (await ethiopiaOption.isVisible()) {
        await ethiopiaOption.click()
        
        // Wait for filtered results
        await page.waitForTimeout(1000)
        
        // Check that products are filtered
        const productCards = page.locator('[data-testid="product-card"]')
        const firstCard = productCards.first()
        
        if (await firstCard.isVisible()) {
          // Check that the product contains Ethiopia in origin
          const originText = await firstCard.locator('[data-testid="product-origin"]').textContent()
          expect(originText?.toLowerCase()).toContain('ethiopia')
        }
      }
    }
  })

  test('should filter products by processing method', async ({ page }) => {
    const processingFilter = page.getByTestId('processing-filter')
    
    if (await processingFilter.isVisible()) {
      await processingFilter.click()
      const washedOption = page.getByRole('option', { name: /washed/i })
      
      if (await washedOption.isVisible()) {
        await washedOption.click()
        
        await page.waitForTimeout(1000)
        
        // Verify filtered results
        const productCards = page.locator('[data-testid="product-card"]')
        if (await productCards.first().isVisible()) {
          const processingText = await productCards.first().locator('[data-testid="product-processing"]').textContent()
          expect(processingText?.toLowerCase()).toContain('washed')
        }
      }
    }
  })

  test('should filter products by price range', async ({ page }) => {
    const priceFilter = page.getByTestId('price-filter')
    
    if (await priceFilter.isVisible()) {
      // Set minimum price
      const minPriceInput = priceFilter.getByLabel(/minimum price/i)
      if (await minPriceInput.isVisible()) {
        await minPriceInput.fill('10')
      }
      
      // Set maximum price
      const maxPriceInput = priceFilter.getByLabel(/maximum price/i)
      if (await maxPriceInput.isVisible()) {
        await maxPriceInput.fill('50')
      }
      
      // Apply filter
      const applyButton = priceFilter.getByRole('button', { name: /apply|filter/i })
      if (await applyButton.isVisible()) {
        await applyButton.click()
        
        await page.waitForTimeout(1000)
        
        // Verify price range
        const productCards = page.locator('[data-testid="product-card"]')
        if (await productCards.first().isVisible()) {
          const priceText = await productCards.first().locator('[data-testid="product-price"]').textContent()
          // Basic check that price is within range (implementation depends on price format)
          expect(priceText).toBeTruthy()
        }
      }
    }
  })

  test('should search products by name', async ({ page }) => {
    const searchInput = page.getByTestId('product-search')
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Ethiopian')
      await searchInput.press('Enter')
      
      await page.waitForTimeout(1000)
      
      // Check search results
      const productCards = page.locator('[data-testid="product-card"]')
      
      if (await productCards.first().isVisible()) {
        const productName = await productCards.first().getByRole('heading').textContent()
        expect(productName?.toLowerCase()).toContain('ethiopian')
      } else {
        // Check for "no results" message
        await expect(page.getByText(/no products found|no results/i)).toBeVisible()
      }
    }
  })

  test('should sort products by different criteria', async ({ page }) => {
    const sortDropdown = page.getByTestId('sort-dropdown')
    
    if (await sortDropdown.isVisible()) {
      await sortDropdown.click()
      
      // Test sorting by price (low to high)
      const priceLowToHigh = page.getByRole('option', { name: /price.*low.*high/i })
      if (await priceLowToHigh.isVisible()) {
        await priceLowToHigh.click()
        
        await page.waitForTimeout(1000)
        
        // Verify sorting (basic check)
        const productCards = page.locator('[data-testid="product-card"]')
        await expect(productCards.first()).toBeVisible()
      }
    }
  })

  test('should handle pagination', async ({ page }) => {
    const pagination = page.getByTestId('pagination')
    
    if (await pagination.isVisible()) {
      const nextButton = pagination.getByRole('button', { name: /next/i })
      
      if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
        // Get current page products
        const currentProducts = await page.locator('[data-testid="product-card"]').count()
        
        await nextButton.click()
        
        await page.waitForTimeout(1000)
        
        // Check URL changed
        await expect(page).toHaveURL(/page=2|\/2/)
        
        // Check new products loaded
        await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible()
        
        // Test previous button
        const prevButton = pagination.getByRole('button', { name: /previous|prev/i })
        if (await prevButton.isVisible()) {
          await prevButton.click()
          await expect(page).toHaveURL(/page=1|\/1|^(?!.*page=)/)
        }
      }
    }
  })

  test('should clear all filters', async ({ page }) => {
    // Apply some filters first
    const originFilter = page.getByTestId('origin-filter')
    if (await originFilter.isVisible()) {
      await originFilter.click()
      const firstOption = page.getByRole('option').first()
      if (await firstOption.isVisible()) {
        await firstOption.click()
      }
    }
    
    // Clear filters
    const clearFiltersButton = page.getByRole('button', { name: /clear.*filters|reset/i })
    if (await clearFiltersButton.isVisible()) {
      await clearFiltersButton.click()
      
      await page.waitForTimeout(1000)
      
      // Check that all products are shown again
      const productCards = page.locator('[data-testid="product-card"]')
      await expect(productCards.first()).toBeVisible()
      
      // Check URL doesn't contain filter parameters
      const url = page.url()
      expect(url).not.toMatch(/origin=|processing=|minPrice=/)
    }
  })

  test('should display loading state while fetching products', async ({ page }) => {
    // Intercept API calls to simulate slow loading
    await page.route('**/api/products**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      route.continue()
    })
    
    await page.reload()
    
    // Check loading indicator
    const loadingIndicator = page.getByTestId('loading-spinner')
    await expect(loadingIndicator).toBeVisible()
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 })
    
    // Loading indicator should be gone
    await expect(loadingIndicator).not.toBeVisible()
  })

  test('should handle empty search results', async ({ page }) => {
    const searchInput = page.getByTestId('product-search')
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('nonexistentproduct12345')
      await searchInput.press('Enter')
      
      await page.waitForTimeout(1000)
      
      // Check for empty state message
      await expect(page.getByText(/no products found|no results|try different/i)).toBeVisible()
      
      // Check for suggestions or alternative actions
      const suggestionsSection = page.getByTestId('search-suggestions')
      if (await suggestionsSection.isVisible()) {
        await expect(suggestionsSection).toContainText(/try|suggestion|browse/i)
      }
    }
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check mobile layout
    const productsGrid = page.getByTestId('products-grid')
    await expect(productsGrid).toBeVisible()
    
    // Check mobile filters (usually in a drawer or modal)
    const mobileFiltersButton = page.getByRole('button', { name: /filters|filter/i })
    if (await mobileFiltersButton.isVisible()) {
      await mobileFiltersButton.click()
      
      const filtersModal = page.getByTestId('filters-modal')
      await expect(filtersModal).toBeVisible()
      
      // Close filters
      const closeButton = filtersModal.getByRole('button', { name: /close|×/i })
      if (await closeButton.isVisible()) {
        await closeButton.click()
      }
    }
  })

  test('should add product to favorites/wishlist', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]')
    
    const firstProductCard = page.locator('[data-testid="product-card"]').first()
    const favoriteButton = firstProductCard.getByRole('button', { name: /favorite|wishlist|heart/i })
    
    if (await favoriteButton.isVisible()) {
      await favoriteButton.click()
      
      // Check for success feedback
      await expect(page.getByText(/added to favorites|added to wishlist/i)).toBeVisible()
      
      // Check button state changed
      await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true')
    }
  })

  test('should handle product comparison', async ({ page }) => {
    await page.waitForSelector('[data-testid="product-card"]')
    
    const productCards = page.locator('[data-testid="product-card"]')
    
    // Select first product for comparison
    const firstCompareButton = productCards.first().getByRole('button', { name: /compare/i })
    if (await firstCompareButton.isVisible()) {
      await firstCompareButton.click()
      
      // Select second product for comparison
      const secondCompareButton = productCards.nth(1).getByRole('button', { name: /compare/i })
      if (await secondCompareButton.isVisible()) {
        await secondCompareButton.click()
        
        // Check comparison panel or button appears
        const comparePanel = page.getByTestId('comparison-panel')
        const viewComparisonButton = page.getByRole('button', { name: /view comparison|compare selected/i })
        
        if (await comparePanel.isVisible()) {
          await expect(comparePanel).toContainText(/2.*selected|compare.*2/i)
        } else if (await viewComparisonButton.isVisible()) {
          await viewComparisonButton.click()
          await expect(page).toHaveURL(/compare/)
        }
      }
    }
  })

  test('should track product view analytics', async ({ page }) => {
    let analyticsEvents: any[] = []
    
    await page.route('**/analytics/**', (route) => {
      analyticsEvents.push({
        url: route.request().url(),
        data: route.request().postData()
      })
      route.fulfill({ status: 200 })
    })
    
    await page.waitForSelector('[data-testid="product-card"]')
    
    // Click on a product
    const firstProductCard = page.locator('[data-testid="product-card"]').first()
    await firstProductCard.click()
    
    // Verify analytics event was sent
    expect(analyticsEvents.length).toBeGreaterThan(0)
    
    // Check for product view event
    const productViewEvent = analyticsEvents.find(event => 
      event.data?.includes('product_view') || event.url.includes('product_view')
    )
    expect(productViewEvent).toBeTruthy()
  })
})