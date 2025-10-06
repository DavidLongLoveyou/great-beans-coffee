import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'accent' | 'muted';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subtitle?: string;
}

export const SectionHeading = forwardRef<HTMLHeadingElement, SectionHeadingProps>(
  ({ 
    className, 
    size = 'lg', 
    variant = 'default', 
    as: Component = 'h2', 
    subtitle,
    children,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'text-xl font-semibold',
      md: 'text-2xl font-bold',
      lg: 'text-3xl font-bold',
      xl: 'text-4xl font-bold',
    };

    const variantClasses = {
      default: 'text-gray-900 dark:text-gray-100',
      accent: 'text-amber-800 dark:text-amber-200',
      muted: 'text-gray-600 dark:text-gray-400',
    };

    return (
      <div className="text-center">
        <Component
          ref={ref}
          className={cn(
            'font-serif tracking-tight',
            sizeClasses[size],
            variantClasses[variant],
            className
          )}
          {...props}
        >
          {children}
        </Component>
        {subtitle && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);

SectionHeading.displayName = 'SectionHeading';