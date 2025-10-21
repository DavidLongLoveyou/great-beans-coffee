/**
 * Performance Optimization Utilities
 *
 * Provides utilities for:
 * - Critical resource preloading
 * - Font optimization
 * - Resource hints (prefetch, preconnect)
 * - Performance monitoring
 * - Bundle optimization
 */

import { createScopedLogger } from './logger';

const _logger = createScopedLogger('PerformanceOptimization');

// Extended Navigator interface for experimental APIs
interface ExtendedNavigator extends Navigator {
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
  deviceMemory?: number;
}

// Types
export interface PreloadResource {
  href: string;
  as: 'script' | 'style' | 'font' | 'image' | 'video' | 'audio' | 'document';
  type?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  media?: string;
  importance?: 'high' | 'low' | 'auto';
}

export interface ResourceHint {
  href: string;
  rel: 'preconnect' | 'dns-prefetch' | 'prefetch' | 'preload' | 'modulepreload';
  crossorigin?: 'anonymous' | 'use-credentials';
  as?: string;
  type?: string;
}

export interface PerformanceConfig {
  enablePreloading: boolean;
  enableResourceHints: boolean;
  enableFontOptimization: boolean;
  enableImageOptimization: boolean;
  enableBundleOptimization: boolean;
  criticalResourcesOnly: boolean;
}

// Default configuration
const DEFAULT_CONFIG: PerformanceConfig = {
  enablePreloading: true,
  enableResourceHints: true,
  enableFontOptimization: true,
  enableImageOptimization: true,
  enableBundleOptimization: true,
  criticalResourcesOnly: false,
};

/**
 * Performance Optimization Service
 */
export class PerformanceOptimizer {
  private config: PerformanceConfig;
  private preloadedResources = new Set<string>();
  private resourceHints = new Set<string>();

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Preload critical resources
   */
  preloadResource(resource: PreloadResource): void {
    if (!this.config.enablePreloading) return;
    if (this.preloadedResources.has(resource.href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;

    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    if (resource.media) link.media = resource.media;
    if (resource.importance) {
      link.setAttribute('importance', resource.importance);
    }

    document.head.appendChild(link);
    this.preloadedResources.add(resource.href);
  }

  /**
   * Add resource hints for performance optimization
   */
  addResourceHint(hint: ResourceHint): void {
    if (!this.config.enableResourceHints) return;
    if (this.resourceHints.has(hint.href)) return;

    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;

    if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
    if (hint.as) link.as = hint.as;
    if (hint.type) link.type = hint.type;

    document.head.appendChild(link);
    this.resourceHints.add(hint.href);
  }

  /**
   * Preload critical fonts
   */
  preloadFonts(fonts: readonly string[]): void {
    if (!this.config.enableFontOptimization) return;

    fonts.forEach(fontUrl => {
      this.preloadResource({
        href: fontUrl,
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
        importance: 'high',
      });
    });
  }

  /**
   * Preconnect to external domains
   */
  preconnectDomains(domains: readonly string[]): void {
    domains.forEach(domain => {
      this.addResourceHint({
        href: domain,
        rel: 'preconnect',
        crossorigin: 'anonymous',
      });
    });
  }

  /**
   * Prefetch next page resources
   */
  prefetchNextPage(url: string): void {
    this.addResourceHint({
      href: url,
      rel: 'prefetch',
    });
  }

  /**
   * Preload critical images
   */
  preloadCriticalImages(images: readonly string[]): void {
    if (!this.config.enableImageOptimization) return;

    images.forEach(imageUrl => {
      this.preloadResource({
        href: imageUrl,
        as: 'image',
        importance: 'high',
      });
    });
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): Record<string, number> {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    const metrics: Record<string, number> = {};

    if (navigation) {
      metrics.domContentLoaded =
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart;
      metrics.loadComplete =
        navigation.loadEventEnd - navigation.loadEventStart;
      metrics.firstByte = navigation.responseStart - navigation.requestStart;
      metrics.domInteractive = navigation.domInteractive - navigation.startTime;
    }

    paint.forEach(entry => {
      if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime;
      }
      if (entry.name === 'first-paint') {
        metrics.firstPaint = entry.startTime;
      }
    });

    return metrics;
  }

  /**
   * Monitor resource loading performance
   */
  monitorResourcePerformance(): void {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;

          // Performance monitoring logging removed for production
          if (resourceEntry.duration > 1000) {
            // Slow resource detection (logging removed)
          }

          // Large resource monitoring (logging removed)
          if (
            resourceEntry.transferSize &&
            resourceEntry.transferSize > 500000
          ) {
            // Large resource detection (logging removed)
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Optimize bundle loading with dynamic imports
   */
  async loadModuleDynamically<T>(
    moduleLoader: () => Promise<T>,
    fallback?: () => T
  ): Promise<T> {
    if (!this.config.enableBundleOptimization && fallback) {
      return fallback();
    }

    try {
      return await moduleLoader();
    } catch (error) {
      // Dynamic module loading error logging removed for production
      throw error;
    }
  }

  /**
   * Clear preloaded resources (for cleanup)
   */
  clearPreloadedResources(): void {
    this.preloadedResources.clear();
    this.resourceHints.clear();
  }
}

// Singleton instance
export const performanceOptimizer = new PerformanceOptimizer();

/**
 * Critical resources for The Great Beans platform
 */
export const CRITICAL_RESOURCES = {
  // External domains to preconnect
  EXTERNAL_DOMAINS: [
    'https://res.cloudinary.com',
    'https://images.unsplash.com',
    'https://api.vercel.com',
  ],

  // Critical fonts to preload (now using local fonts)
  CRITICAL_FONTS: [
    '/fonts/playfair-display-v40-latin-regular.woff2',
    '/fonts/playfair-display-v40-latin-700.woff2',
  ],

  // Critical images for above-the-fold content
  CRITICAL_IMAGES: [
    // Currently using CSS gradients and Lucide icons instead of images
    // Add actual images here when they are used in the design
  ],

  // Critical CSS and JS - Next.js handles CSS automatically
  CRITICAL_STYLES: [],
  CRITICAL_SCRIPTS: [],

  // Font optimization - handled by Next.js font optimization
  FONT_PRELOADS: [],
} as const;

/**
 * Initialize performance optimizations for The Great Beans
 */
export function initializePerformanceOptimizations(): void {
  // Only run on client side
  if (typeof window === 'undefined') return;

  // Preconnect to external domains
  performanceOptimizer.preconnectDomains(CRITICAL_RESOURCES.EXTERNAL_DOMAINS);

  // Preload critical fonts
  performanceOptimizer.preloadFonts(CRITICAL_RESOURCES.CRITICAL_FONTS);

  // Preload critical images
  performanceOptimizer.preloadCriticalImages(
    CRITICAL_RESOURCES.CRITICAL_IMAGES
  );

  // Start monitoring resource performance
  performanceOptimizer.monitorResourcePerformance();

  // Add DNS prefetch for external domains
  CRITICAL_RESOURCES.EXTERNAL_DOMAINS.forEach(domain => {
    performanceOptimizer.addResourceHint({
      href: domain,
      rel: 'dns-prefetch',
    });
  });
}

/**
 * Utility functions for performance optimization
 */
export const performanceUtils = {
  /**
   * Debounce function for performance optimization
   */
  debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttle function for performance optimization
   */
  throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Check if connection is slow
   */
  isSlowConnection(): boolean {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return false;
    }

    const connection = (navigator as ExtendedNavigator).connection;
    return (
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g'
    );
  },

  /**
   * Get device memory (if available)
   */
  getDeviceMemory(): number | undefined {
    if (typeof navigator === 'undefined') return undefined;
    return (navigator as ExtendedNavigator).deviceMemory;
  },

  /**
   * Check if device has limited resources
   */
  isLowEndDevice(): boolean {
    const memory = performanceUtils.getDeviceMemory();
    const isSlowConnection = performanceUtils.isSlowConnection();

    return (memory !== undefined && memory <= 4) || isSlowConnection;
  },
};

/**
 * React hook for performance optimization
 */
export function usePerformanceOptimization() {
  const isLowEndDevice = performanceUtils.isLowEndDevice();
  const prefersReducedMotion = performanceUtils.prefersReducedMotion();

  return {
    isLowEndDevice,
    prefersReducedMotion,
    shouldReduceAnimations: prefersReducedMotion || isLowEndDevice,
    shouldLazyLoad: isLowEndDevice,
    performanceOptimizer,
  };
}
