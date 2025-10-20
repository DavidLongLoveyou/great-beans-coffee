'use client';

import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  X,
  Maximize2,
  RotateCw,
} from '@/components/ui/icons';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  downloadUrl?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  title?: string;
  className?: string;
  showThumbnails?: boolean;
  showCategories?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ImageGallery({
  images,
  title,
  className = '',
  showThumbnails = true,
  showCategories = true,
  allowDownload = true,
  allowShare = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Filter images by category
  const filteredImages = selectedCategory
    ? images.filter(img => img.category === selectedCategory)
    : images;

  // Get unique categories
  const categories = Array.from(
    new Set(
      images
        .map(img => img.category)
        .filter((cat): cat is string => Boolean(cat))
    )
  );

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && filteredImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredImages.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isPlaying, filteredImages.length, autoPlayInterval]);

  const currentImage = filteredImages[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex(
      prev => (prev - 1 + filteredImages.length) % filteredImages.length
    );
    setZoom(1);
    setRotation(0);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % filteredImages.length);
    setZoom(1);
    setRotation(0);
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    setZoom(1);
    setRotation(0);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = async (image: GalleryImage) => {
    if (image.downloadUrl) {
      const link = document.createElement('a');
      link.href = image.downloadUrl;
      link.download = image.title || image.alt;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title || image.alt,
          text: image.description || image.alt,
          url: image.src,
        });
      } catch (error) {
        // Error sharing - silently fail
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(image.src);
    }
  };

  if (filteredImages.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">No images available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      )}

      {/* Category Filter */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap text-xs sm:text-sm"
            onClick={() => setSelectedCategory(null)}
          >
            <span className="hidden sm:inline">All ({images.length})</span>
            <span className="sm:hidden">All</span>
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="whitespace-nowrap text-xs sm:text-sm"
              onClick={() => setSelectedCategory(category)}
            >
              <span className="hidden sm:inline">
                {category} (
                {images.filter(img => img.category === category).length})
              </span>
              <span className="sm:hidden">{category}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Main Gallery */}
      {currentImage && (
        <Card>
          <CardContent className="p-0">
            {/* Main Image */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                loading="lazy"
                unoptimized={currentImage.src.endsWith('.svg') || false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                className="cursor-pointer object-cover transition-transform hover:scale-105"
                onClick={() => openLightbox(currentIndex)}
              />

              {/* Navigation Arrows */}
              {filteredImages.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 transform touch-manipulation bg-white/80 hover:bg-white sm:left-4 sm:h-10 sm:w-10"
                    onClick={goToPrevious}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 transform touch-manipulation bg-white/80 hover:bg-white sm:right-4 sm:h-10 sm:w-10"
                    onClick={goToNext}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white sm:bottom-4 sm:left-4 sm:px-3 sm:text-sm">
                {currentIndex + 1} / {filteredImages.length}
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-2 right-2 flex gap-1 sm:bottom-4 sm:right-4 sm:gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 touch-manipulation bg-white/80 hover:bg-white sm:h-10 sm:w-10"
                  onClick={() => openLightbox(currentIndex)}
                  aria-label="View image in fullscreen"
                >
                  <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                {allowDownload && currentImage.downloadUrl && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 touch-manipulation bg-white/80 hover:bg-white sm:h-10 sm:w-10"
                    onClick={() => handleDownload(currentImage)}
                    aria-label="Download image"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
                {allowShare && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 touch-manipulation bg-white/80 hover:bg-white sm:h-10 sm:w-10"
                    onClick={() => handleShare(currentImage)}
                    aria-label="Share image"
                  >
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>

              {/* Auto-play Control */}
              {autoPlay && filteredImages.length > 1 && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-4 top-4 bg-white/80 hover:bg-white"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
              )}
            </div>

            {/* Image Info */}
            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold">
                {currentImage.title || currentImage.alt}
              </h3>
              {currentImage.description && (
                <p className="mb-3 text-gray-600">{currentImage.description}</p>
              )}
              {currentImage.tags && currentImage.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {currentImage.tags.map(tag => (
                    <Badge
                      key={`tag-${tag}`}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thumbnails */}
      {showThumbnails && filteredImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {filteredImages.map((image, index) => (
            <button
              key={image.id}
              className={`aspect-square touch-manipulation overflow-hidden rounded-lg border-2 transition-all ${
                index === currentIndex
                  ? 'border-amber-500 ring-2 ring-amber-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View image ${index + 1}: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                unoptimized={image.src.endsWith('.svg') || false}
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && currentImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-h-full max-w-7xl">
            {/* Close Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4 z-10 border-2 border-white bg-black/60 text-white transition-all duration-200 hover:bg-black/80"
              onClick={closeLightbox}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Controls */}
            <div className="absolute left-4 top-4 z-10 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="border-2 border-white bg-black/60 text-white transition-all duration-200 hover:bg-black/80"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="border-2 border-white bg-black/60 text-white transition-all duration-200 hover:bg-black/80"
                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="border-2 border-white bg-black/60 text-white transition-all duration-200 hover:bg-black/80"
                onClick={() => setRotation((rotation + 90) % 360)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            {filteredImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 transform border-2 border-white bg-black/60 text-white transition-all duration-200 hover:bg-black/80"
                  onClick={goToPrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform border-2 border-white bg-black/60 text-white transition-all duration-200 hover:bg-black/80"
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image */}
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              width={800}
              height={600}
              loading="lazy"
              unoptimized={currentImage.src.endsWith('.svg') || false}
              sizes="(max-width: 768px) 100vw, 800px"
              className="max-h-full max-w-full object-contain transition-transform"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-black/50 p-4 text-white">
              <h3 className="text-lg font-semibold">
                {currentImage.title || currentImage.alt}
              </h3>
              {currentImage.description && (
                <p className="mt-1 text-gray-200">{currentImage.description}</p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {currentIndex + 1} of {filteredImages.length}
                </span>
                <div className="flex gap-2">
                  {allowDownload && currentImage.downloadUrl && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(currentImage)}
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  )}
                  {allowShare && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleShare(currentImage)}
                    >
                      <Share2 className="mr-1 h-4 w-4" />
                      Share
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
