'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { GridProps } from '../types';

// Grid column configurations
const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  12: 'grid-cols-12',
};

// Gap configurations
const gridGaps = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
  '2xl': 'gap-16',
};

// Responsive grid configurations for specific use cases
const responsiveGrids = {
  'product-grid': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  'feature-grid': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  'testimonial-grid': 'grid-cols-1 lg:grid-cols-2',
  'blog-grid': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  'service-grid': 'grid-cols-1 sm:grid-cols-2',
  'certification-grid':
    'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
  'origin-grid': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  'stats-grid': 'grid-cols-2 lg:grid-cols-4',
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      children,
      cols,
      gap = 'md',
      responsive,
      autoFit = false,
      minItemWidth,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    const gridClasses = cn(
      // Base grid
      'grid',

      // Responsive or fixed columns
      responsive && responsiveGrids[responsive],
      !responsive && cols && gridCols[cols],

      // Auto-fit with minimum width
      autoFit &&
        minItemWidth &&
        `grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]`,

      // Gap
      gridGaps[gap],

      // Custom classes
      className
    );

    return (
      <Component className={gridClasses} ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

Grid.displayName = 'Grid';

// Specialized grid components
export const ProductGrid = forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'responsive' | 'cols'>
>(({ className, children, gap = 'lg', ...props }, ref) => {
  return (
    <Grid
      responsive="product-grid"
      gap={gap}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Grid>
  );
});

ProductGrid.displayName = 'ProductGrid';

export const FeatureGrid = forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'responsive' | 'cols'>
>(({ className, children, gap = 'lg', ...props }, ref) => {
  return (
    <Grid
      responsive="feature-grid"
      gap={gap}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Grid>
  );
});

FeatureGrid.displayName = 'FeatureGrid';

export const TestimonialGrid = forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'responsive' | 'cols'>
>(({ className, children, gap = 'lg', ...props }, ref) => {
  return (
    <Grid
      responsive="testimonial-grid"
      gap={gap}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Grid>
  );
});

TestimonialGrid.displayName = 'TestimonialGrid';

export const BlogGrid = forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'responsive' | 'cols'>
>(({ className, children, gap = 'lg', ...props }, ref) => {
  return (
    <Grid
      responsive="blog-grid"
      gap={gap}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Grid>
  );
});

BlogGrid.displayName = 'BlogGrid';

export const ServiceGrid = forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'responsive' | 'cols'>
>(({ className, children, gap = 'lg', ...props }, ref) => {
  return (
    <Grid
      responsive="service-grid"
      gap={gap}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Grid>
  );
});

ServiceGrid.displayName = 'ServiceGrid';

export const CertificationGrid = forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'responsive' | 'cols'>
>(({ className, children, gap = 'sm', ...props }, ref) => {
  return (
    <Grid
      responsive="certification-grid"
      gap={gap}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Grid>
  );
});

CertificationGrid.displayName = 'CertificationGrid';

export const OriginGrid = forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'responsive' | 'cols'>
>(({ className, children, gap = 'md', ...props }, ref) => {
  return (
    <Grid
      responsive="origin-grid"
      gap={gap}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Grid>
  );
});

OriginGrid.displayName = 'OriginGrid';

export const StatsGrid = forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'responsive' | 'cols'>
>(({ className, children, gap = 'lg', ...props }, ref) => {
  return (
    <Grid
      responsive="stats-grid"
      gap={gap}
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Grid>
  );
});

StatsGrid.displayName = 'StatsGrid';

// Grid item component for more control
export const GridItem = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: React.ReactNode;
    colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
    colStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
    rowStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    as?: React.ElementType;
  }
>(
  (
    {
      className,
      children,
      colSpan,
      rowSpan,
      colStart,
      rowStart,
      as: Component = 'div',
      ...props
    },
    ref
  ) => {
    const colSpanClasses = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12',
    };

    const rowSpanClasses = {
      1: 'row-span-1',
      2: 'row-span-2',
      3: 'row-span-3',
      4: 'row-span-4',
      5: 'row-span-5',
      6: 'row-span-6',
    };

    const colStartClasses = {
      1: 'col-start-1',
      2: 'col-start-2',
      3: 'col-start-3',
      4: 'col-start-4',
      5: 'col-start-5',
      6: 'col-start-6',
      7: 'col-start-7',
      8: 'col-start-8',
      9: 'col-start-9',
      10: 'col-start-10',
      11: 'col-start-11',
      12: 'col-start-12',
      13: 'col-start-13',
    };

    const rowStartClasses = {
      1: 'row-start-1',
      2: 'row-start-2',
      3: 'row-start-3',
      4: 'row-start-4',
      5: 'row-start-5',
      6: 'row-start-6',
      7: 'row-start-7',
    };

    const itemClasses = cn(
      colSpan && colSpanClasses[colSpan],
      rowSpan && rowSpanClasses[rowSpan],
      colStart && colStartClasses[colStart],
      rowStart && rowStartClasses[rowStart],
      className
    );

    return (
      <Component className={itemClasses} ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

GridItem.displayName = 'GridItem';
