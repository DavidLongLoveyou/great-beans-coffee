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
} from 'lucide-react';
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
    new Set(images.map(img => img.category).filter(Boolean))
  );

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && filteredImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredImages.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
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
          text: image.description,
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
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All ({images.length})
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category} (
              {images.filter(img => img.category === category).length})
            </Button>
          ))}
        </div>
      )}

      {/* Main Gallery */}
      <Card>
        <CardContent className="p-0">
          {/* Main Image */}
          <div className="relative aspect-video overflow-hidden bg-gray-100">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="cursor-pointer object-cover transition-transform hover:scale-105"
              onClick={() => openLightbox(currentIndex)}
            />

            {/* Navigation Arrows */}
            {filteredImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 transform bg-white/80 hover:bg-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform bg-white/80 hover:bg-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {filteredImages.length}
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/80 hover:bg-white"
                onClick={() => openLightbox(currentIndex)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              {allowDownload && currentImage.downloadUrl && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => handleDownload(currentImage)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {allowShare && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => handleShare(currentImage)}
                >
                  <Share2 className="h-4 w-4" />
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

      {/* Thumbnails */}
      {showThumbnails && filteredImages.length > 1 && (
        <div className="grid grid-cols-6 gap-2 md:grid-cols-8 lg:grid-cols-10">
          {filteredImages.map((image, index) => (
            <button
              key={image.id}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                index === currentIndex
                  ? 'border-amber-500 ring-2 ring-amber-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-h-full max-w-7xl">
            {/* Close Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4 z-10 bg-white/20 text-white hover:bg-white/30"
              onClick={closeLightbox}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Controls */}
            <div className="absolute left-4 top-4 z-10 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/20 text-white hover:bg-white/30"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 transform bg-white/20 text-white hover:bg-white/30"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 transform bg-white/20 text-white hover:bg-white/30"
                  onClick={goToNext}
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
