'use client';

import {
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
  Video,
  Download,
  Share2,
  Maximize2,
  Grid3X3,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';

import { ImageGallery } from './ImageGallery';
import { VideoPlayer, type VideoSource } from './VideoPlayer';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];

  // Image properties
  src?: string;
  alt?: string;
  downloadUrl?: string;

  // Video properties
  sources?: VideoSource[];
  poster?: string;
  chapters?: Array<{
    time: number;
    title: string;
    description?: string;
  }>;
}

interface MediaCarouselProps {
  items: MediaItem[];
  title?: string;
  className?: string;
  showThumbnails?: boolean;
  showCategories?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  defaultView?: 'carousel' | 'grid';
}

export function MediaCarousel({
  items,
  title,
  className = '',
  showThumbnails = true,
  showCategories = true,
  allowDownload = true,
  allowShare = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  defaultView = 'carousel',
}: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>(
    'all'
  );
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>(defaultView);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Filter items
  const filteredItems = items.filter(item => {
    const categoryMatch =
      !selectedCategory || item.category === selectedCategory;
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    return categoryMatch && typeMatch;
  });

  // Get unique categories and types
  const categories = Array.from(
    new Set(items.map(item => item.category).filter((cat): cat is string => Boolean(cat)))
  );
  const types = Array.from(new Set(items.map(item => item.type)));

  // Auto-play functionality for carousel
  useEffect(() => {
    if (isPlaying && viewMode === 'carousel' && filteredItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredItems.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isPlaying, viewMode, filteredItems.length, autoPlayInterval]);

  const currentItem = filteredItems[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex(
      prev => (prev - 1 + filteredItems.length) % filteredItems.length
    );
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % filteredItems.length);
  };

  const handleDownload = async (item: MediaItem) => {
    const downloadUrl = item.downloadUrl || item.src || item.sources?.[0]?.src;
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = item.title || `media-${item.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async (item: MediaItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title || 'Media',
          text: item.description || item.title || 'Media',
          url: window.location.href,
        });
      } catch (error) {
        // Error sharing - silently fail
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (filteredItems.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">No media available</div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div className={`space-y-6 ${className}`}>
        {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('carousel')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon">
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Type Filter */}
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            All ({items.length})
          </Button>
          {types.map(type => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
              className="capitalize"
            >
              {type === 'image' ? (
                <ImageIcon className="mr-1 h-4 w-4" />
              ) : (
                <Video className="mr-1 h-4 w-4" />
              )}
              {type} ({items.filter(item => item.type === type).length})
            </Button>
          ))}

          {/* Category Filter */}
          {showCategories && categories.length > 0 && (
            <>
              <div className="mx-2 h-6 w-px bg-gray-300" />
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-video bg-gray-100">
                {item.type === 'image' ? (
                  <Image
                    src={item.src || ''}
                    alt={item.alt || item.title || ''}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="relative h-full w-full">
                    <Image
                      src={item.poster || '/placeholder-video.jpg'}
                      alt={item.title || ''}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-12 w-12 bg-white/20 text-white hover:bg-white/30"
                        onClick={() => {
                          setCurrentIndex(index);
                          setViewMode('carousel');
                        }}
                      >
                        <Play className="ml-1 h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Type Badge */}
                <Badge
                  variant="secondary"
                  className="absolute left-2 top-2 bg-black/50 text-white"
                >
                  {item.type === 'image' ? (
                    <ImageIcon className="mr-1 h-3 w-3" />
                  ) : (
                    <Video className="mr-1 h-3 w-3" />
                  )}
                  {item.type}
                </Badge>

                {/* Actions */}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-white/80 hover:bg-white"
                    onClick={() => {
                      setCurrentIndex(index);
                      setViewMode('carousel');
                    }}
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                  {allowDownload && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={() => handleDownload(item)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                  {allowShare && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={() => handleShare(item)}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="mb-1 line-clamp-2 text-sm font-semibold">
                  {item.title || `${item.type} ${item.id}`}
                </h3>
                {item.description && (
                  <p className="mb-2 line-clamp-2 text-xs text-gray-600">
                    {item.description}
                  </p>
                )}
                {item.category && (
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Carousel view
  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <div className="flex gap-2">
            <Button variant="default" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Type Filter */}
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('all')}
        >
          All ({items.length})
        </Button>
        {types.map(type => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(type)}
            className="capitalize"
          >
            {type === 'image' ? (
              <ImageIcon className="mr-1 h-4 w-4" />
            ) : (
              <Video className="mr-1 h-4 w-4" />
            )}
            {type} ({items.filter(item => item.type === type).length})
          </Button>
        ))}

        {/* Category Filter */}
        {showCategories && categories.length > 0 && (
          <>
            <div className="mx-2 h-6 w-px bg-gray-300" />
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </>
        )}
      </div>

      {/* Main Media Display */}
      {currentItem && (
        <Card>
          <CardContent className="p-0">
            <div className="relative">
              {currentItem.type === 'image' ? (
              <ImageGallery
                images={filteredItems
                  .filter(item => item.type === 'image')
                  .map(item => ({
                    id: item.id,
                    src: item.src!,
                    alt: item.alt || item.title || '',
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    tags: item.tags,
                    downloadUrl: item.downloadUrl,
                  }))}
                showThumbnails={showThumbnails}
                showCategories={false}
                allowDownload={allowDownload}
                allowShare={allowShare}
              />
            ) : (
              <VideoPlayer
                sources={currentItem.sources || []}
                title={currentItem.title}
                description={currentItem.description}
                poster={currentItem.poster}
                chapters={currentItem.chapters}
                allowDownload={allowDownload}
                allowShare={allowShare}
              />
            )}

            {/* Navigation for mixed content */}
            {filteredItems.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform bg-white/80 hover:bg-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform bg-white/80 hover:bg-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Media Counter */}
            <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {filteredItems.length}
            </div>

            {/* Auto-play Control */}
            {autoPlay && filteredItems.length > 1 && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-4 z-10 bg-white/80 hover:bg-white"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Thumbnails for mixed content */}
      {showThumbnails && filteredItems.length > 1 && (
        <div className="grid grid-cols-6 gap-2 md:grid-cols-8 lg:grid-cols-10">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                index === currentIndex
                  ? 'border-amber-500 ring-2 ring-amber-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={item.type === 'image' ? item.src : item.poster}
                alt={item.title || item.alt || ''}
                fill
                className="object-cover"
              />
              {/* Type indicator */}
              <div className="absolute right-1 top-1">
                {item.type === 'image' ? (
                  <ImageIcon className="h-3 w-3 text-white drop-shadow" />
                ) : (
                  <Video className="h-3 w-3 text-white drop-shadow" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
