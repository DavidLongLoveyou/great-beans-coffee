'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { TypographyProps } from '../types';

// Heading variant styles
const headingVariants = {
  'display-2xl': 'text-display-2xl font-bold tracking-tight',
  'display-xl': 'text-display-xl font-bold tracking-tight',
  'display-lg': 'text-display-lg font-bold tracking-tight',
  'display-md': 'text-display-md font-bold tracking-tight',
  'display-sm': 'text-display-sm font-bold tracking-tight',
  'heading-xl': 'text-4xl font-bold tracking-tight',
  'heading-lg': 'text-3xl font-bold tracking-tight',
  'heading-md': 'text-2xl font-semibold tracking-tight',
  'heading-sm': 'text-xl font-semibold tracking-tight',
  'body-xl': 'text-xl font-medium',
  'body-lg': 'text-lg font-medium',
  'body-md': 'text-base font-medium',
  'body-sm': 'text-sm font-medium',
  caption: 'text-sm font-normal',
  overline: 'text-xs font-semibold uppercase tracking-wider',
};

// Color variants
const colorVariants = {
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  accent: 'text-accent-foreground',
  coffee: 'text-coffee-500',
  gold: 'text-gold-500',
  bean: 'text-bean-500',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  muted: 'text-muted-foreground',
  destructive: 'text-destructive',
};

// Font weight variants
const weightVariants = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

// Text alignment
const alignVariants = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

interface HeadingProps extends TypographyProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      variant = 'heading-lg',
      color = 'primary',
      weight,
      align = 'left',
      truncate = false,
      gradient = false,
      as: Component = 'h2',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        className={cn(
          // Base styles
          'font-display',

          // Variant styles
          headingVariants[variant],

          // Color styles (override if gradient is used)
          !gradient && colorVariants[color],

          // Weight override
          weight && weightVariants[weight],

          // Alignment
          alignVariants[align],

          // Truncate
          truncate && 'truncate',

          // Gradient text
          gradient && 'text-gradient-coffee',

          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

// Specialized Heading Components

// Display Heading - For hero sections
export const DisplayHeading = forwardRef<
  HTMLHeadingElement,
  Omit<HeadingProps, 'variant'> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  }
>(({ size = 'lg', as = 'h1', ...props }, ref) => (
  <Heading
    variant={`display-${size}` as keyof typeof headingVariants}
    as={as}
    ref={ref}
    {...props}
  />
));

DisplayHeading.displayName = 'DisplayHeading';

// Section Heading - For section titles
export const SectionHeading = forwardRef<
  HTMLHeadingElement,
  Omit<HeadingProps, 'variant'> & {
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }
>(({ size = 'lg', as = 'h2', ...props }, ref) => (
  <Heading
    variant={`heading-${size}` as keyof typeof headingVariants}
    as={as}
    ref={ref}
    {...props}
  />
));

SectionHeading.displayName = 'SectionHeading';

// Coffee Heading - With coffee gradient
export const CoffeeHeading = forwardRef<
  HTMLHeadingElement,
  Omit<HeadingProps, 'gradient' | 'color'>
>((props, ref) => <Heading gradient color="coffee" ref={ref} {...props} />);

CoffeeHeading.displayName = 'CoffeeHeading';

// Gold Heading - With gold gradient
export const GoldHeading = forwardRef<
  HTMLHeadingElement,
  Omit<HeadingProps, 'color'>
>((props, ref) => <Heading color="gold" ref={ref} {...props} />);

GoldHeading.displayName = 'GoldHeading';

// Page Title - For page headers
export const PageTitle = forwardRef<
  HTMLHeadingElement,
  Omit<HeadingProps, 'variant' | 'as'>
>((props, ref) => (
  <Heading variant="display-lg" as="h1" ref={ref} {...props} />
));

PageTitle.displayName = 'PageTitle';

// Card Title - For card headers
export const CardTitle = forwardRef<
  HTMLHeadingElement,
  Omit<HeadingProps, 'variant' | 'as'>
>((props, ref) => (
  <Heading variant="heading-md" as="h3" ref={ref} {...props} />
));

CardTitle.displayName = 'CardTitle';

// Overline - For labels and categories
export const Overline = forwardRef<
  HTMLHeadingElement,
  Omit<HeadingProps, 'variant' | 'as'>
>(({ color = 'muted', ...props }, ref) => (
  <Heading variant="overline" as="span" color={color} ref={ref} {...props} />
));

Overline.displayName = 'Overline';
