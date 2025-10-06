'use client';

import Image, { type ImageLoader } from 'next/image';
import { useState, useCallback, useEffect, type CSSProperties } from 'react';

import { cloudinaryService } from '@/infrastructure/external-services/cloudinary.service';
import { cn } from '@/shared/utils/cn';
import { coreWebVitalsOptimizer } from '@/shared/utils/core-web-vitals';

// Define explicit props interface to work with exactOptionalPropertyTypes
export interface OptimizedImageProps {
  // Required props
  src: string;
  alt: string;

  // Next.js Image props (all optional with explicit undefined)
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
  fill?: boolean | undefined;
  loader?: ImageLoader | undefined;
  quality?: number | `${number}` | undefined;
  priority?: boolean | undefined;
  loading?: 'eager' | 'lazy' | undefined;
  placeholder?: 'blur' | 'empty' | `data:image/${string}` | undefined;
  blurDataURL?: string | undefined;
  unoptimized?: boolean | undefined;
  overrideSrc?: string | undefined;
  onLoadingComplete?:
    | ((result: { naturalWidth: number; naturalHeight: number }) => void)
    | undefined;
  decoding?: 'async' | 'auto' | 'sync' | undefined;
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
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState<number>(0);

  // Determine the image source and blur placeholder
  const imageSource =
    useCloudinary && cloudinaryId
      ? cloudinaryService.getOptimizedImageUrl(cloudinaryId, {
          priority: optimizeForLCP ? 'high' : 'auto',
          responsive: true,
        })
      : src;

  const imageBlurDataURL =
    useCloudinary && cloudinaryId && showBlurPlaceholder
      ? cloudinaryService.getBlurPlaceholder(cloudinaryId)
      : blurDataURL;

  // Handle successful image load
  const handleLoad = useCallback(() => {
    setIsLoading(false);

    if (trackPerformance && loadStartTime > 0) {
      const loadTime = performance.now() - loadStartTime;

      // Track performance metrics
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          `Image load time: ${loadTime}ms (${optimizeForLCP ? 'LCP' : 'standard'} image, Cloudinary: ${useCloudinary})`
        );
      }
    }

    onLoadComplete?.();
  }, [
    onLoadComplete,
    trackPerformance,
    loadStartTime,
    optimizeForLCP,
    useCloudinary,
  ]);

  // Handle image load error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);

    if (trackPerformance) {
      // Track error metrics
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn(
          `Image load error: ${optimizeForLCP ? 'LCP' : 'standard'} image, Cloudinary: ${useCloudinary}`
        );
      }
    }

    onLoadError?.();
  }, [onLoadError, trackPerformance, optimizeForLCP, useCloudinary]);

  // Track load start time and preload critical images
  useEffect(() => {
    if (trackPerformance) {
      setLoadStartTime(performance.now());
    }

    // Preload critical images for LCP optimization
    if (optimizeForLCP && !lazy && useCloudinary && cloudinaryId) {
      coreWebVitalsOptimizer.optimizeImagesForWebVitals([
        {
          publicId: cloudinaryId,
          priority: 'high',
          ...(sizes && { sizes }),
        },
      ]);
    }
  }, [
    trackPerformance,
    optimizeForLCP,
    lazy,
    useCloudinary,
    cloudinaryId,
    sizes,
  ]);

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
        {...(fill ? {} : { style: { width: width, height: height } })}
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
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
        {...(width !== undefined && { width })}
        {...(height !== undefined && { height })}
        {...(fill !== undefined && { fill })}
        {...(sizes && { sizes })}
        {...(quality !== undefined && { quality })}
        {...(style && { style })}
        {...(loader && { loader })}
        {...(unoptimized !== undefined && { unoptimized })}
        {...(overrideSrc && { overrideSrc })}
        {...(onLoadingComplete && { onLoadingComplete })}
        {...(decoding && { decoding })}
        {...(lazyBoundary && { lazyBoundary })}
        {...(lazyRoot && { lazyRoot })}
        className={cn(
          'transition-opacity duration-300',
          isLoading && showBlurPlaceholder ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        priority={Boolean(optimizeForLCP || priority)}
        loading={
          loading || (lazy && !optimizeForLCP && !priority ? 'lazy' : 'eager')
        }
        placeholder={placeholder || (showBlurPlaceholder && imageBlurDataURL ? 'blur' : 'empty')}
        {...(imageBlurDataURL && { blurDataURL: imageBlurDataURL })}
      />

      {/* Loading overlay with blur placeholder */}
      {isLoading && showBlurPlaceholder && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-gray-100',
            className
          )}
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </div>
      )}
    </div>
  );
}

/**
 * Optimized Image component specifically for hero/above-the-fold images
 * Automatically sets priority and optimizes for LCP
 */
export function HeroImage(props: OptimizedImageProps) {
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
export function CardImage({ className, ...props }: OptimizedImageProps) {
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
export function ContentImage({ className, ...props }: OptimizedImageProps) {
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
