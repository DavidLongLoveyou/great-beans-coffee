'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

import { createScopedLogger } from '@/shared/utils/logger';

const logger = createScopedLogger('CoreWebVitalsMonitor');

// Core Web Vitals thresholds (Google's recommended values)
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
};

// Performance rating based on thresholds
type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: PerformanceRating;
  delta: number;
  id: string;
  navigationType: string;
}

interface CoreWebVitalsData {
  LCP?: WebVitalMetric;
  INP?: WebVitalMetric;
  CLS?: WebVitalMetric;
  FCP?: WebVitalMetric;
  TTFB?: WebVitalMetric;
}

interface CoreWebVitalsMonitorProps {
  enableAnalytics?: boolean;
  enableConsoleLogging?: boolean;
  enableVisualIndicator?: boolean;
  onMetricCapture?: (metric: WebVitalMetric) => void;
  analyticsEndpoint?: string;
}

/**
 * Core Web Vitals Monitor Component
 *
 * Monitors and reports Core Web Vitals metrics including:
 * - LCP (Largest Contentful Paint)
 * - INP (Interaction to Next Paint)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 */
export function CoreWebVitalsMonitor({
  enableAnalytics = true,
  enableConsoleLogging = false,
  enableVisualIndicator = false,
  onMetricCapture,
  analyticsEndpoint = '/api/analytics/web-vitals',
}: CoreWebVitalsMonitorProps) {
  const [metrics, setMetrics] = useState<CoreWebVitalsData>({});
  const [isVisible, setIsVisible] = useState(enableVisualIndicator);
  const sentMetrics = useRef(new Set<string>());

  // Get performance rating based on metric value and thresholds
  const getPerformanceRating = (
    name: string,
    value: number
  ): PerformanceRating => {
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  // Send metric to analytics
  const sendToAnalytics = useCallback(
    async (metric: WebVitalMetric) => {
      if (!enableAnalytics) return;

      try {
        // Send to Google Analytics 4 if available
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(
              metric.name === 'CLS' ? metric.value * 1000 : metric.value
            ),
            metric_rating: metric.rating,
            metric_delta: metric.delta,
            navigation_type: metric.navigationType,
          });
        }

        // Send to custom analytics endpoint
        if (analyticsEndpoint) {
          await fetch(analyticsEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              metric,
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent,
              connection: (
                navigator as { connection?: { effectiveType: string } }
              ).connection?.effectiveType,
            }),
          });
        }
      } catch (error) {
        if (enableConsoleLogging) {
          logger.error('Failed to send Web Vitals metric to analytics:', error);
        }
      }
    },
    [enableAnalytics, analyticsEndpoint, enableConsoleLogging]
  );

  // Handle metric capture
  const handleMetric = useCallback(
    (metric: Metric) => {
      const webVitalMetric: WebVitalMetric = {
        name: metric.name,
        value: metric.value,
        rating: getPerformanceRating(metric.name, metric.value),
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType || 'navigate',
      };

      // Update state
      setMetrics(prev => ({
        ...prev,
        [metric.name]: webVitalMetric,
      }));

      // Log to console if enabled and in development
      if (enableConsoleLogging && process.env.NODE_ENV === 'development') {
        logger.info(`[Core Web Vitals] ${metric.name}:`, webVitalMetric);
      }

      // Send to analytics (only once per metric per page load)
      const metricKey = `${metric.name}-${metric.id}`;
      if (!sentMetrics.current.has(metricKey)) {
        sentMetrics.current.add(metricKey);
        sendToAnalytics(webVitalMetric);
      }

      // Call custom handler
      if (onMetricCapture) {
        onMetricCapture(webVitalMetric);
      }
    },
    [enableConsoleLogging, onMetricCapture, sendToAnalytics]
  );

  // Initialize Web Vitals monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    onCLS(handleMetric);
    onFCP(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);

    // Monitor additional performance metrics
    if ('PerformanceObserver' in window) {
      // Monitor Long Tasks (for performance debugging)
      try {
        const longTaskObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              // Tasks longer than 50ms
              if (enableConsoleLogging) {
                logger.warn('[Performance] Long Task detected:', {
                  duration: entry.duration,
                  startTime: entry.startTime,
                  name: entry.name,
                });
              }
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        // Long Task API not supported
      }

      // Monitor Layout Shifts for debugging
      try {
        interface LayoutShiftEntry extends PerformanceEntry {
          value: number;
          sources: Array<{ node?: Element }>;
        }

        const layoutShiftObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as LayoutShiftEntry;
            if (layoutShiftEntry.value > 0.1) {
              // Significant layout shifts
              if (enableConsoleLogging) {
                logger.warn('[Performance] Layout Shift detected:', {
                  value: layoutShiftEntry.value,
                  sources: layoutShiftEntry.sources,
                  startTime: entry.startTime,
                });
              }
            }
          }
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        // Layout Shift API not supported
      }
    }

    // Auto-hide visual indicator after 10 seconds
    if (enableVisualIndicator) {
      const timer = setTimeout(() => setIsVisible(false), 10000);
      return () => clearTimeout(timer);
    }

    // Return undefined for consistency
    return undefined;
  }, [
    enableAnalytics,
    enableConsoleLogging,
    enableVisualIndicator,
    onMetricCapture,
    analyticsEndpoint,
    handleMetric,
  ]);

  // Visual indicator component
  if (!isVisible || !enableVisualIndicator) {
    return null;
  }

  const getMetricColor = (rating: PerformanceRating) => {
    switch (rating) {
      case 'good':
        return 'text-green-600 bg-green-50';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50';
      case 'poor':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  return (
    <div className="fixed bottom-2 right-2 z-50 hidden max-w-xs rounded-lg border border-gray-200 bg-white p-3 shadow-lg sm:bottom-4 sm:right-4 sm:block sm:max-w-sm sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Core Web Vitals</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-sm text-gray-400 hover:text-gray-600"
          aria-label="Close Web Vitals monitor"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(metrics).map(([name, metric]) => (
          <div key={name} className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">{name}</span>
            <span
              className={`rounded px-2 py-1 text-xs ${getMetricColor(metric.rating)}`}
            >
              {formatValue(name, metric.value)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
            <span>Good</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-2 w-2 rounded-full bg-yellow-500"></div>
            <span>Needs Improvement</span>
          </div>
          <div className="flex items-center">
            <div className="mr-1 h-2 w-2 rounded-full bg-red-500"></div>
            <span>Poor</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for accessing Web Vitals data
export function useWebVitals() {
  const [metrics, setMetrics] = useState<CoreWebVitalsData>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMetric = (metric: Metric) => {
      const webVitalMetric: WebVitalMetric = {
        name: metric.name,
        value: metric.value,
        rating: getPerformanceRating(metric.name, metric.value),
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType || 'navigate',
      };

      setMetrics(prev => ({
        ...prev,
        [metric.name]: webVitalMetric,
      }));
    };

    const getPerformanceRating = (
      name: string,
      value: number
    ): PerformanceRating => {
      const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
      if (!threshold) return 'good';

      if (value <= threshold.good) return 'good';
      if (value <= threshold.needsImprovement) return 'needs-improvement';
      return 'poor';
    };

    onCLS(handleMetric);
    onFCP(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
  }, []);

  return metrics;
}

export default CoreWebVitalsMonitor;
