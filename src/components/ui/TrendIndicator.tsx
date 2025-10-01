'use client';

import React from 'react';

interface TrendIndicatorProps {
  value: number;
  previousValue?: number;
  label: string;
  unit?: string;
  currency?: string;
  format?: 'number' | 'percentage' | 'currency';
  size?: 'sm' | 'md' | 'lg';
  showChange?: boolean;
  showIcon?: boolean;
  precision?: number;
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  previousValue,
  label,
  unit,
  currency = 'USD',
  format = 'number',
  size = 'md',
  showChange = true,
  showIcon = true,
  precision = 2,
  className = '',
}) => {
  const calculateChange = () => {
    if (!previousValue || previousValue === 0) return null;
    return ((value - previousValue) / previousValue) * 100;
  };

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(val);

      case 'percentage':
        return `${val.toFixed(precision)}%`;

      default:
        const formatted = val.toLocaleString('en-US', {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        });
        return unit ? `${formatted} ${unit}` : formatted;
    }
  };

  const change = calculateChange();
  const isPositive = change !== null && change >= 0;
  const isNeutral = change === null || Math.abs(change) < 0.01;

  const sizeClasses = {
    sm: {
      container: 'p-3',
      value: 'text-lg',
      label: 'text-xs',
      change: 'text-xs',
      icon: 'text-sm',
    },
    md: {
      container: 'p-4',
      value: 'text-2xl',
      label: 'text-sm',
      change: 'text-sm',
      icon: 'text-base',
    },
    lg: {
      container: 'p-6',
      value: 'text-3xl',
      label: 'text-base',
      change: 'text-base',
      icon: 'text-lg',
    },
  };

  const classes = sizeClasses[size];

  const getChangeColor = () => {
    if (isNeutral) return 'text-gray-500';
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = () => {
    if (isNeutral) return '→';
    return isPositive ? '↗' : '↘';
  };

  const getChangeBg = () => {
    if (isNeutral) return 'bg-gray-100';
    return isPositive ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white ${classes.container} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`font-medium text-gray-600 ${classes.label} mb-1`}>
            {label}
          </p>
          <p className={`font-bold text-gray-900 ${classes.value}`}>
            {formatValue(value)}
          </p>
        </div>

        {showChange && change !== null && (
          <div
            className={`flex items-center space-x-1 ${getChangeBg()} rounded-full px-2 py-1`}
          >
            {showIcon && (
              <span className={`${getChangeColor()} ${classes.icon}`}>
                {getChangeIcon()}
              </span>
            )}
            <span
              className={`font-medium ${getChangeColor()} ${classes.change}`}
            >
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {showChange && change !== null && (
        <div className="mt-2">
          <p className={`text-gray-500 ${classes.change}`}>
            vs. previous period: {formatValue(previousValue || 0)}
          </p>
        </div>
      )}
    </div>
  );
};

// Preset components for common use cases
export const PriceTrend: React.FC<
  Omit<TrendIndicatorProps, 'format'>
> = props => <TrendIndicator {...props} format="currency" />;

export const PercentageTrend: React.FC<
  Omit<TrendIndicatorProps, 'format'>
> = props => <TrendIndicator {...props} format="percentage" />;

export const VolumeTrend: React.FC<
  Omit<TrendIndicatorProps, 'format' | 'unit'>
> = props => <TrendIndicator {...props} format="number" unit="MT" />;

// Grid layout for multiple indicators
interface TrendGridProps {
  indicators: Array<TrendIndicatorProps & { id: string }>;
  columns?: number;
  className?: string;
}

export const TrendGrid: React.FC<TrendGridProps> = ({
  indicators,
  columns = 3,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      className={`grid ${gridCols[columns as keyof typeof gridCols]} my-6 gap-4 ${className}`}
    >
      {indicators.map(({ id, ...props }) => (
        <TrendIndicator key={id} {...props} />
      ))}
    </div>
  );
};

export default TrendIndicator;
