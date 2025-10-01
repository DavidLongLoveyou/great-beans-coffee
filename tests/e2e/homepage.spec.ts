import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/The Great Beans/i)
    
    // Check main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // Check navigation is present
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('should display hero section with CTA', async ({ page }) => {
    // Check hero section exists
    const heroSection = page.getByTestId('hero-section')
    await expect(heroSection).toBeVisible()
    
    // Check main CTA button
    const ctaButton = page.getByRole('button', { name: /get quote|request quote|start trading/i })
    await expect(ctaButton).toBeVisible()
    
    // Check hero image or video
    const heroMedia = page.locator('[data-testid="hero-media"], .hero-image, .hero-video')
    await expect(heroMedia).toBeVisible()
  })

  test('should navigate to products page from hero CTA', async ({ page }) => {
    const ctaButton = page.getByRole('button', { name: /explore products|view products|browse catalog/i })
    
    if (await ctaButton.isVisible()) {
      await ctaButton.click()
      await expect(page).toHaveURL(/\/products/)
    }
  })

  test('should display featured products section', async ({ page }) => {
    const featuredSection = page.getByTestId('featured-products')
    await expect(featuredSection).toBeVisible()
    
    // Check section heading
    await expect(page.getByRole('heading', { name: /featured|premium|popular/i })).toBeVisible()
    
    // Check at least one product card
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards.first()).toBeVisible()
    
    // Check product card contains essential information
    const firstCard = productCards.first()
    await expect(firstCard.getByRole('heading')).toBeVisible() // Product name
    await expect(firstCard.locator('img')).toBeVisible() // Product image
  })

  test('should display market insights section', async ({ page }) => {
    const marketSection = page.getByTestId('market-insights')
    
    if (await marketSection.isVisible()) {
      // Check section heading
      await expect(page.getByRole('heading', { name: /market|insights|trends/i })).toBeVisible()
      
      // Check charts or data visualizations
      const charts = page.locator('[data-testid="market-chart"], .chart, canvas')
      await expect(charts.first()).toBeVisible()
    }
  })

  test('should display company information section', async ({ page }) => {
    const aboutSection = page.getByTestId('about-section')
    
    if (await aboutSection.isVisible()) {
      await expect(page.getByRole('heading', { name: /about|company|who we are/i })).toBeVisible()
      
      // Check company description text
      await expect(aboutSection.locator('p')).toBeVisible()
    }
  })

  test('should display testimonials section', async ({ page }) => {
    const testimonialsSection = page.getByTestId('testimonials')
    
    if (await testimonialsSection.isVisible()) {
      await expect(page.getByRole('heading', { name: /testimonials|reviews|clients/i })).toBeVisible()
      
      // Check at least one testimonial
      const testimonials = page.locator('[data-testid="testimonial"]')
      await expect(testimonials.first()).toBeVisible()
    }
  })

  test('should have working navigation menu', async ({ page }) => {
    const navigation = page.getByRole('navigation')
    
    // Check main navigation links
    const productsLink = navigation.getByRole('link', { name: /products/i })
    const servicesLink = navigation.getByRole('link', { name: /services/i })
    const aboutLink = navigation.getByRole('link', { name: /about/i })
    const contactLink = navigation.getByRole('link', { name: /contact/i })
    
    // Test products navigation
    if (await productsLink.isVisible()) {
      await productsLink.click()
      await expect(page).toHaveURL(/\/products/)
      await page.goBack()
    }
    
    // Test services navigation
    if (await servicesLink.isVisible()) {
      await servicesLink.click()
      await expect(page).toHaveURL(/\/services/)
      await page.goBack()
    }
  })

  test('should have working footer links', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()
    
    // Check important footer links
    const privacyLink = footer.getByRole('link', { name: /privacy/i })
    const termsLink = footer.getByRole('link', { name: /terms/i })
    
    if (await privacyLink.isVisible()) {
      await expect(privacyLink).toHaveAttribute('href', /privacy/)
    }
    
    if (await termsLink.isVisible()) {
      await expect(termsLink).toHaveAttribute('href', /terms/)
    }
  })

  test('should display contact information', async ({ page }) => {
    const contactSection = page.getByTestId('contact-info')
    
    if (await contactSection.isVisible()) {
      // Check for email
      const emailLink = contactSection.getByRole('link', { name: /@/ })
      if (await emailLink.isVisible()) {
        await expect(emailLink).toHaveAttribute('href', /mailto:/)
      }
      
      // Check for phone
      const phoneLink = contactSection.getByRole('link', { name: /\+|\d{3}/ })
      if (await phoneLink.isVisible()) {
        await expect(phoneLink).toHaveAttribute('href', /tel:/)
      }
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check mobile navigation (hamburger menu)
    const mobileMenuButton = page.getByRole('button', { name: /menu|navigation/i })
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      
      // Check mobile menu is open
      const mobileMenu = page.getByTestId('mobile-menu')
      await expect(mobileMenu).toBeVisible()
      
      // Check navigation links in mobile menu
      await expect(mobileMenu.getByRole('link', { name: /products/i })).toBeVisible()
    }
    
    // Check hero section is still visible and properly sized
    const heroSection = page.getByTestId('hero-section')
    await expect(heroSection).toBeVisible()
  })

  test('should have proper SEO elements', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.+/)
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', /.+/)
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    const ogDescription = page.locator('meta[property="og:description"]')
    const ogImage = page.locator('meta[property="og:image"]')
    
    await expect(ogTitle).toHaveAttribute('content', /.+/)
    await expect(ogDescription).toHaveAttribute('content', /.+/)
    await expect(ogImage).toHaveAttribute('content', /.+/)
  })

  test('should load without accessibility violations', async ({ page }) => {
    // Check for basic accessibility requirements
    
    // All images should have alt text
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const ariaLabel = await img.getAttribute('aria-label')
      const ariaLabelledby = await img.getAttribute('aria-labelledby')
      
      // Image should have alt text, aria-label, or aria-labelledby
      expect(alt !== null || ariaLabel !== null || ariaLabelledby !== null).toBeTruthy()
    }
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1) // Should have exactly one h1
    
    // Check for skip links
    const skipLink = page.getByRole('link', { name: /skip to main content/i })
    if (await skipLink.isVisible()) {
      await expect(skipLink).toHaveAttribute('href', '#main')
    }
  })

  test('should handle language switching', async ({ page }) => {
    const languageSwitcher = page.getByTestId('language-switcher')
    
    if (await languageSwitcher.isVisible()) {
      // Test switching to Vietnamese
      const vietnameseOption = languageSwitcher.getByRole('option', { name: /vietnamese|tiếng việt|vi/i })
      
      if (await vietnameseOption.isVisible()) {
        await vietnameseOption.click()
        
        // Check URL contains locale
        await expect(page).toHaveURL(/\/vi\//)
        
        // Check page content is in Vietnamese
        await expect(page.getByText(/cà phê|hạt cà phê|xuất khẩu/i)).toBeVisible()
      }
    }
  })

  test('should track analytics events', async ({ page }) => {
    // Mock analytics tracking
    let analyticsEvents: any[] = []
    
    await page.route('**/analytics/**', (route) => {
      analyticsEvents.push(route.request().postData())
      route.fulfill({ status: 200 })
    })
    
    await page.route('**/gtag/**', (route) => {
      analyticsEvents.push(route.request().url())
      route.fulfill({ status: 200 })
    })
    
    // Trigger some user interactions
    const ctaButton = page.getByRole('button', { name: /get quote|request quote/i })
    if (await ctaButton.isVisible()) {
      await ctaButton.click()
    }
    
    // Check if analytics events were fired
    // Note: This is a basic check - in real implementation, you'd verify specific event data
    expect(analyticsEvents.length).toBeGreaterThan(0)
  })
})