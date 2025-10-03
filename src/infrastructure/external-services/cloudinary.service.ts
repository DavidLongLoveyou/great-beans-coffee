'use client';

import { siteConfig } from '@/shared/config/site';

export interface CloudinaryTransformation {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'auto';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  fetchFormat?: 'auto';
  dpr?: 'auto' | number;
  flags?: string[];
  effect?: string;
  overlay?: string;
  background?: string;
}

export interface OptimizedImageOptions {
  /** Image transformations */
  transformations?: CloudinaryTransformation;
  /** Whether to use responsive breakpoints */
  responsive?: boolean;
  /** Custom breakpoints for responsive images */
  breakpoints?: number[];
  /** Whether to generate blur placeholder */
  generateBlurPlaceholder?: boolean;
  /** SEO-friendly alt text */
  alt?: string;
  /** Loading priority for Core Web Vitals */
  priority?: 'high' | 'low' | 'auto';
}

/**
 * Cloudinary Service for optimized image delivery and management
 * Implements Core Web Vitals best practices and B2B coffee industry requirements
 */
export class CloudinaryService {
  private readonly cloudName: string;
  private readonly baseUrl: string;

  constructor() {
    this.cloudName = siteConfig.integrations.cloudinary.cloudName || '';
    this.baseUrl = `https://res.cloudinary.com/${this.cloudName}`;
  }

  /**
   * Generate optimized image URL with Core Web Vitals optimizations
   */
  getOptimizedImageUrl(
    publicId: string,
    options: OptimizedImageOptions = {}
  ): string {
    const {
      transformations = {},
      responsive = true,
      priority = 'auto',
    } = options;

    // Default optimizations for Core Web Vitals
    const defaultTransformations: CloudinaryTransformation = {
      quality: 'auto',
      format: 'auto',
      fetchFormat: 'auto',
      dpr: 'auto',
      flags: ['progressive'],
      ...transformations,
    };

    // Build transformation string
    const transformString = this.buildTransformationString(defaultTransformations);
    
    // Add responsive transformations if enabled
    if (responsive && priority === 'high') {
      // For above-the-fold images, use eager transformations
      return `${this.baseUrl}/image/upload/${transformString}/c_fill,g_auto/${publicId}`;
    }

    return `${this.baseUrl}/image/upload/${transformString}/${publicId}`;
  }

  /**
   * Generate responsive image URLs for different breakpoints
   */
  getResponsiveImageUrls(
    publicId: string,
    breakpoints: number[] = [640, 768, 1024, 1280, 1536],
    options: OptimizedImageOptions = {}
  ): Array<{ url: string; width: number }> {
    return breakpoints.map(width => ({
      url: this.getOptimizedImageUrl(publicId, {
        ...options,
        transformations: {
          ...options.transformations,
          width,
          crop: 'fill',
          gravity: 'auto',
        },
      }),
      width,
    }));
  }

  /**
   * Generate blur placeholder for improved perceived performance
   */
  getBlurPlaceholder(publicId: string): string {
    return this.getOptimizedImageUrl(publicId, {
      transformations: {
        width: 10,
        height: 10,
        quality: 1,
        effect: 'blur:1000',
        format: 'jpg',
      },
    });
  }

  /**
   * Generate hero image URL optimized for LCP (Largest Contentful Paint)
   */
  getHeroImageUrl(
    publicId: string,
    width: number = 1920,
    height: number = 1080
  ): string {
    return this.getOptimizedImageUrl(publicId, {
      transformations: {
        width,
        height,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto',
        format: 'auto',
        flags: ['progressive', 'immutable_cache'],
      },
      priority: 'high',
    });
  }

  /**
   * Generate product image URL optimized for e-commerce
   */
  getProductImageUrl(
    publicId: string,
    size: 'thumbnail' | 'medium' | 'large' = 'medium'
  ): string {
    const dimensions = {
      thumbnail: { width: 200, height: 200 },
      medium: { width: 400, height: 400 },
      large: { width: 800, height: 800 },
    };

    const { width, height } = dimensions[size];

    return this.getOptimizedImageUrl(publicId, {
      transformations: {
        width,
        height,
        crop: 'fill',
        gravity: 'center',
        quality: 'auto',
        background: 'white',
        format: 'auto',
      },
    });
  }

  /**
   * Generate blog content image URL
   */
  getBlogImageUrl(
    publicId: string,
    width: number = 800,
    height?: number
  ): string {
    return this.getOptimizedImageUrl(publicId, {
      transformations: {
        width,
        ...(height && { height }),
        crop: height ? 'fill' : 'scale',
        gravity: 'auto',
        quality: 'auto',
        format: 'auto',
      },
    });
  }

  /**
   * Upload image to Cloudinary (server-side only)
   * Note: This method should be implemented in a separate server-side service
   */
  uploadImage(): never {
    throw new Error('Image upload should be performed server-side using a dedicated API route');
  }

  /**
   * Generate SEO-optimized image metadata
   */
  getImageMetadata(publicId: string, alt: string): {
    url: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL: string;
  } {
    return {
      url: this.getOptimizedImageUrl(publicId),
      width: 800,
      height: 600,
      alt,
      blurDataURL: this.getBlurPlaceholder(publicId),
    };
  }

  /**
   * Build transformation string from options
   */
  private buildTransformationString(transformations: CloudinaryTransformation): string {
    const parts: string[] = [];

    if (transformations.width) parts.push(`w_${transformations.width}`);
    if (transformations.height) parts.push(`h_${transformations.height}`);
    if (transformations.crop) parts.push(`c_${transformations.crop}`);
    if (transformations.quality) parts.push(`q_${transformations.quality}`);
    if (transformations.format) parts.push(`f_${transformations.format}`);
    if (transformations.gravity) parts.push(`g_${transformations.gravity}`);
    if (transformations.fetchFormat) parts.push(`f_${transformations.fetchFormat}`);
    if (transformations.dpr) parts.push(`dpr_${transformations.dpr}`);
    if (transformations.effect) parts.push(`e_${transformations.effect}`);
    if (transformations.background) parts.push(`b_${transformations.background}`);
    if (transformations.overlay) parts.push(`l_${transformations.overlay}`);
    if (transformations.flags) {
      transformations.flags.forEach(flag => parts.push(`fl_${flag}`));
    }

    return parts.join(',');
  }
}

// Singleton instance
export const cloudinaryService = new CloudinaryService();

// Utility functions for common use cases
export const getOptimizedCoffeeImage = (publicId: string, size: 'small' | 'medium' | 'large' = 'medium') => {
  const mappedSize = size === 'small' ? 'thumbnail' : size;
  return cloudinaryService.getProductImageUrl(publicId, mappedSize as 'thumbnail' | 'medium' | 'large');
};

export const getHeroCoffeeImage = (publicId: string) => {
  return cloudinaryService.getHeroImageUrl(publicId);
};

export const getBlogCoffeeImage = (publicId: string, width?: number, height?: number) => {
  return cloudinaryService.getBlogImageUrl(publicId, width, height);
};

export const getCoffeeImageWithBlur = (publicId: string, alt: string) => {
  return cloudinaryService.getImageMetadata(publicId, alt);
};