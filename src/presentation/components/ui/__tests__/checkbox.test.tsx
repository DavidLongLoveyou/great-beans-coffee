import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '../checkbox'

describe('Checkbox Component', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('renders checked when checked prop is true', () => {
    render(<Checkbox checked />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('renders indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    // Note: indeterminate state is handled by Radix UI internally
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleCheckedChange = jest.fn()
    
    render(<Checkbox onCheckedChange={handleCheckedChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(handleCheckedChange).toHaveBeenCalledWith(true)
  })

  it('toggles between checked and unchecked states', async () => {
    const user = userEvent.setup()
    const handleCheckedChange = jest.fn()
    
    render(<Checkbox onCheckedChange={handleCheckedChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    
    // First click - should check
    await user.click(checkbox)
    expect(handleCheckedChange).toHaveBeenCalledWith(true)
    
    // Second click - should uncheck
    await user.click(checkbox)
    expect(handleCheckedChange).toHaveBeenCalledWith(false)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox disabled />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
    expect(checkbox).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('does not call onCheckedChange when disabled', async () => {
    const user = userEvent.setup()
    const handleCheckedChange = jest.fn()
    
    render(<Checkbox disabled onCheckedChange={handleCheckedChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(handleCheckedChange).not.toHaveBeenCalled()
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    const handleCheckedChange = jest.fn()
    
    render(<Checkbox onCheckedChange={handleCheckedChange} />)
    
    const checkbox = screen.getByRole('checkbox')
    checkbox.focus()
    expect(checkbox).toHaveFocus()
    
    // Space key should toggle checkbox
    await user.keyboard(' ')
    expect(handleCheckedChange).toHaveBeenCalledWith(true)
  })

  it('applies custom className', () => {
    render(<Checkbox className="custom-checkbox" />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('custom-checkbox')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Checkbox ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has correct accessibility attributes', () => {
    render(
      <Checkbox 
        aria-label="Accept terms and conditions"
        aria-describedby="terms-description"
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-label', 'Accept terms and conditions')
    expect(checkbox).toHaveAttribute('aria-describedby', 'terms-description')
  })

  it('displays check icon when checked', () => {
    render(<Checkbox checked />)
    
    const checkbox = screen.getByRole('checkbox')
    const checkIcon = checkbox.querySelector('svg')
    expect(checkIcon).toBeInTheDocument()
    expect(checkIcon).toHaveClass('h-4', 'w-4')
  })

  it('works with form labels', async () => {
    const user = userEvent.setup()
    const handleCheckedChange = jest.fn()
    
    render(
      <div>
        <label htmlFor="test-checkbox">Test Label</label>
        <Checkbox id="test-checkbox" onCheckedChange={handleCheckedChange} />
      </div>
    )
    
    const label = screen.getByText('Test Label')
    const checkbox = screen.getByRole('checkbox')
    
    // Clicking label should toggle checkbox
    await user.click(label)
    expect(handleCheckedChange).toHaveBeenCalledWith(true)
  })

  it('maintains focus styles', () => {
    render(<Checkbox />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    )
  })

  it('handles controlled state correctly', () => {
    const TestComponent = () => {
      const [checked, setChecked] = React.useState(false)
      
      return (
        <div>
          <Checkbox checked={checked} onCheckedChange={setChecked} />
          <span>{checked ? 'Checked' : 'Unchecked'}</span>
        </div>
      )
    }
    
    render(<TestComponent />)
    
    const checkbox = screen.getByRole('checkbox')
    const status = screen.getByText('Unchecked')
    
    expect(checkbox).not.toBeChecked()
    expect(status).toBeInTheDocument()
    
    fireEvent.click(checkbox)
    
    expect(checkbox).toBeChecked()
    expect(screen.getByText('Checked')).toBeInTheDocument()
  })
})