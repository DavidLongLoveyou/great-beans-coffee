'use client';

import Image, { type ImageProps, type StaticImport, type ImageLoader } from 'next/image';
import { useState, useCallback, useEffect, type CSSProperties } from 'react';
import { cn } from '@/shared/utils/cn';
import { cloudinaryService } from '@/infrastructure/external-services/cloudinary.service';
import { coreWebVitalsOptimizer } from '@/shared/utils/core-web-vitals';

// Define explicit props interface to work with exactOptionalPropertyTypes
export interface OptimizedImageProps {
  // Required props
  src: string | StaticImport;
  alt: string;
  
  // Next.js Image props (all optional with explicit undefined)
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  fill?: boolean | undefined;
  loader?: ImageLoader | undefined;
  quality?: number | `${number}` | undefined;
  priority?: boolean | undefined;
  loading?: "eager" | "lazy" | undefined;
  placeholder?: "blur" | "empty" | `data:image/${string}` | undefined;
  blurDataURL?: string | undefined;
  unoptimized?: boolean | undefined;
  overrideSrc?: string | undefined;
  onLoadingComplete?: ((result: { naturalWidth: number; naturalHeight: number }) => void) | undefined;
  decoding?: "async" | "auto" | "sync" | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  sizes?: string | undefined;
  lazyBoundary?: string | undefined;
  lazyRoot?: string | undefined;
  
  // Custom optimization options
  /** Whether to show a blur placeholder while loading */
  showBlurPlaceholder?: boolean | undefined;
  /** Whether to use lazy loading (default: true) */
  lazy?: boolean | undefined;
  /** Custom loading state component */
  loadingComponent?: React.ReactNode | undefined;
  /** Custom error state component */
  errorComponent?: React.ReactNode | undefined;
  /** Callback when image loads successfully */
  onLoadComplete?: (() => void) | undefined;
  /** Callback when image fails to load */
  onLoadError?: (() => void) | undefined;
  /** Whether to optimize for LCP (Largest Contentful Paint) */
  optimizeForLCP?: boolean | undefined;
  
  // Cloudinary integration
  /** Cloudinary public ID (if using Cloudinary) */
  cloudinaryId?: string | undefined;
  /** Whether to use Cloudinary optimization */
  useCloudinary?: boolean | undefined;
  
  // Analytics and monitoring
  /** Whether to track performance metrics */
  trackPerformance?: boolean | undefined;
}

/**
 * Optimized Image component with lazy loading, blur placeholders, and Core Web Vitals optimizations
 * 
 * Features:
 * - Automatic lazy loading with intersection observer
 * - Blur placeholder for better perceived performance
 * - Error handling with fallback states
 * - LCP optimization for above-the-fold images
 * - Responsive image sizing
 * - WebP/AVIF format support via Next.js
 */
export function OptimizedImage({
  src,
  alt,
  className,
  showBlurPlaceholder = true,
  blurDataURL,
  lazy = true,
  loadingComponent,
  errorComponent,
  onLoadComplete,
  onLoadError,
  optimizeForLCP = false,
  cloudinaryId,
  useCloudinary = false,
  trackPerformance = false,
  priority,
  // Extract Next.js Image props
  width,
  height,
  fill,
  sizes,
  quality,
  placeholder,
  style,
  loader,
  unoptimized,
  overrideSrc,
  onLoadingComplete,
  decoding,
  loading,
  lazyBoundary,
  lazyRoot,
  ...restProps
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState<number>(0);

  // Determine the image source and blur placeholder
  const imageSource = useCloudinary && cloudinaryId 
    ? cloudinaryService.getOptimizedImageUrl(cloudinaryId, {
        priority: optimizeForLCP ? 'high' : 'auto',
        responsive: true,
      })
    : src;

  const imageBlurDataURL = useCloudinary && cloudinaryId && showBlurPlaceholder
    ? cloudinaryService.getBlurPlaceholder(cloudinaryId)
    : blurDataURL || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    
    // Track loading performance
    if (trackPerformance && loadStartTime > 0) {
      const loadTime = performance.now() - loadStartTime;
      
      // Report to Core Web Vitals optimizer for LCP images
      if (optimizeForLCP) {
        coreWebVitalsOptimizer.preloadCriticalResources([{
          href: imageSource,
          as: 'image',
        }]);
      }

      // Track in analytics if available
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'image_load_time', {
          event_category: 'Performance',
          event_label: useCloudinary ? 'cloudinary_image' : 'standard_image',
          value: Math.round(loadTime),
          custom_map: {
            is_lcp: optimizeForLCP,
            uses_cloudinary: useCloudinary,
          },
        });
      }
    }
    
    onLoadComplete?.();
  }, [onLoadComplete, trackPerformance, loadStartTime, optimizeForLCP, imageSource, useCloudinary]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    
    // Track error in analytics if available
    if (trackPerformance && typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'image_load_error', {
        event_category: 'Performance',
        event_label: useCloudinary ? 'cloudinary_image_error' : 'standard_image_error',
        custom_map: {
          uses_cloudinary: useCloudinary,
        },
      });
    }
    
    onLoadError?.();
  }, [onLoadError, trackPerformance, useCloudinary]);

  // Track load start time and preload critical images
  useEffect(() => {
    if (trackPerformance) {
      setLoadStartTime(performance.now());
    }

    // Preload critical images for LCP optimization
    if (optimizeForLCP && !lazy && useCloudinary && cloudinaryId) {
      coreWebVitalsOptimizer.optimizeImagesForWebVitals([{
        publicId: cloudinaryId,
        priority: 'high',
        sizes: props.sizes,
      }]);
    }
  }, [trackPerformance, optimizeForLCP, lazy, useCloudinary, cloudinaryId, props.sizes]);

  // Show error state
  if (hasError) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }
    
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        {...(props.fill ? {} : { style: { width: props.width, height: props.height } })}
      >
        <svg
          className="h-8 w-8"
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
    );
  }

  // Show loading state
  if (isLoading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  return (
    <div className="relative">
      <Image
        src={imageSource}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        style={style}
        loader={loader}
        unoptimized={unoptimized}
        overrideSrc={overrideSrc}
        onLoadingComplete={onLoadingComplete}
        decoding={decoding}
        lazyBoundary={lazyBoundary}
        lazyRoot={lazyRoot}
        className={cn(
          'transition-opacity duration-300',
          isLoading && showBlurPlaceholder ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        priority={optimizeForLCP || priority}
        loading={loading || (lazy && !optimizeForLCP && !priority ? 'lazy' : 'eager')}
        placeholder={placeholder || (showBlurPlaceholder ? 'blur' : 'empty')}
        blurDataURL={imageBlurDataURL}
      />
      
      {/* Loading overlay with blur placeholder */}
      {isLoading && showBlurPlaceholder && (
        <div 
          className={cn(
            'absolute inset-0 bg-gray-200 animate-pulse',
            className
          )}
          style={{
            backgroundImage: `url("${imageBlurDataURL}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
          }}
        />
      )}
    </div>
  );
}

/**
 * Optimized Image component specifically for hero/above-the-fold images
 * Automatically sets priority and optimizes for LCP
 */
export function HeroImage({ 
  ...props 
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      optimizeForLCP={true}
      priority={true}
      lazy={false}
      useCloudinary={props.cloudinaryId ? true : props.useCloudinary}
      trackPerformance={true}
    />
  );
}

/**
 * Optimized Image component for card thumbnails
 * Includes responsive sizing and lazy loading
 */
export function CardImage({ 
  className, 
  ...props 
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      className={cn('rounded-lg shadow-sm', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      useCloudinary={props.cloudinaryId ? true : props.useCloudinary}
      trackPerformance={true}
    />
  );
}

/**
 * Optimized Image component for blog content
 * Includes responsive sizing and accessibility features
 */
export function ContentImage({ 
  className, 
  ...props 
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      className={cn('rounded-lg', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
      useCloudinary={props.cloudinaryId ? true : props.useCloudinary}
      trackPerformance={true}
    />
  );
}