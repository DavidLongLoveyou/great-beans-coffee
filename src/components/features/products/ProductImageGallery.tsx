'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Download,
  Share2,
  Coffee,
} from '@/components/ui/icons';

import { EnhancedProductImage } from '@/shared/components/performance/EnhancedOptimizedImage';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ProductImage {
  id: string;
  url: string;
  cloudinaryId?: string;
  alt: string;
  caption?: string;
  isPrimary?: boolean;
  category?: 'product' | 'packaging' | 'origin' | 'process' | 'quality';
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
  showThumbnails?: boolean;
  showControls?: boolean;
  showImageInfo?: boolean;
  enableZoom?: boolean;
  enableDownload?: boolean;
  enableShare?: boolean;
}

const imageCategoryLabels = {
  product: 'Product',
  packaging: 'Packaging',
  origin: 'Origin',
  process: 'Processing',
  quality: 'Quality Control',
};

const imageCategoryColors = {
  product: 'bg-coffee-500',
  packaging: 'bg-amber-500',
  origin: 'bg-green-500',
  process: 'bg-blue-500',
  quality: 'bg-purple-500',
};

export function ProductImageGallery({
  images,
  productName,
  className,
  showThumbnails = true,
  showControls = true,
  showImageInfo = true,
  enableZoom = true,
  enableDownload = false,
  enableShare = false,
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Find primary image or use first image
  const primaryImageIndex = images.findIndex(img => img.isPrimary) || 0;

  // All hooks must be called before any early returns
  useEffect(() => {
    setCurrentImageIndex(primaryImageIndex);
  }, [primaryImageIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  const handleZoomToggle = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  const currentImage = images[currentImageIndex];

  const handleDownload = useCallback(async () => {
    if (!currentImage || !enableDownload) return;

    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${productName}-${currentImage.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Download error handling removed for production
    }
  }, [currentImage, productName, enableDownload]);

  const handleShare = useCallback(async () => {
    if (!currentImage || !enableShare) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${productName} - ${currentImage.alt}`,
          text: `Check out this ${productName} image`,
          url: currentImage.url,
        });
      } catch (error) {
        // Share error handling removed for production
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(currentImage.url);
        // You could show a toast notification here
      } catch (error) {
        // Clipboard error handling removed for production
      }
    }
  }, [currentImage, productName, enableShare]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  const hasMultipleImages = images.length > 1;

  // Early return if no images or current image
  if (!images.length || !currentImage) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="flex h-80 w-full items-center justify-center rounded-lg bg-gradient-to-br from-coffee-100 to-coffee-200">
            <div className="text-center">
              <Coffee className="mx-auto h-24 w-24 text-coffee-400" />
              <p className="mt-4 text-sm text-coffee-600">
                No images available
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        {/* Main Image Display */}
        <div className="relative mb-4">
          <div
            className={cn(
              'relative overflow-hidden rounded-lg bg-gradient-to-br from-coffee-50 to-coffee-100',
              isZoomed ? 'h-96' : 'h-80',
              'transition-all duration-300'
            )}
          >
            {currentImage.cloudinaryId ? (
              <EnhancedProductImage
                publicId={currentImage.cloudinaryId}
                alt={currentImage.alt}
                size="large"
                className={cn(
                  'h-full w-full object-cover transition-transform duration-300',
                  isZoomed && 'scale-110 cursor-zoom-out',
                  !isZoomed && enableZoom && 'cursor-zoom-in'
                )}
                onClick={enableZoom ? handleZoomToggle : undefined}
                priority={currentImageIndex === 0}
                onLoadComplete={() => setIsLoading(false)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Coffee className="h-24 w-24 text-coffee-400" />
              </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-coffee-100/80">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-coffee-500 border-t-transparent" />
              </div>
            )}

            {/* Navigation Controls */}
            {showControls && hasMultipleImages && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={goToPrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Action Controls */}
            <div className="absolute right-2 top-2 flex gap-2">
              {enableZoom && (
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/90 hover:bg-white"
                  onClick={handleZoomToggle}
                  aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              )}
              {enableDownload && (
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/90 hover:bg-white"
                  onClick={handleDownload}
                  aria-label="Download image"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {enableShare && (
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/90 hover:bg-white"
                  onClick={handleShare}
                  aria-label="Share image"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Image Category Badge */}
            {showImageInfo && currentImage.category && (
              <div className="absolute bottom-2 left-2">
                <Badge
                  className={cn(
                    'text-white',
                    imageCategoryColors[currentImage.category]
                  )}
                >
                  {imageCategoryLabels[currentImage.category]}
                </Badge>
              </div>
            )}

            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {currentImageIndex + 1} / {images.length}
                </Badge>
              </div>
            )}
          </div>

          {/* Image Caption */}
          {showImageInfo && currentImage.caption && (
            <p className="mt-2 text-sm text-coffee-600">
              {currentImage.caption}
            </p>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {showThumbnails && hasMultipleImages && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  'relative h-16 w-full overflow-hidden rounded border-2 transition-all duration-200',
                  index === currentImageIndex
                    ? 'border-coffee-500 ring-2 ring-coffee-200'
                    : 'border-transparent hover:border-coffee-300'
                )}
                aria-label={`View image ${index + 1}: ${image.alt}`}
              >
                {image.cloudinaryId ? (
                  <EnhancedProductImage
                    publicId={image.cloudinaryId}
                    alt={image.alt}
                    size="thumbnail"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-coffee-50 to-coffee-100">
                    <Coffee className="h-6 w-6 text-coffee-400" />
                  </div>
                )}

                {/* Primary Image Indicator */}
                {image.isPrimary && (
                  <div className="absolute right-1 top-1">
                    <div className="h-2 w-2 rounded-full bg-gold-500" />
                  </div>
                )}

                {/* Category Indicator */}
                {image.category && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <div
                      className={cn('h-1', imageCategoryColors[image.category])}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
