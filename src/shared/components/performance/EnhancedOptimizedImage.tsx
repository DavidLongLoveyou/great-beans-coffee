'use client';

import Image, { type ImageProps } from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { cloudinaryService, type OptimizedImageOptions } from '@/infrastructure/external-services/cloudinary.service';
import { coreWebVitalsOptimizer } from '@/shared/utils/core-web-vitals';

interface EnhancedOptimizedImageProps extends Omit<ImageProps, 'src' | 'onLoad' | 'onError'> {
  /** Cloudinary public ID */
  publicId: string;
  /** Cloudinary optimization options */
  cloudinaryOptions?: OptimizedImageOptions;
  /** Whether to show a blur placeholder while loading */
  showBlurPlaceholder?: boolean;
  /** Whether to use lazy loading (default: true) */
  lazy?: boolean;
  /** Custom loading state component */
  loadingComponent?: React.ReactNode;
  /** Custom error state component */
  errorComponent?: React.ReactNode;
  /** Callback when image loads successfully */
  onLoadComplete?: () => void;
  /** Callback when image fails to load */
  onLoadError?: () => void;
  /** Whether to optimize for LCP (Largest Contentful Paint) */
  optimizeForLCP?: boolean;
  /** Whether to track loading performance */
  trackPerformance?: boolean;
  /** Image category for analytics */
  category?: 'hero' | 'product' | 'blog' | 'gallery' | 'thumbnail';
  /** Responsive breakpoints */
  responsiveBreakpoints?: number[];
}

/**
 * Enhanced Optimized Image component with Cloudinary integration and Core Web Vitals optimization
 * 
 * Features:
 * - Cloudinary automatic optimization (WebP/AVIF, quality, compression)
 * - Core Web Vitals tracking and optimization
 * - Intelligent lazy loading with intersection observer
 * - Blur placeholder for better perceived performance
 * - Error handling with fallback states
 * - LCP optimization for above-the-fold images
 * - Performance analytics integration
 * - Responsive image sizing with srcSet
 */
export function EnhancedOptimizedImage({
  publicId,
  alt,
  className,
  cloudinaryOptions = {},
  showBlurPlaceholder = true,
  lazy = true,
  loadingComponent,
  errorComponent,
  onLoadComplete,
  onLoadError,
  optimizeForLCP = false,
  trackPerformance = true,
  category = 'product',
  responsiveBreakpoints,
  priority,
  sizes,
  ...props
}: EnhancedOptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement>(null);

  // Generate optimized URLs
  const optimizedUrl = cloudinaryService.getOptimizedImageUrl(publicId, {
    ...cloudinaryOptions,
    priority: optimizeForLCP ? 'high' : 'auto',
    responsive: true,
  });

  const blurDataURL = showBlurPlaceholder 
    ? cloudinaryService.getBlurPlaceholder(publicId)
    : undefined;

  // Generate responsive URLs if breakpoints are provided
  const responsiveUrls = responsiveBreakpoints 
    ? cloudinaryService.getResponsiveImageUrls(publicId, responsiveBreakpoints, cloudinaryOptions)
    : undefined;

  // Create srcSet for responsive images
  const srcSet = responsiveUrls
    ? responsiveUrls.map(({ url, width }) => `${url} ${width}w`).join(', ')
    : undefined;

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    
    // Track loading performance
    if (trackPerformance && loadStartTime > 0) {
      const loadTime = performance.now() - loadStartTime;
      
      // Report to Core Web Vitals optimizer
      if (optimizeForLCP) {
        // This is likely the LCP element, track it specially
        coreWebVitalsOptimizer.preloadCriticalResources([{
          href: optimizedUrl,
          as: 'image',
        }]);
      }

      // Track in analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'image_load_time', {
          event_category: 'Performance',
          event_label: `${category}_image`,
          value: Math.round(loadTime),
          custom_map: {
            image_category: category,
            is_lcp: optimizeForLCP,
            public_id: publicId,
          },
        });
      }
    }
    
    onLoadComplete?.();
  }, [onLoadComplete, trackPerformance, loadStartTime, optimizeForLCP, category, publicId, optimizedUrl]);

  // Handle image error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    
    // Track error in analytics
    if (trackPerformance && typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'image_load_error', {
        event_category: 'Performance',
        event_label: `${category}_image_error`,
        custom_map: {
          image_category: category,
          public_id: publicId,
        },
      });
    }
    
    onLoadError?.();
  }, [onLoadError, trackPerformance, category, publicId]);

  // Track load start time
  useEffect(() => {
    if (trackPerformance) {
      setLoadStartTime(performance.now());
    }
  }, [trackPerformance]);

  // Preload critical images
  useEffect(() => {
    if (optimizeForLCP && !lazy) {
      coreWebVitalsOptimizer.optimizeImagesForWebVitals([{
        publicId,
        priority: 'high',
        sizes,
      }]);
    }
  }, [optimizeForLCP, lazy, publicId, sizes]);

  // Error state
  if (hasError) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }
    
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          'min-h-[200px] rounded-lg',
          className
        )}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <div className="text-center">
          <svg 
            className="mx-auto h-12 w-12 mb-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        ref={imageRef}
        src={optimizedUrl}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          'image-optimized' // CSS class for additional optimizations
        )}
        onLoad={handleLoad}
        onError={handleError}
        priority={optimizeForLCP || priority}
        loading={lazy ? 'lazy' : 'eager'}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'}
        srcSet={srcSet}
        {...props}
      />
      
      {/* Loading overlay */}
      {isLoading && !loadingComponent && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center',
          'bg-gray-100 animate-pulse'
        )}>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Enhanced Hero Image component optimized for LCP
 */
export function EnhancedHeroImage(props: EnhancedOptimizedImageProps) {
  return (
    <EnhancedOptimizedImage
      {...props}
      optimizeForLCP={true}
      priority={true}
      lazy={false}
      category="hero"
      trackPerformance={true}
      cloudinaryOptions={{
        ...props.cloudinaryOptions,
        priority: 'high',
        transformations: {
          quality: 'auto:good',
          format: 'auto',
          flags: ['progressive', 'immutable_cache'],
          ...props.cloudinaryOptions?.transformations,
        },
      }}
    />
  );
}

/**
 * Enhanced Product Image component for e-commerce
 */
export function EnhancedProductImage({ 
  size = 'medium',
  ...props 
}: EnhancedOptimizedImageProps & { 
  size?: 'thumbnail' | 'medium' | 'large' 
}) {
  const dimensions = {
    thumbnail: { width: 200, height: 200 },
    medium: { width: 400, height: 400 },
    large: { width: 800, height: 800 },
  };

  return (
    <EnhancedOptimizedImage
      {...props}
      category="product"
      cloudinaryOptions={{
        ...props.cloudinaryOptions,
        transformations: {
          ...dimensions[size],
          crop: 'fill',
          gravity: 'center',
          quality: 'auto:good',
          background: 'white',
          format: 'auto',
          ...props.cloudinaryOptions?.transformations,
        },
      }}
      className={cn('rounded-lg', props.className)}
    />
  );
}

/**
 * Enhanced Blog Image component for content
 */
export function EnhancedBlogImage(props: EnhancedOptimizedImageProps) {
  return (
    <EnhancedOptimizedImage
      {...props}
      category="blog"
      cloudinaryOptions={{
        ...props.cloudinaryOptions,
        transformations: {
          width: 800,
          crop: 'scale',
          gravity: 'auto',
          quality: 'auto:good',
          format: 'auto',
          ...props.cloudinaryOptions?.transformations,
        },
      }}
      className={cn('rounded-lg', props.className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
    />
  );
}

/**
 * Enhanced Gallery Image component with thumbnail optimization
 */
export function EnhancedGalleryImage(props: EnhancedOptimizedImageProps) {
  return (
    <EnhancedOptimizedImage
      {...props}
      category="gallery"
      cloudinaryOptions={{
        ...props.cloudinaryOptions,
        transformations: {
          width: 300,
          height: 300,
          crop: 'fill',
          gravity: 'auto',
          quality: 'auto:good',
          format: 'auto',
          ...props.cloudinaryOptions?.transformations,
        },
      }}
      className={cn('rounded-lg cursor-pointer hover:scale-105 transition-transform', props.className)}
    />
  );
}