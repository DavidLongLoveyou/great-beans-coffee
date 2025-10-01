import React from 'react'
import { render, screen } from '@testing-library/react'
import { TrendIndicator, PriceTrend, PercentageTrend, VolumeTrend } from '../TrendIndicator'

describe('TrendIndicator Component', () => {
  it('renders positive trend correctly', () => {
    render(<TrendIndicator value={15.5} previousValue={10} />)
    
    expect(screen.getByText('15.5')).toBeInTheDocument()
    expect(screen.getByText('+5.5')).toBeInTheDocument()
    expect(screen.getByText('(+55.0%)')).toBeInTheDocument()
    
    const container = screen.getByText('15.5').closest('div')
    expect(container).toHaveClass('text-green-600')
  })

  it('renders negative trend correctly', () => {
    render(<TrendIndicator value={8} previousValue={12} />)
    
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('-4')).toBeInTheDocument()
    expect(screen.getByText('(-33.3%)')).toBeInTheDocument()
    
    const container = screen.getByText('8').closest('div')
    expect(container).toHaveClass('text-red-600')
  })

  it('renders neutral trend correctly', () => {
    render(<TrendIndicator value={10} previousValue={10} />)
    
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('(0.0%)')).toBeInTheDocument()
    
    const container = screen.getByText('10').closest('div')
    expect(container).toHaveClass('text-gray-600')
  })

  it('handles zero previous value', () => {
    render(<TrendIndicator value={5} previousValue={0} />)
    
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('+5')).toBeInTheDocument()
    expect(screen.getByText('(+∞%)')).toBeInTheDocument()
  })

  it('renders with custom format - currency', () => {
    render(<TrendIndicator value={25.99} previousValue={20.50} format="currency" />)
    
    expect(screen.getByText('$25.99')).toBeInTheDocument()
    expect(screen.getByText('+$5.49')).toBeInTheDocument()
  })

  it('renders with custom format - percentage', () => {
    render(<TrendIndicator value={0.15} previousValue={0.12} format="percentage" />)
    
    expect(screen.getByText('15.0%')).toBeInTheDocument()
    expect(screen.getByText('+3.0%')).toBeInTheDocument()
  })

  it('renders with custom unit', () => {
    render(<TrendIndicator value={1500} previousValue={1200} unit="kg" />)
    
    expect(screen.getByText('1500 kg')).toBeInTheDocument()
    expect(screen.getByText('+300 kg')).toBeInTheDocument()
  })

  it('renders with custom precision', () => {
    render(<TrendIndicator value={15.123456} previousValue={10.987654} precision={3} />)
    
    expect(screen.getByText('15.123')).toBeInTheDocument()
    expect(screen.getByText('+4.136')).toBeInTheDocument()
  })

  it('renders in compact mode', () => {
    render(<TrendIndicator value={15} previousValue={10} compact />)
    
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('+50%')).toBeInTheDocument()
    // Should not show absolute change in compact mode
    expect(screen.queryByText('+5')).not.toBeInTheDocument()
  })

  it('hides percentage when showPercentage is false', () => {
    render(<TrendIndicator value={15} previousValue={10} showPercentage={false} />)
    
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('+5')).toBeInTheDocument()
    expect(screen.queryByText('(+50.0%)')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<TrendIndicator value={15} previousValue={10} className="custom-trend" />)
    
    const container = screen.getByText('15').closest('div')
    expect(container).toHaveClass('custom-trend')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<TrendIndicator value={15} previousValue={10} size="sm" />)
    
    let container = screen.getByText('15').closest('div')
    expect(container).toHaveClass('text-sm')
    
    rerender(<TrendIndicator value={15} previousValue={10} size="lg" />)
    container = screen.getByText('15').closest('div')
    expect(container).toHaveClass('text-lg')
  })

  it('renders trend arrow icons', () => {
    const { rerender } = render(<TrendIndicator value={15} previousValue={10} showIcon />)
    
    // Should show up arrow for positive trend
    expect(document.querySelector('[data-testid="trend-up-icon"]')).toBeInTheDocument()
    
    rerender(<TrendIndicator value={8} previousValue={12} showIcon />)
    // Should show down arrow for negative trend
    expect(document.querySelector('[data-testid="trend-down-icon"]')).toBeInTheDocument()
    
    rerender(<TrendIndicator value={10} previousValue={10} showIcon />)
    // Should show minus icon for neutral trend
    expect(document.querySelector('[data-testid="trend-neutral-icon"]')).toBeInTheDocument()
  })

  describe('Preset Components', () => {
    it('PriceTrend renders with currency format', () => {
      render(<PriceTrend value={25.99} previousValue={20.50} />)
      
      expect(screen.getByText('$25.99')).toBeInTheDocument()
      expect(screen.getByText('+$5.49')).toBeInTheDocument()
    })

    it('PercentageTrend renders with percentage format', () => {
      render(<PercentageTrend value={0.15} previousValue={0.12} />)
      
      expect(screen.getByText('15.0%')).toBeInTheDocument()
      expect(screen.getByText('+3.0%')).toBeInTheDocument()
    })

    it('VolumeTrend renders with MT unit', () => {
      render(<VolumeTrend value={1500} previousValue={1200} />)
      
      expect(screen.getByText('1500 MT')).toBeInTheDocument()
      expect(screen.getByText('+300 MT')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      render(<TrendIndicator value={1000000} previousValue={500000} />)
      
      expect(screen.getByText('1000000')).toBeInTheDocument()
      expect(screen.getByText('+500000')).toBeInTheDocument()
      expect(screen.getByText('(+100.0%)')).toBeInTheDocument()
    })

    it('handles very small numbers', () => {
      render(<TrendIndicator value={0.001} previousValue={0.0005} precision={4} />)
      
      expect(screen.getByText('0.0010')).toBeInTheDocument()
      expect(screen.getByText('+0.0005')).toBeInTheDocument()
    })

    it('handles negative values', () => {
      render(<TrendIndicator value={-5} previousValue={-10} />)
      
      expect(screen.getByText('-5')).toBeInTheDocument()
      expect(screen.getByText('+5')).toBeInTheDocument()
      expect(screen.getByText('(+50.0%)')).toBeInTheDocument()
    })

    it('handles NaN and Infinity gracefully', () => {
      render(<TrendIndicator value={NaN} previousValue={10} />)
      
      expect(screen.getByText('--')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<TrendIndicator value={15} previousValue={10} />)
      
      const container = screen.getByText('15').closest('div')
      expect(container).toHaveAttribute('role', 'status')
      expect(container).toHaveAttribute('aria-label')
    })

    it('provides meaningful aria-label for screen readers', () => {
      render(<TrendIndicator value={15} previousValue={10} />)
      
      const container = screen.getByText('15').closest('div')
      const ariaLabel = container?.getAttribute('aria-label')
      expect(ariaLabel).toContain('15')
      expect(ariaLabel).toContain('increased')
      expect(ariaLabel).toContain('50%')
    })
  })
})