'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { LoadingSpinner } from './Feedback/LoadingSpinner';
import { ButtonProps } from './types';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'forest'
  | 'forest-outline'
  | 'forest-soft'
  | 'sage'
  | 'sage-outline'
  | 'sage-soft'
  | 'emerald'
  | 'emerald-outline'
  | 'emerald-glow'
  | 'coffee'
  | 'gold'
  | 'destructive';

// Button variant styles
const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  
  // Professional Green Variants for B2B
  forest: 'bg-forest-500 text-white hover:bg-forest-600 active:bg-forest-700 shadow-forest focus:ring-forest-500 font-medium',
  'forest-outline': 'border-2 border-forest-500 text-forest-500 bg-transparent hover:bg-forest-50 active:bg-forest-100 focus:ring-forest-500',
  'forest-soft': 'bg-forest-100 text-forest-800 hover:bg-forest-200 active:bg-forest-300 shadow-forest-soft',
  
  sage: 'bg-sage-500 text-white hover:bg-sage-600 active:bg-sage-700 shadow-sage focus:ring-sage-500 font-medium',
  'sage-outline': 'border-2 border-sage-500 text-sage-500 bg-transparent hover:bg-sage-50 active:bg-sage-100 focus:ring-sage-500',
  'sage-soft': 'bg-sage-100 text-sage-800 hover:bg-sage-200 active:bg-sage-300 shadow-sage-soft',
  
  emerald: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-emerald focus:ring-emerald-500 font-medium',
  'emerald-outline': 'border-2 border-emerald-500 text-emerald-500 bg-transparent hover:bg-emerald-50 active:bg-emerald-100 focus:ring-emerald-500',
  'emerald-glow': 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-emerald-glow focus:ring-emerald-500 font-semibold',
  
  // Legacy Coffee Industry Colors
  coffee:
    'bg-coffee-500 text-coffee-50 hover:bg-coffee-600 shadow-coffee focus:ring-coffee-500',
  gold: 'bg-gold-500 text-coffee-900 hover:bg-gold-600 shadow-gold focus:ring-gold-500 font-semibold',
  
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md',
};

// Button size styles
const buttonSizes = {
  xs: 'h-7 px-2 text-xs',
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8 text-lg',
  xl: 'h-12 px-10 text-xl',
  '2xl': 'h-14 px-12 text-2xl',
  '3xl': 'h-16 px-16 text-3xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
          'ring-offset-background transition-all duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'transform active:scale-[0.98]',

          // Variant styles
          buttonVariants[variant],

          // Size styles
          buttonSizes[size],

          // Full width
          fullWidth && 'w-full',

          // Loading state
          loading && 'cursor-wait',

          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {/* Left Icon */}
        {leftIcon && !loading && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}

        {/* Loading Spinner */}
        {loading && (
          <LoadingSpinner
            size={size === 'xs' || size === 'sm' ? 'sm' : 'md'}
            className="flex-shrink-0"
          />
        )}

        {/* Button Text */}
        {children && (
          <span className={cn('flex-1', !fullWidth && 'flex-initial')}>
            {children}
          </span>
        )}

        {/* Right Icon */}
        {rightIcon && !loading && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Specialized Coffee Industry Buttons
export const CoffeeButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant'>
>((props, ref) => <Button variant="coffee" ref={ref} {...props} />);

CoffeeButton.displayName = 'CoffeeButton';

export const GoldButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant'>
>((props, ref) => <Button variant="gold" ref={ref} {...props} />);

GoldButton.displayName = 'GoldButton';

// Request Quote Button - Specialized for B2B
export const RequestQuoteButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant' | 'children'>
>(({ size = 'lg', ...props }, ref) => (
  <Button variant="emerald" size={size} ref={ref} {...props}>
    Request Quote
  </Button>
));

RequestQuoteButton.displayName = 'RequestQuoteButton';

// Contact Sales Button - Specialized for B2B
export const ContactSalesButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant' | 'children'>
>(({ size = 'lg', ...props }, ref) => (
  <CoffeeButton size={size} ref={ref} {...props}>
    Contact Sales
  </CoffeeButton>
));

ContactSalesButton.displayName = 'ContactSalesButton';

// Download Catalog Button - Specialized for B2B
export const DownloadCatalogButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'variant' | 'children'>
>(({ ...props }, ref) => (
  <Button variant="outline" ref={ref} {...props}>
    Download Catalog
  </Button>
));

DownloadCatalogButton.displayName = 'DownloadCatalogButton';
