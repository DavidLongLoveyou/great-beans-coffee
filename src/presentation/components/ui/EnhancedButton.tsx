'use client';

import { Slot } from '@radix-ui/react-slot';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import React, { forwardRef, useState } from 'react';

import { cn } from '@/shared/utils/cn';

import { LoadingSpinner } from './MicroInteractions';

interface EnhancedButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      asChild = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);

    const baseClasses = cn(
      'relative inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'overflow-hidden group',
      fullWidth && 'w-full'
    );

    const variantClasses = {
      primary: cn(
        'bg-forest-600 text-white shadow-lg',
        'hover:bg-forest-700 hover:shadow-xl hover:shadow-forest-500/25',
        'focus:ring-forest-500',
        'active:bg-forest-800',
        'disabled:hover:bg-forest-600'
      ),
      secondary: cn(
        'bg-emerald-600 text-white shadow-lg',
        'hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/25',
        'focus:ring-emerald-500',
        'active:bg-emerald-800',
        'disabled:hover:bg-emerald-600'
      ),
      outline: cn(
        'border-2 border-forest-700 text-forest-800 bg-transparent',
        'hover:bg-forest-700 hover:text-white hover:shadow-lg',
        'focus:ring-forest-500',
        'active:bg-forest-800',
        'disabled:hover:bg-transparent disabled:hover:text-forest-700'
      ),
      ghost: cn(
        'text-forest-800 bg-transparent',
        'hover:bg-forest-50 hover:text-forest-900',
        'focus:ring-forest-500',
        'active:bg-forest-100',
        'disabled:hover:bg-transparent'
      ),
      link: cn(
        'text-forest-800 bg-transparent underline-offset-4',
        'hover:underline hover:text-forest-700',
        'focus:ring-forest-500',
        'active:text-forest-800',
        'disabled:hover:no-underline'
      ),
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
      md: 'px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
      xl: 'px-8 py-4 text-lg rounded-xl gap-3',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
    };

    const buttonVariants: Variants = {
      initial: { scale: 1 },
      hover: {
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeOut' },
      },
      tap: {
        scale: 0.98,
        transition: { duration: 0.1, ease: 'easeInOut' },
      },
    };

    const rippleVariants: Variants = {
      initial: { scale: 0, opacity: 0.5 },
      animate: {
        scale: 4,
        opacity: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
      },
    };

    const shimmerVariants: Variants = {
      initial: { x: '-100%' },
      hover: {
        x: '100%',
        transition: { duration: 0.6, ease: 'easeInOut' },
      },
    };

    const isDisabled = disabled || loading;
    const _Comp = asChild ? Slot : motion.button;

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            className
          )}
        >
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        variants={buttonVariants}
        initial="initial"
        whileHover={!isDisabled ? 'hover' : 'initial'}
        whileTap={!isDisabled ? 'tap' : 'initial'}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        disabled={isDisabled}
        {...props}
      >
        {/* Shimmer Effect */}
        {variant !== 'ghost' && variant !== 'link' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            initial="initial"
            whileHover="hover"
          />
        )}

        {/* Ripple Effect */}
        {isPressed && !isDisabled && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            variants={rippleVariants}
            initial="initial"
            animate="animate"
          />
        )}

        {/* Content */}
        <div className="gap-inherit relative flex items-center justify-center">
          {loading ? (
            <LoadingSpinner size={size === 'sm' ? 'sm' : 'md'} color="white" />
          ) : (
            <>
              {leftIcon && (
                <motion.span
                  className={cn('flex-shrink-0', iconSizes[size])}
                  initial={{ x: 0 }}
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {leftIcon}
                </motion.span>
              )}

              <span className="relative">{children}</span>

              {rightIcon && (
                <motion.span
                  className={cn('flex-shrink-0', iconSizes[size])}
                  initial={{ x: 0 }}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  {rightIcon}
                </motion.span>
              )}
            </>
          )}
        </div>
      </motion.button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export { EnhancedButton };

// Icon Button Component
interface IconButtonProps
  extends Omit<EnhancedButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', variant = 'ghost', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
      xl: 'p-4',
    };

    return (
      <EnhancedButton
        ref={ref}
        variant={variant}
        className={cn('rounded-full', sizeClasses[size], className)}
        {...props}
      >
        {icon}
      </EnhancedButton>
    );
  }
);

IconButton.displayName = 'IconButton';

// Button Group Component
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export function ButtonGroup({
  children,
  className,
  orientation = 'horizontal',
  size: _size = 'md',
  variant: _variant = 'outline',
}: ButtonGroupProps) {
  const groupClasses = cn(
    'inline-flex',
    orientation === 'horizontal' ? 'flex-row' : 'flex-col',
    className
  );

  const childrenArray = React.Children.toArray(children);

  return (
    <div className={groupClasses} role="group">
      {childrenArray.map((child, index) => {
        const childElement = child as React.ReactElement;
        return (
          <div
            key={childElement.key || `button-group-${index}`}
            className={cn(
              orientation === 'horizontal' && index > 0 && '-ml-px',
              orientation === 'vertical' && index > 0 && '-mt-px',
              orientation === 'horizontal' && index === 0 && 'rounded-r-none',
              orientation === 'horizontal' &&
                index === childrenArray.length - 1 &&
                'rounded-l-none',
              orientation === 'horizontal' &&
                index > 0 &&
                index < childrenArray.length - 1 &&
                'rounded-none',
              orientation === 'vertical' && index === 0 && 'rounded-b-none',
              orientation === 'vertical' &&
                index === childrenArray.length - 1 &&
                'rounded-t-none',
              orientation === 'vertical' &&
                index > 0 &&
                index < childrenArray.length - 1 &&
                'rounded-none'
            )}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
