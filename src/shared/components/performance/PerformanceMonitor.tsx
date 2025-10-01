'use client';

import { useEffect, useState, useCallback } from 'react';
import { measureCoreWebVitals } from '@/shared/utils/seo-monitoring';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  
  // Additional metrics
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Resource metrics
  domContentLoaded?: number;
  loadComplete?: number;
  
  // Navigation metrics
  navigationStart?: number;
  responseStart?: number;
  domInteractive?: number;
}

export interface PerformanceRating {
  lcp: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  fid: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  cls: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  overall: 'good' | 'needs-improvement' | 'poor' | 'unknown';
}

interface PerformanceMonitorProps {
  /** Whether to show performance metrics in development */
  showInDev?: boolean;
  /** Whether to track metrics automatically */
  autoTrack?: boolean;
  /** Callback when metrics are updated */
  onMetricsUpdate?: (metrics: PerformanceMetrics, ratings: PerformanceRating) => void;
  /** Whether to show visual indicators */
  showIndicators?: boolean;
}

/**
 * Performance monitoring component that tracks Core Web Vitals and provides real-time metrics
 * 
 * Features:
 * - Real-time Core Web Vitals tracking (LCP, FID, CLS)
 * - Additional performance metrics (FCP, TTFB, etc.)
 * - Performance rating system
 * - Visual indicators for development
 * - Automatic metric collection and reporting
 */
export function PerformanceMonitor({
  showInDev = false,
  autoTrack = true,
  onMetricsUpdate,
  showIndicators = false,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [ratings, setRatings] = useState<PerformanceRating>({
    lcp: 'unknown',
    fid: 'unknown',
    cls: 'unknown',
    overall: 'unknown',
  });

  // Calculate performance ratings based on Core Web Vitals thresholds
  const calculateRatings = useCallback((metrics: PerformanceMetrics): PerformanceRating => {
    const lcpRating = metrics.lcp 
      ? metrics.lcp <= 2500 ? 'good' 
        : metrics.lcp <= 4000 ? 'needs-improvement' 
        : 'poor'
      : 'unknown';

    const fidRating = metrics.fid 
      ? metrics.fid <= 100 ? 'good' 
        : metrics.fid <= 300 ? 'needs-improvement' 
        : 'poor'
      : 'unknown';

    const clsRating = metrics.cls !== undefined
      ? metrics.cls <= 0.1 ? 'good' 
        : metrics.cls <= 0.25 ? 'needs-improvement' 
        : 'poor'
      : 'unknown';

    // Overall rating is the worst of the three
    const ratings = [lcpRating, fidRating, clsRating].filter(r => r !== 'unknown');
    const overall = ratings.length === 0 ? 'unknown' 
      : ratings.includes('poor') ? 'poor'
      : ratings.includes('needs-improvement') ? 'needs-improvement'
      : 'good';

    return { lcp: lcpRating, fid: fidRating, cls: clsRating, overall };
  }, []);

  // Collect performance metrics using Performance API
  const collectMetrics = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    const newMetrics: PerformanceMetrics = {
      navigationStart: navigation?.startTime || 0,
      responseStart: navigation?.responseStart || 0,
      domInteractive: navigation?.domInteractive || 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
      loadComplete: navigation?.loadEventEnd || 0,
      ttfb: navigation ? navigation.responseStart - navigation.requestStart : 0,
    };

    // First Contentful Paint
    const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      newMetrics.fcp = fcpEntry.startTime;
    }

    setMetrics(prev => ({ ...prev, ...newMetrics }));
  }, []);

  // Set up Core Web Vitals observers
  useEffect(() => {
    if (!autoTrack || typeof window === 'undefined') return;

    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });

    // First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime;
        setMetrics(prev => ({ ...prev, fid }));
      });
    });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });
      
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });

    // Start observing
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    // Collect initial metrics
    collectMetrics();

    // Cleanup
    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [autoTrack, collectMetrics]);

  // Update ratings when metrics change
  useEffect(() => {
    const newRatings = calculateRatings(metrics);
    setRatings(newRatings);
    onMetricsUpdate?.(metrics, newRatings);
  }, [metrics, calculateRatings, onMetricsUpdate]);

  // Initialize Core Web Vitals monitoring from seo-monitoring.ts
  useEffect(() => {
    if (autoTrack) {
      measureCoreWebVitals();
    }
  }, [autoTrack]);

  // Don't render in production unless explicitly shown
  if (process.env.NODE_ENV === 'production' && !showIndicators) {
    return null;
  }

  // Don't render in development unless explicitly shown
  if (process.env.NODE_ENV === 'development' && !showInDev && !showIndicators) {
    return null;
  }

  if (!showIndicators) {
    return null;
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatMetric = (value: number | undefined, unit: string = 'ms') => {
    if (value === undefined) return 'N/A';
    return unit === 'ms' ? `${Math.round(value)}ms` : value.toFixed(3);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-white p-4 shadow-lg border">
      <h3 className="text-sm font-semibold mb-2">Performance Metrics</h3>
      
      {/* Core Web Vitals */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span>LCP:</span>
          <span className={`px-2 py-1 rounded ${getRatingColor(ratings.lcp)}`}>
            {formatMetric(metrics.lcp)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>FID:</span>
          <span className={`px-2 py-1 rounded ${getRatingColor(ratings.fid)}`}>
            {formatMetric(metrics.fid)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>CLS:</span>
          <span className={`px-2 py-1 rounded ${getRatingColor(ratings.cls)}`}>
            {formatMetric(metrics.cls, '')}
          </span>
        </div>
        
        <hr className="my-2" />
        
        {/* Additional metrics */}
        <div className="flex justify-between items-center">
          <span>FCP:</span>
          <span>{formatMetric(metrics.fcp)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>TTFB:</span>
          <span>{formatMetric(metrics.ttfb)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Load:</span>
          <span>{formatMetric(metrics.loadComplete)}</span>
        </div>
        
        <hr className="my-2" />
        
        {/* Overall rating */}
        <div className="flex justify-between items-center font-semibold">
          <span>Overall:</span>
          <span className={`px-2 py-1 rounded ${getRatingColor(ratings.overall)}`}>
            {ratings.overall.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to access performance metrics programmatically
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [ratings, setRatings] = useState<PerformanceRating>({
    lcp: 'unknown',
    fid: 'unknown',
    cls: 'unknown',
    overall: 'unknown',
  });

  const updateMetrics = useCallback((newMetrics: PerformanceMetrics, newRatings: PerformanceRating) => {
    setMetrics(newMetrics);
    setRatings(newRatings);
  }, []);

  return { metrics, ratings, updateMetrics };
}