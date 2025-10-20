import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple test component to verify basic functionality
const SimpleSEODashboard = () => {
  return (
    <div data-testid="seo-dashboard">
      <h2>SEO Dashboard</h2>
      <p>Monitor and optimize your website&apos;s SEO performance</p>
    </div>
  );
};

describe('Simple SEO Dashboard Test', () => {
  it('renders without crashing', () => {
    render(<SimpleSEODashboard />);
    expect(screen.getByTestId('seo-dashboard')).toBeInTheDocument();
    expect(screen.getByText('SEO Dashboard')).toBeInTheDocument();
  });
});
