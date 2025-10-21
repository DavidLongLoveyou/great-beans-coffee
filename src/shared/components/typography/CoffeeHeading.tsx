import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface CoffeeHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  variant?: 'default' | 'gradient' | 'coffee';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CoffeeHeading = forwardRef<HTMLHeadingElement, CoffeeHeadingProps>(
  (
    {
      className,
      size = 'lg',
      variant = 'default',
      as: Component = 'h2',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-lg font-semibold',
      md: 'text-xl font-semibold',
      lg: 'text-2xl font-bold',
      xl: 'text-3xl font-bold',
      '2xl': 'text-4xl font-bold',
      '3xl': 'text-5xl font-bold',
      '4xl': 'text-6xl font-bold',
      '5xl': 'text-7xl font-bold',
    };

    const variantClasses = {
      default: 'text-gray-900 dark:text-gray-100',
      gradient:
        'bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent',
      coffee: 'text-amber-800 dark:text-amber-200',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          'font-display tracking-tight',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

CoffeeHeading.displayName = 'CoffeeHeading';
