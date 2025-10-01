'use client';

import { cloudinaryService } from '@/infrastructure/external-services/cloudinary.service';

export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender';
}

export interface PerformanceConfig {
  enableWebVitalsTracking: boolean;
  enableImageOptimization: boolean;
  enableResourceHints: boolean;
  enableCriticalResourcePreload: boolean;
  reportWebVitals: boolean;
  analyticsId?: string;
}

/**
 * Core Web Vitals optimization and monitoring service
 * Implements Google's Core Web Vitals best practices for B2B coffee export platform
 */
export class CoreWebVitalsOptimizer {
  private config: PerformanceConfig;
  private vitalsData: Map<string, WebVitalsMetric> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableWebVitalsTracking: true,
      enableImageOptimization: true,
      enableResourceHints: true,
      enableCriticalResourcePreload: true,
      reportWebVitals: true,
      ...config,
    };

    if (typeof window !== 'undefined') {
      this.initializeWebVitalsTracking();
    }
  }

  /**
   * Initialize Core Web Vitals tracking
   */
  private initializeWebVitalsTracking(): void {
    if (!this.config.enableWebVitalsTracking) return;

    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID) / Interaction to Next Paint (INP)
    this.observeFID();
    this.observeINP();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
    
    // Time to First Byte (TTFB)
    this.observeTTFB();
  }

  /**
   * Observe Largest Contentful Paint (LCP)
   * Target: < 2.5s (good), < 4.0s (needs improvement), >= 4.0s (poor)
   */
  private observeLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;

      if (lastEntry) {
        const metric: WebVitalsMetric = {
          name: 'LCP',
          value: lastEntry.startTime,
          rating: this.getLCPRating(lastEntry.startTime),
          delta: lastEntry.startTime,
          id: this.generateMetricId(),
          navigationType: this.getNavigationType(),
        };

        this.vitalsData.set('LCP', metric);
        this.reportMetric(metric);
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('LCP', observer);
    } catch (error) {
      console.warn('LCP observation not supported:', error);
    }
  }

  /**
   * Observe First Input Delay (FID)
   * Target: < 100ms (good), < 300ms (needs improvement), >= 300ms (poor)
   */
  private observeFID(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach((entry: any) => {
        const metric: WebVitalsMetric = {
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          rating: this.getFIDRating(entry.processingStart - entry.startTime),
          delta: entry.processingStart - entry.startTime,
          id: this.generateMetricId(),
          navigationType: this.getNavigationType(),
        };

        this.vitalsData.set('FID', metric);
        this.reportMetric(metric);
      });
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('FID', observer);
    } catch (error) {
      console.warn('FID observation not supported:', error);
    }
  }

  /**
   * Observe Interaction to Next Paint (INP)
   * Target: < 200ms (good), < 500ms (needs improvement), >= 500ms (poor)
   */
  private observeINP(): void {
    if (!('PerformanceObserver' in window)) return;

    let maxINP = 0;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach((entry: any) => {
        const inp = entry.processingEnd - entry.startTime;
        if (inp > maxINP) {
          maxINP = inp;
          
          const metric: WebVitalsMetric = {
            name: 'INP',
            value: inp,
            rating: this.getINPRating(inp),
            delta: inp,
            id: this.generateMetricId(),
            navigationType: this.getNavigationType(),
          };

          this.vitalsData.set('INP', metric);
          this.reportMetric(metric);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['event'] });
      this.observers.set('INP', observer);
    } catch (error) {
      console.warn('INP observation not supported:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift (CLS)
   * Target: < 0.1 (good), < 0.25 (needs improvement), >= 0.25 (poor)
   */
  private observeCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (sessionValue && 
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            
            const metric: WebVitalsMetric = {
              name: 'CLS',
              value: clsValue,
              rating: this.getCLSRating(clsValue),
              delta: clsValue,
              id: this.generateMetricId(),
              navigationType: this.getNavigationType(),
            };

            this.vitalsData.set('CLS', metric);
            this.reportMetric(metric);
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('CLS', observer);
    } catch (error) {
      console.warn('CLS observation not supported:', error);
    }
  }

  /**
   * Observe First Contentful Paint (FCP)
   * Target: < 1.8s (good), < 3.0s (needs improvement), >= 3.0s (poor)
   */
  private observeFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');

      if (fcpEntry) {
        const metric: WebVitalsMetric = {
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: this.getFCPRating(fcpEntry.startTime),
          delta: fcpEntry.startTime,
          id: this.generateMetricId(),
          navigationType: this.getNavigationType(),
        };

        this.vitalsData.set('FCP', metric);
        this.reportMetric(metric);
      }
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('FCP', observer);
    } catch (error) {
      console.warn('FCP observation not supported:', error);
    }
  }

  /**
   * Observe Time to First Byte (TTFB)
   * Target: < 800ms (good), < 1800ms (needs improvement), >= 1800ms (poor)
   */
  private observeTTFB(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const navigationEntry = entries[0] as PerformanceNavigationTiming;

      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        
        const metric: WebVitalsMetric = {
          name: 'TTFB',
          value: ttfb,
          rating: this.getTTFBRating(ttfb),
          delta: ttfb,
          id: this.generateMetricId(),
          navigationType: this.getNavigationType(),
        };

        this.vitalsData.set('TTFB', metric);
        this.reportMetric(metric);
      }
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.set('TTFB', observer);
    } catch (error) {
      console.warn('TTFB observation not supported:', error);
    }
  }

  /**
   * Preload critical resources for better Core Web Vitals
   */
  preloadCriticalResources(resources: Array<{
    href: string;
    as: 'image' | 'font' | 'style' | 'script';
    type?: string;
    crossorigin?: 'anonymous' | 'use-credentials';
  }>): void {
    if (!this.config.enableCriticalResourcePreload || typeof document === 'undefined') return;

    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      
      if (resource.type) link.type = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      
      document.head.appendChild(link);
    });
  }

  /**
   * Optimize images for Core Web Vitals using Cloudinary
   */
  optimizeImagesForWebVitals(images: Array<{
    publicId: string;
    priority: 'high' | 'low';
    sizes?: string;
  }>): void {
    if (!this.config.enableImageOptimization) return;

    images.forEach(({ publicId, priority, sizes }) => {
      if (priority === 'high') {
        // Preload critical images
        const optimizedUrl = cloudinaryService.getHeroImageUrl(publicId);
        this.preloadCriticalResources([{
          href: optimizedUrl,
          as: 'image',
        }]);
      }
    });
  }

  /**
   * Get current Web Vitals metrics
   */
  getMetrics(): Map<string, WebVitalsMetric> {
    return new Map(this.vitalsData);
  }

  /**
   * Get performance score based on Core Web Vitals
   */
  getPerformanceScore(): {
    score: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    metrics: Record<string, WebVitalsMetric>;
  } {
    const metrics = Array.from(this.vitalsData.values());
    const coreMetrics = metrics.filter(m => ['LCP', 'FID', 'CLS'].includes(m.name));
    
    if (coreMetrics.length === 0) {
      return { score: 0, rating: 'poor', metrics: {} };
    }

    const goodCount = coreMetrics.filter(m => m.rating === 'good').length;
    const score = (goodCount / coreMetrics.length) * 100;
    
    const rating = score >= 75 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor';
    
    const metricsObj = Object.fromEntries(
      metrics.map(m => [m.name, m])
    );

    return { score, rating, metrics: metricsObj };
  }

  /**
   * Report metric to analytics
   */
  private reportMetric(metric: WebVitalsMetric): void {
    if (!this.config.reportWebVitals) return;

    // Report to Google Analytics 4
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Report to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Core Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    }
  }

  // Rating helper methods
  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';
  }

  private getINPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value < 200 ? 'good' : value < 500 ? 'needs-improvement' : 'poor';
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
  }

  private getFCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
  }

  private getTTFBRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    return value < 800 ? 'good' : value < 1800 ? 'needs-improvement' : 'poor';
  }

  private generateMetricId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getNavigationType(): 'navigate' | 'reload' | 'back-forward' | 'prerender' {
    if (typeof window === 'undefined' || !('performance' in window)) return 'navigate';
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return (navigation?.type as any) || 'navigate';
  }

  /**
   * Cleanup observers
   */
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Singleton instance
export const coreWebVitalsOptimizer = new CoreWebVitalsOptimizer();

// Utility functions
export const initializeWebVitals = (config?: Partial<PerformanceConfig>) => {
  return new CoreWebVitalsOptimizer(config);
};

export const preloadCriticalCoffeeImages = (imageIds: string[]) => {
  const images = imageIds.map(id => ({
    publicId: id,
    priority: 'high' as const,
  }));
  
  coreWebVitalsOptimizer.optimizeImagesForWebVitals(images);
};

export const getWebVitalsScore = () => {
  return coreWebVitalsOptimizer.getPerformanceScore();
};