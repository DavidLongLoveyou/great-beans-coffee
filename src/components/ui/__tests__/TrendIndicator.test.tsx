import { render, screen } from '@testing-library/react';
import React from 'react';

import {
  TrendIndicator,
  PriceTrend,
  PercentageTrend,
  VolumeTrend,
} from '../TrendIndicator';

describe('TrendIndicator Component', () => {
  it('renders basic trend indicator with positive change', () => {
    render(
      <TrendIndicator value={15.5} previousValue={10} label="Test Metric" />
    );

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('15.50')).toBeInTheDocument();
    expect(screen.getByText('55.0%')).toBeInTheDocument();
  });

  it('renders basic trend indicator with negative change', () => {
    render(<TrendIndicator value={8} previousValue={12} label="Test Metric" />);

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('8.00')).toBeInTheDocument();
    expect(screen.getByText('33.3%')).toBeInTheDocument();
  });

  it('renders without previous value', () => {
    render(<TrendIndicator value={15} label="Test Metric" />);

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('15.00')).toBeInTheDocument();
    expect(screen.queryByText('+')).not.toBeInTheDocument();
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('renders with zero previous value', () => {
    render(<TrendIndicator value={5} previousValue={0} label="Test Metric" />);

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('5.00')).toBeInTheDocument();
    expect(screen.queryByText('+')).not.toBeInTheDocument();
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('renders with custom format - currency', () => {
    render(
      <TrendIndicator
        value={25.99}
        previousValue={20.5}
        label="Price"
        format="currency"
      />
    );

    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('$25.99')).toBeInTheDocument();
    expect(screen.getByText('26.8%')).toBeInTheDocument();
  });

  it('renders with custom format - percentage', () => {
    render(
      <TrendIndicator
        value={15}
        previousValue={12}
        label="Growth Rate"
        format="percentage"
      />
    );

    expect(screen.getByText('Growth Rate')).toBeInTheDocument();
    expect(screen.getByText('15.00%')).toBeInTheDocument();
    expect(screen.getByText('25.0%')).toBeInTheDocument();
  });

  it('renders with custom unit', () => {
    render(
      <TrendIndicator
        value={1500}
        previousValue={1200}
        label="Weight"
        unit="kg"
      />
    );

    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('1,500.00 kg')).toBeInTheDocument();
    expect(screen.getByText('25.0%')).toBeInTheDocument();
  });

  it('renders with custom precision', () => {
    render(
      <TrendIndicator
        value={15.123456}
        previousValue={10.987654}
        label="Precision Test"
        precision={3}
      />
    );

    expect(screen.getByText('Precision Test')).toBeInTheDocument();
    expect(screen.getByText('15.123')).toBeInTheDocument();
    expect(screen.getByText('37.6%')).toBeInTheDocument();
  });

  it('renders without change display when showChange is false', () => {
    render(
      <TrendIndicator
        value={15}
        previousValue={10}
        label="No Change"
        showChange={false}
      />
    );

    expect(screen.getByText('No Change')).toBeInTheDocument();
    expect(screen.getByText('15.00')).toBeInTheDocument();
    expect(screen.queryByText('+5')).not.toBeInTheDocument();
    expect(screen.queryByText('50.0%')).not.toBeInTheDocument();
  });

  it('renders without change when showChange is false', () => {
    render(
      <TrendIndicator
        value={15}
        previousValue={10}
        label="No Change"
        showChange={false}
      />
    );

    expect(screen.getByText('No Change')).toBeInTheDocument();
    expect(screen.getByText('15.00')).toBeInTheDocument();
    expect(screen.queryByText('50.0%')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TrendIndicator
        value={15}
        previousValue={10}
        label="Custom Style"
        className="custom-trend"
      />
    );

    const trendContainer = container.querySelector('.custom-trend');
    expect(trendContainer).toBeInTheDocument();
  });

  it('renders with small size', () => {
    render(
      <TrendIndicator
        value={15}
        previousValue={10}
        label="Size Test"
        size="sm"
      />
    );
    expect(screen.getByText('Size Test')).toBeInTheDocument();
  });

  it('renders with large size', () => {
    render(
      <TrendIndicator
        value={15}
        previousValue={10}
        label="Size Test"
        size="lg"
      />
    );
    expect(screen.getByText('Size Test')).toBeInTheDocument();
  });

  it('renders with icon when showIcon is true - positive change', () => {
    render(
      <TrendIndicator
        value={15}
        previousValue={10}
        label="With Icon"
        showIcon={true}
      />
    );
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders with icon when showIcon is true - negative change', () => {
    render(
      <TrendIndicator
        value={8}
        previousValue={12}
        label="With Icon"
        showIcon={true}
      />
    );
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders with icon when showIcon is true - neutral change', () => {
    render(
      <TrendIndicator
        value={10}
        previousValue={10}
        label="With Icon"
        showIcon={true}
      />
    );
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  describe('PriceTrend Component', () => {
    it('renders price trend with currency format', () => {
      render(
        <PriceTrend value={25.99} previousValue={20.5} label="Coffee Price" />
      );

      expect(screen.getByText('Coffee Price')).toBeInTheDocument();
      expect(screen.getByText('$25.99')).toBeInTheDocument();
    });
  });

  describe('PercentageTrend Component', () => {
    it('renders percentage trend with percentage format', () => {
      render(
        <PercentageTrend value={15} previousValue={12} label="Market Share" />
      );

      expect(screen.getByText('Market Share')).toBeInTheDocument();
      expect(screen.getByText('15.00%')).toBeInTheDocument();
    });
  });

  describe('VolumeTrend Component', () => {
    it('renders volume trend with MT unit', () => {
      render(<VolumeTrend value={1500} previousValue={1200} label="Volume" />);

      expect(screen.getByText('Volume')).toBeInTheDocument();
      expect(screen.getByText('1,500.00 MT')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      render(
        <TrendIndicator
          value={1000000}
          previousValue={500000}
          label="Large Number"
        />
      );

      expect(screen.getByText('Large Number')).toBeInTheDocument();
      expect(screen.getByText('1,000,000.00')).toBeInTheDocument();
    });

    it('handles very small numbers', () => {
      render(
        <TrendIndicator
          value={0.001}
          previousValue={0.0005}
          label="Small Number"
          precision={4}
        />
      );

      expect(screen.getByText('Small Number')).toBeInTheDocument();
      expect(screen.getByText('0.0010')).toBeInTheDocument();
    });

    it('handles negative numbers', () => {
      render(
        <TrendIndicator
          value={-5}
          previousValue={-10}
          label="Negative Number"
        />
      );

      expect(screen.getByText('Negative Number')).toBeInTheDocument();
      expect(screen.getByText('-5.00')).toBeInTheDocument();
    });

    it('handles same values (no change)', () => {
      render(
        <TrendIndicator value={15} previousValue={15} label="No Change" />
      );

      expect(screen.getByText('No Change')).toBeInTheDocument();
      expect(screen.getByText('15.00')).toBeInTheDocument();
      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });

    it('handles NaN values', () => {
      render(
        <TrendIndicator value={NaN} previousValue={10} label="NaN Test" />
      );

      expect(screen.getByText('NaN Test')).toBeInTheDocument();
      expect(screen.getByText('NaN')).toBeInTheDocument();
    });

    it('handles decimal precision correctly', () => {
      render(
        <TrendIndicator
          value={15.123456789}
          previousValue={10.987654321}
          label="Precision Test"
          precision={2}
        />
      );

      expect(screen.getByText('Precision Test')).toBeInTheDocument();
      expect(screen.getByText('15.12')).toBeInTheDocument();
    });
  });
});
