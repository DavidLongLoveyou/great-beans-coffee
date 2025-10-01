'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LazySectionProps {
  /** Content to render when section is visible */
  children: ReactNode;
  /** Custom loading component */
  fallback?: ReactNode;
  /** Root margin for intersection observer (default: '50px') */
  rootMargin?: string;
  /** Threshold for intersection observer (default: 0.1) */
  threshold?: number;
  /** Custom className for the container */
  className?: string;
  /** Whether to only load once (default: true) */
  once?: boolean;
  /** Minimum height while loading */
  minHeight?: string | number;
  /** Animation class when content loads */
  animationClass?: string;
  /** Delay before showing content (in ms) */
  delay?: number;
}

/**
 * Lazy loading component that renders content only when it enters the viewport
 * 
 * Features:
 * - Intersection Observer API for efficient viewport detection
 * - Customizable loading states and animations
 * - Configurable thresholds and margins
 * - One-time or repeated loading
 * - Performance optimized with cleanup
 */
export function LazySection({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  className,
  once = true,
  minHeight,
  animationClass = 'animate-fade-in',
  delay = 0,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              if (once) {
                observer.unobserve(element);
              }
            }, delay);
          } else {
            setIsVisible(true);
            if (once) {
              observer.unobserve(element);
            }
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, once, delay]);

  useEffect(() => {
    if (isVisible && !isLoaded) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => setIsLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoaded]);

  const containerStyle = minHeight 
    ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }
    : undefined;

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      style={containerStyle}
    >
      {isVisible ? (
        <div className={cn(isLoaded && animationClass)}>
          {children}
        </div>
      ) : (
        fallback || <LazyFallback minHeight={minHeight} />
      )}
    </div>
  );
}

/**
 * Default loading fallback component
 */
function LazyFallback({ minHeight }: { minHeight?: string | number }) {
  const style = minHeight 
    ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }
    : { minHeight: '200px' };

  return (
    <div 
      className="flex items-center justify-center bg-gray-50 rounded-lg"
      style={style}
    >
      <div className="flex items-center space-x-2 text-gray-400">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
}

/**
 * Lazy loading component specifically for images with skeleton
 */
export function LazyImageSection({
  children,
  aspectRatio = 'aspect-video',
  className,
  ...props
}: LazySectionProps & {
  aspectRatio?: string;
}) {
  return (
    <LazySection
      {...props}
      className={cn(aspectRatio, className)}
      fallback={
        <div className={cn('bg-gray-200 animate-pulse rounded-lg', aspectRatio)}>
          <div className="flex items-center justify-center h-full">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      }
    >
      {children}
    </LazySection>
  );
}

/**
 * Lazy loading component for text content with skeleton
 */
export function LazyTextSection({
  children,
  lines = 3,
  className,
  ...props
}: LazySectionProps & {
  lines?: number;
}) {
  return (
    <LazySection
      {...props}
      className={className}
      fallback={
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-4 bg-gray-200 rounded animate-pulse',
                i === lines - 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      }
    >
      {children}
    </LazySection>
  );
}

/**
 * Lazy loading component for card grids
 */
export function LazyCardGrid({
  children,
  cardCount = 6,
  columns = 3,
  className,
  ...props
}: LazySectionProps & {
  cardCount?: number;
  columns?: number;
}) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <LazySection
      {...props}
      className={className}
      fallback={
        <div className={cn('grid gap-6', gridClass)}>
          {Array.from({ length: cardCount }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      }
    >
      {children}
    </LazySection>
  );
}

/**
 * Hook for programmatic lazy loading control
 */
export function useLazyLoading(
  threshold = 0.1,
  rootMargin = '50px',
  once = true
) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}