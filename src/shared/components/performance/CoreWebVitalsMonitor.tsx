'use client';

import { useEffect, useRef, useState } from 'react';
import { getCLS, getFCP, getFID, getLCP, getTTFB, type Metric } from 'web-vitals';

// Core Web Vitals thresholds (Google's recommended values)
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
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
  FID?: WebVitalMetric;
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
 * - FID (First Input Delay)
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
  const getPerformanceRating = (name: string, value: number): PerformanceRating => {
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
    if (!threshold) return 'good';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  // Send metric to analytics
  const sendToAnalytics = async (metric: WebVitalMetric) => {
    if (!enableAnalytics) return;

    try {
      // Send to Google Analytics 4 if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          custom_map: {
            metric_rating: metric.rating,
            metric_delta: metric.delta,
            navigation_type: metric.navigationType,
          },
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
            connection: (navigator as any).connection?.effectiveType,
          }),
        });
      }
    } catch (error) {
      if (enableConsoleLogging) {
        console.error('Failed to send Web Vitals metric to analytics:', error);
      }
    }
  };

  // Handle metric capture
  const handleMetric = (metric: Metric) => {
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

    // Log to console if enabled
    if (enableConsoleLogging) {
      console.log(`[Core Web Vitals] ${metric.name}:`, webVitalMetric);
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
  };

  // Initialize Web Vitals monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    getCLS(handleMetric);
    getFCP(handleMetric);
    getFID(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);

    // Monitor additional performance metrics
    if ('PerformanceObserver' in window) {
      // Monitor Long Tasks (for performance debugging)
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              if (enableConsoleLogging) {
                console.warn('[Performance] Long Task detected:', {
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
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).value > 0.1) { // Significant layout shifts
              if (enableConsoleLogging) {
                console.warn('[Performance] Layout Shift detected:', {
                  value: (entry as any).value,
                  sources: (entry as any).sources,
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
  }, [enableAnalytics, enableConsoleLogging, onMetricCapture, analyticsEndpoint]);

  // Visual indicator component
  if (!isVisible || !enableVisualIndicator) {
    return null;
  }

  const getMetricColor = (rating: PerformanceRating) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Core Web Vitals</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
          aria-label="Close Web Vitals monitor"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2">
        {Object.entries(metrics).map(([name, metric]) => (
          <div key={name} className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">{name}</span>
            <span className={`text-xs px-2 py-1 rounded ${getMetricColor(metric.rating)}`}>
              {formatValue(name, metric.value)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span>Good</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
            <span>Needs Improvement</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
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

    const getPerformanceRating = (name: string, value: number): PerformanceRating => {
      const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
      if (!threshold) return 'good';
      
      if (value <= threshold.good) return 'good';
      if (value <= threshold.needsImprovement) return 'needs-improvement';
      return 'poor';
    };

    getCLS(handleMetric);
    getFCP(handleMetric);
    getFID(handleMetric);
    getLCP(handleMetric);
    getTTFB(handleMetric);
  }, []);

  return metrics;
}

export default CoreWebVitalsMonitor;