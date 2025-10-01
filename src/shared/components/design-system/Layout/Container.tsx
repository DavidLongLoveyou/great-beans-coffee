'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { ContainerProps } from '../types';

// Container size configurations
const containerSizes = {
  xs: 'max-w-xs', // 320px
  sm: 'max-w-sm', // 384px
  md: 'max-w-md', // 448px
  lg: 'max-w-lg', // 512px
  xl: 'max-w-xl', // 576px
  '2xl': 'max-w-2xl', // 672px
  '3xl': 'max-w-3xl', // 768px
  '4xl': 'max-w-4xl', // 896px
  '5xl': 'max-w-5xl', // 1024px
  '6xl': 'max-w-6xl', // 1152px
  '7xl': 'max-w-7xl', // 1280px
  full: 'max-w-full', // 100%
  screen: 'max-w-screen-2xl', // 1536px
};

// Padding configurations
const containerPadding = {
  none: '',
  xs: 'px-2',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
  xl: 'px-12',
  '2xl': 'px-16',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      children,
      size = '7xl',
      padding = 'md',
      center = true,
      fluid = false,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    const containerClasses = cn(
      // Base container styles
      'w-full',

      // Size constraints
      !fluid && containerSizes[size],

      // Centering
      center && 'mx-auto',

      // Padding
      containerPadding[padding],

      // Custom classes
      className
    );

    return (
      <Component className={containerClasses} ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';

// Specialized container variants
export const HeroContainer = forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'size' | 'padding'>
>(({ className, children, ...props }, ref) => {
  return (
    <Container
      size="screen"
      padding="lg"
      className={cn('py-12 lg:py-20', className)}
      ref={ref}
      {...props}
    >
      {children}
    </Container>
  );
});

HeroContainer.displayName = 'HeroContainer';

export const ContentContainer = forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'size' | 'padding'>
>(({ className, children, ...props }, ref) => {
  return (
    <Container
      size="4xl"
      padding="md"
      className={cn('py-8 lg:py-12', className)}
      ref={ref}
      {...props}
    >
      {children}
    </Container>
  );
});

ContentContainer.displayName = 'ContentContainer';

export const SectionContainer = forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'size' | 'padding'>
>(({ className, children, ...props }, ref) => {
  return (
    <Container
      size="6xl"
      padding="lg"
      className={cn('py-16 lg:py-24', className)}
      ref={ref}
      {...props}
    >
      {children}
    </Container>
  );
});

SectionContainer.displayName = 'SectionContainer';

export const NarrowContainer = forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'size' | 'padding'>
>(({ className, children, ...props }, ref) => {
  return (
    <Container
      size="2xl"
      padding="sm"
      className={cn('py-6 lg:py-8', className)}
      ref={ref}
      {...props}
    >
      {children}
    </Container>
  );
});

NarrowContainer.displayName = 'NarrowContainer';

export const WideContainer = forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'size' | 'padding'>
>(({ className, children, ...props }, ref) => {
  return (
    <Container
      size="screen"
      padding="xl"
      className={cn('py-12 lg:py-16', className)}
      ref={ref}
      {...props}
    >
      {children}
    </Container>
  );
});

WideContainer.displayName = 'WideContainer';
