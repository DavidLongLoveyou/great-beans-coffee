'use client';

import { motion, HTMLMotionProps, useScroll, useTransform } from 'framer-motion';
import {
  useScrollAnimation,
  useHoverAnimation,
} from '@/presentation/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Fade In on Scroll Component
interface FadeInScrollProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
}

export function FadeInScroll({
  children,
  delay = 0,
  threshold = 0.1,
  className,
  triggerOnce = true,
  ...props
}: FadeInScrollProps) {
  const { ref, isInView, animationVariants } = useScrollAnimation({
    threshold,
    triggerOnce,
    delay,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={animationVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Staggered Children Animation
interface StaggeredFadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  childClassName?: string;
}

export function StaggeredFadeIn({
  children,
  staggerDelay = 0.1,
  className,
  childClassName,
  ...props
}: StaggeredFadeInProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
      {...props}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={childClassName}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

// Hover Lift Effect
interface HoverLiftProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  liftHeight?: number;
  scale?: number;
  className?: string;
}

export function HoverLift({
  children,
  liftHeight = 4,
  scale = 1.02,
  className,
  ...props
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{
        y: -liftHeight,
        scale,
        transition: {
          duration: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      className={cn('cursor-pointer', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Button with Professional Hover Effects
interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
}

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  ...props
}: AnimatedButtonProps) {
  const { buttonHoverVariants } = useHoverAnimation();

  const baseClasses =
    'relative overflow-hidden font-medium transition-all duration-200 rounded-lg';

  const variantClasses = {
    primary:
      'bg-forest-600 text-white hover:bg-forest-700 shadow-lg hover:shadow-forest-medium',
    secondary:
      'bg-emerald-100 text-forest-800 hover:bg-emerald-200 shadow-md hover:shadow-emerald-soft',
    outline:
      'border-2 border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      variants={buttonHoverVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loading && 'cursor-not-allowed opacity-70',
        className
      )}
      disabled={loading}
      {...props}
    >
      {/* Ripple Effect Background */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </span>
    </motion.button>
  );
}

// Icon with Hover Animation
interface AnimatedIconProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hoverRotate?: number;
  hoverScale?: number;
}

export function AnimatedIcon({
  children,
  className,
  hoverRotate = 5,
  hoverScale = 1.1,
  ...props
}: AnimatedIconProps) {
  return (
    <motion.div
      whileHover={{
        rotate: hoverRotate,
        scale: hoverScale,
        transition: {
          duration: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      }}
      className={cn('inline-block', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Card with Professional Hover Effects
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hoverShadow?: boolean;
  hoverLift?: boolean;
}

export function AnimatedCard({
  children,
  className,
  hoverShadow = true,
  hoverLift = true,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{
        y: hoverLift ? -4 : 0,
        scale: 1.01,
        boxShadow: hoverShadow
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          : undefined,
        transition: {
          duration: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      }}
      whileTap={{
        scale: 0.99,
        transition: { duration: 0.1 },
      }}
      className={cn(
        'cursor-pointer transition-all duration-200',
        hoverShadow && 'shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Floating Animation for Decorative Elements
interface FloatingElementProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export function FloatingElement({
  children,
  duration = 3,
  yOffset = 10,
  className,
  ...props
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [-yOffset, yOffset, -yOffset],
        transition: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Pulse Animation for Attention-Grabbing Elements
interface PulseElementProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  scale?: [number, number];
  duration?: number;
  className?: string;
}

export function PulseElement({
  children,
  scale = [1, 1.05],
  duration = 2,
  className,
  ...props
}: PulseElementProps) {
  return (
    <motion.div
      animate={{
        scale,
        transition: {
          duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Enhanced Loading Spinner with Forest Theme
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'forest' | 'emerald' | 'white';
}

export function LoadingSpinner({
  size = 'md',
  className,
  color = 'forest',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const colorClasses = {
    forest: 'border-forest-600 border-t-transparent',
    emerald: 'border-emerald-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={cn(
        'rounded-full border-2',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
}

// Professional Loading State Component
interface LoadingStateProps {
  children?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  className?: string;
}

export function LoadingState({
  children,
  loading = false,
  loadingText = 'Loading...',
  className,
}: LoadingStateProps) {
  return (
    <motion.div
      className={cn('relative', className)}
      animate={loading ? 'loading' : 'loaded'}
      variants={{
        loading: { opacity: 0.6 },
        loaded: { opacity: 1 },
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
      
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <LoadingSpinner size="md" color="forest" />
            <span className="text-forest-700 font-medium">{loadingText}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Enhanced Skeleton Loader with Forest Theme
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave';
}

export function Skeleton({
  className,
  variant = 'text',
  animation = 'pulse',
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    rectangular: 'w-full rounded-lg',
    circular: 'rounded-full aspect-square',
  };

  const animationClasses = {
    pulse: 'animate-pulse bg-forest-200',
    wave: 'loading-shimmer',
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    />
  );
}

// Performance-Optimized Parallax Effect
interface ParallaxElementProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxElement({
  children,
  speed = 0.5,
  className,
  ...props
}: ParallaxElementProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);

  return (
    <motion.div
      style={{ y }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Smooth Page Transition Component
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}