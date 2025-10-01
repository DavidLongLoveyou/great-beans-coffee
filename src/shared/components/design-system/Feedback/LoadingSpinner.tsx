'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { SizeVariant } from '../types';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SizeVariant;
  variant?: 'default' | 'coffee' | 'gold';
}

// Spinner size styles
const spinnerSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
  '2xl': 'w-12 h-12',
  '3xl': 'w-16 h-16',
};

// Spinner variant styles
const spinnerVariants = {
  default: 'border-primary',
  coffee: 'border-coffee-500',
  gold: 'border-gold-500',
};

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', variant = 'default', ...props }, ref) => {
    return (
      <div
        className={cn(
          // Base styles
          'animate-spin rounded-full border-2 border-transparent',
          'border-r-current border-t-current',

          // Size styles
          spinnerSizes[size],

          // Variant styles
          spinnerVariants[variant],

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

// Coffee-themed spinner with steam animation
export const CoffeeSpinner = forwardRef<
  HTMLDivElement,
  Omit<LoadingSpinnerProps, 'variant'>
>(({ size = 'md', className, ...props }, ref) => {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      ref={ref}
      {...props}
    >
      {/* Coffee cup base */}
      <div
        className={cn(
          'rounded-full border-2 border-coffee-300 bg-coffee-100',
          spinnerSizes[size],
          className
        )}
      />

      {/* Steam animation */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 transform">
        <div className="h-2 w-0.5 animate-coffee-steam rounded-full bg-coffee-400 opacity-60" />
        <div
          className="ml-1 h-2 w-0.5 animate-coffee-steam rounded-full bg-coffee-400 opacity-40"
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className="ml-1 h-2 w-0.5 animate-coffee-steam rounded-full bg-coffee-400 opacity-30"
          style={{ animationDelay: '1s' }}
        />
      </div>
    </div>
  );
});

CoffeeSpinner.displayName = 'CoffeeSpinner';

// Dots loading indicator
export const DotsSpinner = forwardRef<
  HTMLDivElement,
  Omit<LoadingSpinnerProps, 'variant'> & {
    dotCount?: 3 | 4 | 5;
  }
>(({ size = 'md', dotCount = 3, className, ...props }, ref) => {
  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
    '2xl': 'w-4 h-4',
    '3xl': 'w-5 h-5',
  };

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      ref={ref}
      {...props}
    >
      {Array.from({ length: dotCount }, (_, index) => (
        <div
          key={`dot-${dotCount}-delay-${index * 0.2}s`}
          className={cn(
            'animate-pulse rounded-full bg-coffee-500',
            dotSizes[size]
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
});

DotsSpinner.displayName = 'DotsSpinner';

// Pulse loading indicator
export const PulseSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', variant = 'coffee', className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'animate-pulse rounded-full',
          spinnerSizes[size],
          variant === 'coffee' && 'bg-coffee-200',
          variant === 'gold' && 'bg-gold-200',
          variant === 'default' && 'bg-muted',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

PulseSpinner.displayName = 'PulseSpinner';
