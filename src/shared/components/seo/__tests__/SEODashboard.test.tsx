import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SEODashboard } from '../SEODashboard'

// Mock the performance monitoring hooks
jest.mock('@/shared/hooks/use-performance-metrics', () => ({
  usePerformanceMetrics: () => ({
    metrics: {
      lcp: 2.1,
      fid: 85,
      cls: 0.08,
      fcp: 1.2,
      ttfb: 180,
    },
    loading: false,
    error: null,
  }),
}))

jest.mock('@/shared/hooks/use-seo-analysis', () => ({
  useSEOAnalysis: () => ({
    analysis: {
      score: 85,
      issues: [
        {
          type: 'warning',
          message: 'Meta description is too short',
          element: 'meta[name="description"]',
          recommendation: 'Increase meta description length to 150-160 characters',
        },
        {
          type: 'error',
          message: 'Missing alt text on image',
          element: 'img[src="/hero-image.jpg"]',
          recommendation: 'Add descriptive alt text to improve accessibility',
        },
      ],
      recommendations: [
        'Add structured data for better search visibility',
        'Optimize images for faster loading',
        'Improve internal linking structure',
      ],
      technicalSEO: {
        hasRobotsTxt: true,
        hasSitemap: true,
        hasSSL: true,
        mobileOptimized: true,
        pageSpeed: 'good',
      },
    },
    loading: false,
    error: null,
    refreshAnalysis: jest.fn(),
  }),
}))

describe('SEODashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the dashboard with all sections', () => {
    render(<SEODashboard />)

    // Check main sections are present
    expect(screen.getByText('SEO Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
    expect(screen.getByText('SEO Analysis')).toBeInTheDocument()
    expect(screen.getByText('Technical SEO')).toBeInTheDocument()
  })

  it('displays performance metrics correctly', () => {
    render(<SEODashboard />)

    // Check Core Web Vitals
    expect(screen.getByText('LCP')).toBeInTheDocument()
    expect(screen.getByText('2.1s')).toBeInTheDocument()
    expect(screen.getByText('FID')).toBeInTheDocument()
    expect(screen.getByText('85ms')).toBeInTheDocument()
    expect(screen.getByText('CLS')).toBeInTheDocument()
    expect(screen.getByText('0.08')).toBeInTheDocument()
  })

  it('shows SEO score with correct styling', () => {
    render(<SEODashboard />)

    const scoreElement = screen.getByText('85')
    expect(scoreElement).toBeInTheDocument()
    
    // Score of 85 should be in the "good" range (green)
    expect(scoreElement.closest('[data-testid="seo-score"]')).toHaveClass('text-green-600')
  })

  it('displays SEO issues with correct severity indicators', () => {
    render(<SEODashboard />)

    // Check warning issue
    expect(screen.getByText('Meta description is too short')).toBeInTheDocument()
    const warningIcon = screen.getByTestId('warning-icon')
    expect(warningIcon).toHaveClass('text-yellow-500')

    // Check error issue
    expect(screen.getByText('Missing alt text on image')).toBeInTheDocument()
    const errorIcon = screen.getByTestId('error-icon')
    expect(errorIcon).toHaveClass('text-red-500')
  })

  it('shows recommendations list', () => {
    render(<SEODashboard />)

    expect(screen.getByText('Add structured data for better search visibility')).toBeInTheDocument()
    expect(screen.getByText('Optimize images for faster loading')).toBeInTheDocument()
    expect(screen.getByText('Improve internal linking structure')).toBeInTheDocument()
  })

  it('displays technical SEO status indicators', () => {
    render(<SEODashboard />)

    // Check positive indicators
    expect(screen.getByText('Robots.txt')).toBeInTheDocument()
    expect(screen.getByTestId('robots-status')).toHaveClass('text-green-500')
    
    expect(screen.getByText('Sitemap')).toBeInTheDocument()
    expect(screen.getByTestId('sitemap-status')).toHaveClass('text-green-500')
    
    expect(screen.getByText('SSL Certificate')).toBeInTheDocument()
    expect(screen.getByTestId('ssl-status')).toHaveClass('text-green-500')
    
    expect(screen.getByText('Mobile Optimized')).toBeInTheDocument()
    expect(screen.getByTestId('mobile-status')).toHaveClass('text-green-500')
  })

  it('handles refresh analysis action', async () => {
    const user = userEvent.setup()
    const mockRefreshAnalysis = jest.fn()
    
    // Mock the hook to return our mock function
    jest.mocked(require('@/shared/hooks/use-seo-analysis').useSEOAnalysis).mockReturnValue({
      analysis: expect.any(Object),
      loading: false,
      error: null,
      refreshAnalysis: mockRefreshAnalysis,
    })

    render(<SEODashboard />)

    const refreshButton = screen.getByRole('button', { name: /refresh analysis/i })
    await user.click(refreshButton)

    expect(mockRefreshAnalysis).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    // Mock loading state
    jest.mocked(require('@/shared/hooks/use-seo-analysis').useSEOAnalysis).mockReturnValue({
      analysis: null,
      loading: true,
      error: null,
      refreshAnalysis: jest.fn(),
    })

    render(<SEODashboard />)

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByText('Analyzing SEO...')).toBeInTheDocument()
  })

  it('handles error state', () => {
    // Mock error state
    jest.mocked(require('@/shared/hooks/use-seo-analysis').useSEOAnalysis).mockReturnValue({
      analysis: null,
      loading: false,
      error: 'Failed to analyze SEO',
      refreshAnalysis: jest.fn(),
    })

    render(<SEODashboard />)

    expect(screen.getByText('Error loading SEO analysis')).toBeInTheDocument()
    expect(screen.getByText('Failed to analyze SEO')).toBeInTheDocument()
  })

  it('expands and collapses issue details', async () => {
    const user = userEvent.setup()
    
    render(<SEODashboard />)

    const issueItem = screen.getByText('Meta description is too short').closest('[data-testid="seo-issue"]')
    expect(issueItem).toBeInTheDocument()

    // Initially, recommendation should not be visible
    expect(screen.queryByText('Increase meta description length to 150-160 characters')).not.toBeInTheDocument()

    // Click to expand
    await user.click(issueItem!)

    // Now recommendation should be visible
    await waitFor(() => {
      expect(screen.getByText('Increase meta description length to 150-160 characters')).toBeInTheDocument()
    })

    // Click to collapse
    await user.click(issueItem!)

    // Recommendation should be hidden again
    await waitFor(() => {
      expect(screen.queryByText('Increase meta description length to 150-160 characters')).not.toBeInTheDocument()
    })
  })

  it('filters issues by severity', async () => {
    const user = userEvent.setup()
    
    render(<SEODashboard />)

    // Initially both warning and error should be visible
    expect(screen.getByText('Meta description is too short')).toBeInTheDocument()
    expect(screen.getByText('Missing alt text on image')).toBeInTheDocument()

    // Filter to show only errors
    const errorFilter = screen.getByRole('button', { name: /errors only/i })
    await user.click(errorFilter)

    // Only error should be visible
    expect(screen.queryByText('Meta description is too short')).not.toBeInTheDocument()
    expect(screen.getByText('Missing alt text on image')).toBeInTheDocument()

    // Filter to show only warnings
    const warningFilter = screen.getByRole('button', { name: /warnings only/i })
    await user.click(warningFilter)

    // Only warning should be visible
    expect(screen.getByText('Meta description is too short')).toBeInTheDocument()
    expect(screen.queryByText('Missing alt text on image')).not.toBeInTheDocument()
  })

  it('exports SEO report', async () => {
    const user = userEvent.setup()
    
    // Mock the download functionality
    const mockCreateObjectURL = jest.fn(() => 'blob:mock-url')
    const mockRevokeObjectURL = jest.fn()
    global.URL.createObjectURL = mockCreateObjectURL
    global.URL.revokeObjectURL = mockRevokeObjectURL

    // Mock link click
    const mockClick = jest.fn()
    const mockLink = { click: mockClick, href: '', download: '' }
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any)

    render(<SEODashboard />)

    const exportButton = screen.getByRole('button', { name: /export report/i })
    await user.click(exportButton)

    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(mockClick).toHaveBeenCalled()
    expect(mockRevokeObjectURL).toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<SEODashboard />)

    // Check ARIA labels and roles
    expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'SEO Dashboard')
    expect(screen.getByRole('region', { name: /performance metrics/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /seo analysis/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /technical seo/i })).toBeInTheDocument()
  })

  it('updates metrics in real-time', async () => {
    const { rerender } = render(<SEODashboard />)

    // Initial metrics
    expect(screen.getByText('2.1s')).toBeInTheDocument()

    // Mock updated metrics
    jest.mocked(require('@/shared/hooks/use-performance-metrics').usePerformanceMetrics).mockReturnValue({
      metrics: {
        lcp: 1.8,
        fid: 75,
        cls: 0.06,
        fcp: 1.0,
        ttfb: 150,
      },
      loading: false,
      error: null,
    })

    rerender(<SEODashboard />)

    // Updated metrics should be displayed
    await waitFor(() => {
      expect(screen.getByText('1.8s')).toBeInTheDocument()
    })
  })
})