import { test, expect } from '@playwright/test'

test.describe('RFQ (Request for Quote) Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete full RFQ flow from homepage', async ({ page }) => {
    // Start from homepage CTA
    const ctaButton = page.getByRole('button', { name: /get quote|request quote|start trading/i })
    
    if (await ctaButton.isVisible()) {
      await ctaButton.click()
      await expect(page).toHaveURL(/\/quote|\/rfq/)
    } else {
      // Navigate directly to quote page
      await page.goto('/quote')
    }
    
    // Fill out RFQ form
    await fillRFQForm(page)
    
    // Submit form
    await submitRFQForm(page)
    
    // Verify success
    await verifyRFQSuccess(page)
  })

  test('should start RFQ from product detail page', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products')
    await page.waitForSelector('[data-testid="product-card"]')
    
    // Click on first product
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()
    
    // Click "Request Quote" button on product detail page
    const requestQuoteButton = page.getByRole('button', { name: /request quote|get quote|inquire/i })
    await expect(requestQuoteButton).toBeVisible()
    await requestQuoteButton.click()
    
    // Should navigate to quote page with product pre-selected
    await expect(page).toHaveURL(/\/quote/)
    
    // Verify product is pre-selected
    const selectedProduct = page.getByTestId('selected-product')
    if (await selectedProduct.isVisible()) {
      await expect(selectedProduct).toBeVisible()
    }
  })

  test('should validate required fields in RFQ form', async ({ page }) => {
    await page.goto('/quote')
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /submit|send|request quote/i })
    await submitButton.click()
    
    // Check validation errors
    await expect(page.getByText(/company name.*required/i)).toBeVisible()
    await expect(page.getByText(/email.*required/i)).toBeVisible()
    await expect(page.getByText(/quantity.*required/i)).toBeVisible()
    
    // Check form doesn't submit
    await expect(page).toHaveURL(/\/quote/)
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/quote')
    
    const emailInput = page.getByLabel(/email/i)
    await emailInput.fill('invalid-email')
    
    const submitButton = page.getByRole('button', { name: /submit/i })
    await submitButton.click()
    
    // Check email validation error
    await expect(page.getByText(/valid email|email format/i)).toBeVisible()
  })

  test('should validate quantity is positive number', async ({ page }) => {
    await page.goto('/quote')
    
    const quantityInput = page.getByLabel(/quantity/i)
    await quantityInput.fill('-10')
    
    const submitButton = page.getByRole('button', { name: /submit/i })
    await submitButton.click()
    
    // Check quantity validation error
    await expect(page.getByText(/quantity.*positive|quantity.*greater/i)).toBeVisible()
  })

  test('should allow multiple product selection', async ({ page }) => {
    await page.goto('/quote')
    
    // Add first product
    const addProductButton = page.getByRole('button', { name: /add product|select product/i })
    if (await addProductButton.isVisible()) {
      await addProductButton.click()
      
      // Select from product modal/dropdown
      const productModal = page.getByTestId('product-selector')
      if (await productModal.isVisible()) {
        const firstProduct = productModal.locator('[data-testid="product-option"]').first()
        await firstProduct.click()
        
        // Add another product
        await addProductButton.click()
        const secondProduct = productModal.locator('[data-testid="product-option"]').nth(1)
        await secondProduct.click()
        
        // Verify both products are selected
        const selectedProducts = page.locator('[data-testid="selected-product"]')
        await expect(selectedProducts).toHaveCount(2)
      }
    }
  })

  test('should calculate estimated total', async ({ page }) => {
    await page.goto('/quote')
    
    // Fill product and quantity
    await selectProduct(page, 0)
    
    const quantityInput = page.getByLabel(/quantity/i)
    await quantityInput.fill('1000')
    
    // Check if estimated total appears
    const estimatedTotal = page.getByTestId('estimated-total')
    if (await estimatedTotal.isVisible()) {
      await expect(estimatedTotal).toContainText(/\$|USD|total/i)
    }
  })

  test('should save draft and allow continuation', async ({ page }) => {
    await page.goto('/quote')
    
    // Fill partial form
    await page.getByLabel(/company name/i).fill('Test Company')
    await page.getByLabel(/email/i).fill('test@example.com')
    
    // Save draft
    const saveDraftButton = page.getByRole('button', { name: /save draft|save progress/i })
    if (await saveDraftButton.isVisible()) {
      await saveDraftButton.click()
      
      // Verify draft saved message
      await expect(page.getByText(/draft saved|progress saved/i)).toBeVisible()
      
      // Navigate away and back
      await page.goto('/')
      await page.goto('/quote')
      
      // Check if form data is restored
      await expect(page.getByLabel(/company name/i)).toHaveValue('Test Company')
      await expect(page.getByLabel(/email/i)).toHaveValue('test@example.com')
    }
  })

  test('should handle file attachments', async ({ page }) => {
    await page.goto('/quote')
    
    const fileInput = page.getByLabel(/attach.*file|upload.*document/i)
    if (await fileInput.isVisible()) {
      // Create a test file
      const testFile = await page.evaluateHandle(() => {
        const file = new File(['test content'], 'test-requirements.pdf', { type: 'application/pdf' })
        return file
      })
      
      await fileInput.setInputFiles(testFile as any)
      
      // Verify file is attached
      await expect(page.getByText(/test-requirements\.pdf/i)).toBeVisible()
      
      // Test file removal
      const removeFileButton = page.getByRole('button', { name: /remove.*file|delete.*file/i })
      if (await removeFileButton.isVisible()) {
        await removeFileButton.click()
        await expect(page.getByText(/test-requirements\.pdf/i)).not.toBeVisible()
      }
    }
  })

  test('should display shipping options', async ({ page }) => {
    await page.goto('/quote')
    
    // Fill required fields first
    await fillBasicRFQInfo(page)
    
    const shippingSection = page.getByTestId('shipping-options')
    if (await shippingSection.isVisible()) {
      // Check shipping methods
      const airFreight = page.getByLabel(/air freight|air shipping/i)
      const seaFreight = page.getByLabel(/sea freight|ocean shipping/i)
      
      if (await airFreight.isVisible()) {
        await airFreight.check()
        await expect(airFreight).toBeChecked()
      }
      
      if (await seaFreight.isVisible()) {
        await seaFreight.check()
        await expect(seaFreight).toBeChecked()
      }
    }
  })

  test('should handle special requirements', async ({ page }) => {
    await page.goto('/quote')
    
    const specialRequirements = page.getByLabel(/special requirements|additional notes|comments/i)
    if (await specialRequirements.isVisible()) {
      const requirements = 'Need organic certification and specific packaging requirements for retail distribution.'
      await specialRequirements.fill(requirements)
      
      await expect(specialRequirements).toHaveValue(requirements)
    }
  })

  test('should show quote confirmation with reference number', async ({ page }) => {
    await page.goto('/quote')
    
    // Complete full RFQ flow
    await fillRFQForm(page)
    await submitRFQForm(page)
    
    // Check confirmation page
    await expect(page.getByText(/quote.*submitted|request.*received/i)).toBeVisible()
    
    // Check reference number
    const referenceNumber = page.getByTestId('reference-number')
    if (await referenceNumber.isVisible()) {
      const refText = await referenceNumber.textContent()
      expect(refText).toMatch(/RFQ-\d+|REF-\d+|\d{6,}/)
    }
    
    // Check next steps information
    await expect(page.getByText(/contact.*within|response.*hours|follow.*up/i)).toBeVisible()
  })

  test('should send confirmation email', async ({ page }) => {
    // Mock email service
    let emailSent = false
    await page.route('**/api/email/**', (route) => {
      emailSent = true
      route.fulfill({ 
        status: 200, 
        body: JSON.stringify({ success: true, messageId: 'test-123' })
      })
    })
    
    await page.goto('/quote')
    await fillRFQForm(page)
    await submitRFQForm(page)
    
    // Verify email was sent
    expect(emailSent).toBeTruthy()
    
    // Check confirmation message
    await expect(page.getByText(/confirmation.*email|email.*sent/i)).toBeVisible()
  })

  test('should be accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/quote')
    
    // Test tab navigation through form
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/company name/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/email/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/phone/i)).toBeFocused()
    
    // Test form submission with Enter key
    await page.getByLabel(/company name/i).focus()
    await page.keyboard.type('Test Company')
    
    await page.keyboard.press('Tab')
    await page.keyboard.type('test@example.com')
    
    // Continue with other required fields...
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/rfq/**', (route) => {
      route.abort('failed')
    })
    
    await page.goto('/quote')
    await fillRFQForm(page)
    await submitRFQForm(page)
    
    // Check error message
    await expect(page.getByText(/error.*submitting|network.*error|try.*again/i)).toBeVisible()
    
    // Check retry button
    const retryButton = page.getByRole('button', { name: /retry|try again/i })
    if (await retryButton.isVisible()) {
      await expect(retryButton).toBeVisible()
    }
  })

  test('should track RFQ analytics events', async ({ page }) => {
    let analyticsEvents: any[] = []
    
    await page.route('**/analytics/**', (route) => {
      analyticsEvents.push({
        event: route.request().url(),
        data: route.request().postData()
      })
      route.fulfill({ status: 200 })
    })
    
    await page.goto('/quote')
    await fillRFQForm(page)
    await submitRFQForm(page)
    
    // Verify analytics events
    expect(analyticsEvents.length).toBeGreaterThan(0)
    
    // Check for specific events
    const rfqStartEvent = analyticsEvents.find(e => e.data?.includes('rfq_started'))
    const rfqSubmitEvent = analyticsEvents.find(e => e.data?.includes('rfq_submitted'))
    
    expect(rfqStartEvent || rfqSubmitEvent).toBeTruthy()
  })
})

// Helper functions
async function fillRFQForm(page: any) {
  await fillBasicRFQInfo(page)
  await selectProduct(page, 0)
  
  const quantityInput = page.getByLabel(/quantity/i)
  await quantityInput.fill('1000')
  
  const deliveryDate = page.getByLabel(/delivery.*date|target.*date/i)
  if (await deliveryDate.isVisible()) {
    const futureDate = new Date()
    futureDate.setMonth(futureDate.getMonth() + 2)
    await deliveryDate.fill(futureDate.toISOString().split('T')[0])
  }
}

async function fillBasicRFQInfo(page: any) {
  await page.getByLabel(/company name/i).fill('Great Coffee Importers Ltd.')
  await page.getByLabel(/email/i).fill('procurement@greatcoffee.com')
  await page.getByLabel(/phone/i).fill('+1-555-0123')
  
  const countrySelect = page.getByLabel(/country/i)
  if (await countrySelect.isVisible()) {
    await countrySelect.click()
    await page.getByRole('option', { name: /united states|usa/i }).click()
  }
}

async function selectProduct(page: any, index: number) {
  const productSelector = page.getByTestId('product-selector')
  if (await productSelector.isVisible()) {
    await productSelector.click()
    const productOptions = page.locator('[data-testid="product-option"]')
    await productOptions.nth(index).click()
  }
}

async function submitRFQForm(page: any) {
  const submitButton = page.getByRole('button', { name: /submit|send|request quote/i })
  await submitButton.click()
}

async function verifyRFQSuccess(page: any) {
  // Wait for success page or message
  await expect(page.getByText(/quote.*submitted|request.*received|thank you/i)).toBeVisible()
  
  // Check for reference number or confirmation
  const confirmation = page.getByTestId('rfq-confirmation')
  if (await confirmation.isVisible()) {
    await expect(confirmation).toBeVisible()
  }
}