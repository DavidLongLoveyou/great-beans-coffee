'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

import { cn } from '@/lib/utils';

import { Skeleton, LoadingSpinner } from './MicroInteractions';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality: _quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  const containerClasses = cn(
    'relative overflow-hidden',
    fill ? 'absolute inset-0' : '',
    className
  );

  const imageClasses = cn(
    'transition-all duration-300',
    fill ? 'absolute inset-0 h-full w-full' : '',
    objectFit === 'cover' ? 'object-cover' : '',
    objectFit === 'contain' ? 'object-contain' : '',
    objectFit === 'fill' ? 'object-fill' : '',
    objectFit === 'none' ? 'object-none' : '',
    objectFit === 'scale-down' ? 'object-scale-down' : ''
  );

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={!fill ? { width, height } : undefined}
    >
      <AnimatePresence mode="wait">
        {/* Loading State */}
        {isLoading && !hasError && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-forest-50"
          >
            {placeholder === 'blur' && blurDataURL ? (
              <Image
                src={blurDataURL}
                alt=""
                fill
                className={cn(imageClasses, 'scale-110 blur-sm')}
              />
            ) : (
              <Skeleton
                variant="rectangular"
                className="h-full w-full bg-forest-100"
                animation="wave"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner size="md" color="forest" />
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {hasError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-forest-50 text-forest-600"
          >
            <svg
              className="mb-2 h-12 w-12 text-forest-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium">Failed to load image</span>
          </motion.div>
        )}

        {/* Actual Image */}
        {isInView && !hasError && (
          <motion.img
            key="image"
            ref={imgRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            className={imageClasses}
            variants={imageVariants}
            initial="hidden"
            animate={isLoading ? 'hidden' : 'visible'}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Optimized Background Image Component
interface OptimizedBackgroundImageProps {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayOpacity?: number;
  priority?: boolean;
}

export function OptimizedBackgroundImage({
  src,
  alt,
  className,
  children,
  overlay = false,
  overlayOpacity = 0.5,
  priority = false,
}: OptimizedBackgroundImageProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        objectFit="cover"
        priority={priority}
        className="absolute inset-0"
      />

      {overlay && (
        <div
          className="absolute inset-0 bg-forest-900"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
